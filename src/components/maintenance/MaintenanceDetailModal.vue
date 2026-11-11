<template>
  <Dialog :open="!!ticket" @update:open="(val) => { if (!val) emit('close'); }">
    <DialogContent v-if="ticket" class="max-w-lg">
      <DialogHeader>
        <DialogTitle class="flex items-center gap-2 flex-wrap">
          <Badge :variant="getCategoryBadgeVariant(ticket.category)" class="font-bold">
            <component :is="getCategoryIcon(ticket.category)" class="w-3.5 h-3.5" />
            {{ getCategoryLabel(ticket.category) }}
          </Badge>
          <span class="text-xs text-cyan-700 bg-cyan-50 px-2.5 py-1 rounded-xl border border-cyan-100 font-mono font-bold flex items-center gap-1">
            <DoorClosed class="w-3.5 h-3.5 text-cyan-500" />
            ห้อง {{ ticket.room?.roomNumber || '-' }} {{ ticket.building?.name ? `(${ticket.building.name})` : '' }}
          </span>
        </DialogTitle>
      </DialogHeader>

      <!-- Tenant Information Card -->
      <div class="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs">
        <div class="flex items-center gap-2.5">
          <div class="w-9 h-9 rounded-xl bg-cyan-100 text-cyan-700 font-bold flex items-center justify-center text-xs shadow-2xs">
            {{ getTenantAvatarInitial(ticket) }}
          </div>
          <div>
            <div class="font-bold text-slate-900 text-sm">
              {{ getTenantDisplayName(ticket) }}
            </div>
            <div v-if="ticket.tenant?.phone" class="text-slate-500 font-mono text-xs flex items-center gap-1">
              <Phone class="w-3 h-3 text-slate-400" />
              <span>{{ ticket.tenant.phone }}</span>
            </div>
          </div>
        </div>

        <div class="text-right">
          <div class="text-xs text-slate-400">วันเวลาที่แจ้ง</div>
          <div class="font-mono text-slate-700 font-semibold text-xs">
            {{ formatDate(ticket.createdAt) }}
          </div>
        </div>
      </div>

      <!-- Description Details -->
      <div class="space-y-1.5">
        <label class="block text-xs font-bold text-slate-700">รายละเอียดปัญหา / เรื่องที่แจ้ง:</label>
        <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-800 leading-relaxed whitespace-pre-line">
          {{ ticket.description || 'ไม่มีรายละเอียด' }}
        </div>
      </div>

      <!-- Attached Images Gallery -->
      <div v-if="ticket.imageUrls && ticket.imageUrls.length > 0" class="space-y-1.5">
        <label class="block text-xs font-bold text-slate-700">รูปภาพประกอบ ({{ ticket.imageUrls.length }} รูป - แตะเพื่อเปิดรูปเต็ม):</label>
        <div class="grid grid-cols-3 gap-2">
          <a
            v-for="(img, idx) in ticket.imageUrls"
            :key="idx"
            :href="resolveImageUrl(img)"
            target="_blank"
            class="aspect-square rounded-xl overflow-hidden border border-slate-200 hover:opacity-90 hover:scale-[1.02] transition-all duration-200 shadow-2xs"
          >
            <img :src="resolveImageUrl(img)" alt="รูปประกอบการแจ้งซ่อม (ขยาย)" class="w-full h-full object-cover" />
          </a>
        </div>
      </div>

      <!-- Edit Form -->
      <form @submit.prevent="handleSaveTicket" class="space-y-4 pt-2 border-t border-slate-100 text-xs text-slate-700">
        <!-- Status Selector Cards (Visual Radio Pills) -->
        <div class="space-y-1.5">
          <label class="block font-bold text-slate-800">ปรับเปลี่ยนสถานะ:</label>
          <div class="grid grid-cols-3 gap-2">
            <Button
              type="button"
              variant="outline"
              @click="editForm.status = 'pending'"
              class="h-auto py-2.5 flex-col items-center gap-1 font-bold"
              :class="editForm.status === 'pending' ? 'bg-amber-50 border-amber-300 text-amber-900 ring-2 ring-amber-400/30' : 'bg-slate-50 text-slate-600'"
            >
              <span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span>รอรับเรื่อง</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              @click="editForm.status = 'in_progress'"
              class="h-auto py-2.5 flex-col items-center gap-1 font-bold"
              :class="editForm.status === 'in_progress' ? 'bg-blue-50 border-blue-300 text-blue-900 ring-2 ring-blue-400/30' : 'bg-slate-50 text-slate-600'"
            >
              <span class="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
              <span>กำลังดำเนินการ</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              @click="editForm.status = 'resolved'"
              class="h-auto py-2.5 flex-col items-center gap-1 font-bold"
              :class="editForm.status === 'resolved' ? 'bg-emerald-50 border-emerald-300 text-emerald-900 ring-2 ring-emerald-400/30' : 'bg-slate-50 text-slate-600'"
            >
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>เสร็จสิ้นแล้ว</span>
            </Button>
          </div>
        </div>

        <!-- Technician & Cost (Optional for Repairs) -->
        <div class="grid grid-cols-2 gap-3" v-if="ticket.category === 'REPAIR'">
          <div>
            <label for="maintenance-technician-name" class="block font-bold text-slate-800 mb-1">ชื่อช่างผู้รับผิดชอบ</label>
            <Input
              id="maintenance-technician-name"
              v-model="editForm.technicianName"
              type="text"
              placeholder="e.g. ช่างสมชาย"
              class="font-medium"
            />
          </div>
          <div>
            <label for="maintenance-repair-cost" class="block font-bold text-slate-800 mb-1">ค่าซ่อม/อุปกรณ์ (บาท)</label>
            <Input
              id="maintenance-repair-cost"
              v-model.number="editForm.repairCost"
              type="number"
              min="0"
              step="any"
              placeholder="0.00"
              :disabled="Boolean(ticket.billedInvoiceId)"
              class="font-bold font-mono text-emerald-700"
            />
          </div>

          <!-- ผู้รับผิดชอบค่าใช้จ่าย: นิติออกให้ (ไม่เก็บเงินลูกบ้าน) หรือลูกบ้านจ่ายเอง (รวมเข้าบิลค่าเช่ารอบถัดไปอัตโนมัติ) -->
          <div class="col-span-2 space-y-1">
            <label class="block font-bold text-slate-800 mb-1">ผู้รับผิดชอบค่าใช้จ่าย</label>
            <div class="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant="outline"
                @click="editForm.payer = 'MANAGEMENT'"
                :disabled="Boolean(ticket.billedInvoiceId)"
                class="font-bold"
                :class="editForm.payer === 'MANAGEMENT' ? 'bg-slate-800 border-slate-800 text-white hover:bg-slate-800' : 'bg-slate-50 text-slate-600'"
              >
                นิติออกให้
              </Button>
              <Button
                type="button"
                variant="outline"
                @click="editForm.payer = 'TENANT'"
                :disabled="Boolean(ticket.billedInvoiceId)"
                class="font-bold"
                :class="editForm.payer === 'TENANT' ? 'bg-amber-700 border-amber-700 text-white hover:bg-amber-700' : 'bg-slate-50 text-slate-600'"
              >
                ลูกบ้านจ่ายเอง
              </Button>
            </div>
            <p v-if="editForm.payer === 'TENANT'" class="text-xs text-amber-700 font-medium">
              ค่าซ่อมนี้จะถูกรวมเข้าบิลค่าเช่ารอบถัดไปของห้องนี้โดยอัตโนมัติเมื่อสถานะเป็น "เสร็จสิ้นแล้ว"
            </p>
            <p v-if="ticket.billedInvoiceId" class="text-xs text-emerald-700 font-medium">
              ค่าซ่อมนี้ถูกรวมเข้าบิลไปแล้ว ไม่สามารถแก้ไขค่าซ่อม/ผู้รับผิดชอบได้อีก
            </p>
          </div>
        </div>

        <!-- Admin Reply Note with Quick Suggestion Chips -->
        <div class="space-y-1.5">
          <div class="flex items-center justify-between">
            <label for="maintenance-admin-note" class="block font-bold text-slate-800">ข้อความตอบกลับลูกบ้าน (LINE LIFF Notification):</label>
          </div>

          <!-- Quick Template Chips -->
          <div class="flex items-center gap-1 overflow-x-auto pb-1 text-xs">
            <Button
              v-for="(chip, idx) in quickReplyChips"
              :key="idx"
              type="button"
              size="sm"
              variant="outline"
              @click="editForm.adminNote = chip"
              class="shrink-0 text-cyan-700 border-cyan-100 bg-cyan-50/70 hover:bg-cyan-100"
            >
              + {{ chip }}
            </Button>
          </div>

          <textarea
            id="maintenance-admin-note"
            v-model="editForm.adminNote"
            rows="3"
            placeholder="พิมพ์ข้อความตอบกลับ เช่น 'เจ้าหน้าที่รับเรื่องแล้ว กำลังส่งช่างเข้าตรวจสอบช่วงบ่ายครับ'..."
            class="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:bg-white focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 focus:outline-hidden leading-relaxed"
          ></textarea>
        </div>

        <!-- Modal Action Buttons -->
        <div class="flex items-center justify-between pt-3 border-t border-slate-100">
          <Button
            v-if="ticket.sourceType === 'maintenance'"
            type="button"
            variant="outline"
            size="sm"
            class="text-rose-600 border-rose-200 hover:bg-rose-50"
            @click="handleDelete"
          >
            <Trash2 class="w-4 h-4" />
            <span>ลบรายการ</span>
          </Button>
          <div v-else></div>

          <DialogFooter class="pt-0">
            <Button type="button" variant="outline" @click="emit('close')">ยกเลิก</Button>
            <Button type="submit" :disabled="submitting">
              {{ submitting ? 'กำลังบันทึก...' : 'บันทึก & ตอบกลับ' }}
            </Button>
          </DialogFooter>
        </div>
      </form>
    </DialogContent>
  </Dialog>
