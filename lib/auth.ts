// lib/auth.ts - Dashboard Authentication
import { createClient } from "@supabase/supabase-js";
import { jwtVerify } from "jose";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key"
);

// ============================================
// AUTHENTICATION FUNCTIONS
// ============================================

export async function loginAdmin(
  email: string,
  password: string
): Promise<{ success: boolean; token?: string; error?: string }> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return {
      success: true,
      token: data.session?.access_token,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Login failed",
    };
  }
}

export async function registerAdmin(
  email: string,
  password: string,
  role: "admin" | "content_creator" | "moderator" = "admin"
): Promise<{ success: boolean; userId?: string; error?: string }> {
  try {
    // Sign up with Supabase Auth
    const { data: authData, error: authError } =
      await supabase.auth.signUp({
        email,
        password,
      });

    if (authError) {
      return { success: false, error: authError.message };
    }

    // Create admin user record
    const { data, error: dbError } = await supabase
      .from("admin_users")
      .insert([
        {
          email,
          role,
        },
      ])
      .select();

    if (dbError) {
      return { success: false, error: dbError.message };
    }

    return {
      success: true,
      userId: data?.[0]?.id,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Registration failed",
    };
  }
}

export async function logoutAdmin(token: string): Promise<void> {
  try {
    await supabase.auth.signOut();
  } catch (error) {
    console.error("Logout error:", error);
  }
}

// ============================================
// TOKEN VERIFICATION
// ============================================

export async function verifyToken(token: string): Promise<{
  valid: boolean;
  userId?: string;
  email?: string;
}> {
  try {
    const verified = await jwtVerify(token, JWT_SECRET);
    return {
      valid: true,
      userId: verified.payload.sub as string,
      email: verified.payload.email as string,
    };
  } catch (error) {
    return { valid: false };
  }
}

// ============================================
// PERMISSION CHECKS
// ============================================

export async function checkAdminPermission(userId: string): Promise<boolean> {
  try {
    const { data } = await supabase
      .from("admin_users")
      .select("role")
      .eq("id", userId)
      .single();

    return data?.role === "admin";
  } catch (error) {
    return false;
  }
}

export async function checkContentCreatorPermission(
  userId: string
): Promise<boolean> {
  try {
    const { data } = await supabase
      .from("admin_users")
      .select("role")
      .eq("id", userId)
      .single();

    return ["admin", "content_creator"].includes(data?.role);
  } catch (error) {
    return false;
  }
}

export default {
  loginAdmin,
  registerAdmin,
  logoutAdmin,
  verifyToken,
  checkAdminPermission,
  checkContentCreatorPermission,
};
