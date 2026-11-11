import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { initLiff, isInLiffClient, isLiffLoggedIn, loginLiff } from '@/utils/liff';

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue'),
    meta: { isCms: true }
  },
  // หมายเหตุ: เดิมมี /pin-login, /setup-pin, /change-pin แบบ Top-level ซ้ำกับชุดใต้ /liff/*
  // แต่ใช้ Component เดียวกันทุกอย่างและไม่มีที่ไหนในแอปลิงก์มาเลย - ตัดออกเหลือชุดเดียวใต้ /liff/*
  // ที่มี LiffLayout ห่ออยู่ (ดูด้านล่างในหมวด LINE / LIFF Tenant Portal Routes)

  // 🏢 1. CMS Admin Backoffice Routes (ต้องการสิทธิ์ Admin JWT Authentication)
  {
    path: '/403',
    name: 'Forbidden',
    component: () => import('@/views/ForbiddenView.vue'),
    meta: { isCms: true, title: 'ไม่มีสิทธิ์เข้าถึง' }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/DashboardView.vue'),
    meta: { isCms: true, requiresAuth: true, roles: ['admin'], title: 'แดชบอร์ดภาพรวม' }
  },
  {
    path: '/rooms',
    name: 'Rooms',
    component: () => import('@/views/RoomsView.vue'),
    meta: { isCms: true, requiresAuth: true, roles: ['admin'], title: 'จัดการห้องพัก' }
  },
  {
    path: '/leases',
    name: 'Leases',
    component: () => import('@/views/LeasesView.vue'),
    meta: { isCms: true, requiresAuth: true, roles: ['admin'], title: 'สัญญาเช่า' }
  },
  {
    path: '/tenants',
    name: 'Tenants',
    component: () => import('@/views/TenantsView.vue'),
    meta: { isCms: true, requiresAuth: true, roles: ['admin'], title: 'ข้อมูลผู้เช่า' }
  },
  {
    path: '/tenants/:id',
    name: 'TenantDetail',
    component: () => import('@/views/TenantDetail.vue'),
    meta: { isCms: true, requiresAuth: true, roles: ['admin'], title: 'รายละเอียดผู้เช่า' }
  },
  {
    path: '/admin/tenants/:id',
    name: 'TenantDetailAdmin',
    component: () => import('@/views/TenantDetail.vue'),
    meta: { isCms: true, requiresAuth: true, roles: ['admin'], title: 'รายละเอียดผู้เช่า' }
  },
  {
    path: '/buildings',
    name: 'Buildings',
    component: () => import('@/views/BuildingManagementView.vue'),
    meta: { isCms: true, requiresAuth: true, roles: ['admin'], title: 'จัดการข้อมูลอาคาร' }
  },
  {
    path: '/building-settings',
    name: 'BuildingSettings',
    component: () => import('@/views/BuildingSettingsView.vue'),
    meta: { isCms: true, requiresAuth: true, roles: ['admin'], title: 'ตั้งค่าอาคาร' }
  },
  {
    path: '/meter-readings',
    name: 'MeterReadings',
    component: () => import('@/views/MeterReadingsView.vue'),
    meta: { isCms: true, requiresAuth: true, roles: ['admin'], title: 'จดบันทึกมิเตอร์' }
  },
  {
    path: '/invoices',
    name: 'Invoices',
    component: () => import('@/views/InvoicesView.vue'),
    meta: { isCms: true, requiresAuth: true, roles: ['admin'], title: 'จัดการบิลค่าเช่า' }
  },
  {
    path: '/maintenance',
    name: 'Maintenance',
    component: () => import('@/views/MaintenanceView.vue'),
    meta: { isCms: true, requiresAuth: true, roles: ['admin'], title: 'จัดการรายการแจ้งซ่อม' }
  },
  {
    path: '/announcements',
    name: 'Announcements',
    component: () => import('@/views/AnnouncementsView.vue'),
    meta: { isCms: true, requiresAuth: true, roles: ['admin'], title: 'ข่าวสารและประกาศ' }
  },
  {
    path: '/parcels',
    name: 'AdminParcels',
    component: () => import('@/views/AdminParcelView.vue'),
    meta: { isCms: true, requiresAuth: true, roles: ['admin'], title: 'จัดการพัสดุ' }
  },
  {
    path: '/admin/parcels',
    name: 'AdminParcelsDirect',
    component: () => import('@/views/AdminParcelView.vue'),
    meta: { isCms: true, requiresAuth: true, roles: ['admin'], title: 'จัดการพัสดุ' }
  },
  {
    path: '/facility-bookings',
    name: 'AdminFacilityBookings',
    component: () => import('@/views/AdminFacilityBookingView.vue'),
    meta: { isCms: true, requiresAuth: true, roles: ['admin'], title: 'จองพื้นที่ส่วนกลาง' }
  },
  {
    path: '/vehicles',
    name: 'AdminVehicles',
    component: () => import('@/views/AdminVehicleView.vue'),
    meta: { isCms: true, requiresAuth: true, roles: ['admin'], title: 'จัดการยานพาหนะ' }
  },
  {
    path: '/polls',
    name: 'AdminPolls',
    component: () => import('@/views/AdminPollView.vue'),
    meta: { isCms: true, requiresAuth: true, roles: ['admin'], title: 'แบบสำรวจและโหวต' }
  },
  {
    path: '/vendors',
    name: 'AdminVendors',
    component: () => import('@/views/AdminVendorView.vue'),
    meta: { isCms: true, requiresAuth: true, roles: ['admin'], title: 'รายชื่อช่างและผู้รับเหมา' }
  },
  {
    path: '/inspections',
    name: 'AdminInspections',
    component: () => import('@/views/AdminInspectionView.vue'),
    meta: { isCms: true, requiresAuth: true, roles: ['admin'], title: 'ตรวจสภาพห้องพัก' }
  },
  {
    path: '/features',
    name: 'FeatureSettings',
    component: () => import('@/views/FeatureSettingsView.vue'),
    meta: { isCms: true, requiresAuth: true, roles: ['admin'], title: 'ตั้งค่าฟีเจอร์' }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/ProfileView.vue'),
    meta: { isCms: true, requiresAuth: true, title: 'โปรไฟล์ผู้ดูแล' }
  },
  {
    path: '/admin/users',
    name: 'AdminUserManagement',
    component: () => import('@/views/AdminUserManagementView.vue'),
    meta: { isCms: true, requiresAuth: true, roles: ['owner', 'super_admin', 'superadmin'], title: 'จัดการผู้ใช้งาน' }
  },
  {
    path: '/admin/audit-logs',
    name: 'AuditLogViewer',
    component: () => import('@/views/AuditLogViewer.vue'),
    meta: { isCms: true, requiresAuth: true, roles: ['owner', 'super_admin', 'superadmin'], title: 'ประวัติการทำงานระบบ' }
  },
  {
    path: '/admin/feedback',
    name: 'AdminFeedback',
    component: () => import('@/views/AdminFeedbackView.vue'),
    meta: { isCms: true, requiresAuth: true, roles: ['owner', 'super_admin', 'superadmin', 'admin'], title: 'ข้อเสนอแนะ' }
  },


  // 📱 2. LINE / LIFF Tenant Portal Routes (แยก Guard ทำงานอิสระเฉพาะของฝั่ง LINE)
  {
    path: '/liff',
    component: () => import('@/layouts/LiffLayout.vue'),
    meta: { isLiff: true },
    children: [
      {
        path: '',
        name: 'LiffEntry',
        component: () => import('@/views/LiffEntryView.vue'),
        meta: { isLiff: true, title: 'Horspace (ฮอร์สเปซ)' }
      },
      {
        path: 'pin-login',
        name: 'LiffPinLogin',
        component: () => import('@/views/LiffPinLogin.vue'),
        meta: { isLiff: true, title: 'เข้าสู่ระบบด้วยรหัส PIN' }
      },
      {
        path: 'setup-pin',
        name: 'LiffSetupPin',
        component: () => import('@/views/LiffSetupPin.vue'),
        meta: { isLiff: true, title: 'ตั้งรหัส PIN 6 หลัก' }
      },
      {
        path: 'change-pin',
        name: 'LiffChangePin',
        component: () => import('@/views/LiffChangePin.vue'),
        meta: { isLiff: true, title: 'เปลี่ยนรหัส PIN' }
      },
      {
        path: 'profile',
        name: 'LiffProfile',
        component: () => import('@/views/LiffProfileView.vue'),
        meta: { isLiff: true, requiresLiffAuth: true, title: 'Horspace (ฮอร์สเปซ)' }
      },
      {
        path: 'owner-dashboard',
        name: 'LiffOwnerDashboard',
        component: () => import('@/views/LiffOwnerDashboardView.vue'),
        meta: { isLiff: true, requiresLiffAuth: true, title: 'แดชบอร์ดเจ้าของตึก' }
      },
      {
        path: 'settings',
        name: 'LiffSettings',
        component: () => import('@/views/LiffPersonalProfileView.vue'),
        meta: { isLiff: true, requiresLiffAuth: true, title: 'โปรไฟล์ส่วนตัว (Personal Profile)' }
      },
      {
        path: 'personal-profile',
        redirect: '/liff/settings'
      },
      {
        path: 'account',
        redirect: '/liff/settings'
      },
      {
        path: 'profile/edit',
        name: 'LiffUpdateProfile',
        component: () => import('@/views/LiffUpdateProfileView.vue'),
        meta: { isLiff: true, requiresLiffAuth: true, title: 'แก้ไขข้อมูลส่วนตัว' }
      },
      {
        path: 'invoices',
        name: 'LiffInvoiceList',
        component: () => import('@/views/LiffInvoiceListView.vue'),
        meta: { isLiff: true, requiresLiffAuth: true, title: 'บิลค่าเช่าทั้งหมด', feature: 'ENABLE_LINE_PAYMENT' }
      },
      {
        path: 'invoices/:id',
        name: 'LiffInvoiceDetail',
        component: () => import('@/views/LiffInvoiceDetailView.vue'),
        meta: { isLiff: true, requiresLiffAuth: true, title: 'รายละเอียดบิล & ชำระเงิน', feature: 'ENABLE_LINE_PAYMENT' }
      },
      {
        path: 'pay/:invoiceId',
        name: 'LiffPayment',
        component: () => import('@/views/LiffPaymentView.vue'),
        meta: { isLiff: true, requiresLiffAuth: true, title: 'ชำระเงินบิลค่าเช่า', feature: 'ENABLE_LINE_PAYMENT' }
      },
      {
        path: 'register',
        name: 'LiffRegister',
        component: () => import('@/views/LiffRegisterView.vue'),
        meta: { isLiff: true, title: 'ลงทะเบียนลูกบ้าน' }
      },
      {
        path: 'onboarding',
        name: 'LiffOnboarding',
        component: () => import('@/views/LiffOnboardingView.vue'),
        meta: { isLiff: true, title: 'ผูกบัญชีลูกบ้าน (Account Linking)' }
      },
      {
        path: 'announcements',
        name: 'LiffAnnouncements',
        component: () => import('@/views/LiffAnnouncementsView.vue'),
        meta: { isLiff: true, requiresLiffAuth: true, title: 'ข่าวสาร & ประกาศหอพัก', feature: 'ENABLE_ANNOUNCEMENTS' }
      },
      {
        // เดิมเป็นระบบแจ้งซ่อมแยกต่างหาก (LiffMaintenanceView) - ถูก unify รวมกับระบบ issues แล้ว
        // คง path เดิมไว้เป็น redirect เพื่อไม่ให้ลิงก์เก่า/LINE Rich Menu ที่ผูกไว้พังกลางทาง
        path: 'maintenance',
        redirect: '/liff/issues'
      },
      {
        path: 'parcels',
        name: 'LiffParcels',
        component: () => import('@/views/LiffParcelsView.vue'),
        meta: { isLiff: true, requiresLiffAuth: true, title: 'จัดการพัสดุของฉัน (My Parcels)', feature: 'ENABLE_PARCEL_NOTIFY' }
      },
      {
        path: 'facility-bookings',
        name: 'LiffFacilityBookings',
        component: () => import('@/views/LiffFacilityBookingView.vue'),
        meta: { isLiff: true, requiresLiffAuth: true, title: 'จองพื้นที่ส่วนกลาง', feature: 'ENABLE_FACILITY_BOOKING' }
      },
      {
        path: 'vehicles',
        name: 'LiffVehicles',
        component: () => import('@/views/LiffVehicleView.vue'),
        meta: { isLiff: true, requiresLiffAuth: true, title: 'จัดการยานพาหนะ/ผู้มาเยือน', feature: 'ENABLE_VEHICLE_MANAGEMENT' }
      },
      {
        path: 'polls',
        name: 'LiffPolls',
        component: () => import('@/views/LiffPollView.vue'),
        meta: { isLiff: true, requiresLiffAuth: true, title: 'โหวต/แบบสำรวจ', feature: 'ENABLE_VOTING' }
      },
      {
        path: 'issues',
        name: 'LiffIssueHistory',
        component: () => import('@/views/IssueHistory.vue'),
        meta: { isLiff: true, requiresLiffAuth: true, title: 'ประวัติการแจ้งซ่อมและร้องเรียน', feature: 'ENABLE_MAINTENANCE_REQUEST' }
      },
      {
        path: 'issues/report',
        name: 'LiffReportIssue',
        component: () => import('@/views/ReportIssue.vue'),
        meta: { isLiff: true, requiresLiffAuth: true, title: 'แจ้งซ่อมและร้องเรียน', feature: 'ENABLE_MAINTENANCE_REQUEST' }
      },
      {
        path: 'report-issue',
        redirect: '/liff/issues/report'
      },
      {
        path: 'issue-history',
        redirect: '/liff/issues'
      },
      {
        path: 'receipts',
        name: 'LiffReceiptHistory',
        component: () => import('@/views/LiffReceiptHistoryView.vue'),
        meta: { isLiff: true, requiresLiffAuth: true, title: 'ประวัติบิล & ใบเสร็จ E-Receipt', feature: 'ENABLE_RECEIPT_HISTORY' }
      },
      {
        path: 'contract',
        name: 'LiffContract',
        component: () => import('@/views/LiffContractView.vue'),
        meta: { isLiff: true, requiresLiffAuth: true, title: 'สัญญาเช่าห้องพัก (E-Contract)', feature: 'ENABLE_E_CONTRACT' }
      }
    ]
  },

  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

