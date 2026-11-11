import axios from 'axios';
import { getLiffIdToken, initLiff, isLiffLoggedIn, loginLiff } from './liff';
import { useAuthStore } from '@/stores/auth';
import router from '@/router';

// 1. สร้าง Axios Instance พร้อมกำหนด withCredentials: true เสมอ
// เพื่อให้เบราว์เซอร์ส่งและรับ HTTP-Only Cookies (Refresh Token) อัตโนมัติ
const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
const cleanBaseUrl = rawBaseUrl.replace(/\/+$/, '');

const api = axios.create({
  baseURL: cleanBaseUrl,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// ==========================================
// 1. CMS Admin Token Refresh Queue & Lock
// ==========================================
let isCmsRefreshing = false;
let cmsFailedQueue = [];

const processCmsQueue = (error, token = null) => {
  cmsFailedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  cmsFailedQueue = [];
};

// ==========================================
// 2. LIFF Silent Re-Authentication Queue & Lock
// ==========================================
let isLiffRefreshing = false;
let liffFailedQueue = [];

const processLiffQueue = (error, token = null) => {
  liffFailedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  liffFailedQueue = [];
};

// ==========================================
// 3. Request Interceptors
// ==========================================

// 3.1 Attach JWT Access Token (Authorization: Bearer)
api.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore();
    const url = config.url || '';
    const isLiff = url.includes('/api/v1/liff') || url.includes('/api/liff') || url.includes('/liff');

    if (isLiff) {
      // 1. LIFF Tenant Token (Isolated from CMS Admin, Memory-only ผ่าน Pinia)
      const liffToken = authStore.liffToken;
      if (liffToken) {
        config.headers.Authorization = `Bearer ${liffToken}`;
      }
    } else {
      // 2. CMS Admin Token (Memory-only from Pinia), หรือ Fallback เป็น LIFF Token ถ้าเรียกจากฝั่ง Owner Mobile
      const token = authStore.accessToken || authStore.liffToken;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 3.2 Attach LINE ID Token for LIFF Endpoints
api.interceptors.request.use(
  async (config) => {
    const isLiff = config.url && (config.url.includes('/api/v1/liff') || config.url.includes('/api/liff') || config.url.includes('/features'));
    if (isLiff) {
      try {
        const idToken = getLiffIdToken();
        if (idToken) {
          config.headers['X-Line-Id-Token'] = idToken;
        }

        // แนบ buildingId และ roomId ที่ผู้เช่ากำลังเลือกอยู่ เพื่อให้ Endpoint ฝั่ง LIFF ดึงข้อมูลเฉพาะตึก/ห้องนั้น
        if (typeof window !== 'undefined') {
          const activeBuildingId = localStorage.getItem('active_tenant_building_id') || localStorage.getItem('liff_target_building');
          if (activeBuildingId && !config.headers['X-Building-Id']) {
            config.headers['X-Building-Id'] = activeBuildingId;
          }
          const activeRoomId = localStorage.getItem('active_tenant_room_id');
          if (activeRoomId && !config.headers['X-Room-Id']) {
            config.headers['X-Room-Id'] = activeRoomId;
          }
        }

        // Attach lineUserId fallback สำหรับ Standalone Dev Mode เท่านั้น
        // ห้ามทำงานใน Production เด็ดขาด ป้องกันการปลอม X-Line-User-Id เพื่อสวมรอยผู้ใช้อื่น
        if (import.meta.env.DEV) {
          const devLineUserId = localStorage.getItem('dev_line_user_id');
          if (devLineUserId && !config.headers['X-Line-User-Id']) {
            config.headers['X-Line-User-Id'] = devLineUserId;
          }
        }
      } catch {
        // Continue request even if token extraction fails
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ==========================================
// 4. Response Interceptor (Dual Silent Refresh)
// ==========================================
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // หากไม่มี response หรือ error ไม่ใช่ status 401 ให้ reject ต่อทันที
    if (!error.response || error.response.status !== 401 || !originalRequest) {
      return Promise.reject(error);
    }

    const url = originalRequest.url || '';
    const isLiffRoute = url.includes('/api/v1/liff') || url.includes('/api/liff');
    const isAuthEndpoint = url.includes('/auth/') || url.includes('/invites/verify') || url.includes('/silent-login');
    const isCmsAuthRoute = url.includes('/auth/login') || url.includes('/auth/refresh');

    // ------------------------------------------------------------------------
    // CASE 0: LINE ID Token เสียจริง (หมดอายุ/ไม่ถูกต้อง) — Silent Retry ช่วยไม่ได้ เพราะ Token เดิม
    // ที่ค้างอยู่ใน LIFF SDK ก็ยังเสียเหมือนเดิม ต้อง Hard Redirect กลับไปหน้า Login (/liff) เท่านั้น
    // เพื่อบังคับให้ liff.init() รันใหม่ทั้งหมด (Route Change ธรรมดาผ่าน router.push ไม่ช่วย เพราะ
    // Singleton ใน liff.js จะไม่ re-init ให้) เช็คก่อน isAuthEndpoint เพราะ Endpoint ที่คืน Code นี้
    // (pin-login, link-and-login, check-status, silent-login) ล้วนมี /auth/ อยู่ในพาธที่จะโดน Skip ไป
    if (isLiffRoute && error.response?.data?.code === 'LINE_TOKEN_INVALID') {
      const authStore = useAuthStore();
      authStore.clearLiffAuth();
      localStorage.removeItem('dev_line_user_id');
      if (typeof window !== 'undefined' && window.location.pathname !== '/liff') {
        window.location.href = `/liff?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`;
      }
      return Promise.reject(error);
    }

    // ------------------------------------------------------------------------
    // CASE A: LIFF Silent Re-Authentication (สำหรับลูกบ้านใน LINE LIFF)
    // ------------------------------------------------------------------------
    if (isLiffRoute) {
      // หากเป็น Endpoint เกี่ยวกับ Auth หรือ Verification ให้ Reject ทันที ป้องกัน Infinite Loop
      if (isAuthEndpoint) {
        return Promise.reject(error);
      }

      // หาก Request นี้เคย Retry แล้วแต่ยังคงได้ 401 ให้ Fallback
      if (originalRequest._retry) {
        return Promise.reject(error);
      }

      // [QUEUEING SYSTEM]: หากกำลังทำการ Silent Re-Auth อยู่ ให้ Request อื่นเข้าคิวรอ Promise
      if (isLiffRefreshing) {
        return new Promise((resolve, reject) => {
          liffFailedQueue.push({ resolve, reject });
        })
          .then((newToken) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            const idToken = getLiffIdToken();
            if (idToken) originalRequest.headers['X-Line-Id-Token'] = idToken;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      // [LOCKING]: ล็อกไม่ให้ยิงขอ Silent Login ซ้ำซ้อน
      originalRequest._retry = true;
      isLiffRefreshing = true;

      try {
        await initLiff();
        const idToken = getLiffIdToken();

        if (!idToken) {
          throw new Error('ไม่พบ LINE ID Token สำหรับต่ออายุเซสชัน');
        }

        // ยิง Silent Re-Auth API ขอ JWT ตัวใหม่จาก LINE ID Token
        const silentRes = await axios.post(
          `${cleanBaseUrl}/api/v1/liff/auth/silent-login`,
          { lineIdToken: idToken },
          {
            headers: {
              'Content-Type': 'application/json',
              'X-Line-Id-Token': idToken
            },
            withCredentials: true
          }
        );

        const newAccessToken = silentRes.data?.accessToken || silentRes.data?.token || silentRes.data?.data?.accessToken;
        if (!newAccessToken) {
          throw new Error('ไม่ได้รับ JWT Token ใหม่จากการต่ออายุเซสชัน LIFF');
        }

        // บันทึก Token ใหม่ลง Pinia Store และ LocalStorage
        const authStore = useAuthStore();
        const tenantData = silentRes.data?.data?.tenant || silentRes.data?.tenant;
        authStore.setLiffAuth(newAccessToken, tenantData);

        // อัปเดต Authorization Header ให้ Request เดิม
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        originalRequest.headers['X-Line-Id-Token'] = idToken;

        // ปล่อย Request ทุกตัวที่รออยู่ใน Queue ให้ทำงานต่อด้วย Token ใหม่
        processLiffQueue(null, newAccessToken);

        // ยิง Request เดิมซ้ำ (Retry)
        return api(originalRequest);
      } catch (refreshError) {
        // [FALLBACK / EDGE CASE]: ต่ออายุไม่สำเร็จ (เช่น เปลี่ยน LINE Account หรือสิทธิ์หลุด)
        processLiffQueue(refreshError, null);

        const authStore = useAuthStore();
        authStore.clearLiffAuth();
        localStorage.removeItem('dev_line_user_id');

        return Promise.reject(refreshError);
      } finally {
        isLiffRefreshing = false;
      }
    }

    // ------------------------------------------------------------------------
    // CASE B: CMS Admin Silent Refresh (สำหรับผู้ดูแลระบบผ่าน Cookies)
    // ------------------------------------------------------------------------
    if (isCmsAuthRoute) {
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    // [QUEUEING SYSTEM]: สำหรับ CMS Admin Request
    if (isCmsRefreshing) {
      return new Promise((resolve, reject) => {
        cmsFailedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isCmsRefreshing = true;

    const authStore = useAuthStore();

    try {
      // ขอ Access Token ใหม่ผ่าน HTTP-Only Cookie
      const response = await axios.post(
        `${cleanBaseUrl}/auth/refresh`,
        {},
        { withCredentials: true }
      );

      const newAccessToken = response.data?.accessToken;
      if (!newAccessToken) {
        throw new Error('No access token returned from CMS refresh');
      }

      authStore.setAccessToken(newAccessToken);
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      processCmsQueue(null, newAccessToken);

      return api(originalRequest);
    } catch (refreshError) {
      processCmsQueue(refreshError, null);
      authStore.clearAuth();
      router.push('/login');
      return Promise.reject(refreshError);
    } finally {
      isCmsRefreshing = false;
    }
  }
);

export default api;
