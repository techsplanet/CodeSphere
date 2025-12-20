import {z} from "zod";

// > Define time representation contract across all runtimes.

export const TimestampSchema = z.iso.datetime();

// Nullable timestamp for optional fields
export const NullableTimestampSchema = TimestampSchema.nullable();

// Optional timestamp for fields that may be omitted
export const OptionalTimestampSchema = TimestampSchema.optional();

// Inferring type for use in application logic
export type TimeStamp = z.infer<typeof TimestampSchema>;