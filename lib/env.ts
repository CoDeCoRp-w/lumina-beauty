import { z } from "zod";

// Define environment variable schema
const envSchema = z.object({
    DATABASE_URL: z.string().optional(),
    POSTGRES_PRISMA_URL: z.string().optional(),
    AUTH_SECRET: z.string().min(32, "AUTH_SECRET must be at least 32 characters"),
    NEXT_PUBLIC_APP_URL: z.string().url().optional().default("http://localhost:3000"),
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

// Parse and validate environment variables
const envParsed = envSchema.safeParse({
    DATABASE_URL: process.env.DATABASE_URL,
    POSTGRES_PRISMA_URL: process.env.POSTGRES_PRISMA_URL,
    AUTH_SECRET: process.env.AUTH_SECRET,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NODE_ENV: process.env.NODE_ENV,
});

if (!envParsed.success) {
    console.error("❌ Invalid environment variables:", envParsed.error.flatten().fieldErrors);
    throw new Error("Invalid environment variables");
}

// prioritize DATABASE_URL if available (manual override), otherwise use POSTGRES_PRISMA_URL
const dbUrl = envParsed.data.DATABASE_URL || envParsed.data.POSTGRES_PRISMA_URL;

if (!dbUrl) {
    throw new Error("DATABASE_URL or POSTGRES_PRISMA_URL is required");
}

export const env = {
    ...envParsed.data,
    DATABASE_URL: dbUrl
};
