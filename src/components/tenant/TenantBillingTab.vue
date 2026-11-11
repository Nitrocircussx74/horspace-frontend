<template>
  <div class="space-y-6">
    <!-- Header Summary Metrics Cards -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <!-- Metric 1: Total Paid Amount -->
      <Card class="p-5 space-y-1">
        <div class="text-xs font-bold text-slate-500 uppercase tracking-wider">ยอดรวมที่เคยจ่าย</div>
        <div class="text-xl sm:text-2xl font-extrabold text-emerald-600">{{ formatCurrency(totalPaidAmount) }}</div>
        <div class="text-xs text-slate-400">จากบิลที่ชำระเรียบร้อยแล้ว</div>
      </Card>

      <!-- Metric 2: Late Payments Count -->
      <Card class="p-5 space-y-1">
        <div class="text-xs font-bold text-slate-500 uppercase tracking-wider">จำนวนครั้งที่จ่ายช้า</div>
        <div class="text-xl sm:text-2xl font-extrabold" :class="latePaymentsCount > 0 ? 'text-rose-600' : 'text-slate-800'">
          {{ latePaymentsCount }} ครั้ง
        </div>
        <div class="text-xs text-slate-400">จ่ายหลังวันครบกำหนด หรือค้างชำระ</div>
      </Card>

      <!-- Metric 3: Total Invoices -->
      <Card class="p-5 space-y-1">
        <div class="text-xs font-bold text-slate-500 uppercase tracking-wider">จำนวนบิลทั้งหมด</div>
        <div class="text-xl sm:text-2xl font-extrabold text-cyan-700">{{ tenant.invoices?.length || 0 }} ใบ</div>
        <div class="text-xs text-slate-400">ประวัติออกบิลย้อนหลัง</div>
      </Card>

      <!-- Metric 4: Outstanding Balance -->
      <Card class="p-5 space-y-1">
        <div class="text-xs font-bold text-slate-500 uppercase tracking-wider">ยอดค้างชำระปัจจุบัน</div>
        <div class="text-xl sm:text-2xl font-extrabold" :class="outstandingBalance > 0 ? 'text-amber-600' : 'text-slate-800'">
          {{ formatCurrency(outstandingBalance) }}
        </div>
        <div class="text-xs text-slate-400">สถานะ Pending หรือ Overdue</div>
      </Card>
    </div>

    <!-- Invoices History Table Card -->
    <Card class="p-0 overflow-hidden">
      <div class="p-5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 class="text-base font-bold text-slate-900 flex items-center gap-2">
            <Receipt class="w-4 h-4" />
            <span>ตารางประวัติใบแจ้งหนี้และการชำระเงิน (Invoice Log)</span>
          </h3>
          <p class="text-xs text-slate-500">
            เรียงตามรอบบิลล่าสุดและแสดงสถานะความตรงต่อเวลาของการชำระเงิน
          </p>
        </div>
      </div>

      <!-- Empty Invoices Table -->
      <div v-if="!tenant.invoices || tenant.invoices.length === 0" class="p-12 text-center text-slate-400 space-y-2">
        <div class="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mx-auto text-slate-400 mb-2"><Receipt class="w-6 h-6" /></div>
        <div class="text-xs font-bold text-slate-600">ยังไม่มีประวัติใบแจ้งหนี้</div>
        <p class="text-xs">ไม่พบบิลค่าเช่าของผู้เช่ารายนี้ในระบบ</p>
      </div>

      <!-- Invoices Table -->
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left text-xs text-slate-700">
          <thead class="bg-slate-50 border-b border-slate-200/80 text-xs font-bold text-slate-500 uppercase">
            <tr>
              <th class="py-3.5 px-4">เลขที่บิล</th>
              <th class="py-3.5 px-4">รอบบิล</th>
              <th class="py-3.5 px-4">ห้องพัก</th>
              <th class="py-3.5 px-4">ยอดสุทธิ</th>
              <th class="py-3.5 px-4">วันครบกำหนด</th>
              <th class="py-3.5 px-4">วันที่ชำระ</th>
              <th class="py-3.5 px-4 text-center">สถานะ</th>
              <th class="py-3.5 px-4 text-right">พฤติกรรมชำระ</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="inv in tenant.invoices" :key="inv.id" class="hover:bg-slate-50/80 transition-colors">
              <td class="py-3.5 px-4 font-mono font-bold text-cyan-700">{{ inv.invoiceNumber }}</td>
              <td class="py-3.5 px-4 font-medium">{{ inv.billingCycle }}</td>
              <td class="py-3.5 px-4 font-semibold">ห้อง {{ inv.room?.roomNumber || '-' }}</td>
              <td class="py-3.5 px-4 font-extrabold text-slate-900">{{ formatCurrency(inv.grandTotal) }}</td>
              <td class="py-3.5 px-4 text-slate-500 font-mono">{{ formatDate(inv.dueDate) }}</td>
              <td class="py-3.5 px-4 font-mono">
                {{ inv.paidAt ? formatDate(inv.paidAt) : '-' }}
              </td>
              <td class="py-3.5 px-4 text-center">
                <Badge :variant="inv.status === 'paid' ? 'success' : inv.status === 'pending' ? 'warning' : 'danger'">
                  {{ inv.status === 'paid' ? 'ชำระแล้ว' : inv.status === 'pending' ? 'รอชำระ' : 'เกินกำหนด' }}
                </Badge>
              </td>
              <td class="py-3.5 px-4 text-right">
                <span v-if="getInvoicePaymentBehavior(inv).isLate" class="px-2 py-0.5 rounded-md bg-rose-100 text-rose-700 text-xs font-bold">
                  จ่ายช้า {{ getInvoicePaymentBehavior(inv).daysLate }} วัน
                </span>
                <span v-else-if="inv.status === 'paid'" class="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-xs font-semibold">
                  ตรงเวลา
                </span>
                <span v-else class="text-slate-400 text-xs italic">
                  -
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Card>
  </div>
</template>

<script setup>
import { Receipt } from 'lucide-vue-next';
import { formatShortDate as formatDate, formatCurrency } from '@/utils/formatters';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const props = defineProps({
  tenant: { type: Object, required: true },
  totalPaidAmount: { type: Number, default: 0 },
  outstandingBalance: { type: Number, default: 0 },
  latePaymentsCount: { type: Number, default: 0 }
});

const getInvoicePaymentBehavior = (inv) => {
  if (!inv) return { isLate: false, daysLate: 0 };
  if (inv.status === 'overdue') {
    const due = new Date(inv.dueDate);
    const now = new Date();
    const diffTime = Math.max(0, now - due);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return { isLate: true, daysLate: diffDays };
  }
  if (inv.status === 'paid' && inv.paidAt && inv.dueDate) {
    const paid = new Date(inv.paidAt);
    const due = new Date(inv.dueDate);
    if (paid > due) {
      const diffTime = paid - due;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return { isLate: true, daysLate: diffDays };
    }
  }
  return { isLate: false, daysLate: 0 };
};
</script>
