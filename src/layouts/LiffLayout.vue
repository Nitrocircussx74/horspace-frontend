<template>
  <!-- App Shell: Locked Viewport Container (ห้ามขยับทั้ง Header และ Footer) -->
  <div class="fixed inset-0 h-[100dvh] w-full bg-slate-50 flex flex-col font-sans text-slate-800 selection:bg-teal-500 selection:text-white overflow-hidden">
    <!-- 1. Top Navigation Bar (Header) - ปักหมุดถาวรด้านบน -->
    <header class="shrink-0 min-h-14 bg-white/95 backdrop-blur-md border-b border-slate-100 z-30 px-4 sm:px-6 shadow-2xs select-none pt-[env(safe-area-inset-top)]">
      <div class="max-w-4xl mx-auto h-full flex items-center justify-between">
        <!-- Left: Back Button or Logo -->
        <div class="flex items-center gap-2">
          <Button
            v-if="showBackButton"
            variant="ghost"
            size="icon"
            class="w-11 h-11 bg-slate-100/80 hover:bg-slate-200 text-slate-600"
            aria-label="ย้อนกลับ"
            @click="handleBack"
          >
            <ChevronLeft class="w-4 h-4" />
          </Button>
          
          <div v-else class="flex items-center gap-2">
            <img
              :src="logoUrl || '/horspace-app-icon.webp'"
              alt="Horspace Logo"
              width="32"
              height="32"
              class="w-8 h-8 rounded-xl object-contain border border-slate-200/80 bg-white p-0.5 shadow-2xs"
              @error="(e) => e.target.src = '/horspace-app-icon.webp'"
              loading="eager"
              decoding="async"
            />
          </div>
        </div>

        <!-- Center: Dynamic Page Title -->
        <div class="flex-1 text-center truncate px-2">
          <h1 class="font-bold text-sm sm:text-base text-slate-800 tracking-tight truncate">
            {{ pageTitle }}
          </h1>
        </div>

        <!-- Right: Badge & Actions -->
        <div class="flex items-center justify-end gap-2">
          <Badge variant="success">LIFF</Badge>
          <NotificationBell v-if="showBottomNav" mode="tenant" />
        </div>
      </div>
    </header>

    <!-- 2. Main Scrollable Content Area (เลื่อนเฉพาะเนื้อหาข้างใน ไม่กระทบ Header/Footer) -->
    <main class="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6 overflow-y-auto overscroll-y-contain -webkit-overflow-scrolling-touch">
      <!-- หน้าที่ผูกกับฟีเจอร์ (route.meta.feature) แต่ตึกนี้ปิดไว้ใน CMS: กันไว้จุดเดียว รวมกรณีเปิดลิงก์ตรง/ค้างหน้าเดิม -->
      <div
        v-if="disabledFeatureRoute"
        class="p-5 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 space-y-3 shadow-xs"
        role="alert"
      >
        <div class="flex items-center gap-2 font-bold text-xs">
          <AlertTriangle class="w-4 h-4 text-amber-600 shrink-0" />
          <span>ฟีเจอร์นี้ถูกปิดใช้งานสำหรับอาคารนี้</span>
        </div>
        <p class="text-xs text-amber-700 leading-relaxed">
          ผู้ดูแลหอพักปิดการใช้งานส่วนนี้ไว้ หากต้องการความช่วยเหลือกรุณาติดต่อเจ้าหน้าที่โดยตรง
        </p>
        <button
          type="button"
          class="text-xs font-semibold text-amber-800 underline underline-offset-2 cursor-pointer"
          @click="router.replace('/liff/profile')"
        >
          กลับหน้าแรก
        </button>
      </div>
      <router-view v-else v-slot="{ Component }">
        <transition name="page-fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- 3. Bottom Navigation (Fixed Immovable Footer ปักหมุดถาวร ห้ามขยับเด็ดขาด) -->
    <nav
      v-if="showBottomNav"
      class="shrink-0 h-16 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-lg z-30 select-none pb-[max(0.25rem,env(safe-area-inset-bottom))] touch-none"
    >
      <div class="max-w-4xl mx-auto h-full flex items-center justify-around px-2">
        <router-link
          v-for="tab in navTabs"
          :key="tab.path"
          :to="tab.path"
          class="flex-1 flex flex-col items-center justify-center py-1 group text-decoration-none transition-all duration-200 cursor-pointer"
          :class="isTabActive(tab.path) ? 'font-bold' : 'text-slate-400 hover:text-slate-600 font-medium'"
          :style="isTabActive(tab.path) ? { color: themeColor } : {}"
        >
          <div class="relative flex items-center justify-center w-8 h-8 rounded-xl transition-colors" :class="isTabActive(tab.path) ? 'bg-slate-100' : ''">
            <component :is="tab.icon" class="w-4 h-4 transition-transform duration-200 group-hover:scale-105" />
            <!-- Unread Announcement Dot Badge -->
            <span
              v-if="tab.path === '/liff/announcements' && unreadCount > 0"
              class="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5"
            >
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500 border border-white"></span>
            </span>
          </div>
          <span class="text-xs mt-0.5 tracking-tight font-medium">{{ tab.name }}</span>
        </router-link>
      </div>
    </nav>

    <!-- 4. Mandatory Add Friend Modal Overlay (บังคับเพิ่มเพื่อน LINE Official ก่อนเข้าใช้งาน) -->
    <div
      v-if="needsAddFriend"
      class="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
    >
      <Card class="p-6 sm:p-7 max-w-sm w-full shadow-2xl text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
        <!-- Hero LINE Icon -->
        <div class="relative inline-flex items-center justify-center">
          <div class="w-16 h-16 rounded-xl bg-gradient-to-tr from-[#06C755] to-emerald-400 p-3.5 shadow-lg shadow-[#06C755]/25 flex items-center justify-center ring-8 ring-emerald-50/80">
            <svg class="w-full h-full fill-current text-white" viewBox="0 0 24 24">
              <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.477.254l2.486 3.37V8.108c0-.345.282-.63.63-.63.345 0 .624.285.624.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
            </svg>
          </div>
          <span class="absolute -bottom-0.5 -right-0.5 flex h-5 w-5">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-5 w-5 bg-emerald-500 border-2 border-white items-center justify-center text-white text-xs font-bold">
              <UserPlus class="w-3 h-3" />
            </span>
          </span>
        </div>

        <div class="space-y-1.5">
          <Badge variant="success" class="font-bold">
            <Sparkles class="w-3.5 h-3.5" />
            <span>จำเป็นต้องเพิ่มเพื่อนก่อนใช้งาน</span>
          </Badge>
          <h2 class="text-lg font-bold text-slate-900 tracking-tight">
            เพิ่มเพื่อนกับ LINE Official
          </h2>
          <p class="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
            เพื่อรับการแจ้งเตือนบิลค่าเช่า ค่าน้ำค่าไฟ พัสดุมาถึง และติดตามสถานะแจ้งซ่อม กรุณากดเพิ่มเพื่อนกับ LINE Official Account ของหอพักครับ
          </p>
        </div>

        <div class="space-y-2.5 pt-1">
          <!-- Main Action: Add Friend -->
          <Button
            class="w-full bg-gradient-to-r from-[#06C755] to-emerald-600 hover:from-[#05b34c] hover:to-emerald-700 shadow-lg shadow-[#06C755]/25"
            @click="handleAddFriend"
          >
            <UserPlus class="w-4 h-4" />
            <span>กดเพิ่มเพื่อน (Add Friend)</span>
          </Button>

          <!-- Secondary Action: Re-check -->
          <Button variant="secondary" class="w-full" :disabled="checkingFriendship" @click="handleRecheckFriendship">
            <span v-if="checkingFriendship" class="animate-spin w-3.5 h-3.5 border-2 border-slate-600 border-t-transparent rounded-full"></span>
            <RotateCw v-else class="w-3.5 h-3.5" />
            <span>{{ checkingFriendship ? 'กำลังตรวจสอบ...' : 'ฉันเพิ่มเพื่อนแล้ว (ตรวจสอบอีกครั้ง)' }}</span>
          </Button>
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useFeatureStore } from '@/stores/useFeatureStore';
import { useDynamicTheme } from '@/composables/useDynamicTheme';
import { useAnnouncements } from '@/composables/useAnnouncements';
import { initLiff, getLiffFriendship, openAddFriendLine, isLiffLoggedIn } from '@/utils/liff';
import { showSuccess, showWarning } from '@/utils/swal';
import NotificationBell from '@/components/NotificationBell.vue';
import {
  ChevronLeft,
  Home,
  User,
  Receipt,
  Wrench,
  Megaphone,
  UserPlus,
  RotateCw,
  Sparkles,
  LayoutDashboard,
  FileText,
  AlertTriangle
} from 'lucide-vue-next';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const featureStore = useFeatureStore();
const { themeColor, logoUrl, buildingName, fetchAndApplyTheme } = useDynamicTheme();
const { unreadCount, checkUnread } = useAnnouncements();

