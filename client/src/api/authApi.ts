/**
 * Care Orbit - Auth Demo API
 * Owner: Person B
 */

import { apiClient } from './client';
import type { DemoAuthResponse } from '@sthreecare/shared';

export async function requestDemoOtp(phone: string): Promise<{ success: boolean; message: string }> {
  const res = await apiClient<{ success: boolean; message: string }>('/auth/demo/otp', {
    method: 'POST',
    body: JSON.stringify({ phone }),
  });

  if (res.data) return res.data;
  // Offline / Demo fallback
  return {
    success: true,
    message: 'Simulated OTP 123456 generated for testing.',
  };
}

export async function verifyDemoOtp(phone: string, otp: string): Promise<DemoAuthResponse> {
  const res = await apiClient<DemoAuthResponse>('/auth/demo/verify', {
    method: 'POST',
    body: JSON.stringify({ phone, otp }),
  });

  if (res.data) return res.data;

  // Offline / Demo fallback
  if (otp === '123456') {
    return {
      success: true,
      message: 'Demo verification successful',
      token: 'demo-token-' + Date.now(),
      anonymousRef: 'anon_demo_' + phone.slice(-4),
      phoneNumber: phone,
    };
  }

  throw new Error('Invalid test OTP. Use 123456.');
}
