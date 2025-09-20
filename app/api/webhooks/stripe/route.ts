import db from "@/db/drizzle";
import { userSubscriptions } from "@/db/schema";
import { stripe } from "@/lib/stripe";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

// Simple in-memory store for processed events (in production, use Redis or database)
const processedEvents = new Set<string>();

export async function POST(req: Request) {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get("Stripe-Signature") as string;
    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET as string
        );
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return new NextResponse(`Webhook Error: ${errorMessage}` , { status: 400 });
    }

    // Check if we've already processed this event
    if (processedEvents.has(event.id)) {
        return new NextResponse(null, { status: 200 });
    }

    try {
        if (event.type === "checkout.session.completed") {
            const session = event.data.object as Stripe.Checkout.Session;
            
            if (!session.subscription || !session?.metadata?.userId) {
                processedEvents.add(event.id);
                return new NextResponse(null, { status: 200 });
            }
            
            const subscription = await stripe.subscriptions.retrieve(
                session.subscription as string,
            );
            
            // Validate subscription data
            if (!subscription.id || !subscription.customer || !subscription.items?.data?.[0]?.price?.id) {
                processedEvents.add(event.id);
                return new NextResponse(null, { status: 200 });
            }

            // Validate current_period_end timestamp
            const subscriptionData = subscription as unknown as Stripe.Subscription & { current_period_end: number };
            const currentPeriodEnd = subscriptionData.current_period_end;
            if (!currentPeriodEnd || currentPeriodEnd <= 0) {
                processedEvents.add(event.id);
                return new NextResponse(null, { status: 200 });
            }

            const periodEndDate = new Date(currentPeriodEnd * 1000);

            // Check if subscription already exists
            const existingSubscription = await db.select().from(userSubscriptions)
                .where(eq(userSubscriptions.userId, session.metadata.userId));
            
            if (existingSubscription.length > 0) {
                await db.update(userSubscriptions).set({
                    stripeSubscriptionId: subscription.id,
                    stripeCustomerId: subscription.customer as string,
                    stripePriceId: subscription.items.data[0]?.price.id,
                    stripeCurrentPeriodEnd: periodEndDate,
                }).where(eq(userSubscriptions.userId, session.metadata.userId));
            } else {
                await db.insert(userSubscriptions).values({
                    userId: session.metadata.userId,
                    stripeSubscriptionId: subscription.id,
                    stripeCustomerId: subscription.customer as string,
                    stripePriceId: subscription.items.data[0]?.price.id,
                    stripeCurrentPeriodEnd: periodEndDate,
                });
            }
        }

        if (event.type === "invoice.payment_succeeded" || event.type === "invoice_payment.paid" || event.type === "invoice.paid") {
            const invoice = event.data.object as Stripe.Invoice;
            
            const invoiceData = invoice as Stripe.Invoice & { subscription?: string };
            if (!invoiceData.subscription) {
                processedEvents.add(event.id);
                return new NextResponse(null, { status: 200 });
            }
            
            const invoiceSubscription = await stripe.subscriptions.retrieve(
                invoiceData.subscription as string,
            );

            // Validate invoice subscription data
            if (!invoiceSubscription.id || !invoiceSubscription.items?.data?.[0]?.price?.id) {
                processedEvents.add(event.id);
                return new NextResponse(null, { status: 200 });
            }

            // Validate current_period_end timestamp for invoice
            const invoiceSubscriptionData = invoiceSubscription as unknown as Stripe.Subscription & { current_period_end: number };
            const invoiceCurrentPeriodEnd = invoiceSubscriptionData.current_period_end;
            if (!invoiceCurrentPeriodEnd || invoiceCurrentPeriodEnd <= 0) {
                processedEvents.add(event.id);
                return new NextResponse(null, { status: 200 });
            }

            const invoicePeriodEndDate = new Date(invoiceCurrentPeriodEnd * 1000);

            // Check if subscription exists in our database first
            const existingSubscription = await db.select().from(userSubscriptions)
                .where(eq(userSubscriptions.stripeSubscriptionId, invoiceSubscription.id));
            
            if (existingSubscription.length === 0) {
                processedEvents.add(event.id);
                return new NextResponse(null, { status: 200 });
            }

            await db.update(userSubscriptions).set({
                stripePriceId: invoiceSubscription.items.data[0]?.price.id,
                stripeCurrentPeriodEnd: invoicePeriodEndDate,
            }).where(eq(userSubscriptions.stripeSubscriptionId, invoiceSubscription.id));
        }

    } catch (error: unknown) {
        // Don't return 500 for duplicate events or constraint violations
        const dbError = error as { code?: string; constraint?: string; message?: string };
        if (dbError.code === '23505' || dbError.constraint) {
            processedEvents.add(event.id);
            return new NextResponse(null, { status: 200 });
        }
        
        // For any other database errors, also treat as success to avoid endless retries
        if (dbError.code && dbError.code.startsWith('23')) {
            processedEvents.add(event.id);
            return new NextResponse(null, { status: 200 });
        }
        
        const errorMessage = dbError.message || 'Unknown error';
        return new NextResponse(`Webhook processing error: ${errorMessage}`, { status: 500 });
    }

    // Mark event as processed after successful handling
    processedEvents.add(event.id);
    return new NextResponse(null, { status: 200 });
};
