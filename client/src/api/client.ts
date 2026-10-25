/**
 * Care Orbit - Zero-Health API Client
 * Owner: Person B
 * 
 * STRICT PRIVACY CONTRACT:
 * 1. This client communicates with the server for non-medical services only:
 *    facilities lookup, support request dispatch, and Time Bank credits.
 * 2. It NEVER includes health, bleeding, symptom, or diagnostic data in payloads.
 */

const BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8000';

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ data: T | null; error: string | null }> {
  try {
    const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(options.headers || {}),
    };

    // Client-side privacy guard: check payload does not contain health fields
    if (options.body && typeof options.body === 'string') {
      const lower = options.body.toLowerCase();
      const forbidden = ['pbac', 'epds', 'haemoglobin', 'symptoms', 'diagnosis', 'blood', 'menstrual'];
      for (const f of forbidden) {
        if (lower.includes(`"${f}"`)) {
          throw new Error(`Privacy Violation: Forbidden health field "${f}" detected in outgoing request payload!`);
        }
      }
    }

    const res = await fetch(url, {
      ...options,
      headers,
    });

    if (!res.ok) {
      const errText = await res.text();
      return { data: null, error: `HTTP ${res.status}: ${errText}` };
    }

    const data = await res.json();
    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: err.message || 'Network request failed' };
  }
}
