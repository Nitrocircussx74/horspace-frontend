<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="max-w-md p-0 overflow-hidden">
      <div class="px-6 py-4 bg-slate-900 text-white">
        <DialogHeader class="pr-6">
          <DialogTitle class="text-white">
            สลิปโอนเงิน ห้อง {{ invoice?.room?.roomNumber }}
          </DialogTitle>
          <DialogDescription class="text-slate-300">
            ยอดตามบิล ฿{{ Number(invoice?.grandTotal || 0).toLocaleString() }} · รอบบิล {{ invoice?.billingCycle }}
          </DialogDescription>
        </DialogHeader>
      </div>

      <div class="p-6 space-y-4">
        <img
          v-if="invoice?.slipUrl"
          :src="invoice.slipUrl"
          alt="สลิปโอนเงิน"
          class="w-full max-h-[60vh] object-contain rounded-xl border border-slate-200 bg-slate-50"
        />

        <template v-if="invoice?.status === 'reviewing'">
          <p class="text-xs text-slate-500 text-center">ตรวจสอบยอดเงินให้ตรงกับบิลก่อนอนุมัติ</p>
          <div class="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              class="border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700"
              :disabled="rejecting"
              @click="emit('reject', invoice)"
            >
              <Ban class="w-3.5 h-3.5" />
              <span>ปฏิเสธ</span>
            </Button>
            <Button
              class="bg-emerald-600 hover:bg-emerald-700"
              :disabled="approving"
              @click="emit('approve', invoice)"
            >
              <CheckCircle2 class="w-3.5 h-3.5" />
              <span>{{ approving ? 'กำลังอนุมัติ...' : 'อนุมัติ' }}</span>
            </Button>
          </div>
        </template>
        <Button v-else variant="outline" class="w-full" @click="emit('update:open', false)">ปิด</Button>
      </div>
    </DialogContent>
  </Dialog>
</template>

<script setup>
import { CheckCircle2, Ban } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

defineProps({
  open: { type: Boolean, default: false },
  invoice: { type: Object, default: null },
  rejecting: { type: Boolean, default: false },
  approving: { type: Boolean, default: false }
});

const emit = defineEmits(['update:open', 'reject', 'approve']);
</script>
