<template>
  <div class="space-y-6 max-w-7xl mx-auto pb-12">
    <!-- Top Header Bar / Navigation -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <Button variant="outline" size="icon" @click="goBack" title="ย้อนกลับ">
          <ArrowLeft class="w-4 h-4" />
        </Button>
        <div>
          <h1 class="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <User class="w-5 h-5 text-cyan-600" />
            <span>โปรไฟล์และประวัติผู้เช่า (Tenant 360° Profile)</span>
          </h1>
          <p class="text-xs sm:text-sm text-slate-500">
            ศูนย์รวมข้อมูลส่วนตัว สัญญาเช่า ประวัติการชำระเงิน และบันทึกแจ้งซ่อมของลูกบ้าน
          </p>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <Button variant="outline" @click="loadTenantData">
          <RefreshCw :class="['w-3.5 h-3.5', loading ? 'animate-spin' : '']" />
          <span>รีเฟรชข้อมูล</span>
        </Button>
      </div>
    </div>

    <!-- Loading State -->
    <Card v-if="loading" class="p-16 text-center space-y-4">
      <div class="w-10 h-10 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
      <p class="text-sm text-slate-600 font-medium">กำลังโหลดข้อมูลโปรไฟล์ผู้เช่าแบบ 360°...</p>
    </Card>

    <!-- Error / Not Found State -->
    <Card v-else-if="error || !tenant" class="p-12 text-center space-y-3">
      <div class="w-16 h-16 bg-rose-50 rounded-xl flex items-center justify-center mx-auto text-rose-500 mb-3"><AlertCircle class="w-8 h-8" /></div>
      <h3 class="text-lg font-bold text-slate-800">ไม่พบข้อมูลผู้เช่า</h3>
      <p class="text-xs text-slate-500">{{ error || 'ไม่พบเรคคอร์ดของผู้เช่ารายนี้ในระบบ' }}</p>
      <Button @click="goBack" class="mt-2">
        กลับไปหน้าหลัก
      </Button>
    </Card>

    <!-- Content State -->
    <div v-else class="space-y-6">
      <!-- Header Section (360-degree Profile Summary Card) -->
      <div class="bg-gradient-to-br from-slate-900 via-slate-850 to-cyan-950 text-white rounded-xl p-6 sm:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
        <!-- Accent Glow background decoration -->
        <div class="absolute -top-24 -right-24 w-72 h-72 bg-cyan-600/20 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute -bottom-24 -left-24 w-72 h-72 bg-teal-600/20 rounded-full blur-3xl pointer-events-none"></div>

        <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <!-- Profile Info Left -->
          <div class="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <!-- Avatar image with LINE fallback ring -->
            <div class="relative group shrink-0">
              <img
                v-if="tenant.linePictureUrl"
                :src="tenant.linePictureUrl"
                :alt="tenant.firstName"
                class="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover ring-4 ring-cyan-500/40 shadow-lg"
              />
              <div
                v-else
                class="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-gradient-to-tr from-cyan-600 to-teal-600 text-white font-extrabold text-3xl sm:text-4xl flex items-center justify-center ring-4 ring-cyan-500/40 shadow-lg"
              >
                {{ tenant.firstName ? tenant.firstName.charAt(0).toUpperCase() : 'U' }}
              </div>
              <div v-if="tenant.lineUserId" class="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full shadow-md" title="ผูกบัญชี LINE แล้ว">
                <MessageSquare class="w-3.5 h-3.5" />
              </div>
            </div>

            <!-- Text Profile Summary -->
            <div class="space-y-2">
              <div class="flex flex-wrap items-center gap-2">
                <h2 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {{ tenant.firstName }} {{ tenant.lastName }}
                </h2>

                <!-- Status Badges -->
                <span
                  v-if="tenant.isBlacklisted"
                  class="px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1 shadow-xs"
                >
                  <span class="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                  Blacklist (แบล็กลิสต์)
                </span>

                <span
                  v-if="isCurrentlyRenting"
                  class="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1 shadow-xs"
                >
                  <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
                  กำลังเช่าอยู่
                </span>

                <span
                  v-else
                  class="px-3 py-1 rounded-full text-xs font-bold bg-slate-700 text-slate-300 border border-slate-600 flex items-center gap-1 shadow-xs"
                >
                  ย้ายออกแล้ว
                </span>

                <!-- Access Channel Badges -->
                <span
                  v-if="isLineConnected"
                  class="px-2.5 py-1 rounded-full text-xs font-bold bg-[#06C755]/20 text-emerald-300 border border-[#06C755]/40 flex items-center gap-1.5 shadow-xs"
                  title="ลูกบ้านผูกบัญชี LINE OA สำหรับใช้งานผ่าน LINE LIFF เรียบร้อยแล้ว"
                >
                  <MessageSquare class="w-3.5 h-3.5" />
                  <span>LINE LIFF Active</span>
                </span>

                <span
                  v-if="hasSetPin"
                  class="px-2.5 py-1 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-500/40 flex items-center gap-1.5 shadow-xs"
                  title="ลูกบ้านตั้งรหัส PIN 6 หลักแล้ว สามารถเข้าใช้งาน Web Portal หรือสแกน LINE บนคอมพิวเตอร์ได้"
                >
                  <Globe class="w-3.5 h-3.5" />
                  <span>Web Portal (PIN 6 หลัก)</span>
                </span>

                <span
                  v-if="!isLineConnected && !hasSetPin"
                  class="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1.5 shadow-xs"
                  title="ลูกบ้านลงทะเบียนแบบ Walk-in ยังไม่ได้เปิดใช้งาน LINE หรือตั้ง PIN"
                >
                  <AlertCircle class="w-3.5 h-3.5" />
                  <span>รอเปิดใช้งาน (Walk-in)</span>
                </span>
              </div>

              <!-- Contact & Identity Attributes -->
              <div class="flex flex-wrap items-center gap-y-1.5 gap-x-4 text-xs sm:text-sm text-slate-300">
                <div class="flex items-center gap-1.5 font-medium">
                  <Phone class="w-3.5 h-3.5 text-cyan-400" />
                  <a :href="`tel:${tenant.phone}`" class="hover:underline hover:text-white font-mono">{{ tenant.phone || '-' }}</a>
                </div>

                <div v-if="tenant.idCard" class="flex items-center gap-1.5 font-medium">
                  <CreditCard class="w-3.5 h-3.5 text-cyan-400" />
                  <span class="font-mono">เลขบัตร: {{ tenant.idCard }}</span>
                </div>

                <div v-if="tenant.lineDisplayName" class="flex items-center gap-1.5 text-emerald-400 font-medium">
                  <span class="flex items-center gap-1"><MessageSquare class="w-3.5 h-3.5 text-emerald-400" /> LINE:</span>
                  <span>{{ tenant.lineDisplayName }}</span>
                </div>
              </div>

              <!-- Current Active Rooms Badge if any -->
              <div v-if="activeRoomsList.length > 0" class="pt-1 flex flex-wrap items-center gap-2 text-xs">
                <span class="text-slate-400">ห้องพักปัจจุบัน:</span>
                <span
                  v-for="r in activeRoomsList"
                  :key="r.id"
                  class="bg-cyan-900/60 text-cyan-200 border border-cyan-700/60 px-2.5 py-1 rounded-lg font-bold"
                >
                  {{ r.building?.name || 'อาคาร' }} - ห้อง {{ r.roomNumber }} (ชั้น {{ r.floor }})
                </span>
              </div>

              <!-- LINE Linking Action for Non-LINE / Walk-in Tenants -->
              <div v-if="!tenant.lineUserId" class="pt-2 flex flex-wrap items-center gap-2">
                <Button
                  @click="lineLinkModalRef?.open()"
                  size="sm"
                  class="bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/30 active:scale-95"
                >
                  <MessageSquare class="w-3.5 h-3.5" />
                  <span>สร้างรหัส/QR เชื่อมต่อบัญชี LINE</span>
                </Button>
                <span class="text-xs text-slate-300">
                  (สำหรับผู้เช่าที่ลงทะเบียนแบบ Walk-in แล้วต้องการผูก LINE ภายหลัง)
                </span>
              </div>
            </div>
          </div>

          <!-- Profile Quick Stats Summary Right -->
          <div class="grid grid-cols-3 gap-3 bg-slate-900/60 backdrop-blur-md p-3.5 rounded-xl border border-slate-800/80 text-center shrink-0">
            <div class="px-2">
              <div class="text-xs text-slate-400 font-medium">สัญญาเช่า</div>
              <div class="text-lg font-extrabold text-white mt-0.5">{{ tenant.leaseContracts?.length || 0 }}</div>
            </div>
            <div class="px-2 border-x border-slate-800">
              <div class="text-xs text-slate-400 font-medium">ประวัติบิล</div>
              <div class="text-lg font-extrabold text-white mt-0.5">{{ tenant.invoices?.length || 0 }}</div>
            </div>
            <div class="px-2">
              <div class="text-xs text-slate-400 font-medium">แจ้งซ่อม</div>
              <div class="text-lg font-extrabold text-white mt-0.5">{{ tenant.maintenanceRequests?.length || 0 }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs Component Layout -->
      <Tabs v-model="activeTab" class="w-full">
        <!-- Tabs Trigger List Navigation -->
        <Card class="p-2">
          <TabsList class="flex items-center gap-2 bg-slate-100 p-1 rounded-xl w-full">
            <TabsTrigger value="overview" class="flex-1 py-2.5 text-xs sm:text-sm font-bold flex items-center justify-center gap-2">
              <FileText class="w-4 h-4" />
              <span>ภาพรวม & สัญญาเช่า</span>
            </TabsTrigger>

            <TabsTrigger value="billing" class="flex-1 py-2.5 text-xs sm:text-sm font-bold flex items-center justify-center gap-2">
              <Receipt class="w-4 h-4" />
              <span>ประวัติการชำระเงิน</span>
              <span v-if="latePaymentsCount > 0" class="px-1.5 py-0.5 text-xs bg-rose-500 text-white rounded-full font-bold">
                {{ latePaymentsCount }}
              </span>
            </TabsTrigger>

            <TabsTrigger value="maintenance" class="flex-1 py-2.5 text-xs sm:text-sm font-bold flex items-center justify-center gap-2">
              <Wrench class="w-4 h-4" />
              <span>ประวัติแจ้งซ่อม</span>
              <span v-if="pendingMaintenanceCount > 0" class="px-1.5 py-0.5 text-xs bg-amber-500 text-white rounded-full font-bold">
                {{ pendingMaintenanceCount }}
              </span>
            </TabsTrigger>

            <TabsTrigger value="security" class="flex-1 py-2.5 text-xs sm:text-sm font-bold flex items-center justify-center gap-2">
              <ShieldCheck class="w-4 h-4" />
              <span>การเข้าถึง & ความปลอดภัย</span>
            </TabsTrigger>
          </TabsList>
        </Card>

        <!-- TAB 1: ภาพรวม & สัญญาเช่า (Overview & Leases) -->
        <TabsContent value="overview">
          <TenantOverviewTab
            :tenant="tenant"
            :can-manage-notes="canManageNotes"
            @notes-saved="handleNotesSaved"
          />
        </TabsContent>

        <!-- TAB 2: ประวัติการชำระเงิน (Billing Behavior) -->
        <TabsContent value="billing">
          <TenantBillingTab
            :tenant="tenant"
            :total-paid-amount="totalPaidAmount"
            :outstanding-balance="outstandingBalance"
            :late-payments-count="latePaymentsCount"
          />
        </TabsContent>

        <!-- TAB 3: ประวัติแจ้งซ่อม (Maintenance Log) -->
        <TabsContent value="maintenance">
          <TenantMaintenanceTab
            :tenant="tenant"
            :resolved-maintenance-count="resolvedMaintenanceCount"
            :pending-maintenance-count="pendingMaintenanceCount"
            :total-repair-cost="totalRepairCost"
          />
        </TabsContent>

        <!-- TAB 4: การเข้าถึงและความปลอดภัย (App Access & Security) -->
        <TabsContent value="security">
          <TenantSecurityTab :tenant="tenant" @updated="handleSecurityUpdated" />
        </TabsContent>
      </Tabs>
    </div>

    <!-- LINE Account Linking Modal for Existing Tenant -->
    <LineAccountLinkModal ref="lineLinkModalRef" :tenant="tenant" :tenant-id="tenantId" />
  </div>
</template>

<script setup>
import {
  User,
  RefreshCw,
  AlertCircle,
  MessageSquare,
  Globe,
  Phone,
  CreditCard,
  FileText,
  Receipt,
  Wrench,
  ShieldCheck,
  ArrowLeft
} from 'lucide-vue-next';
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import tenantService from '@/services/tenantService';
import { useAuthStore } from '@/stores/auth';
import { useBuildingStore } from '@/stores/useBuildingStore';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import TenantSecurityTab from '@/components/TenantSecurityTab.vue';
import TenantOverviewTab from '@/components/tenant/TenantOverviewTab.vue';
import TenantBillingTab from '@/components/tenant/TenantBillingTab.vue';
import TenantMaintenanceTab from '@/components/tenant/TenantMaintenanceTab.vue';
import LineAccountLinkModal from '@/components/tenant/LineAccountLinkModal.vue';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const buildingStore = useBuildingStore();

const tenantId = computed(() => route.params.id || route.params.tenantId);

const handleSecurityUpdated = (updatedTenant) => {
  if (tenant.value && updatedTenant) {
    Object.assign(tenant.value, updatedTenant);
  }
};

const handleNotesSaved = ({ internalNotes, isBlacklisted }) => {
  if (tenant.value) {
    tenant.value.internalNotes = internalNotes;
    tenant.value.isBlacklisted = isBlacklisted;
  }
};

const loading = ref(true);
const error = ref(null);
const tenant = ref(null);
const activeTab = ref('overview');
const lineLinkModalRef = ref(null);

// Check Security & RBAC permission for internal notes (OWNER / MANAGER / ADMIN)
const userRole = computed(() => {
  return (authStore.user?.role || authStore.currentUser?.role || 'tenant').toLowerCase();
});

const canManageNotes = computed(() => {
  return ['owner', 'manager', 'super_admin', 'superadmin', 'admin'].includes(userRole.value);
});

// Computed Statuses
const isLineConnected = computed(() => {
  return !!tenant.value?.lineUserId;
});

const hasSetPin = computed(() => {
  return !!tenant.value?.pinHash;
});

const isCurrentlyRenting = computed(() => {
  if (!tenant.value?.leaseContracts) return false;
  return tenant.value.leaseContracts.some((l) => l.status === 'ACTIVE');
});

const activeRoomsList = computed(() => {
  if (!tenant.value?.rooms) return [];
  return tenant.value.rooms;
});

// Billing Statistics
const totalPaidAmount = computed(() => {
  if (!tenant.value?.invoices) return 0;
  return tenant.value.invoices
    .filter((inv) => inv.status === 'paid')
    .reduce((sum, inv) => sum + Number(inv.grandTotal || 0), 0);
});

const outstandingBalance = computed(() => {
  if (!tenant.value?.invoices) return 0;
  return tenant.value.invoices
    .filter((inv) => inv.status === 'pending' || inv.status === 'overdue')
    .reduce((sum, inv) => sum + Number(inv.grandTotal || 0), 0);
});

const latePaymentsCount = computed(() => {
  if (!tenant.value?.invoices) return 0;
  return tenant.value.invoices.filter((inv) => {
    if (inv.status === 'overdue') return true;
    if (inv.status === 'paid' && inv.paidAt && inv.dueDate) {
      const paidDate = new Date(inv.paidAt);
      const dueDate = new Date(inv.dueDate);
      return paidDate > dueDate;
    }
    return false;
  }).length;
});

// Maintenance Statistics
const resolvedMaintenanceCount = computed(() => {
  if (!tenant.value?.maintenanceRequests) return 0;
  return tenant.value.maintenanceRequests.filter((m) => m.status === 'resolved').length;
});

const pendingMaintenanceCount = computed(() => {
  if (!tenant.value?.maintenanceRequests) return 0;
  return tenant.value.maintenanceRequests.filter((m) => m.status === 'pending' || m.status === 'in_progress').length;
});

const totalRepairCost = computed(() => {
  if (!tenant.value?.maintenanceRequests) return 0;
  return tenant.value.maintenanceRequests.reduce((sum, m) => sum + Number(m.repairCost || 0), 0);
});

// Lifecycle hook
onMounted(() => {
  loadTenantData();
});

// Watch active building changes to reload
watch(
  () => buildingStore.activeBuildingId,
  () => {
    loadTenantData();
  }
);

// Methods
const loadTenantData = async () => {
  if (!tenantId.value) {
    error.value = 'ไม่พบรหัสผู้เช่าใน URL';
    loading.value = false;
    return;
  }

  loading.value = true;
  error.value = null;

  try {
    const params = {};
    if (buildingStore.activeBuildingId) {
      params.buildingId = buildingStore.activeBuildingId;
    }
    const res = await tenantService.getTenantDetail(tenantId.value, params);
    if (res.success && res.data) {
      tenant.value = res.data;
    } else {
      error.value = res.message || 'ไม่สามารถโหลดข้อมูลผู้เช่าได้';
    }
  } catch (err) {
    console.error('Error fetching tenant profile:', err);
    error.value = err.response?.data?.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูลผู้เช่า';
  } finally {
    loading.value = false;
  }
};

const goBack = () => {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push('/tenants');
  }
};
</script>
