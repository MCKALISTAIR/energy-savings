import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface FeedbackRequest {
  feedbackType: string;
  email?: string;
  subject?: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { feedbackType, email, subject, message }: FeedbackRequest = await req.json();

    console.log("Received feedback:", { feedbackType, email: email || "anonymous", subject });

    // Create email content
    const emailSubject = subject || `${feedbackType.replace('-', ' ').toUpperCase()} - Renewable Energy Calculator`;
    
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">New Feedback - Renewable Energy Calculator</h2>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #374151;">Feedback Details</h3>
          <p><strong>Type:</strong> ${feedbackType.replace('-', ' ').toUpperCase()}</p>
          <p><strong>From:</strong> ${email || 'Anonymous user'}</p>
          ${subject ? `<p><strong>Subject:</strong> ${subject}</p>` : ''}
        </div>
        
        <div style="background-color: #ffffff; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <h3 style="margin-top: 0; color: #374151;">Message</h3>
          <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
        </div>
        
        <div style="margin-top: 20px; padding: 15px; background-color: #fef3c7; border-radius: 8px; font-size: 14px;">
          <p style="margin: 0; color: #92400e;">
            <strong>Note:</strong> This feedback was submitted through the Renewable Energy Calculator help page.
          </p>
        </div>
      </div>
    `;

    // Send feedback email to your team
    const emailResponse = await resend.emails.send({
      from: "Feedback <onboarding@resend.dev>", // Change this to your verified domain
      to: ["your-email@example.com"], // Replace with your actual email
      subject: emailSubject,
      html: emailHtml,
    });

    console.log("Feedback email sent successfully:", emailResponse);

    // If user provided email, send confirmation
    if (email) {
      const confirmationResponse = await resend.emails.send({
        from: "Renewable Energy Calculator <onboarding@resend.dev>", // Change this to your verified domain
        to: [email],
        subject: "Thank you for your feedback!",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Thank you for your feedback!</h2>
            
            <p>Hi there,</p>
            
            <p>We've received your ${feedbackType.replace('-', ' ')} and really appreciate you taking the time to help us improve the Renewable Energy Calculator.</p>
            
            <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #374151;">Your feedback:</h3>
              <p style="white-space: pre-wrap; line-height: 1.6; font-style: italic;">"${message}"</p>
            </div>
            
            <p>Our team will review your feedback and get back to you if we need any clarification or have updates to share.</p>
            
            <p>Best regards,<br>The Renewable Energy Calculator Team</p>
            
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
            <p style="font-size: 12px; color: #6b7280;">
              This is an automated confirmation email. Please don't reply to this email.
            </p>
          </div>
        `,
      });

      console.log("Confirmation email sent successfully:", confirmationResponse);
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Feedback sent successfully" 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error("Error in send-feedback function:", error);
    return new Response(
      JSON.stringify({ 
        error: "Failed to send feedback",
        details: error.message 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);