import { defineStore } from 'pinia';
import authService from '@/services/authService';
import { initLiff, isLiffLoggedIn, getLiffIdToken } from '@/utils/liff';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    // CMS Admin Authentication State (Memory-only)
    user: null,
    accessToken: null,
    isInitialized: false,

    // LIFF & Web Portal Tenant Authentication State (แยกอิสระจาก CMS Admin)
    tenant: null,
    liffToken: null,
    isLiffReady: false,
    liffProfile: null,
    loading: false,

    // ห้อง/ตึกที่ลูกบ้านเลือกอยู่ใน LIFF (Mirror ลง localStorage ให้ api.js แนบเป็น X-Room-Id / X-Building-Id)
    // Backend ตรวจสิทธิ์ซ้ำเสมอ (scopeTenantRooms) ค่านี้เป็นแค่ "ห้องที่อยากดู" ไม่ใช่สิทธิ์
    activeRoomId: null,
    activeBuildingId: null,

    // Role Management for Dual-Role / Owner Support
    activeRole: null, // 'owner' | 'tenant'
    availableRoles: [] // Array of available roles e.g. ['owner', 'tenant']
  }),

  getters: {
    isAuthenticated: (state) => !!state.accessToken,
    currentUser: (state) => state.user,
    currentTenant: (state) => state.tenant,
    isTenantAuthenticated: (state) => !!state.liffToken,
    ready: (state) => state.isLiffReady,
    isOwner: (state) => {
      const userRole = (state.user?.role || state.tenant?.role || '').toLowerCase();
      const hasOwnerRole = ['owner', 'admin', 'super_admin', 'superadmin', 'manager'].includes(userRole);
      return (
        hasOwnerRole ||
        state.availableRoles.includes('owner') ||
        state.availableRoles.includes('admin') ||
        Boolean(state.tenant?.isOwner)
      );
    },
    isDualRole: (state) => {
      return state.availableRoles.length > 1;
    },
    currentRole: (state) => {
      if (state.activeRole) return state.activeRole;
      const userRole = (state.user?.role || state.tenant?.role || '').toLowerCase();
      if (['owner', 'admin', 'super_admin', 'superadmin', 'manager'].includes(userRole)) {
        return 'owner';
      }
      return 'tenant';
    }
  },

  actions: {
    // Role Switching
    setActiveRole(role) {
      this.activeRole = role;
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.setItem('horspace_active_role', role);
      }
    },

    switchRole(role) {
      this.setActiveRole(role);
    },

    setAvailableRoles(roles) {
      this.availableRoles = Array.isArray(roles) ? roles : [];
    },

    // 🏢 CMS Admin Actions
    setAccessToken(token) {
      this.accessToken = token;
    },

    setUser(userData) {
      this.user = userData;
    },

    clearAuth() {
      this.user = null;
      this.accessToken = null;
    },

    // 👤 LIFF & Web Tenant Actions (Isolated from CMS Admin)
    setLiffAuth(token, tenantData = null) {
      this.liffToken = token;
      if (tenantData) {
        this.tenant = tenantData;
        if (tenantData.availableRoles) {
          this.setAvailableRoles(tenantData.availableRoles);
        } else if (tenantData.role === 'owner' || tenantData.isOwner) {
          this.setAvailableRoles(['tenant', 'owner']);
        }
        if (this.isOwner && !this.activeRole) {
          this.activeRole = 'owner';
        }
      }
    },

    setTenant(tenantData) {
      this.tenant = tenantData;
    },

    clearLiffAuth() {
      this.tenant = null;
      this.liffToken = null;
      this.setActiveRoom(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('liff_token');
      }
    },

    /**
     * ตั้งห้องที่กำลังดูอยู่ (จุดเดียวที่เขียน active_tenant_room_id / active_tenant_building_id)
     * @param {{ id?: string, buildingId?: string } | null} room ห้องจาก /liff/profile, null = ล้าง (Logout)
     */
    setActiveRoom(room) {
      const buildingId = room?.buildingId || room?.building_id || room?.building?.id || null;
      this.activeRoomId = room?.id || null;
      this.activeBuildingId = buildingId;
      if (typeof window === 'undefined') return;
      const write = (key, value) => (value ? localStorage.setItem(key, value) : localStorage.removeItem(key));
      write('active_tenant_room_id', this.activeRoomId);
      write('active_tenant_building_id', buildingId);
      // liff_target_building ใช้ตอน Onboarding ด้วย (ลิงก์ ?building=) จึงเขียนทับเฉพาะตอนมีตึกจริง ไม่ลบทิ้ง
      if (buildingId) localStorage.setItem('liff_target_building', buildingId);
    },

    /**
     * กู้คืน Session ของลูกบ้าน (รองรับทั้ง LINE LIFF และ Web Portal)
     * @returns {Promise<boolean>} true หากกู้คืน Session สำเร็จ
     */
    async restoreLiffSession() {
      if (this.liffToken) return true;

      // กู้คืนผ่าน LINE LIFF Silent Login
      try {
        await initLiff();
        if (!isLiffLoggedIn()) return false;

        const idToken = getLiffIdToken();
        if (!idToken) return false;

        const data = await authService.silentLoginLiff(idToken);
        const token = data?.accessToken || data?.token || data?.data?.accessToken;
        const tenantData = data?.data?.tenant || data?.tenant;

        if (token) {
          this.setLiffAuth(token, tenantData);
          return true;
        }
        return false;
      } catch (err) {
        console.warn('restoreLiffSession failed:', err?.message || err);
        return false;
      }
    },

    setLiffReady(ready, profile = null) {
      this.isLiffReady = ready;
      if (profile) {
        this.liffProfile = profile;
      }
    },

    /**
     * Action เข้าสู่ระบบด้วย LINE Seamless PIN 6 หลัก
     */
    async loginPin(lineIdToken, pin) {
      this.loading = true;
      try {
        const data = await authService.loginPin(lineIdToken, pin);
        const token = data.accessToken || data.token || data.data?.accessToken;
        const tenantData = data.user || data.tenant || data.data?.tenant || data.data?.user;
        if (token) {
          this.setLiffAuth(token, tenantData);
        }
        return data;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Action ตั้งค่าหรือเปลี่ยนรหัส PIN 6 หลัก
     */
    async setupPin(pin, lineIdToken = '') {
      this.loading = true;
      try {
        const data = await authService.setupPin({ pin, lineIdToken });
        const token = data.accessToken || data.token || data.data?.accessToken;
        const tenantData = data.user || data.tenant || data.data?.tenant;
        if (token) {
          this.setLiffAuth(token, tenantData);
        }
        return data;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Action สำหรับเข้าสู่ระบบ
     */
    async login(email, password = 'password123') {
      this.loading = true;
      try {
        const data = await authService.login({ email, password });
        this.setAccessToken(data.accessToken);
        this.setUser(data.user);
        return data;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Action ทำ Silent Refresh เพื่อขอ Access Token ใหม่เมื่อโหลดหน้าเว็บใหม่
     */
    async silentRefresh() {
      try {
        const data = await authService.refreshToken();
        this.setAccessToken(data.accessToken);

        // ดึงข้อมูล User Profile เพิ่มเติมหากยังไม่มีใน State
        if (!this.user) {
          await this.fetchProfile();
        }
        return true;
      } catch (error) {
        this.clearAuth();
        return false;
      } finally {
        this.isInitialized = true;
      }
    },

    /**
     * Action ดึงข้อมูล Profile ผู้ใช้ปัจจุบัน
     */
    async fetchProfile() {
      try {
        const data = await authService.getProfile();
        this.setUser(data.user);
        return data.user;
      } catch (error) {
        throw error;
      }
    },

    /**
     * Action สำหรับเข้าสู่ระบบด้วย LINE SSO ID Token
     */
    async loginLine(idToken) {
      this.loading = true;
      try {
        const data = await authService.loginLine(idToken);
        const token = data.accessToken || data.token || data.data?.accessToken;
        const tenantData = data.user || data.tenant || data.data?.tenant || data.data?.user;
        if (token) {
          this.setLiffAuth(token, tenantData);
        }
        return data;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Action สำหรับเข้าสู่ระบบด้วยเบอร์โทรศัพท์และรหัสผ่าน (Local Password)
     */
    async loginLocal(phoneNumber, password) {
      this.loading = true;
      try {
        const data = await authService.loginLocal({ phoneNumber, password });
        const token = data.accessToken || data.token || data.data?.accessToken;
        const tenantData = data.user || data.tenant || data.data?.tenant || data.data?.user;
        if (token) {
          this.setLiffAuth(token, tenantData);
        }
        return data;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Action ออกจากระบบสำหรับลูกบ้าน (Tenant Logout ผ่าน LINE LIFF)
     * ปิดหน้าต่าง LINE App หรือ logout LINE session
     */
    async logoutTenant() {
      this.loading = true;
      try {
        this.clearLiffAuth();
        if (typeof window !== 'undefined') {
          localStorage.removeItem('dev_line_user_id');
        }

        try {
          const liff = (await import('@line/liff')).default;
          if (typeof liff.isInClient === 'function' && liff.isInClient()) {
            if (typeof liff.closeWindow === 'function') {
              liff.closeWindow();
            }
            return { channel: 'line_client', closed: true };
          } else if (typeof liff.isLoggedIn === 'function' && liff.isLoggedIn()) {
            if (typeof liff.logout === 'function') {
              liff.logout();
            }
            return { channel: 'line_external', redirect: '/liff' };
          }
        } catch (liffErr) {
          console.warn('LIFF logout warning:', liffErr);
        }
        return { channel: 'line', redirect: '/liff' };
      } finally {
        this.loading = false;
      }
    },

    /**
     * Action ออกจากระบบสำหรับ CMS Admin
     */
    async logout() {
      this.loading = true;
      try {
        await authService.logout();
      } catch (error) {
        console.warn('Logout server request failed:', error);
      } finally {
        this.clearAuth();
        this.loading = false;
      }
    }
  }
});
