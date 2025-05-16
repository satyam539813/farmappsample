
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not set');
    }

    const { image, prompt } = await req.json();
    if (!image) {
      throw new Error('Image data is required');
    }

    const analysisPrompt = prompt || "What is in this image?";
    console.log(`Analyzing image with prompt: "${analysisPrompt}"`);

    // Call Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: analysisPrompt },
                {
                  inline_data: {
                    mime_type: "image/jpeg",
                    data: image.replace(/^data:image\/\w+;base64,/, ''),
                  },
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API error:', errorData);
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }

    const analysisResult = await response.json();
    console.log('Analysis successful');

    return new Response(
      JSON.stringify({ 
        analysis: analysisResult.candidates?.[0]?.content?.parts?.[0]?.text || 'No analysis available'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error analyzing image:', error.message);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to analyze image' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
