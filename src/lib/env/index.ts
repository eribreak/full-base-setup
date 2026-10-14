import { z } from "zod"

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  NEXT_PUBLIC_APP_NAME: z.string().default("FE Base"),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_API_BASE_URL: z.string().url().optional(),
  API_BASE_URL: z.string().url().optional(),
})

type Env = z.infer<typeof envSchema>

let cachedEnv: Env | null = null

export function getEnv(): Env {
  if (cachedEnv) return cachedEnv

  const parsed = envSchema.safeParse({
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    API_BASE_URL: process.env.API_BASE_URL,
  })

  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors
    const messages = Object.entries(errors)
      .map(([key, value]) => `${key}: ${value.join(", ")}`)
      .join("; ")
    throw new Error(`Invalid environment variables: ${messages}`)
  }

  cachedEnv = parsed.data
  return cachedEnv
}

export function getPublicEnv(): Pick<Env, "NODE_ENV" | "NEXT_PUBLIC_APP_NAME" | "NEXT_PUBLIC_APP_URL" | "NEXT_PUBLIC_API_BASE_URL"> {
  const env = getEnv()
  return {
    NODE_ENV: env.NODE_ENV,
    NEXT_PUBLIC_APP_NAME: env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_APP_URL: env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_API_BASE_URL: env.NEXT_PUBLIC_API_BASE_URL,
  }
}

export function getServerEnv(): Pick<Env, "NODE_ENV" | "API_BASE_URL"> {
  const env = getEnv()
  return {
    NODE_ENV: env.NODE_ENV,
    API_BASE_URL: env.API_BASE_URL,
  }
}

export type { Env }