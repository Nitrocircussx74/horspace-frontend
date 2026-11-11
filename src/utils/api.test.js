import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';

const { push, setLiffAuth, clearAuth, getLiffIdToken, logoutLiff } = vi.hoisted(() => ({
  push: vi.fn(),
  setLiffAuth: vi.fn(),
  clearAuth: vi.fn(),
  getLiffIdToken: vi.fn(),
  logoutLiff: vi.fn()
}));

vi.mock('@/router', () => ({ default: { push } }));
vi.mock('@/stores/auth', () => ({
  useAuthStore: () => ({ setLiffAuth, clearAuth, clearLiffAuth: vi.fn(), accessToken: null, liffToken: 'liff-jwt' })
}));
vi.mock('./liff', () => ({
  getLiffIdToken,
  logoutLiff,
  initLiff: vi.fn(),
  isLiffLoggedIn: () => true,
  loginLiff: vi.fn()
}));

import api from './api';

const FLAG = 'liff_auto_login_attempted';
const COOLDOWN_KEY = 'liff_token_recovered_at';

// adapter ปลอม: ครั้งแรกตอบ 401 (พร้อม data) ครั้งต่อไปตอบ 200
const stubAdapter = (firstData = {}) => {
  let calls = 0;
  api.defaults.adapter = async (config) => {
    calls += 1;
    const response = { data: calls === 1 ? firstData : { ok: true }, status: calls === 1 ? 401 : 200, config, headers: {} };
    if (calls === 1) throw Object.assign(new Error('401'), { config, response, isAxiosError: true });
    return response;
  };
};

// adapter ที่ตอบ 401 พร้อม code ทุกครั้ง
const alwaysReject = (code) => {
  api.defaults.adapter = async (config) => {
    const response = { data: { code }, status: 401, config, headers: {} };
    throw Object.assign(new Error('401'), { config, response, isAxiosError: true });
  };
};

describe('api response interceptor: 401 ในหน้า LIFF', () => {
  let reloadSpy;

  beforeEach(() => {
    vi.clearAllMocks();
    getLiffIdToken.mockReturnValue('line-id-token');
    vi.stubGlobal('localStorage', { removeItem: vi.fn(), getItem: vi.fn(() => null), setItem: vi.fn() });
    sessionStorage.clear();
    sessionStorage.setItem(FLAG, 'true');
    stubAdapter();
    vi.spyOn(axios, 'post').mockResolvedValue({ data: { accessToken: 'new-jwt', data: { tenant: {} } } });
    reloadSpy = vi.spyOn(window.location, 'reload').mockImplementation(() => {});
  });

  it('endpoint ที่ไม่มี /liff ใน path ต้อง silent-login แล้ว retry ไม่ใช่เด้งไป /login', async () => {
    window.history.pushState({}, '', '/liff/owner-dashboard');

    const res = await api.get('/api/v1/invoices');

    expect(res.data.ok).toBe(true);
    expect(axios.post).toHaveBeenCalledWith(expect.stringContaining('/api/v1/liff/auth/silent-login'), expect.anything(), expect.anything());
    expect(push).not.toHaveBeenCalledWith('/login');
  });

  it.each(['LINE_TOKEN_INVALID', 'TOKEN_INVALID'])('%s ต้องกู้คืน: ล้าง flag, logout token ใน SDK, โหลดหน้าใหม่ และบอก view ว่ากำลังกู้คืน', async (code) => {
    window.history.pushState({}, '', '/liff');
    alwaysReject(code);

    const err = await api.post('/api/v1/liff/register/invite', {}).catch((e) => e);

    expect(sessionStorage.getItem(FLAG)).toBeNull();
    expect(logoutLiff).toHaveBeenCalled();
    expect(reloadSpy).toHaveBeenCalledTimes(1);
    expect(err.liffRecovering).toBe(true);
  });

  it('กู้คืนซ้ำภายใน 1 นาทีต้องไม่โหลดซ้ำ (กัน Loop เมื่อ login ใหม่แล้วก็ยังเสีย)', async () => {
    window.history.pushState({}, '', '/liff');
    alwaysReject('LINE_TOKEN_INVALID');

    await api.get('/api/v1/liff/me').catch(() => {});
    const second = await api.get('/api/v1/liff/me').catch((e) => e);

    expect(reloadSpy).toHaveBeenCalledTimes(1);
    expect(second.liffRecovering).toBe(false);
  });

  it('silent-login ล้มเหลวด้วย LINE_TOKEN_INVALID ต้องกู้คืน (ไม่ผ่าน interceptor จึงต้องเช็คใน catch)', async () => {
    window.history.pushState({}, '', '/liff');
    stubAdapter({ code: 'TOKEN_EXPIRED' });
    axios.post.mockRejectedValue(Object.assign(new Error('401'), { response: { status: 401, data: { code: 'LINE_TOKEN_INVALID' } } }));

    await api.get('/api/v1/invoices').catch(() => {});

    expect(sessionStorage.getItem(FLAG)).toBeNull();
    expect(reloadSpy).toHaveBeenCalledTimes(1);
  });

  it('silent-login หา LINE ID Token ไม่เจอเลย ต้องกู้คืนเหมือนกัน', async () => {
    window.history.pushState({}, '', '/liff');
    stubAdapter({ code: 'TOKEN_EXPIRED' });
    getLiffIdToken.mockReturnValue(null);

    await api.get('/api/v1/invoices').catch(() => {});

    expect(axios.post).not.toHaveBeenCalled();
    expect(sessionStorage.getItem(FLAG)).toBeNull();
    expect(reloadSpy).toHaveBeenCalledTimes(1);
  });

  it('UNAUTHORIZED (ไม่ได้ส่ง token — เช่น ยิงก่อน LIFF init เสร็จ) ต้องไปทาง silent re-auth ไม่ใช่กู้คืนด้วยการโหลดหน้าใหม่', async () => {
    window.history.pushState({}, '', '/liff');
    stubAdapter({ code: 'UNAUTHORIZED' });

    const res = await api.get('/api/v1/liff/me');

    expect(res.data.ok).toBe(true);
    expect(axios.post).toHaveBeenCalled();
    expect(reloadSpy).not.toHaveBeenCalled();
  });

  it('นอกหน้า LIFF ยังใช้ CMS refresh และเด้งไป /login เมื่อ refresh ล้มเหลว', async () => {
    window.history.pushState({}, '', '/rooms');
    axios.post.mockRejectedValue(new Error('no cookie'));

    await expect(api.get('/api/v1/invoices')).rejects.toThrow();

    expect(push).toHaveBeenCalledWith('/login');
  });
});
