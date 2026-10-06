import { AdviserError, type ModelCaller, type ModelResponse } from './adviser';

/** This module is imported only by server routes; never return the credential or provider error body. */
export function openAIAdviser(apiKey: string, fetcher: typeof fetch = fetch): ModelCaller {
  return async (body, signal): Promise<ModelResponse> => {
    let response: Response;
    try {
      response = await fetcher('https://api.openai.com/v1/responses', {
        method: 'POST', headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(body), signal,
      });
    } catch {
      throw new AdviserError('The model service could not be reached. Your design and evidence are unchanged.', 503, 'provider_unavailable');
    }
    if (!response.ok) throw new AdviserError(response.status === 429 ? 'The model service is busy. Please try again shortly.' : 'The model service is not available with the current server configuration.', 503, 'provider_unavailable');
    const raw = await response.text();
    if (raw.length > 128_000) throw new AdviserError('The model response exceeded the supported size.', 502, 'invalid_model_response');
    try { return JSON.parse(raw) as ModelResponse; } catch { throw new AdviserError('The model service returned an invalid response.', 502, 'invalid_model_response'); }
  };
}
