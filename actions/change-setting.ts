"use server";

import { ChangeSettingSchema } from "@/schemas";
import { z } from "zod";
import { getUserByEmail, getUserById } from "@/data/user";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";

export const changeSetting = async (
  values: z.infer<typeof ChangeSettingSchema>
) => {
  const validatedFields = ChangeSettingSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  const { name, email, password, newPassword, role, isTwoFactorEnabled } =
    validatedFields.data;

  const user = await currentUser();
  if (!user) {
    return { error: "Invalid user" };
  }
  if (user.isOAuth) {
    values.email = "";
    values.password = undefined;
    values.newPassword = undefined;
    values.isTwoFactorEnabled = undefined;
  }
  const exisitngUser = await getUserByEmail(email);
  const dbUser = await getUserById(user.id || "");

  if (
    !exisitngUser ||
    !exisitngUser.email ||
    !exisitngUser.password ||
    !newPassword
  ) {
    return { error: "Invalid credentials" };
  }

  if (email && email !== user.email) {
    if (exisitngUser && exisitngUser.email !== user.email) {
      return { error: "Email already exists" };
    }
    const verificationToken = await generateVerificationToken(email);
    await sendVerificationEmail(email, verificationToken.token);
    return { success: "Verification email sent" };
  }

  if (password && newPassword && dbUser?.password) {
    const passwordsMatch = await bcrypt.compare(password, dbUser.password);
    if (!passwordsMatch) {
      return { error: "Invalid password" };
    }
    const newHashedPassword = await bcrypt.hash(newPassword, 10);
    await db.user.update({
      where: { id: exisitngUser.id },
      data: {
        emailVerified: new Date(),
        email: exisitngUser.email,
        password: newHashedPassword,
        name: exisitngUser.name,
        role: role,
        isTwoFactorEnabled: isTwoFactorEnabled,
      },
    });
  }

  console.log("change setting action!", role);
  return { success: "Setting changed" };
};
