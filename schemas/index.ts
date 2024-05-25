import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Invalid email address",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
  code: z.optional(z.string()),
});

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Invalid email address",
  }),
  password: z.string().min(6),
  name: z.string().min(1, {
    message: "Name is required",
  }),
});

export const ResetLinkSchema = z.object({
  email: z.string().email({
    message: "Invalid email address",
  }),
});

export const ResetPasswordSchema = z.object({
  password: z.string().min(6),
});