const needsAddFriend = ref(false);
const checkingFriendship = ref(false);

/**
 * ตรวจสอบว่าผู้ใช้กำลังอยู่ในโหมดเจ้าของหอพัก (Owner Mode) หรือไม่
 */
const isOwnerMode = computed(() => {
  const currentPath = route.path.replace(/\/$/, '') || '/';
  return (
    (authStore.isOwner && authStore.currentRole === 'owner') ||
    currentPath.startsWith('/liff/owner-dashboard')
  );
});

/**
 * 1. Dynamic Page Title
 */
const pageTitle = computed(() => {
  return route.meta?.title || 'Horspace (ฮอร์สเปซ)';
});

/**
 * 2. Logic แสดงปุ่ม Back
 */
const showBackButton = computed(() => {
  const currentPath = route.path.replace(/\/$/, '') || '/';
  const mainTabPaths = [
    '/liff',
    '/liff/profile',
    '/liff/owner-dashboard',
    '/liff/receipts',
    '/liff/issues',
    '/liff/announcements',
    '/liff/settings'
  ];
  return !mainTabPaths.includes(currentPath);
});

/**
 * 2.1 Logic แสดงแถบ Bottom Navigation Bar
 */
const showBottomNav = computed(() => {
  if (route.meta?.hideBottomNav) return false;
  const noNavPaths = [
    '/liff',
    '/liff/register',
    '/liff/onboarding',
    '/liff/pin-login',
    '/liff/setup-pin',
    '/liff/change-pin'
  ];
  return !noNavPaths.includes(route.path);
});

