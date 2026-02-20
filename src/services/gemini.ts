const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

export async function parseResumeWithGemini(resumeText: string): Promise<any> {
  if (!GEMINI_API_KEY) {
    console.warn('Gemini API key not found, using fallback parsing');
    return null;
  }

  try {
    const prompt = `
    Parse the following resume text and extract structured information in JSON format. 
    Return only valid JSON with this exact structure:
    {
      "personalInfo": {
        "fullName": "full name",
        "jobTitle": "current job title",
        "email": "email address",
        "phone": "phone number",
        "location": "location",
        "summary": "professional summary"
      },
      "experiences": [
        {
          "position": "job title",
          "company": "company name",
          "startDate": "start date",
          "endDate": "end date",
          "current": false,
          "location": "work location",
          "description": "job description"
        }
      ],
      "education": [
        {
          "degree": "degree name",
          "field": "field of study",
          "institution": "institution name",
          "startDate": "start date",
          "endDate": "end date",
          "gpa": "GPA"
        }
      ],
      "skills": [
        {
          "name": "skill name",
          "category": "technical or soft skills"
        }
      ]
    }

    Resume text:
    ${resumeText}
    `;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.1,
          topK: 1,
          topP: 1,
          maxOutputTokens: 2048,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data: GeminiResponse = await response.json();
    const text = data.candidates[0]?.content?.parts[0]?.text;
    
    if (!text) {
      throw new Error('No response from Gemini');
    }

    // Extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('Gemini API error:', error);
    throw error;
  }
}

export async function analyzeResumeWithGemini(resumeData: any): Promise<any> {
  if (!GEMINI_API_KEY) {
    console.warn('Gemini API key not found, using fallback analysis');
    return null;
  }

  try {
    const prompt = `
    Analyze this resume data and provide professional feedback in JSON format:
    {
      "overallScore": 85,
      "strengths": [
        "Strong technical skills section",
        "Clear professional experience"
      ],
      "improvements": [
        "Add quantifiable achievements",
        "Include more specific skills"
      ],
      "atsScore": 78,
      "atsRecommendations": [
        "Use standard section headings",
        "Include keywords from job description"
      ]
    }

    Resume data:
    ${JSON.stringify(resumeData, null, 2)}
    `;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.3,
          topK: 1,
          topP: 1,
          maxOutputTokens: 1024,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data: GeminiResponse = await response.json();
    const text = data.candidates[0]?.content?.parts[0]?.text;
    
    if (!text) {
      throw new Error('No response from Gemini');
    }

    // Extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('Gemini analysis error:', error);
    throw error;
  }
}
