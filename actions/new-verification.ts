"use server";

import { db } from "@/lib/db";
import { getUserByEmail } from "@/data/user";
import { getVerificationtokenByToken } from "@/data/verification-token";

export const newVerification = async (token: string) => {
  const existingToken = await getVerificationtokenByToken(token);
  console.log("existingToken", existingToken)

  if (!existingToken) {
    return { error: "Token does not exist" };
  }

  const hasExpired = new Date() > existingToken.expires;

  if (hasExpired) {
    return { error: "Token has expired" };
  }

  const exisitngUser = await getUserByEmail(existingToken.email);
  if (!exisitngUser) {
    return { error: "Email does not exist" };
  }

  await db.user.update({
    where: { id: exisitngUser.id },
    data: { emailVerified: new Date(), email: exisitngUser.email },
  });

  await db.verificationToken.delete({
    where: { id: existingToken.id },
  });

  return { success: "Email verified" };
};
