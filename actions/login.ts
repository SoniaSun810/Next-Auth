"use server";
import * as z from "zod";
import { LoginSchema } from "@/schemas";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { getUserByEmail } from "@/data/user";
import {
  generateVerificationToken,
  generateTwoFactorToken,
} from "@/lib/tokens";
import { sendVerificationEmail, sendTwoFactorTokenEmail } from "@/lib/mail";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";
import { db } from "@/lib/db";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  const { email, password, code } = validatedFields.data;

  const exisitngUser = await getUserByEmail(email);

  if (!exisitngUser || !exisitngUser.email || !exisitngUser.password) {
    return { error: "Invalid credentials" };
  }

  if (!exisitngUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      exisitngUser.email
    );
    await sendVerificationEmail(exisitngUser.email, verificationToken.token);
    return { success: "Verification email sent" };
  }

  if (exisitngUser.isTwoFactorEnabled && exisitngUser.email) {
    if (code) {
      const twoFactorToken = await getTwoFactorTokenByEmail(exisitngUser.email);
      if (!twoFactorToken || twoFactorToken.token !== code) {
        return { error: "Invalid code" };
      }
      const hasExpired = new Date() > twoFactorToken.expires;
      if (hasExpired) {
        return { error: "Code has expired" };
      }

      // Delete the token after successful login
      await db.twoFactorToken.delete({
        where: {
          id: twoFactorToken.id,
        },
      });

      const existingConfirmation = await getTwoFactorConfirmationByUserId(
        exisitngUser.id
      );

      if (existingConfirmation) {
        await db.twoFactorConfirmation.delete({
          where: {
            id: existingConfirmation.id,
          },
        });
      }

      await db.twoFactorConfirmation.create({
        data: {
          userId: exisitngUser.id,
        },
      });

      
    } else {
      const twoFactorToken = await generateTwoFactorToken(exisitngUser.email);
      await sendTwoFactorTokenEmail(exisitngUser.email, twoFactorToken.token);
      console.log({ twoFactorToken });
      return { twoFactor: true };
    }
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
    //  TODO: Update the token here
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials" };
        default:
          return { error: "Something went wrong" };
      }
    }
    throw error;
  }
};

// const user = await getUserByEmail(email);

// if (!user || !user.password) return {error: "Login failed"};

// const passwordMatch = await bcrypt.compare(password, user.password);

// if (passwordMatch) return { success: "Logged in!" };
