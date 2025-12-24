import {z} from "zod";

export enum Difficulty {
    Easy = "easy",
    Medium = "medium",
    Hard = "hard"
}

export const DifficultySchema = z.enum(["easy", "medium", "hard"]);


export type DifficultyType = z.infer<typeof DifficultySchema>