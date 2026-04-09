import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt } = await req.json();
    if (!prompt) {
      return new Response(JSON.stringify({ error: "Prompt is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "API key not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");

    const response = await fetch(`${SUPABASE_URL}/functions/v1/ai-proxy`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
      },
      body: JSON.stringify({
        model: "google/gemini-3.1-flash-image-preview",
        messages: [
          {
            role: "user",
            content: `Generate a clean, professional logo design. The logo should be: ${prompt}. Make it minimalist, modern, and suitable for a website header. The image should have a transparent/white background. Output only the image.`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("AI proxy error:", errText);
      return new Response(JSON.stringify({ error: "Failed to generate logo" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    
    // Extract image from response
    const imageContent = data?.choices?.[0]?.message?.content;
    let imageUrl = "";
    
    if (Array.isArray(imageContent)) {
      const imgPart = imageContent.find((p: any) => p.type === "image_url" || p.inline_data);
      if (imgPart?.image_url?.url) {
        imageUrl = imgPart.image_url.url;
      } else if (imgPart?.inline_data) {
        imageUrl = `data:${imgPart.inline_data.mime_type};base64,${imgPart.inline_data.data}`;
      }
    } else if (typeof imageContent === "string" && imageContent.startsWith("data:")) {
      imageUrl = imageContent;
    }

    if (!imageUrl) {
      return new Response(JSON.stringify({ error: "No image generated. Try a different prompt.", raw: data }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ url: imageUrl }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
