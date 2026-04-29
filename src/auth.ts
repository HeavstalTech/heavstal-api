// src/auth.ts

export async function verifyApiKey(userApiKey?: string): Promise<void> {
    const apiKey = userApiKey || process.env.HEAVSTAL_API_KEY

    if (!apiKey) {
        throw new Error("Missing API Key. Please provide it in the function options or set 'HEAVSTAL_API_KEY' in your environment variables. Get your key at: https://heavstal.com.ng/credentials");
    }

    if (!apiKey.startsWith('ht_live_') || (apiKey.length !== 40 && apiKey.length !== 56)) {
        throw new Error("Invalid API Key format. Please go to https://heavstal.com.ng/credentials to generate or rotate your key. More info: https://docs.heavstal.com.ng")
    }

    try {
        await fetch("https://heavstal.com.ng/api/v1/verify-key", {
            headers: { 'x-api-key': apiKey },
            timeout: 10000
        })
      
        return;

    } catch (error: any) {
        if (error.response) {
            const status = error.response.status;
            const errData = error.response.data;
            const serverMsg = errData?.error || "Unknown Error";

            if (status === 429) {
                throw new Error(`Rate Limit Exceeded (${serverMsg}). Please upgrade your plan at: https://heavstal.com.ng/pricing`)
            }
            if (status === 401 || status === 403) {
                throw new Error(`Auth Failed (${serverMsg}). Go to https://heavstal.com.ng/credentials to generate or rotate your key.`)
            }
            throw new Error(`Heavstal API Error: ${serverMsg}`);
        }
        
        throw new Error(`Network Error: Could not reach Heavstal servers to verify API key.`)
    }
              }
