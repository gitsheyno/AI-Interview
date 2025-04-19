"use server";

import { db } from "@/app/firebase/admin";

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
