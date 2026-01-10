import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EligibilityRequest {
  schemeName: string;
  schemeDescription: string;
  ministry: string;
  benefits: string[];
  userProfile: Record<string, any>;
  ruleResults: Array<{
    criterionId: string;
    passed: boolean;
    reason: string;
  }>;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      schemeName, 
      schemeDescription, 
      ministry,
      benefits,
      userProfile, 
      ruleResults 
    }: EligibilityRequest = await req.json();

    console.log(`Generating eligibility explanation for: ${schemeName}`);
    console.log(`User profile:`, userProfile);
    console.log(`Rule results:`, ruleResults);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const passedRules = ruleResults.filter(r => r.passed).length;
    const totalRules = ruleResults.length;
    const isEligible = passedRules === totalRules;

    // Build detailed prompt for AI
    const systemPrompt = `You are an official government scheme eligibility advisor for India. 
Your role is to provide clear, authoritative explanations about eligibility for government welfare schemes.
Always maintain a professional, helpful tone while being accurate about eligibility criteria.
Cite specific eligibility rules when explaining decisions.
If the applicant is not fully eligible, be empathetic and suggest what they might do or alternative options.
Keep responses under 300 words but comprehensive.`;

    const userPrompt = `Please provide an official eligibility assessment explanation for the following:

**Scheme:** ${schemeName}
**Ministry:** ${ministry}
**Description:** ${schemeDescription}

**Key Benefits:**
${benefits.map(b => `- ${b}`).join('\n')}

**Applicant Profile:**
- Name: ${userProfile.name || 'Not provided'}
- Age: ${userProfile.age || 'Not provided'}
- Gender: ${userProfile.gender || 'Not provided'}
- Annual Income: ₹${userProfile.annualIncome?.toLocaleString('en-IN') || 'Not provided'}
- State: ${userProfile.state || 'Not provided'}
- Category: ${userProfile.category?.toUpperCase() || 'Not provided'}
- Education: ${userProfile.education || 'Not provided'}
- Has Land: ${userProfile.hasLand ? 'Yes' : 'No'}
- Land Holding: ${userProfile.landHolding ? userProfile.landHolding + ' hectares' : 'N/A'}
- BPL Card: ${userProfile.hasBPLCard ? 'Yes' : 'No'}
- Rural Area: ${userProfile.isRural ? 'Yes' : 'No'}
- Family Members: ${userProfile.familyMembers || 'Not provided'}

**Eligibility Criteria Results (${passedRules}/${totalRules} passed):**
${ruleResults.map(r => `- ${r.passed ? '✓' : '✗'} ${r.reason}`).join('\n')}

**Overall Eligibility Status:** ${isEligible ? 'ELIGIBLE' : 'NOT FULLY ELIGIBLE'}

Please provide:
1. A clear explanation of the eligibility decision
2. Specific reasons for each criteria result
3. ${isEligible ? 'Next steps to apply for this scheme' : 'What the applicant could do to become eligible or alternative schemes they might consider'}
4. Any important notes or disclaimers`;

    console.log("Calling Lovable AI Gateway...");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ 
            error: "Rate limit exceeded. Please try again in a few moments.",
            code: "RATE_LIMIT"
          }),
          { 
            status: 429, 
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ 
            error: "AI service requires additional credits. Please try again later.",
            code: "PAYMENT_REQUIRED"
          }),
          { 
            status: 402, 
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          }
        );
      }
      
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const explanation = aiResponse.choices?.[0]?.message?.content || 
      "Unable to generate explanation. Please try again.";

    console.log("AI explanation generated successfully");

    // Generate next steps based on eligibility
    const nextSteps = isEligible 
      ? [
          "Gather all required documents mentioned in the scheme details",
          "Visit the official scheme portal or nearest Common Service Centre (CSC)",
          "Submit your application with verified documents",
          "Keep your application reference number for tracking",
          "Check your registered mobile/email for status updates"
        ]
      : [
          "Review the unmet eligibility criteria carefully",
          "Check if any documents can help prove eligibility",
          "Visit your local Block Development Office for guidance",
          "Consider alternative schemes that may better match your profile",
          "Keep your documents updated for future applications"
        ];

    return new Response(
      JSON.stringify({
        success: true,
        isEligible,
        overallScore: Math.round((passedRules / totalRules) * 100),
        explanation,
        nextSteps,
        generatedAt: new Date().toISOString(),
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );

  } catch (error) {
    console.error("Error generating eligibility explanation:", error);
    
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Failed to generate explanation",
        success: false 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
