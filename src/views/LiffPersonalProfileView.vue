<template>
  <div class="space-y-5 pb-6 font-sans text-slate-900 selection:bg-teal-600 selection:text-white relative">
    <!-- Ambient Light Background Ornaments -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <div class="absolute -top-24 -left-24 w-80 h-80 bg-teal-100/30 rounded-full blur-3xl"></div>
      <div class="absolute top-1/2 -right-24 w-80 h-80 bg-emerald-100/25 rounded-full blur-3xl"></div>
    </div>

    <div class="space-y-4 relative z-10">
      <!-- Loading Skeleton State -->
      <div v-if="loading" class="space-y-4 animate-pulse">
        <div class="p-5 bg-white rounded-xl border border-slate-100 shadow-xs flex items-center gap-3.5">
          <div class="w-14 h-14 rounded-full bg-slate-100 skeleton-shimmer shrink-0"></div>
          <div class="space-y-2 flex-1">
            <div class="h-4 w-32 bg-slate-100 skeleton-shimmer rounded-md"></div>
            <div class="h-3 w-24 bg-slate-100 skeleton-shimmer rounded-md"></div>
          </div>
        </div>

        <div class="p-4 bg-white rounded-xl border border-slate-100 shadow-xs space-y-3">
          <div v-for="i in 4" :key="i" class="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-xl bg-slate-100 skeleton-shimmer"></div>
              <div class="h-3.5 w-28 bg-slate-100 skeleton-shimmer rounded-md"></div>
            </div>
            <div class="h-4 w-4 bg-slate-100 skeleton-shimmer rounded-full"></div>
          </div>
        </div>
      </div>

      <template v-else>
        <!-- 1. Profile Header Card -->
        <div
          class="p-5 text-white rounded-xl shadow-lg relative overflow-hidden transition-all duration-500"
          :style="{
            background: `linear-gradient(135deg, ${themeColor}, ${adjustBrightness(themeColor, -25)})`,
            boxShadow: `0 14px 20px -5px ${themeColor}25, 0 6px 8px -6px ${themeColor}25`
          }"
        >
          <div class="absolute -right-8 -bottom-8 w-36 h-36 bg-white/10 rounded-full blur-xl pointer-events-none"></div>

          <div class="flex items-center gap-3.5">
            <!-- Avatar จาก LINE หรือ Initials -->
            <div class="relative w-16 h-16 shrink-0">
              <img
                v-if="tenantProfile.avatarUrl && !imageLoadError"
                :src="tenantProfile.avatarUrl"
                alt="Tenant Avatar"
                class="w-16 h-16 rounded-full object-cover border-2 border-white/80 shadow-xs bg-white/20"
                @error="imageLoadError = true"
              />
              <div
                v-else
                class="w-16 h-16 rounded-full bg-white/20 backdrop-blur-xs border-2 border-white/80 shadow-xs flex items-center justify-center text-xl font-bold text-white select-none"
              >
                {{ tenantInitial }}
              </div>
              <span class="absolute bottom-0 right-0 w-4 h-4 bg-emerald-400 border-2 border-white rounded-full shadow-2xs" title="LINE Verified"></span>
            </div>

            <!-- ชื่อ และ เบอร์โทร -->
            <div class="space-y-1 flex-1 min-w-0">
              <div class="flex items-center gap-1.5 flex-wrap">
                <h1 class="font-bold text-base sm:text-lg truncate text-white">
                  {{ tenantProfile.firstName }} {{ tenantProfile.lastName }}
                </h1>
                <Badge class="bg-white/20 text-white font-semibold border border-white/30 backdrop-blur-xs">
                  ลูกบ้าน
                </Badge>
              </div>
              <p class="text-xs text-teal-100/90 font-mono">{{ tenantProfile.phone || '081-234-5678' }}</p>
              <div class="flex items-center gap-2 pt-0.5">
                <span class="text-xs font-semibold text-yellow-300">
                  ห้อง {{ tenantProfile.roomNumber || '-' }}
                </span>
                <span v-if="tenantProfile.buildingName" class="text-xs text-teal-100/80">
                  • ตึก {{ tenantProfile.buildingName }}
                </span>
              </div>
            </div>
          </div>

          <!-- Digital ID & Quick Status -->
          <div class="mt-4 pt-3.5 border-t border-white/20 flex items-center justify-between gap-2">
            <div class="flex items-center gap-1.5 text-xs text-teal-100/90">
              <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>LINE Verified</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              @click="showQrModal = true"
              class="bg-white/20 hover:bg-white/30 text-white font-semibold border border-white/30 backdrop-blur-xs active:scale-95"
            >
              <QrCode class="w-3.5 h-3.5" />
              <span>Digital ID</span>
            </Button>
          </div>
        </div>
      </template>

      <!-- 2. เมนูทั่วไป (GENERAL SETTINGS) - Minimal iOS Group List -->
      <div class="space-y-2">
        <h2 class="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
          เมนูทั่วไป (General Settings)
        </h2>

        <Card class="overflow-hidden divide-y divide-slate-100">
          <button
            v-for="menu in availableGeneralMenus"
            :key="menu.id"
            @click="handleMenuClick(menu)"
            class="w-full p-3.5 flex items-center justify-between hover:bg-slate-50/80 active:bg-slate-100/80 transition-colors text-left group cursor-pointer"
          >
            <div class="flex items-center gap-3">
              <div
                class="w-8.5 h-8.5 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 shrink-0 bg-slate-50 text-slate-600 group-hover:bg-primary/10 group-hover:text-primary"
              >
                <component :is="menu.icon" class="w-4 h-4" />
              </div>
              <div class="min-w-0 flex-1">
                <div class="text-xs font-semibold leading-snug text-slate-800">
                  {{ menu.title }}
                </div>
                <div v-if="menu.subtitle" class="text-xs text-slate-400 mt-0.5 truncate font-normal">
                  {{ menu.subtitle }}
                </div>
              </div>
            </div>
            <ChevronRight
              class="w-4 h-4 text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5 transition-all shrink-0"
            />
          </button>
        </Card>
      </div>

      <!-- 3. Big Standalone Logout Button at Bottom -->
      <div class="pt-2 pb-2">
        <Button
          variant="outline"
          @click="handleTenantLogout"
          class="w-full py-3 h-auto rounded-xl bg-rose-50/80 hover:bg-rose-100/80 active:bg-rose-200/80 text-rose-600 border-rose-100 font-bold shadow-2xs active:scale-[0.99]"
        >
          <LogOut class="w-4 h-4" />
          <span>ออกจากระบบ (Logout)</span>
        </Button>
      </div>
    </div>

    <!-- 4. Digital ID QR Code Modal Pop-up -->
    <Dialog :open="showQrModal" @update:open="showQrModal = $event">
      <DialogContent class="max-w-sm text-center">
        <DialogHeader>
          <DialogTitle class="text-center">Digital Tenant ID</DialogTitle>
          <DialogDescription class="text-center">แสดง QR Code นี้แก่เจ้าหน้าที่รักษาความปลอดภัย</DialogDescription>
        </DialogHeader>

        <div class="py-3">
          <img :src="digitalIdQrUrl" alt="Digital ID QR" class="w-48 h-48 mx-auto rounded-xl border border-slate-200 shadow-xs" />
        </div>

        <div class="p-3 bg-slate-50 rounded-xl text-xs space-y-1 text-slate-600 font-mono">
          <div>ผู้เช่า: <span class="font-bold text-slate-900">{{ tenantProfile.firstName }} {{ tenantProfile.lastName }}</span></div>
          <div>ห้องพัก: <span class="font-bold text-teal-600">ห้อง {{ tenantProfile.roomNumber || '-' }}</span></div>
        </div>

        <DialogFooter class="sm:justify-center">
          <Button class="w-full bg-slate-900 hover:bg-slate-800" @click="showQrModal = false">
            ปิดหน้าต่าง (Close)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- 6. Developer Feedback Modal -->
    <DeveloperFeedbackModal
      v-model="showFeedbackModal"
      platform="TENANT_LIFF"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import api from '@/utils/api';
