import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";


export async function createClient() {
  const cookieStore = await cookies();

  // This function creates a Supabase client that can be used on the server side.
  // It uses the cookies from the request to manage the session.

  const client = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {}
        },
      },
    },
  );

  return client;
}

// This function retrieves the current user from the Supabase auth session.
export async function getUser() {
  try {
    const { auth } = await createClient();
    const userObject = await auth.getUser();

    if (userObject.error || !userObject.data.user) {
      return null; 
    }

    return userObject.data.user;
  } catch (error) {
    console.log('No active session'); 
    return null;
  }
}