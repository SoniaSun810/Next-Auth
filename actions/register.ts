"use server";
import * as z from "zod";
import { RegisterSchema } from "@/schemas";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { getUserByEmail } from "@/data/user";

export const register = async (values: z.infer<typeof RegisterSchema>) => {

  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return {error: "Invalid fields"}
  }

 const {email, password, name} = validatedFields.data;
 const hashedPassword = await bcrypt.hash(password, 10);

 const exisitngUser = await getUserByEmail(email);

  if (exisitngUser)  {
    return {error: "User already exists!"};
  }
  
  await db.user.create({
    data: {
      email: email,
      password: hashedPassword,
      name: name,
    }
  })

  // Todo: Send email verification


  return {success: "Logged in!"};
};