import { initLiff, isLiffLoggedIn, getLiffProfile } from '@/utils/liff';
import QRCode from 'qrcode';
import { useAuthStore } from '@/stores/auth';
import { useFeatureStore } from '@/stores/useFeatureStore';
import { useDynamicTheme } from '@/composables/useDynamicTheme';
import { showSuccess, showError, showWarning, showConfirm } from '@/utils/swal';
import DeveloperFeedbackModal from '@/components/DeveloperFeedbackModal.vue';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

import {
  User,
  Car,
  Receipt,
  LogOut,
  DoorOpen,
  QrCode,
  ChevronRight,
  KeyRound,
  MessageSquarePlus
} from 'lucide-vue-next';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const featureStore = useFeatureStore();
const { themeColor, adjustBrightness } = useDynamicTheme();

const loading = ref(true);
const imageLoadError = ref(false);
const showQrModal = ref(false);
const showFeedbackModal = ref(false);
const digitalIdQrUrl = ref('');

const tenantProfile = reactive({
  id: '',
  firstName: '',
  lastName: '',
  roomNumber: '',
  buildingName: '',
  phone: '',
  avatarUrl: ''
});

const tenantInitial = computed(() => {
  if (tenantProfile.firstName) {
    return tenantProfile.firstName.charAt(0).toUpperCase();
  }
  return 'T';
});

