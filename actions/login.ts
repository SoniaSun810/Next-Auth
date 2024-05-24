"use server";
import * as z from "zod";
import { LoginSchema } from "@/schemas";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { getUserByEmail } from "@/data/user";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  const { email, password } = validatedFields.data;

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
