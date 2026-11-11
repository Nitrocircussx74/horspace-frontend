<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="max-w-md p-0 overflow-hidden no-print">
      <div class="px-6 py-4 bg-gradient-to-r from-emerald-800 to-teal-800 text-white">
        <DialogHeader class="pr-6">
          <DialogTitle class="text-white flex items-center gap-2">
            <Banknote class="w-5 h-5" />
            <span>บันทึกรับชำระเงิน (Record Payment)</span>
          </DialogTitle>
        </DialogHeader>
      </div>

      <form @submit.prevent="emit('submit')" class="p-6 space-y-4">
        <div class="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-center space-y-1">
          <div class="text-xs font-bold text-emerald-800 uppercase tracking-wider">ยอดเงินที่ต้องรับชำระ (Total Payable)</div>
          <div class="text-3xl font-black text-emerald-700 font-mono">
            ฿{{ Number(invoice?.grandTotal || 0).toLocaleString() }}
          </div>
          <div class="text-xs text-slate-600 font-medium">
            ห้อง {{ invoice?.room?.roomNumber }} | รอบบิล {{ invoice?.billingCycle }}
          </div>
        </div>

        <div>
          <label for="invoice-payment-method" class="block text-xs font-bold text-slate-700 mb-1">ช่องทางการชำระเงิน (Payment Method)</label>
          <Select
            id="invoice-payment-method"
            :model-value="paymentMethod"
            @update:model-value="emit('update:paymentMethod', $event)"
            required
            class="font-bold"
          >
            <option value="CASH">เงินสดผ่านเคาน์เตอร์ (Cash)</option>
            <option value="PROMPTPAY">พร้อมเพย์ / สแกน QR (PromptPay)</option>
            <option value="BANK_TRANSFER">โอนเงินผ่านบัญชีธนาคาร (Bank Transfer)</option>
          </Select>
        </div>

        <div>
          <label for="invoice-payment-note" class="block text-xs font-bold text-slate-700 mb-1">หมายเหตุการชำระเงิน (Payment Note - Optional)</label>
          <Input
            id="invoice-payment-note"
            :model-value="note"
            @update:model-value="emit('update:note', $event)"
            type="text"
            placeholder="เช่น รับเงินสดแบงก์ 5,000 บาท ทอน 200 บาท"
          />
        </div>

        <DialogFooter class="pt-3">
          <Button
            type="button"
            variant="outline"
            class="flex-1"
            @click="emit('update:open', false)"
          >
            ยกเลิก
          </Button>
          <Button
            type="submit"
            :disabled="recording"
            class="flex-1 bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20"
          >
            <CheckCircle2 class="w-4 h-4" />
            <span>{{ recording ? 'กำลังบันทึก...' : 'บันทึกรับเงิน' }}</span>
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>

<script setup>
import { CheckCircle2, Banknote } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

defineProps({
  open: { type: Boolean, default: false },
  invoice: { type: Object, default: null },
  paymentMethod: { type: String, default: 'CASH' },
  note: { type: String, default: '' },
  recording: { type: Boolean, default: false }
});

const emit = defineEmits(['update:open', 'update:paymentMethod', 'update:note', 'submit']);
</script>
