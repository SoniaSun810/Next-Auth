import { db } from "@/lib/db";

export const getVerificationtokenByToken = async (token: string) => {
  try {
    const allTokens = await db.verificationToken.findMany();
    console.log("all tokens", allTokens);
    const verificationToken = await db.verificationToken.findUnique({
      where: {
        token: token,
      },
    });
    return verificationToken;
  } catch {
    return null;
  }
};

export const getVerificationtokenByEmail = async (email: string) => {
  try {
    const verificationToken = await db.verificationToken.findFirst({
      where: {
        email,
      },
    });
    return verificationToken;
  } catch {
    return null;
  }
};
