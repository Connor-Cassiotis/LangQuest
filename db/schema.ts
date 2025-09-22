/**
 * Database Schema Definitions
 * 
 * This module defines the database schema for LangQuest using Drizzle ORM.
 * It includes tables for courses, units, lessons, challenges, user progress, and subscriptions.
 * All tables are designed for a PostgreSQL database with proper foreign key relationships.
 */

import { relations } from "drizzle-orm";
import { boolean, pgTable, serial, text, timestamp, integer, pgEnum } from "drizzle-orm/pg-core";

/**
 * Courses Table
 * Stores language courses available in the application
 */
export const courses = pgTable("courses", {
    id: serial("id").primaryKey(),
    title: text("title").notNull(), // Course name (e.g., "Spanish", "French")
    imageSrc: text("image_src").notNull(), // Course flag or icon URL
    createdAt: timestamp("created_at").defaultNow()
});

export const coursesRelations = relations(courses, ({ many }) => ({
    userProgress: many(userProgress),
    units: many(units),
}));

/**
 * Units Table
 * Represents learning units within a course (e.g., "Basic Phrases", "Grammar")
 */
export const units = pgTable("units", {
    id: serial("id").primaryKey(),
    title: text("title").notNull(), // Unit name
    description: text("description").notNull(), // Unit description
    courseId: integer("course_id").references(() => courses.id, { onDelete: "cascade" }).notNull(),
    order: integer("order").notNull(), // Display order within course
});

export const unitRelations = relations(units, ({ many, one }) => ({
    course: one(courses, {
        fields: [units.courseId],
        references: [courses.id]
    }),
    lessons: many(lessons),
}));

/**
 * Lessons Table
 * Individual lessons within a unit containing multiple challenges
 */
export const lessons = pgTable("lessons", {
    id: serial("id").primaryKey(),
    title: text("title").notNull(), // Lesson name
    unitId: integer("unit_id").references(() => units.id, { onDelete: "cascade" }).notNull(),
    order: integer("order").notNull(), // Display order within unit
});

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
    unit: one(units, {
        fields: [lessons.unitId],
        references: [units.id]
    }),
    challenges: many(challenges),
}));

/**
 * Challenge Types Enum
 * Defines the types of challenges available in lessons
 */
export const challengesEnum = pgEnum("type", ["SELECT", "ASSIST"])

/**
 * Challenges Table
 * Individual questions/exercises within lessons
 */
export const challenges = pgTable("challenges", {
    id: serial("id").primaryKey(),
    lessonId: integer("lesson_id").references(() => lessons.id, { onDelete: "cascade" }).notNull(),
    type: challengesEnum("type").notNull(), // Challenge type (SELECT or ASSIST)
    question: text("question").notNull(), // The question text
    order: integer("order").notNull(), // Display order within lesson

});

export const challengesRelations = relations(challenges, ({ one, many }) => ({
    lesson: one(lessons, {
        fields: [challenges.lessonId],
        references: [lessons.id]
    }),
    challengeOptions: many(challengeOptions),
    challengeProgress: many(challengeProgress),
}));

/**
 * Challenge Options Table
 * Multiple choice answers for challenges
 */
export const challengeOptions = pgTable("challenge_options", {
    id: serial("id").primaryKey(),
    challengeId: integer("challenge_id").references(() => challenges.id, { onDelete: "cascade" }).notNull(),
    text: text("text").notNull(), // Option text
    correct: boolean("correct").notNull(), // Whether this is the correct answer
    imageSrc: text("image_src"), // Optional image for visual answers
    audioSrc: text("audio_src"), // Optional audio for pronunciation
});

export const challengesOptionsRelations = relations(challengeOptions, ({ one }) => ({
    challenge: one(challenges, {
        fields: [challengeOptions.challengeId],
        references: [challenges.id]
    }),
}));

/**
 * Challenge Progress Table
 * Tracks which challenges each user has completed
 */
export const challengeProgress = pgTable("challenge_progress", {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull(), // Clerk user ID
    challengeId: integer("challenge_id").references(() => challenges.id, { onDelete: "cascade" }).notNull(),
    completed: boolean("completed").notNull().default(false),
});

export const challengesProgressRelations = relations(challengeProgress, ({ one }) => ({
    challenge: one(challenges, {
        fields: [challengeProgress.challengeId],
        references: [challenges.id]
    }),
}));

/**
 * User Progress Table
 * Stores user's overall progress, hearts (lives), points, and active course
 */
export const userProgress = pgTable("user_progress", {
    userId: text("user_id").primaryKey(), // Clerk user ID
    userName: text("user_name").notNull().default("User"), // Display name
    userImageSrc: text("user_image_src").notNull().default("/mascot.svg"), // Profile image URL
    activeCourseId: integer("active_course_id").references(() => courses.id, { onDelete: "cascade" }),
    hearts: integer("hearts").notNull().default(5), // Lives/attempts (max 5)
    points: integer("points").notNull().default(0), // Total points earned
});

export const userProgressRelations = relations(userProgress, ({ one }) => ({
    activeCourse: one(courses, {
        fields: [userProgress.activeCourseId],
        references: [courses.id]
    })
}));

/**
 * User Subscriptions Table
 * Manages Stripe subscription data for LangQuest Plus users
 */
export const userSubscriptions = pgTable("user_subscriptions", {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull().unique(), // Clerk user ID
    stripeCustomerId: text("stripe_customer_id").notNull().unique(), // Stripe customer ID
    stripeSubscriptionId: text("stripe_subscription_id").notNull().unique(), // Stripe subscription ID
    stripePriceId: text("stripe_price_id").notNull(), // Stripe price ID for the subscription
    stripeCurrentPeriodEnd: timestamp("stripe_current_period_end").notNull(), // Subscription end date
});