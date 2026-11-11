<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <!-- Left 2 Cols: Tenancy History & Rooms -->
    <div class="lg:col-span-2 space-y-6">
      <Card class="p-6 space-y-4">
        <div class="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 class="text-base font-bold text-slate-900 flex items-center gap-2">
              <Home class="w-4 h-4" />
              <span>ประวัติการอยู่อาศัย & สัญญาเช่า (Lease History)</span>
            </h3>
            <p class="text-xs text-slate-500">
              แสดงรายการห้องพักที่เคยเช่าตั้งแต่วันเริ่มต้นสัญญาจนถึงปัจจุบัน
            </p>
          </div>
          <span class="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            ทั้งหมด {{ tenant.leaseContracts?.length || 0 }} สัญญา
          </span>
        </div>

        <!-- Empty Leases List -->
        <div v-if="!tenant.leaseContracts || tenant.leaseContracts.length === 0" class="p-8 text-center bg-slate-50 rounded-xl border border-slate-200/60 text-slate-400 space-y-1">
          <div class="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mx-auto text-slate-400 mb-2"><FileText class="w-6 h-6" /></div>
          <div class="text-xs font-bold text-slate-600">ยังไม่มีบันทึกสัญญาเช่า</div>
          <p class="text-xs">ผู้เช่าคนนี้ยังไม่มีประวัติเปิดสัญญาเช่าอย่างเป็นทางการในระบบ</p>
        </div>

        <!-- Leases Timeline List -->
        <div v-else class="space-y-4">
          <div
            v-for="lease in tenant.leaseContracts"
            :key="lease.id"
            class="p-5 rounded-xl border transition-all space-y-3"
            :class="lease.status === 'ACTIVE' ? 'bg-cyan-50/40 border-cyan-200 shadow-2xs' : 'bg-slate-50/60 border-slate-200'"
          >
            <!-- Lease Item Header -->
            <div class="flex flex-wrap items-center justify-between gap-2">
              <div class="flex items-center gap-2.5">
                <div
                  class="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-2xs"
                  :class="lease.status === 'ACTIVE' ? 'bg-cyan-600 text-white' : 'bg-slate-200 text-slate-700'"
                >
                  <Home class="w-5 h-5" />
                </div>
                <div>
                  <div class="text-sm font-bold text-slate-900">
                    {{ lease.building?.name || lease.room?.building?.name || 'อาคาร' }} - ห้อง {{ lease.room?.roomNumber || '-' }}
                  </div>
                  <div class="text-xs text-slate-500">
                    ชั้น {{ lease.room?.floor || '-' }} • ค่าเช่า {{ formatCurrency(lease.room?.price) }}/เดือน
                  </div>
                </div>
              </div>

              <!-- Lease Status Badge -->
              <Badge :variant="lease.status === 'ACTIVE' ? 'success' : lease.status === 'CANCELLED' ? 'danger' : 'neutral'">
                {{ lease.status === 'ACTIVE' ? 'กำลังพักอาศัย' : lease.status === 'ENDED' ? 'ย้ายออกแล้ว' : 'ยกเลิกสัญญา' }}
              </Badge>
            </div>

            <!-- Dates & Deposit Info -->
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-white p-3 rounded-xl border border-slate-200/80 text-xs">
              <div>
                <span class="text-slate-400 block text-xs">วันเริ่มสัญญา:</span>
                <span class="font-bold text-slate-800">{{ formatDate(lease.startDate) }}</span>
              </div>

              <div>
                <span class="text-slate-400 block text-xs">วันสิ้นสุดสัญญา:</span>
                <span class="font-bold text-slate-800">
                  {{ lease.actualEndDate ? formatDate(lease.actualEndDate) : formatDate(lease.expectedEndDate) }}
                  <span v-if="lease.status === 'ACTIVE'" class="text-cyan-600 font-normal"> (ปัจจุบัน)</span>
                </span>
              </div>

              <div class="col-span-2 sm:col-span-1">
                <span class="text-slate-400 block text-xs">เงินประกัน/มัดจำ:</span>
                <span class="font-bold text-cyan-700">{{ formatCurrency(lease.depositAmount) }}</span>
              </div>
            </div>

            <!-- Move Out Reason & Record Details if present -->
            <div v-if="lease.moveOutReason || lease.moveOutRecord" class="p-3 bg-amber-50/80 border border-amber-200/80 rounded-xl text-xs space-y-1 text-amber-900">
              <div v-if="lease.moveOutReason" class="font-medium">
                <span class="font-bold">เหตุผลที่ย้ายออก:</span> {{ lease.moveOutReason }}
              </div>

              <div v-if="lease.moveOutRecord" class="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-amber-200/60 text-xs">
                <span>ยอดคืนมัดจำสุทธิ: <strong>{{ formatCurrency(lease.moveOutRecord.netRefund) }}</strong></span>
                <span class="px-2 py-0.5 rounded-md bg-amber-200/60 font-bold">
                  สถานะคืนเงิน: {{ lease.moveOutRecord.refundStatus === 'PAID' ? 'ชำระคืนเรียบร้อย' : 'รอคืนเงิน' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>

    <!-- Right 1 Col: Internal Notes Box (RBAC Controlled for OWNER / MANAGER) -->
    <div class="space-y-6">
      <Card class="p-6 space-y-4">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 class="text-base font-bold text-slate-900 flex items-center gap-2">
            <Lock class="w-4 h-4" />
            <span>บันทึกภายใน (Internal Notes)</span>
          </h3>
          <span
            class="text-xs font-extrabold px-2.5 py-1 rounded-md uppercase"
            :class="canManageNotes ? 'bg-cyan-100 text-cyan-800' : 'bg-slate-100 text-slate-500'"
          >
            {{ canManageNotes ? 'OWNER / MANAGER ONLY' : 'READ ONLY' }}
          </span>
        </div>

        <p class="text-xs text-slate-500">
          บันทึกพฤติกรรม ข้อสังเกต หรือสัญลักษณ์แจ้งเตือนเฉพาะกลุ่มผู้บริหารและแอดมิน (ลูกบ้านจะไม่เห็นข้อมูลนี้)
        </p>

        <!-- Blacklist Flag Checkbox Toggle -->
        <div
          class="p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3"
          :class="notesForm.isBlacklisted ? 'bg-rose-50 border-rose-300' : 'bg-slate-50 border-slate-200'"
        >
          <div class="flex items-center gap-2.5">
            <input
              id="blacklist-toggle"
              type="checkbox"
              v-model="notesForm.isBlacklisted"
              :disabled="!canManageNotes || savingNotes"
              class="w-4 h-4 text-rose-600 rounded-md border-slate-300 focus:ring-rose-500 cursor-pointer disabled:cursor-not-allowed"
            />
            <label for="blacklist-toggle" class="text-xs font-bold text-slate-800 cursor-pointer select-none">
              กำหนดสถานะ Blacklist (ติดแบล็กลิสต์)
            </label>
          </div>
          <span v-if="notesForm.isBlacklisted" class="text-xs font-extrabold text-rose-600 bg-rose-100 px-2 py-0.5 rounded-md">
            ความเสี่ยงสูง
          </span>
        </div>

        <!-- Textarea Internal Notes -->
        <div class="space-y-1.5">
          <label for="tenant-internal-notes" class="text-xs font-bold text-slate-700">ข้อความบันทึกภายในเพิ่มเติม:</label>
          <textarea
            id="tenant-internal-notes"
            v-model="notesForm.internalNotes"
            rows="6"
            :disabled="!canManageNotes || savingNotes"
            placeholder="พิมพ์บันทึกภายใน เช่น จ่ายค่าเช่าตรงเวลา, มักขอผ่อนผันค่าน้ำไฟ, มีเสียงดังรบกวนห้องข้างเคียง..."
            class="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 disabled:bg-slate-100 disabled:text-slate-500"
          ></textarea>
        </div>

        <!-- Action Save Button for Authorized Admin -->
        <Button v-if="canManageNotes" class="w-full" :disabled="savingNotes" @click="saveInternalNotes">
          <span v-if="savingNotes" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          <span>{{ savingNotes ? 'กำลังบันทึก...' : 'บันทึกข้อมูลภายใน' }}</span>
        </Button>

        <!-- Restricted Access Alert Notice -->
        <div v-else class="p-3 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-600 flex items-center gap-2">
          <span>ℹ️</span>
          <span>คุณมีสิทธิ์อ่านเท่านั้น (เฉพาะ Role OWNER หรือ MANAGER ที่แก้ไขได้)</span>
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { Home, FileText, Lock } from 'lucide-vue-next';
import { showSuccess, showError } from '@/utils/swal';
import tenantService from '@/services/tenantService';
import { formatShortDate as formatDate, formatCurrency } from '@/utils/formatters';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const props = defineProps({
  tenant: { type: Object, required: true },
  canManageNotes: { type: Boolean, default: false }
});

const emit = defineEmits(['notes-saved']);

const savingNotes = ref(false);
const notesForm = ref({
  internalNotes: props.tenant.internalNotes || '',
  isBlacklisted: Boolean(props.tenant.isBlacklisted)
});

// tenant โหลดใหม่ได้ (เช่นสลับตึก) ต้อง sync ฟอร์มตามข้อมูลล่าสุดเสมอ
watch(
  () => props.tenant,
  (newTenant) => {
    notesForm.value = {
      internalNotes: newTenant.internalNotes || '',
      isBlacklisted: Boolean(newTenant.isBlacklisted)
    };
  }
);

const saveInternalNotes = async () => {
  if (!props.canManageNotes) {
    showError('ไม่มีสิทธิ์ดำเนินการ', 'เฉพาะสิทธิ์ OWNER หรือ MANAGER เท่านั้นที่สามารถบันทึกได้');
    return;
  }

  savingNotes.value = true;

  try {
    const res = await tenantService.updateTenantNotes(props.tenant.id, {
      internalNotes: notesForm.value.internalNotes,
      isBlacklisted: notesForm.value.isBlacklisted
    });

    if (res.success) {
      emit('notes-saved', {
        internalNotes: notesForm.value.internalNotes,
        isBlacklisted: notesForm.value.isBlacklisted
      });
      showSuccess('บันทึกสำเร็จ', 'อัปเดตบันทึกภายในและสถานะผู้เช่าเรียบร้อยแล้ว');
    }
  } catch (err) {
    console.error('Failed to update internal notes:', err);
    showError('บันทึกไม่สำเร็จ', err.response?.data?.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
  } finally {
    savingNotes.value = false;
  }
};
</script>
