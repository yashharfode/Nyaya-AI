"use server";

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback_secret_for_local_development_only_12345"
);

// Helper to get session from cookie
export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_session")?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as { userId: string; name: string; email: string };
  } catch (error) {
    return null;
  }
}

export async function createSessionAction({ firebaseUid, email, name }: { firebaseUid: string, email: string, name?: string | null }) {
  try {
    if (!email || !firebaseUid) {
      return { error: "Missing required user information" };
    }

    const userName = name || email.split("@")[0];

    // Create JWT for existing middleware protection using Firebase UID as userId
    const token = await new SignJWT({ userId: firebaseUid, firebaseUid, name: userName, email })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(JWT_SECRET);

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set("auth_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return { success: true };
  } catch (error: any) {
    console.error("Session creation error:", error);
    return { error: "Failed to create session on the server. Please try again." };
  }
}

// Development Only: Bypass Login
export async function bypassLoginAction() {
  const token = await new SignJWT({ 
    userId: "dev_bypass_uid_123", 
    firebaseUid: "dev_bypass_uid_123", 
    name: "Dev User", 
    email: "dev@example.com" 
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);

  const cookieStore = await cookies();
  cookieStore.set("auth_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return { success: true };
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("auth_session");
  return { success: true };
}
