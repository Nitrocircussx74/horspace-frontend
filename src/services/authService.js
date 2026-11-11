import api from '@/utils/api';
import axios from 'axios';

const BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000').replace(/\/+$/, '');

export const authService = {
  /**
   * เข้าสู่ระบบด้วย Email (Admin / CMS)
   * @param {Object} credentials - { email: string, password?: string }
   */
  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    return response.data; // { success: true, accessToken, user }
  },

  /**
   * เข้าสู่ระบบด้วย LINE SSO ID Token (LIFF / ลูกบ้าน)
   * @param {string} idToken
   */
  async loginLine(idToken) {
    const response = await api.post('/api/auth/login/line', { idToken });
    return response.data; // { success: true, accessToken, user, tenant }
  },

  /**
   * เข้าสู่ระบบด้วยเบอร์โทรศัพท์และรหัสผ่าน (Local Password)
   * @param {Object} credentials - { phoneNumber: string, password: string }
   */
  async loginLocal(credentials) {
    const response = await api.post('/api/auth/login/local', credentials);
    return response.data; // { success: true, accessToken, user, tenant }
  },

  /**
   * ตรวจสอบสถานะการผูกบัญชีและการตั้งค่า PIN ของลูกบ้าน
   * @param {string} lineIdToken
   */
  async checkLiffStatus(lineIdToken) {
    const response = await api.post('/api/liff/auth/check-status', { lineIdToken });
    return response.data; // { success: true, isLinked: boolean, hasPin: boolean, data }
  },

  /**
   * เข้าสู่ระบบด้วย LINE PIN 6 หลัก (LIFF Seamless PIN Auto-Login)
   * @param {string} lineIdToken
   * @param {string} pin
   */
  async loginPin(lineIdToken, pin) {
    const response = await api.post('/api/liff/auth/pin-login', { lineIdToken, pin });
    return response.data; // { success: true, accessToken, user, tenant }
  },

  /**
   * ตั้งค่ารหัส PIN 6 หลักครั้งแรก
   * @param {Object} payload - { pin: string, newPin?: string, lineIdToken?: string, phone?: string }
   */
  async setupPin(payload) {
    const response = await api.post('/api/liff/auth/setup-pin', payload);
    return response.data; // { success: true, message, accessToken, user }
  },

  /**
   * รีเซ็ตรหัส PIN 6 หลัก (Forgot PIN / Reset PIN)
   * @param {Object} payload - { newPin: string, phone?: string, lineIdToken?: string }
   */
  async resetPin(payload) {
    const response = await api.post('/api/liff/auth/reset-pin', payload);
    return response.data; // { success: true, message, accessToken, user }
  },

  /**
   * ตรวจสอบสถานะเบอร์โทรศัพท์ (มีในระบบ Horspace แล้วหรือไม่สำหรับ Centralized Identity)
   * @param {string|Object} payload - { phone: string } or phone string
   */
  async verifyPhoneStatus(payload) {
    const data = typeof payload === 'string' ? { phone: payload } : payload;
    const response = await api.post('/api/liff/auth/verify-phone-status', data);
    return response.data; // { success: true, isExistingUser: boolean, hasPin: boolean, tenantName?: string }
  },

  /**
   * ผูก LINE OA ของตึกใหม่เข้ากับบัญชีเดิมด้วย PIN 6 หลัก และเข้าสู่ระบบทันที
   * หากบัญชีนี้ยังไม่เคยตั้ง PIN มาก่อน ระบบจะบันทึก pin ที่ส่งไปเป็นรหัส PIN ใหม่ให้ทันที
   * @param {Object} payload - { phone, pin, buildingId, lineIdToken, lineUserId, lineDisplayName, linePictureUrl, lineStatusMessage }
   */
  async linkAndLogin(payload) {
    const response = await api.post('/api/liff/auth/link-and-login', payload);
    return response.data; // { success: true, accessToken, user, tenant, pinCreated }
  },

  /**
   * เปลี่ยนรหัส PIN ของลูกบ้าน (ต้องแนบ Bearer Token)
   * @param {Object} payload - { oldPin: string, newPin: string }
   */
  async changePin(payload) {
    const response = await api.post('/api/liff/profile/change-pin', payload);
    return response.data; // { success: true, message }
  },

  /**
   * ต่ออายุ Session ของลูกบ้าน LIFF แบบเงียบ (Silent Re-Authentication)
   * ใช้ LINE ID Token สดจาก LIFF SDK แลก Access Token ใหม่ทุกครั้ง
   * แทนการเก็บ Access Token ไว้ใน LocalStorage เพื่อลดความเสี่ยงจาก XSS
   * หมายเหตุ: ใช้ axios ตรงๆ (ไม่ผ่าน instance `api`) เพื่อไม่ให้ชนกับ interceptor ต่ออายุ session
   * @param {string} lineIdToken
   */
  async silentLoginLiff(lineIdToken) {
    // แนบ buildingId ของตึกที่กำลังใช้งานอยู่ (จำไว้ใน localStorage ตอนเข้า LIFF ครั้งแรกผ่าน Query/Deep Link
    // เดียวกับที่ LiffEntryView/LiffOnboardingView ใช้) กัน Silent Re-Auth หลัง Token หมดอายุคืนข้อมูล
    // ผู้เช่าจากตึกอื่นของ LINE Account เดียวกัน (Multi-Building Centralized Identity)
    const buildingId = typeof window !== 'undefined' ? localStorage.getItem('liff_target_building') : null;
    const response = await axios.post(
      `${BASE_URL}/api/v1/liff/auth/silent-login`,
      { lineIdToken, ...(buildingId && { buildingId }) },
      {
        headers: { 'X-Line-Id-Token': lineIdToken },
        withCredentials: true
      }
    );
    return response.data; // { success: true, accessToken, data: { tenant } }
  },

  /**
   * ขอ Access Token ใหม่ด้วย HTTP-Only Refresh Token Cookie (Silent Refresh)
   */
  async refreshToken() {
    const response = await axios.post(
      `${BASE_URL}/auth/refresh`,
      {},
      { withCredentials: true }
    );
    return response.data; // { success: true, accessToken }
  },

  /**
   * ดึงข้อมูลโปรไฟล์ผู้ใช้ปัจจุบัน
   */
  async getProfile() {
    const response = await api.get('/auth/me');
    return response.data; // { success: true, user }
  },

  /**
   * ออกจากระบบ (ลบ Refresh Token ใน Server & ลบ Cookie)
   */
  async logout() {
    const response = await api.post('/auth/logout');
    return response.data; // { success: true, message }
  }
};

export default authService;
