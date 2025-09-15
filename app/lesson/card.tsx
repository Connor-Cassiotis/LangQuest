import { challenges } from "@/db/schema";

type Props = {
    id: number;
    title: string;
    imageSrc: string | null;
    shortcut: string | null;
    text: string;
    selected?: boolean;
    onClick: () => void;
    status: "correct" | "wrong" | "none";
    audioSrc: string | null;
    disabled?: boolean;
    type: typeof challenges.$inferSelect["type"];
};


export const Card = ({ id, title, imageSrc, shortcut, selected, onClick, status, audioSrc, disabled, type }: Props) => {
    return (
        <div>
            {title}
        </div>
    );
};