// เมนูทั่วไป (General Settings List) ตามที่ผู้ใช้ระบุ
const generalMenusConfig = [
  {
    id: 'change-pin',
    title: 'เปลี่ยนรหัส PIN 6 หลัก (Change PIN)',
    subtitle: 'เปลี่ยนรหัสความปลอดภัยสำหรับเข้าใช้งาน LIFF',
    icon: KeyRound,
    route: '/liff/change-pin',
    featureKey: null
  },
  {
    id: 'profile',
    title: 'จัดการข้อมูลส่วนตัว (เบอร์โทร, บัตรประชาชน)',
    subtitle: 'อัปเดตเบอร์ติดต่อและข้อมูลผู้เช่า',
    icon: User,
    route: '/liff/profile/edit',
    featureKey: null
  },
  {
    id: 'vehicles',
    title: 'ยานพาหนะของฉัน (ป้ายทะเบียนรถ)',
    subtitle: 'ลงทะเบียนรถยนต์ / มอเตอร์ไซค์',
    icon: Car,
    route: '/liff/profile/edit',
    featureKey: 'ENABLE_VEHICLE_MANAGEMENT'
  },
  {
    id: 'receipts',
    title: 'ประวัติใบเสร็จรับเงิน (E-Receipt)',
    subtitle: 'ดูประวัติใบเสร็จและการชำระเงินย้อนหลัง',
    icon: Receipt,
    route: '/liff/receipts',
    featureKey: null
  },
  {
    id: 'developer-feedback',
    title: 'ส่งข้อเสนอแนะถึงทีมผู้พัฒนา (Developer Feedback)',
    subtitle: 'แจ้งปัญหาการใช้งาน หรือขอฟีเจอร์ใหม่',
    icon: MessageSquarePlus,
    action: () => {
      showFeedbackModal.value = true;
    },
    featureKey: null
  },
  {
    id: 'moveout',
    title: 'แจ้งย้ายออกล่วงหน้า',
    subtitle: 'แจ้งเรื่องย้ายออกล่วงหน้าอย่างน้อย 30 วัน',
    icon: DoorOpen,
    isDanger: false,
    action: () => showWarning('แจ้งย้ายออก', 'กรุณาติดต่อแอดมินหรือสำนักงานหอพักล่วงหน้าอย่างน้อย 30 วันก่อนวันย้ายออก'),
    featureKey: null
  }
];

const availableGeneralMenus = computed(() => {
  return generalMenusConfig.filter((menu) => {
    if (!menu.featureKey) return true;
    return featureStore.isEnabled(menu.featureKey);
  });
});

const handleMenuClick = (menu) => {
  if (menu.action) {
    menu.action();
  } else if (menu.route) {
    router.push(menu.route);
  }
};

const handleTenantLogout = async () => {
  const isConfirmed = await showConfirm(
    'ยืนยันออกจากระบบ',
    'คุณต้องการออกจากระบบและลบเซสชันการใช้งานในอุปกรณ์นี้ใช่หรือไม่?',
    'ออกจากระบบ',
    'ยกเลิก'
  );
  if (!isConfirmed) return;

  try {
    const result = await authStore.logoutTenant();
    await showSuccess('ออกจากระบบสำเร็จ', 'ลบข้อมูลการเข้าใช้งานเรียบร้อยแล้ว');

    if (result.channel === 'line_client') {
      const { closeLiffWindow } = await import('@/utils/liff');
      closeLiffWindow();
    } else {
      router.replace('/liff');
    }
  } catch (err) {
    console.error('Tenant logout error:', err);
    router.replace('/liff');
  }
};

const fetchProfile = async () => {
  try {
    await initLiff();
    if (isLiffLoggedIn()) {
      const lineProfile = await getLiffProfile();
      if (lineProfile) {
        tenantProfile.avatarUrl = lineProfile.pictureUrl || '';
      }
    } else if (!authStore.liffToken && !localStorage.getItem('dev_line_user_id')) {
      authStore.clearLiffAuth();
      router.replace('/liff');
      return;
    }

    const res = await api.get('/api/v1/liff/profile');
    if (res.data?.success && res.data.data) {
      const data = res.data.data;
      tenantProfile.id = data.id || '';
      tenantProfile.firstName = data.firstName || 'ลูกบ้าน';
      tenantProfile.lastName = data.lastName || '';
      tenantProfile.phone = data.phone || '';
      tenantProfile.roomNumber = data.roomNumber || data.rooms?.[0]?.roomNumber || '-';
      tenantProfile.buildingName = data.buildingName || data.rooms?.[0]?.buildingName || '';
      if (!tenantProfile.avatarUrl && data.linePictureUrl) {
        tenantProfile.avatarUrl = data.linePictureUrl;
      }

      // Generate Digital ID QR
      const qrData = JSON.stringify({
        tenantId: tenantProfile.id,
        name: `${tenantProfile.firstName} ${tenantProfile.lastName}`,
        room: tenantProfile.roomNumber,
        timestamp: Date.now()
      });
      digitalIdQrUrl.value = await QRCode.toDataURL(qrData, { width: 300, margin: 2 });
    }
  } catch (err) {
    console.error('Fetch profile error:', err);
    if (err.response?.status === 401 || err.response?.status === 403 || !isLiffLoggedIn()) {
      authStore.clearLiffAuth();
      router.replace('/liff');
    }
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchProfile();
});
</script>
