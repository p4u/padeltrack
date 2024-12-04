import type { Config } from 'drizzle-kit';

export default {
  schema: './src/db/schema.ts',
  out: './src/db/migrations',
  driver: 'turso',
  dbCredentials: {
    url: "https://padel-p4u1.aws-eu-west-3.turso.io",
    authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MzMzMDc2NDQsImlhdCI6MTczMzMwNDA0NCwiaWQiOiI2Yjk0Nzk4YS00M2U5LTRkMGEtOGJkNS0xYmU2NTQxNjEyMzQifQ.Yrv5ozpM8MZrwS195R3Wiz0sq7QM4Dkpf9fn0SQeuR16iQxPgcriyiBqAOWUNnBcuKhJi0ZX0bwaNRANk6oeCA"
  }
} satisfies Config;