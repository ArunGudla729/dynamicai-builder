import { z } from "zod";
import { ValidationError } from "@/types";

export function validateBody<T>(schema: z.ZodSchema<T>, data: any): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError("Validation failed", error.errors);
    }
    throw error;
  }
}

export function validateQuery<T>(schema: z.ZodSchema<T>, data: any): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError("Invalid query parameters", error.errors);
    }
    throw error;
  }
}

export function sanitizeInput(input: string): string {
  return input.replace(/[<>]/g, "").trim();
}
