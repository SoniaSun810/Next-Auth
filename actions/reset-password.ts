"use server";

import * as z from "zod";
import { db } from "@/lib/db";
import { getUserByEmail } from "@/data/user";
import bcrypt from "bcryptjs";
import { LoginSchema } from "@/schemas";

export const resetPassword = async (email: string | null, password: string | undefined) => {
  //   const validatedFields = LoginSchema.safeParse(values);

  //   if (!validatedFields.success) {
  //     return { error: "Invalid fields" };
  //   }

  //   const { email, password } = validatedFields.data;
  if (!email || !password) {
    return { error: "Invalid Request" };
  }
  const exisitngUser = await getUserByEmail(email);
  if (!exisitngUser) {
    return { error: "Email does not exist" };
  }

  if (!exisitngUser.emailVerified) {
    return { error: "Email not verified" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await db.user.update({
    where: { id: exisitngUser.id },
    data: {
      emailVerified: new Date(),
      email: exisitngUser.email,
      password: hashedPassword,
      name: exisitngUser.name,
    },
  });

  return { success: "Reset password successfully" };
};
