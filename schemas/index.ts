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

export const ChangeSettingSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required",
  }),
  email: z.string().email({
    message: "Invalid email address",
  }),
  password: z.optional(z.string().min(6)),
  newPassword: z.optional(z.string().min(6)),
  role: z.optional(z.union([z.literal("ADMIN"), z.literal("USER")])),
  isTwoFactorEnabled: z.optional(z.boolean()),
}).refine((data) => {
  if (data.password && !data.newPassword) {
    return false;
  }
  // TODO add more validation
  return true;
}, {
  message: "New password is required",
  path: ["newPassword"],
})

