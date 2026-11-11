<template>
  <teleport to="body">
    <div
      v-if="open"
      id="print-modal-root"
      class="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="พรีวิวใบแจ้งหนี้และใบเสร็จ"
    >
      <Card class="w-full max-w-2xl overflow-hidden my-8 p-0 animate-in fade-in zoom-in-95 duration-150">
        <!-- Print Toolbar Bar (Hidden during window.print) -->
        <div class="px-6 py-3 bg-slate-900 text-white flex items-center justify-between no-print">
          <div class="flex items-center gap-2">
            <Printer class="w-4 h-4 text-cyan-300" />
            <span class="font-bold text-xs">พรีวิวใบแจ้งหนี้/ใบเสร็จ (Print Preview)</span>
          </div>

          <div class="flex items-center gap-2">
            <Button @click="triggerPrint" size="sm" class="bg-cyan-600 hover:bg-cyan-700">
              <Printer class="w-3.5 h-3.5" />
              <span>สั่งพิมพ์ออกเครื่องพิมพ์ (Print)</span>
            </Button>
            <Button
              @click="emit('update:open', false)"
              variant="ghost"
              size="icon"
              class="text-slate-400 hover:text-white hover:bg-transparent h-auto w-auto p-1"
              aria-label="ปิดหน้าตัวอย่าง"
              title="ปิด"
            >
              <X class="w-5 h-5" />
            </Button>
          </div>
        </div>

        <!-- Print Content Paper Box -->
        <div id="printable-receipt" class="p-8 bg-white text-slate-900 font-sans space-y-6 relative border-t-4 border-cyan-600">
          <!-- Watermark Stamp for PAID -->
          <div v-if="invoice?.status === 'paid'" class="absolute top-20 right-8 pointer-events-none opacity-20 transform rotate-[-15deg] border-4 border-emerald-600 text-emerald-700 px-6 py-2 rounded-xl font-black text-3xl uppercase tracking-widest text-center select-none">
            ชำระเงินแล้ว<br/><span class="text-lg font-bold">PAID OFFICIAL</span>
          </div>

          <!-- Document Header -->
          <div class="flex justify-between items-start border-b border-slate-200 pb-6">
            <div>
              <div class="text-xl font-black tracking-tight text-cyan-900 uppercase">
                {{ invoice?.room?.building?.name || 'หอพักสมาร์ทโดรม (Dormitory)' }}
              </div>
              <p class="text-xs text-slate-500 mt-1 font-semibold">ใบแจ้งหนี้ / ใบเสร็จรับเงิน (Invoice & Official Receipt)</p>
              <div v-if="invoice?.room?.building?.promptpayNumber" class="text-xs text-slate-600 mt-1 font-mono">
                พร้อมเพย์: {{ invoice.room.building.promptpayNumber }} ({{ invoice.room.building.promptpayName }})
              </div>
            </div>

            <div class="text-right">
              <div class="text-xs font-bold text-slate-400 uppercase">เลขที่เอกสาร / No.</div>
              <div class="text-base font-black font-mono text-cyan-900">{{ invoice?.invoiceNumber }}</div>
              <div class="text-xs text-slate-500 font-mono mt-1">วันที่ออกบิล: {{ formatDate(invoice?.createdAt) }}</div>
            </div>
          </div>

          <!-- Tenant & Room Info -->
          <div class="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <div>
              <div class="text-xs font-bold text-slate-400 uppercase">ข้อมูลผู้เช่า / Tenant Information</div>
              <div class="font-bold text-slate-900 text-sm mt-0.5">
                {{ invoice?.tenant ? `${invoice.tenant.firstName} ${invoice.tenant.lastName}` : 'ผู้เช่าห้องพัก' }}
              </div>
              <div class="text-slate-600 mt-0.5">โทร: {{ invoice?.tenant?.phone || '-' }}</div>
            </div>

            <div class="text-right">
              <div class="text-xs font-bold text-slate-400 uppercase">ห้องพัก & รอบบิล / Room & Cycle</div>
              <div class="font-extrabold text-slate-900 text-sm mt-0.5">ห้อง {{ invoice?.room?.roomNumber }}</div>
              <div class="text-cyan-700 font-bold font-mono mt-0.5">ประจำรอบบิล: {{ invoice?.billingCycle }}</div>
            </div>
          </div>

          <!-- Items Table -->
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="bg-slate-100 text-slate-700 uppercase font-bold border-b border-slate-300">
                <th class="p-3">รายการ (Description)</th>
                <th class="p-3 text-right">จำนวนเงิน (Amount)</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200 text-slate-800 font-medium">
              <tr>
                <td class="p-3">ค่าเช่าห้องพักประจำเดือน (Monthly Room Rent)</td>
                <td class="p-3 text-right font-mono font-semibold">฿{{ Number(invoice?.roomPrice || 0).toLocaleString() }}</td>
              </tr>
              <tr>
                <td class="p-3">ค่าน้ำประปา (Water Usage Fee)</td>
                <td class="p-3 text-right font-mono font-semibold">฿{{ Number(invoice?.waterTotal || 0).toLocaleString() }}</td>
              </tr>
              <tr>
                <td class="p-3">ค่าไฟฟ้า (Electricity Usage Fee)</td>
                <td class="p-3 text-right font-mono font-semibold">฿{{ Number(invoice?.electricTotal || 0).toLocaleString() }}</td>
              </tr>
              <tr v-if="Number(invoice?.commonFee) > 0">
                <td class="p-3">ค่าส่วนกลาง (Common Maintenance Fee)</td>
                <td class="p-3 text-right font-mono font-semibold">฿{{ Number(invoice?.commonFee || 0).toLocaleString() }}</td>
              </tr>
              <tr v-if="Number(invoice?.otherFee) > 0">
                <td class="p-3">
                  ค่าบริการอื่นๆ (Other Charges)
                  <span v-if="invoice?.otherFeeNote" class="text-slate-500 font-normal">({{ invoice.otherFeeNote }})</span>
                </td>
                <td class="p-3 text-right font-mono font-semibold">฿{{ Number(invoice?.otherFee || 0).toLocaleString() }}</td>
              </tr>
              <tr v-if="Number(invoice?.lateFeeCharge) > 0" class="text-rose-600 font-bold bg-rose-50/50">
                <td class="p-3">ค่าปรับชำระล่าช้า (Late Payment Penalty Fee)</td>
                <td class="p-3 text-right font-mono font-semibold">+฿{{ Number(invoice?.lateFeeCharge || 0).toLocaleString() }}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr class="border-t-2 border-slate-900 bg-slate-50 font-bold">
                <td class="p-3 text-slate-900 text-sm">ยอดเงินสุทธิทั้งสิ้น (Grand Total)</td>
                <td class="p-3 text-right font-mono text-base text-cyan-900 font-black">
                  ฿{{ Number(invoice?.grandTotal || 0).toLocaleString() }}
                </td>
              </tr>
            </tfoot>
          </table>

          <!-- Payment Status Footer -->
          <div class="pt-4 border-t border-slate-200 flex justify-between items-end text-xs">
            <div>
              <div class="text-xs text-slate-400 font-bold uppercase mb-1">สถานะการชำระเงิน</div>
              <div v-if="invoice?.status === 'paid'" class="text-emerald-700 font-bold flex items-center gap-1.5">
                <CheckCircle2 class="w-4 h-4 text-emerald-600 inline-block" />
                <span>ชำระเงินเรียบร้อยแล้ว</span>
                <Badge variant="success" class="font-extrabold font-mono">
                  {{ invoice.paymentMethod || 'CASH' }}
                </Badge>
                <span v-if="invoice.paidAt" class="text-slate-500 font-mono text-xs">({{ formatDate(invoice.paidAt) }})</span>
              </div>
              <div v-else class="text-amber-700 font-bold flex items-center gap-1.5">
                <Clock class="w-4 h-4 text-amber-600 inline-block" />
                <span>รอชำระเงิน (กำหนดชำระ: {{ formatDate(invoice?.dueDate) }})</span>
              </div>
              <div v-if="invoice?.paymentNote" class="text-slate-500 italic mt-1 text-xs">
                หมายเหตุ: {{ invoice.paymentNote }}
              </div>
            </div>

            <div class="text-center w-44 pt-4">
              <div class="border-b border-dashed border-slate-400 mb-1"></div>
              <div class="text-xs text-slate-500 font-semibold">ผู้รับเงิน / Authorized Signature</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  </teleport>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';
import { CheckCircle2, Clock, Printer, X } from 'lucide-vue-next';
import { formatDate } from '@/utils/formatters';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const props = defineProps({
  open: { type: Boolean, default: false },
  invoice: { type: Object, default: null }
});

const emit = defineEmits(['update:open']);

const triggerPrint = () => {
  window.print();
};

const handleEscapeKey = (e) => {
  if (e.key === 'Escape' && props.open) {
    emit('update:open', false);
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleEscapeKey);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleEscapeKey);
});
</script>

<style>
@media print {
  body > *:not(#print-modal-root) {
    display: none !important;
  }

  #print-modal-root {
    position: absolute !important;
    left: 0 !important;
    top: 0 !important;
    width: 100% !important;
    height: auto !important;
    background: white !important;
    padding: 0 !important;
    margin: 0 !important;
    overflow: visible !important;
  }

  #print-modal-root > div {
    max-width: 100% !important;
    border: none !important;
    box-shadow: none !important;
    margin: 0 !important;
    border-radius: 0 !important;
  }

  #printable-receipt {
    padding: 20px !important;
    border-top: none !important;
  }

  .no-print {
    display: none !important;
  }

  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
}
</style>
