import { PrismaClient } from "@prisma/client";

const SUPABASE_POOLER_URL =
  "postgresql://postgres.vjatoeqdlnjsjkkezxob:NFq6EOKBbjdOOBVY@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true";

const SUPABASE_DIRECT_URL =
  "postgresql://postgres.vjatoeqdlnjsjkkezxob:NFq6EOKBbjdOOBVY@aws-0-ap-south-1.pooler.supabase.com:5432/postgres";

// Ensure process.env has valid database URLs for schema and runtime
if (!process.env.DATABASE_URL || process.env.DATABASE_URL.trim() === "") {
  process.env.DATABASE_URL = SUPABASE_POOLER_URL;
}

if (!process.env.DIRECT_URL || process.env.DIRECT_URL.trim() === "") {
  process.env.DIRECT_URL = SUPABASE_DIRECT_URL;
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL || SUPABASE_POOLER_URL,
      },
    },
    log: ["error"],
  });

// Cache on globalThis for both dev and serverless production lambda reuse
globalForPrisma.prisma = prisma;
