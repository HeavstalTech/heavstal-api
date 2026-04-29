import { HeavstalConfig } from './types';

export async function heavstalFetch(endpoint: string, body: any, config?: HeavstalConfig) {
  const apiKey = config?.apiKey || process.env.HEAVSTAL_API_KEY;

  if (!apiKey) {
    throw new Error("Missing API Key. Please provide it in the function options or set 'HEAVSTAL_API_KEY' in your environment variables. Get your key at: https://heavstal.com.ng/credentials");
  }

  try {
    const response = await fetch(`https://heavstal.com.ng/api/v1/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey
      },
      body: JSON.stringify(body)
    });
    
    let responseData;
    try {
      responseData = await response.json();
    } catch {
      throw new Error(`Server returned a non-JSON response with status: ${response.status}`);
    }
    
    if (!response.ok) {
      const serverMsg = responseData?.error || "Unknown Error";
      const serverDetails = responseData?.details || "";
      
      if (response.status === 429) {
        throw new Error(`Rate Limit Exceeded (${serverMsg}). Upgrade plan at https://heavstal.com.ng/pricing`);
      }
      if (response.status === 401 || response.status === 403) {
        throw new Error(`Auth Failed (${serverMsg}). Check your API Key.`);
      }
      
      throw new Error(`Heavstal API Error: ${serverMsg} ${serverDetails ? `- ${serverDetails}` : ''}`);
    }

    // Return just the nested "data" object from your backend response
    return responseData.data;

  } catch (error: any) {
    if (error.message.includes('Heavstal') || error.message.includes('Auth') || error.message.includes('Rate Limit')) {
        throw error;
    }
    throw new Error(`Network Error: Could not reach Heavstal servers. Details: ${error.message}`);
  }
}