async function cmsNavigationGuard(to, from, next) {
  const authStore = useAuthStore();

  if (!authStore.isInitialized && !authStore.isAuthenticated) {
    await authStore.silentRefresh();
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next({ path: '/login', query: { redirect: to.fullPath } });
  }

  if (to.meta.roles && to.meta.roles.length > 0) {
    const userRole = (
      authStore.user?.role ||
      authStore.currentUser?.role ||
      'tenant'
    ).toLowerCase();

    const allowedRoles = to.meta.roles.map((r) => r.toLowerCase());
    const isCmsAdminUser = ['admin', 'super_admin', 'superadmin', 'owner', 'manager'].includes(userRole);

    // If route requires 'admin' role, allow any CMS backoffice role (admin, super_admin, owner, manager)
    if (allowedRoles.includes('admin') && isCmsAdminUser) {
      return next();
    }

    if (!allowedRoles.includes(userRole)) {
      return next({ path: '/403' });
    }
  }

  next();
}

async function liffNavigationGuard(to, from, next) {
  const authStore = useAuthStore();

  // 📱 0. หากเปิดผ่าน Browser ธรรมดา (ไม่ใช่ LINE App จริง) ให้เด้งไปเปิดผ่าน LINE แทนทันที
  // กัน User สับสน/ติดปัญหา LINE ID Token verify ไม่ได้แบบที่เจอกันมา (LIFF ต้องพึ่ง Session จริงของ LINE
  // เสมอ Browser ธรรมดาไม่มีทางได้ Token จริง) — ข้ามใน Dev Mode ไว้ให้ยังทดสอบผ่าน Browser ด้วย ?devLineUserId= ได้ตามปกติ
  if (!import.meta.env.DEV && typeof window !== 'undefined') {
    await initLiff();
    if (!isInLiffClient()) {
      const liffId = import.meta.env.VITE_LINE_LIFF_ID || import.meta.env.VITE_LIFF_ID || '';
      if (liffId) {
        window.location.href = `https://liff.line.me/${liffId}${to.fullPath}`;
        return; // กำลังจะออกจากหน้านี้อยู่แล้ว ไม่ต้อง next() ต่อ
      }
    }
  }

  // 🔑 0.5 Auto-login ผ่าน LINE ให้ทุกหน้าที่มาผ่าน LIFF โดยไม่ต้องรอแต่ละหน้าเขียนเช็คเอง (ก่อนหน้านี้มีแค่
  // LiffEntryView.vue ที่เช็ค พอเข้าหน้าอื่นตรง ๆ ด้วย Deep Link เช่น /liff/onboarding, /liff/register เลยไม่มี
  // LINE ID Token ให้ Backend ตรวจ แล้วโดน 401 "กรุณาเข้าสู่ระบบผ่าน LINE ก่อนใช้งาน" — ย้ายมาเช็ครวมที่นี่ที่
  // เดียวแทน ครอบคลุมทุก Route ที่ผ่าน Guard นี้) จำกัด 1 ครั้งต่อ Session กัน Loop เหมือนเดิม
  if (typeof window !== 'undefined' && !isLiffLoggedIn()) {
    const loginAttempted = sessionStorage.getItem('liff_auto_login_attempted');
    if (!loginAttempted) {
      sessionStorage.setItem('liff_auto_login_attempted', 'true');
      const loginStarted = await loginLiff(undefined, 'aggressive');
      if (loginStarted) return; // liff.login() จะ Redirect ออกจากหน้านี้เอง (หรือ Login แบบ Silent ในแอป LINE)
    }
  }

  // 🏢 1. ดึงและคงค่า Target Building จาก Query Param (?building=... หรือ ?buildingId=...)
  const targetBuilding =
    to.query.building ||
    to.query.buildingId ||
    (typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search).get('building') || new URLSearchParams(window.location.search).get('buildingId')
      : null);

  if (targetBuilding && typeof window !== 'undefined' && window.localStorage) {
    localStorage.setItem('liff_target_building', String(targetBuilding).trim());
  }

  // 🔗 2. รองรับ LINE Deep Link ผ่าน liff.state query parameter
  const liffState = to.query['liff.state'] || (typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('liff.state') : null);

  if (liffState && to.path === '/liff') {
    try {
      const decodedState = decodeURIComponent(liffState);
      if (decodedState.includes('?')) {
        const params = new URLSearchParams(decodedState.split('?')[1]);
        const stateBld = params.get('building') || params.get('buildingId');
        if (stateBld && typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem('liff_target_building', String(stateBld).trim());
        }
      }

      let targetPath = decodedState.startsWith('/liff')
        ? decodedState
        : `/liff${decodedState.startsWith('/') ? '' : '/'}${decodedState}`;

      const cleanQuery = { ...to.query };
      delete cleanQuery['liff.state'];

      if (targetPath !== to.path) {
        console.log(`[LIFF Deep Link] Redirecting from /liff to: ${targetPath}`);
        return next({ path: targetPath, query: cleanQuery });
      }
    } catch (err) {
      console.warn('ไม่สามารถ parse liff.state ได้:', err);
    }
  }

  // ⚡ Fast-track: หากผู้ใช้เคยล็อกอินอยู่แล้ว (Memory หรือกู้คืนผ่าน Silent Login ด้วย LINE ID Token)
  // เมื่อเข้าหน้า /liff ให้ตรงไปหน้าแรกทันทีโดยไม่ต้องผ่านหน้าโหลด
  if (to.path === '/liff' || to.path === '/liff/') {
    const hasSession = authStore.liffToken || (await authStore.restoreLiffSession());
    if (hasSession) {
      if (authStore.isOwner && authStore.currentRole === 'owner') {
        return next({ path: '/liff/owner-dashboard', query: to.query });
      }
      return next({ path: '/liff/profile', query: to.query });
    }
    return next();
  }

  // 🔒 กันหน้าที่ต้อง Login ก่อนเข้า (invoices, payment, profile ฯลฯ) ไม่ให้เห็นหน้าเปล่า/ยิง API แล้วเจอ 401
  // ก่อนเด้งกลับ - เช็ค Session ในหน่วยความจำก่อน แล้วลองกู้คืน session
  if (to.meta?.requiresLiffAuth) {
    const hasSession = authStore.liffToken || (await authStore.restoreLiffSession());
    if (!hasSession) {
      return next({ path: '/liff', query: { redirect: to.fullPath } });
    }
  }

  next();
}

router.beforeEach(async (to, from, next) => {
  if (to.path.startsWith('/liff') || to.meta.isLiff) {
    return liffNavigationGuard(to, from, next);
  } else {
    return cmsNavigationGuard(to, from, next);
  }
});

router.afterEach((to) => {
  if (typeof document !== 'undefined') {
    const pageTitle = to.meta?.title;
    if (pageTitle) {
      document.title = `${pageTitle} | Horspace`;
    } else if (to.meta?.isCms) {
      document.title = 'Horspace CMS - ระบบจัดการหอพักและอพาร์ตเมนต์';
    } else {
      document.title = 'Horspace - ระบบจัดการหอพักและอพาร์ตเมนต์อัจฉริยะ';
    }
  }
});

export default router;


