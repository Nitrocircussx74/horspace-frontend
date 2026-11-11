<template>
  <Dialog :open="isOpen" @update:open="isOpen = $event">
    <DialogContent class="max-w-md space-y-5">
      <div class="text-center space-y-2">
        <div class="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-2xs">
          <MessageSquare class="w-6 h-6" />
        </div>
        <h3 class="text-lg font-extrabold text-slate-900 tracking-tight">เชื่อมต่อบัญชี LINE ให้ผู้เช่า</h3>
        <p class="text-xs text-slate-500">
          ผู้เช่า: <span class="font-bold text-slate-800">{{ tenant?.firstName }} {{ tenant?.lastName }}</span>
        </p>
      </div>

      <div v-if="loadingInvite" class="py-12 text-center text-slate-500 space-y-2">
        <div class="animate-spin w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full mx-auto"></div>
        <div class="text-xs">กำลังสร้างรหัสเชื่อมต่อ...</div>
      </div>

      <div v-else class="space-y-4">
        <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center space-y-2">
          <div class="text-xs font-bold text-slate-500 uppercase">รหัสเชิญ 6 หลัก (Invite Code)</div>
          <div class="text-3xl font-black font-mono tracking-widest text-emerald-600">
            {{ generatedInviteCode }}
          </div>
          <div class="text-xs text-slate-400">
            หมดอายุใน 7 วัน (ใช้คู่กับเบอร์โทรศัพท์ 4 ตัวท้าย: <span class="font-mono font-bold text-slate-700">{{ (tenant?.phone || '').slice(-4) }}</span>)
          </div>
        </div>

        <div v-if="qrCodeDataUrl" class="text-center space-y-2">
          <div class="text-xs font-bold text-slate-600">หรือให้ลูกบ้านสแกน QR Code เพื่อเปิด LINE LIFF:</div>
          <img :src="qrCodeDataUrl" alt="LINE Onboarding QR" class="w-48 h-48 mx-auto rounded-xl border border-slate-200 shadow-xs" />
        </div>

        <div class="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 space-y-1">
          <div class="font-bold">วิธีการเชื่อมต่อสำหรับลูกบ้าน:</div>
          <ol class="list-decimal pl-4 space-y-0.5 text-emerald-800">
            <li>เปิด LINE ของหอพัก และเข้าเมนู "ผูกบัญชีลูกบ้าน"</li>
            <li>กรอกรหัส 6 หลัก และเบอร์โทร 4 ตัวท้าย</li>
            <li>ระบบจะเชื่อมข้อมูลห้องพักและบิลเข้า LINE ทันที</li>
          </ol>
        </div>

        <Button class="w-full bg-slate-900 hover:bg-slate-800" @click="isOpen = false">
          ปิดหน้าต่าง (Close)
        </Button>
      </div>
    </DialogContent>
  </Dialog>
</template>

<script setup>
import { ref } from 'vue';
import { MessageSquare } from 'lucide-vue-next';
import QRCode from 'qrcode';
import { showError } from '@/utils/swal';
import tenantService from '@/services/tenantService';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';

const props = defineProps({
  tenant: { type: Object, default: null },
  tenantId: { type: [String, Number], required: true }
});

const isOpen = ref(false);
const loadingInvite = ref(false);
const generatedInviteCode = ref('');
const qrCodeDataUrl = ref('');

const open = async () => {
  isOpen.value = true;
  loadingInvite.value = true;
  try {
    const res = await tenantService.generateTenantInvite(props.tenantId);
    if (res.success && res.data) {
      generatedInviteCode.value = res.data.inviteCode;
      // Generate QR Code containing LIFF Onboarding URL with prefilled code
      // ต้องใช้ https://liff.line.me/{LIFF_ID}/... (ไม่ใช่ window.location.origin) มิฉะนั้นสแกนแล้วจะเปิดเป็นเว็บปกติ
      // ไม่ใช่แอป LIFF ใน LINE — เหมือน pattern เดียวกับ router/index.js, utils/liff.js และ TenantSecurityTab.vue
      const liffId = import.meta.env.VITE_LINE_LIFF_ID || import.meta.env.VITE_LIFF_ID || '';
      const liffUrl = liffId
        ? `https://liff.line.me/${liffId}/onboarding?code=${res.data.inviteCode}`
        : `${window.location.origin}/liff/onboarding?code=${res.data.inviteCode}`;
      qrCodeDataUrl.value = await QRCode.toDataURL(liffUrl, {
        width: 300,
        margin: 2,
        color: { dark: '#065f46', light: '#ffffff' }
      });
    }
  } catch (err) {
    console.error('Failed to generate invite code for LINE linking:', err);
    showError('เกิดข้อผิดพลาด', err.response?.data?.message || 'ไม่สามารถสร้างรหัสเชื่อมต่อ LINE ได้');
    isOpen.value = false;
  } finally {
    loadingInvite.value = false;
  }
};

defineExpose({ open });
</script>