</template>

<script setup>
import { reactive, watch, ref } from 'vue';
import { DoorClosed, Phone, Trash2 } from 'lucide-vue-next';
import maintenanceService from '@/services/maintenanceService';
import api from '@/utils/api';
import { showSuccess, showError, showConfirm } from '@/utils/swal';
import { formatDateTime as formatDate } from '@/utils/formatters';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import {
  getCategoryLabel,
  getCategoryIcon,
  getCategoryBadgeVariant,
  getTenantDisplayName,
  getTenantAvatarInitial,
  resolveImageUrl
} from '@/utils/maintenanceTicket';

const props = defineProps({
  ticket: { type: Object, default: null }
});

const emit = defineEmits(['close', 'saved', 'deleted']);

const submitting = ref(false);

const quickReplyChips = [
  'เจ้าหน้าที่รับเรื่องแล้ว กำลังส่งช่างเข้าตรวจสอบครับ',
  'ช่างกำลังดำเนินการซ่อมแซมหน้างานครับ',
  'ดำเนินการแก้ไขเรียบร้อยแล้วครับ ขอบคุณครับ',
  'รับทราบข้อร้องเรียน กำลังตรวจสอบและตักเตือนให้ครับ'
];

const editForm = reactive({
  status: 'pending',
  technicianName: '',
  repairCost: 0,
  payer: 'MANAGEMENT',
  adminNote: ''
});

