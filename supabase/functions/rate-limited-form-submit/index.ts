import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface FormSubmissionRequest {
  formType: string;
  formData: Record<string, any>;
  userIP?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { formType, formData, userIP } = await req.json() as FormSubmissionRequest;
    
    // Get client IP for rate limiting
    const clientIP = userIP || req.headers.get("x-forwarded-for") || "unknown";
    
    // Check rate limit (10 submissions per hour per IP)
    const { data: rateLimitCheck, error: rateLimitError } = await supabase
      .rpc('check_rate_limit', {
        p_identifier: clientIP,
        p_action: 'form_submission',
        p_max_requests: 10,
        p_window_minutes: 60
      });

    if (rateLimitError) {
      console.error("Rate limit check error:", rateLimitError);
      return new Response(
        JSON.stringify({ error: "Rate limit check failed" }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500
        }
      );
    }

    if (!rateLimitCheck) {
      return new Response(
        JSON.stringify({ 
          error: "Rate limit exceeded. Please wait before submitting again.",
          retryAfter: 3600 // 1 hour in seconds
        }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 429 
        }
      );
    }

    // Validate required fields based on form type
    let validationError = null;
    
    if (formType === 'connection_request') {
      const required = ['nom', 'prenom', 'email', 'telephone', 'type_client'];
      for (const field of required) {
        if (!formData[field] || formData[field].toString().trim() === '') {
          validationError = `Field ${field} is required`;
          break;
        }
      }

      // Validate email format
      const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]+$/;
      if (formData.email && !emailRegex.test(formData.email)) {
        validationError = "Invalid email format";
      }

      // Validate phone format (basic validation)
      const phoneRegex = /^[+]?[0-9\s\-\(\)\.]{10,}$/;
      if (formData.telephone && !phoneRegex.test(formData.telephone)) {
        validationError = "Invalid phone format";
      }
    }

    if (validationError) {
      return new Response(
        JSON.stringify({ error: validationError }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400 
        }
      );
    }

    // Sanitize and limit input lengths
    const sanitizedData = { ...formData };
    
    // Enforce length limits
    if (sanitizedData.nom) sanitizedData.nom = sanitizedData.nom.toString().slice(0, 100);
    if (sanitizedData.prenom) sanitizedData.prenom = sanitizedData.prenom.toString().slice(0, 100);
    if (sanitizedData.commentaires) sanitizedData.commentaires = sanitizedData.commentaires.toString().slice(0, 2000);
    if (sanitizedData.message) sanitizedData.message = sanitizedData.message.toString().slice(0, 5000);

    // Insert based on form type
    let result;
    
    if (formType === 'connection_request') {
      const { data, error } = await supabase
        .from('leads_raccordement')
        .insert({
          ...sanitizedData,
          form_type: 'full',
          status: 'nouveau',
          created_at: new Date().toISOString(),
          consent_accepted: true
        })
        .select()
        .single();

      if (error) {
        console.error("Database insert error:", error);
        return new Response(
          JSON.stringify({ error: "Failed to submit form" }),
          { 
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 500 
          }
        );
      }

      result = data;
    } else if (formType === 'contact') {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          name: sanitizedData.name,
          email: sanitizedData.email,
          phone: sanitizedData.phone,
          message: sanitizedData.message,
          request_type: 'contact',
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error("Database insert error:", error);
        return new Response(
          JSON.stringify({ error: "Failed to submit message" }),
          { 
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 500 
          }
        );
      }

      result = data;
    }

    // Log successful submission for monitoring
    console.log(`Form submitted successfully: ${formType}, ID: ${result?.id}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        id: result?.id,
        message: "Form submitted successfully" 
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200 
      }
    );

  } catch (error) {
    console.error("Form submission error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500 
      }
    );
  }
});