import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["patient", "doctor"]),
  phone: z.string().optional(),
  bmdcRegistrationNumber: z.string().optional(),
  specialization: z.string().optional(),
  hospitalAffiliation: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export const healthRecordSchema = z.object({
  temperature: z.number().min(94).max(108),
  plateletCount: z.number().min(0).max(1000000),
  hematocrit: z.number().min(10).max(80).optional(),
  wbcCount: z.number().min(500).max(50000).optional(),
  symptoms: z.array(z.string()).default([]),
  notes: z.string().optional(),
});