watch(
  () => props.ticket,
  (item) => {
    if (!item) return;
    editForm.status = item.status || 'pending';
    editForm.technicianName = item.technicianName || '';
    editForm.repairCost = item.repairCost || 0;
    editForm.payer = item.payer || 'MANAGEMENT';
    editForm.adminNote = item.adminNote || '';
  },
  { immediate: true }
);

const handleSaveTicket = async () => {
  if (!props.ticket) return;
  submitting.value = true;
  try {
    if (props.ticket.sourceType === 'maintenance') {
      await maintenanceService.updateMaintenanceRequest(props.ticket.rawId, {
        status: editForm.status.toLowerCase(),
        technicianName: editForm.technicianName,
        repairCost: editForm.repairCost,
        payer: editForm.payer,
        adminNote: editForm.adminNote
      });
    } else {
      await api.put(`/api/admin/issues/${props.ticket.rawId}`, {
        status: editForm.status.toUpperCase(),
        adminReply: editForm.adminNote
      });
    }

    showSuccess('สำเร็จ', 'บันทึกการแก้ไขและส่งข้อความตอบกลับเรียบร้อยแล้ว');
    emit('saved');
  } catch (error) {
    showError('เกิดข้อผิดพลาด', error.response?.data?.message || 'ไม่สามารถบันทึกข้อมูลได้');
  } finally {
    submitting.value = false;
  }
};

const handleDelete = async () => {
  if (!props.ticket || props.ticket.sourceType !== 'maintenance') return;
  const isConfirmed = await showConfirm(
    'ยืนยันการลบ',
    'คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้ออกจากระบบ?'
  );
  if (isConfirmed) {
    try {
      await maintenanceService.deleteMaintenanceRequest(props.ticket.rawId);
      showSuccess('สำเร็จ', 'ลบรายการเรียบร้อยแล้ว');
      emit('deleted');
    } catch (error) {
      showError('เกิดข้อผิดพลาด', 'ไม่สามารถลบรายการได้');
    }
  }
};
</script>
