import { z } from "zod";

export const JWT_SECRET = "temp"; // maak echt geheim

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});
