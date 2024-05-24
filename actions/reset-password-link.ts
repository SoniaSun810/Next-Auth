"use server";

import { db } from "@/lib/db";
import { getUserByEmail } from "@/data/user";
import bcrypt from "bcryptjs";
import { sendResetPasswordEmail } from "@/lib/mail";
import * as z from "zod";
import { ResetLinkSchema } from "@/schemas";

export const resetPasswordLink = async (
  values: z.infer<typeof ResetLinkSchema>
) => {
  const validatedFields = ResetLinkSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  const { email } = validatedFields.data;

  const exisitngUser = await getUserByEmail(email);
  if (!exisitngUser) {
    return { error: "Email does not exist" };
  }

  if (!exisitngUser.emailVerified) {
    return { error: "Email not verified" };
  }

  await sendResetPasswordEmail(exisitngUser.email ?? "");
  return { success: "Reset link sent!" };

  // const hashedPassword = await bcrypt.hash(password, 10);
  // await db.user.update({
  //   where: { id: exisitngUser.id },
  //   data: {
  //     emailVerified: new Date(),
  //     email: exisitngUser.email,
  //     password: hashedPassword,
  //     name: exisitngUser.name,
  //   },
  // });

  // return { success: "Reset password successfully" };
};
