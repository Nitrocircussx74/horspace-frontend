import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';

const { silentLoginLiff, recoverFromInvalidLineToken } = vi.hoisted(() => ({
  silentLoginLiff: vi.fn(),
  recoverFromInvalidLineToken: vi.fn()
}));

vi.mock('@/services/authService', () => ({ default: { silentLoginLiff } }));
vi.mock('@/utils/liff', () => ({
  initLiff: vi.fn(),
  isLiffLoggedIn: () => true,
  getLiffIdToken: () => 'line-id-token'
}));
vi.mock('@/utils/api', () => ({
  isLineTokenInvalid: (e) => ['LINE_TOKEN_INVALID', 'TOKEN_INVALID'].includes(e?.response?.data?.code),
  recoverFromInvalidLineToken
}));

import { useAuthStore } from './auth';

describe('useAuthStore.restoreLiffSession', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('localStorage', { getItem: vi.fn(() => null), setItem: vi.fn(), removeItem: vi.fn() });
    setActivePinia(createPinia());
  });

  it('silent-login ล้มเหลวเพราะ LINE ID Token เสีย ต้องกู้คืนและคืน false', async () => {
    silentLoginLiff.mockRejectedValue(Object.assign(new Error('401'), { response: { data: { code: 'LINE_TOKEN_INVALID' } } }));

    const ok = await useAuthStore().restoreLiffSession();

    expect(ok).toBe(false);
    expect(recoverFromInvalidLineToken).toHaveBeenCalledTimes(1);
  });

  it('ล้มเหลวด้วยสาเหตุอื่น (เช่น network) ไม่กู้คืน', async () => {
    silentLoginLiff.mockRejectedValue(new Error('Network Error'));

    const ok = await useAuthStore().restoreLiffSession();

    expect(ok).toBe(false);
    expect(recoverFromInvalidLineToken).not.toHaveBeenCalled();
  });
});
