// supabase/functions/register-with-invite/index.ts

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
// import { Database } from '../_shared/database.types.ts'; // Add this line if you generate DB types

// Use the Service Role Key for secure operations
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

// Define the expected request body structure
type RegisterPayload = {
  email: string;
  password: string;
  role: 'customer' | 'worker' | 'admin';
  invite_code?: string;
};

// Helper function for a quick JSON response
const respond = (status: number, data: any) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

// Correctly type the incoming Request object
serve(async (req: Request) => {
  if (req.method !== 'POST') {
    return respond(405, { error: 'Method Not Allowed' });
  }

  try {
    const { email, password, role, invite_code }: RegisterPayload = await req.json();

    if (!email || !password || !role) {
      return respond(400, { error: 'Missing required fields: email, password, and role.' });
    }

    let finalRole: 'customer' | 'worker' | 'admin' = 'customer';

    if (role === 'customer') {
      finalRole = 'customer';
    } else if (role === 'worker' || role === 'admin') {
      if (!invite_code) {
        return respond(403, { error: `Registration for role '${role}' requires an invite code.` });
      }

      // 1. Validate the invite code
      const { data: codeData, error: codeError } = await supabase
        .from('invite_codes')
        .select('role, used')
        .eq('code', invite_code)
        .maybeSingle(); 

      if (codeError || !codeData || codeData.used) {
        return respond(403, { error: 'Invalid or expired invite code.' });
      }

      if (codeData.role !== role) {
        return respond(403, { error: `Invite code is for a different role (${codeData.role}).` });
      }

      // 2. Mark the code as used
      const { error: updateError } = await supabase
        .from('invite_codes')
        .update({ used: true })
        .eq('code', invite_code);

      if (updateError) {
        console.error('Failed to mark invite code as used:', updateError);
        return respond(500, { error: 'Server failed to finalize invite code. Try again.' });
      }
      
      finalRole = role; 
    }

    // 3. Create the user using the Service Role Key
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Always confirm email for invited roles
    });

    if (authError || !authData.user) {
      console.error('Supabase Auth error:', authError);
      return respond(400, { error: authError?.message || 'Failed to create user account.' });
    }

    // 4. Insert the user's profile with the determined role
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({ id: authData.user.id, full_name: email.split('@')[0], role: finalRole });

    if (profileError) {
      console.error('Profile creation error:', profileError);
      // Clean up the auth user if profile creation fails (important cleanup)
      await supabase.auth.admin.deleteUser(authData.user.id);
      return respond(500, { error: 'Failed to create user profile. Account rolled back.' });
    }

    // 5. Successful registration response
    return respond(200, {
      message: 'Registration successful',
      user_id: authData.user.id,
      role: finalRole,
    });
  } catch (e) {
    console.error('Unhandled request error:', e);
    return respond(500, { error: 'Internal server error.' });
  }
});