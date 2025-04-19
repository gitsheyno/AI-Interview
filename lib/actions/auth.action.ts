"use server";

import { auth, db } from "@/app/firebase/admin";
import { cookies } from "next/headers";

export async function signUp(params: SignUpParams) {
  const { uid, name, email } = params;

  try {
    // user already exists
    const useRecord = await db.collection("users").doc(uid).get();

    if (useRecord.exists) {
      return {
        success: false,
        message: "User already exists",
      };
    }

    await db.collection("users").doc(uid).set({});
  } catch (error: any) {
    console.error("Error signing up:", error);

    if (error.code === "auth/email-already-exists") {
      return {
        success: false,
        message: "Email already exists",
      };
    }

    return {
      success: false,
      message: "An error occurred during sign-up",
    };
  }
}

export async function signIn(params: SignInParams) {
  const { email, idToken } = params;

  try {
    const userRecord = await auth.getUserByEmail(email);
    if (!userRecord) {
      return {
        success: false,
        message: "User not found",
      };
    }

    await setSessionCookie(idToken);
  } catch (error: any) {
    console.error("Error signing in:", error);

    if (error.code === "auth/user-not-found") {
      return {
        success: false,
        message: "User not found",
      };
    }

    return {
      success: false,
      message: "An error occurred during sign-in",
    };
  }
}

export async function setSessionCookie(idToken: string) {
  const cookieStore = await cookies();

  const sessionCoocie = await auth.createSessionCookie(idToken, {
    expiresIn: 60 * 60 * 24 * 5 * 1000, // 5 days
  });

  cookieStore.set("session", sessionCoocie, {
    maxAge: 60 * 60 * 24 * 5, // 5 days
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
  });
}