/**
 * 3. ฟังก์ชันสำหรับย้อนกลับหน้าเดิม
 */
const handleBack = () => {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push(isOwnerMode.value ? '/liff/owner-dashboard' : '/liff/profile');
  }
};

/**
 * 4. เมนูของ Bottom Navigation Bar แยกตาม Role (Tenant vs Owner)
 */
// 4.1 แท็บสำหรับลูกบ้าน (Tenant)
const tenantNavTabs = [
  { name: 'หน้าแรก', path: '/liff/profile', icon: Home },
  { name: 'ใบเสร็จ', path: '/liff/receipts', icon: Receipt, featureKey: 'ENABLE_RECEIPT_HISTORY' },
  { name: 'แจ้งซ่อม', path: '/liff/issues', icon: Wrench, featureKey: 'ENABLE_MAINTENANCE_REQUEST' },
  { name: 'ข่าวสาร', path: '/liff/announcements', icon: Megaphone, featureKey: 'ENABLE_ANNOUNCEMENTS' },
  { name: 'โปรไฟล์', path: '/liff/settings', icon: User }
];

// 4.2 แท็บสำหรับเจ้าของหอพัก (Owner / Manager)
const ownerNavTabs = [
  { name: 'ภาพรวม', path: '/liff/owner-dashboard', icon: LayoutDashboard },
  { name: 'ตรวจสลิป', path: '/liff/owner-dashboard?tab=slips', icon: Receipt },
  { name: 'แจ้งซ่อม', path: '/liff/owner-dashboard?tab=maintenance', icon: Wrench },
  { name: 'สัญญาเช่า', path: '/liff/owner-dashboard?tab=leases', icon: FileText },
  { name: 'โปรไฟล์', path: '/liff/settings', icon: User }
];

const navTabs = computed(() => {
  if (isOwnerMode.value) {
    return ownerNavTabs;
  }
  return tenantNavTabs.filter((tab) => !tab.featureKey || featureStore.isEnabled(tab.featureKey));
});

/**
 * ตรวจสอบว่าแอนิเมชัน/ไฮไลต์แท็บปัจจุบันถูกเปิดอยู่หรือไม่
 */
