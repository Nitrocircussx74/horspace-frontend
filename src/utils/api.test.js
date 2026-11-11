import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';

const { push, setLiffAuth, clearAuth } = vi.hoisted(() => ({
  push: vi.fn(),
  setLiffAuth: vi.fn(),
  clearAuth: vi.fn()
}));

vi.mock('@/router', () => ({ default: { push } }));
vi.mock('@/stores/auth', () => ({
  useAuthStore: () => ({ setLiffAuth, clearAuth, clearLiffAuth: vi.fn(), accessToken: null, liffToken: 'liff-jwt' })
}));
vi.mock('./liff', () => ({
  getLiffIdToken: () => 'line-id-token',
  initLiff: vi.fn(),
  isLiffLoggedIn: () => true,
  loginLiff: vi.fn()
}));

import api from './api';

// adapter ปลอม: ครั้งแรกตอบ 401 ครั้งต่อไปตอบ 200
const stubAdapter = () => {
  let calls = 0;
  api.defaults.adapter = async (config) => {
    calls += 1;
    const response = { data: { ok: true }, status: calls === 1 ? 401 : 200, config, headers: {} };
    if (calls === 1) throw Object.assign(new Error('401'), { config, response, isAxiosError: true });
    return response;
  };
};

describe('api response interceptor: 401 ในหน้า LIFF', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    stubAdapter();
    vi.spyOn(axios, 'post').mockResolvedValue({ data: { accessToken: 'new-jwt', data: { tenant: {} } } });
  });

  it('endpoint ที่ไม่มี /liff ใน path ต้อง silent-login แล้ว retry ไม่ใช่เด้งไป /login', async () => {
    window.history.pushState({}, '', '/liff/owner-dashboard');

    const res = await api.get('/api/v1/invoices');

    expect(res.data.ok).toBe(true);
    expect(axios.post).toHaveBeenCalledWith(expect.stringContaining('/api/v1/liff/auth/silent-login'), expect.anything(), expect.anything());
    expect(push).not.toHaveBeenCalledWith('/login');
  });

  it('นอกหน้า LIFF ยังใช้ CMS refresh และเด้งไป /login เมื่อ refresh ล้มเหลว', async () => {
    window.history.pushState({}, '', '/rooms');
    axios.post.mockRejectedValue(new Error('no cookie'));

    await expect(api.get('/api/v1/invoices')).rejects.toThrow();

    expect(push).toHaveBeenCalledWith('/login');
  });
});