const isTabActive = (tabPath) => {
  if (tabPath.includes('?')) {
    return route.fullPath === tabPath;
  }
  if (route.query.tab && tabPath === '/liff/owner-dashboard') {
    return false;
  }
  return route.path === tabPath || route.path.startsWith(tabPath + '/');
};

/**
 * 5. ตรวจสอบสถานะการเพิ่มเพื่อนกับ LINE Official Account
 */
const checkUserFriendship = async () => {
  if (route.path === '/liff' || route.path === '/liff/') {
    needsAddFriend.value = false;
    return;
  }
  try {
    await initLiff();
    if (!isLiffLoggedIn()) return;
    const friendship = await getLiffFriendship();
    console.log('[LIFF Layout] Friendship status:', friendship);
    if (friendship && friendship.noBotLinked) {
      needsAddFriend.value = false;
      return;
    }
    if (friendship && friendship.friendFlag === false) {
      needsAddFriend.value = true;
    } else {
      needsAddFriend.value = false;
    }
  } catch (err) {
    console.warn('Friendship check warning:', err);
  }
};

const handleAddFriend = () => {
  openAddFriendLine();
};

const handleRecheckFriendship = async () => {
  checkingFriendship.value = true;
  try {
    const friendship = await getLiffFriendship();
    if (friendship && (friendship.friendFlag === true || friendship.noBotLinked)) {
      needsAddFriend.value = false;
      await showSuccess('ยินดีต้อนรับ!', 'ตรวจสอบพบการเพิ่มเพื่อนเรียบร้อยแล้วครับ');
    } else {
      needsAddFriend.value = true;
      showWarning('ยังไม่พบการเพิ่มเพื่อน', 'กรุณากดปุ่ม "กดเพิ่มเพื่อน" เพื่อเพิ่มเพื่อนกับ LINE Official Account ก่อนเข้าใช้งานนะครับ');
    }
  } catch (err) {
    console.warn('Recheck friendship error:', err);
  } finally {
    checkingFriendship.value = false;
  }
};

// หมายเหตุ: checkUserFriendship() ไม่ได้ผูกกับ watch(route.path) แล้ว เพราะจะยิง LINE SDK
// getFriendship() ซ้ำทุกครั้งที่สลับแท็บโดยไม่จำเป็น (สถานะเพิ่มเพื่อนไม่ได้เปลี่ยนบ่อยขนาดนั้น)
// เช็คครั้งเดียวตอนเข้าแอปพอ ผู้ใช้ยังกดปุ่ม "ตรวจสอบอีกครั้ง" เองได้จาก Modal อยู่แล้ว
const disabledFeatureRoute = computed(() => Boolean(route.meta.feature) && !featureStore.isEnabled(route.meta.feature));

// ดึง Feature Toggle ซ้ำทุกครั้งที่เปลี่ยนหน้า/กลับเข้าแอป ให้การเปิด-ปิดใน CMS มีผลกับ LIFF ที่เปิดค้างไว้โดยไม่ต้องปิดแอป
// ponytail: poll ตอนเปลี่ยนหน้า ไม่ใช่ realtime, ถ้าต้องการทันทีค่อยต่อ SSE/websocket
const refreshFeatures = () => featureStore.fetchFeatures(featureStore.buildingId);
const onVisible = () => {
  if (document.visibilityState === 'visible') refreshFeatures();
};

// เช็คเฉพาะตอน Login แล้วจริงๆ กัน 401 Noise จาก Silent LINE Login ที่ยังไม่มี Token (เช่นหน้ายังโหลดไม่เสร็จ)
const checkUnreadIfAuthed = () => {
  if (authStore.liffToken) checkUnread();
};

watch(
  () => route.path,
  () => {
    checkUnreadIfAuthed();
    refreshFeatures();
  }
);

onUnmounted(() => document.removeEventListener('visibilitychange', onVisible));

onMounted(async () => {
  const themeData = await fetchAndApplyTheme();
  const bId = themeData?.buildingId || null;
  await featureStore.fetchFeatures(bId);
  document.addEventListener('visibilitychange', onVisible);
  checkUserFriendship();
  checkUnreadIfAuthed();
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(4px);
}
</style>

