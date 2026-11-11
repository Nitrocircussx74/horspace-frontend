<template>
  <Card
    @click="emit('open')"
    class="p-4 hover:shadow-md transition-all duration-200 cursor-pointer space-y-3 group"
    :class="[
      item.status === 'pending' && 'hover:border-amber-400/80 hover:-translate-y-0.5',
      item.status === 'in_progress' && 'hover:border-blue-400/80 hover:-translate-y-0.5',
      isResolved && 'bg-white/95 hover:border-emerald-400/80'
    ]"
  >
    <!-- Card Top: Category Badge + Room Pill + Time -->
    <div class="flex items-center justify-between gap-2">
      <div class="flex items-center gap-1.5 flex-wrap">
        <Badge :variant="getCategoryBadgeVariant(item.category)" class="font-bold">
          <component :is="getCategoryIcon(item.category)" class="w-3 h-3" />
          <span>{{ getCategoryLabel(item.category) }}</span>
        </Badge>

        <span class="text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200/80 font-mono flex items-center gap-1">
          <DoorClosed class="w-3 h-3" :class="isResolved ? 'text-slate-500' : 'text-cyan-600'" />
          <span>ห้อง {{ item.room?.roomNumber || '-' }}</span>
        </span>
      </div>

      <span class="text-xs text-slate-400 font-medium whitespace-nowrap flex items-center gap-0.5">
        <CheckCircle2 v-if="isResolved" class="w-3 h-3 text-emerald-500" />
        <Clock v-else class="w-3 h-3 text-slate-300" />
        <span>{{ formatRelativeTime(isResolved ? item.resolvedAt || item.createdAt : item.createdAt) }}</span>
      </span>
    </div>

    <!-- Title & Description -->
    <div class="space-y-1">
      <h4
        class="font-bold text-xs sm:text-sm transition-colors line-clamp-1"
        :class="[
          isResolved ? 'text-slate-800' : 'text-slate-900',
          item.status === 'pending' && 'group-hover:text-cyan-600',
          item.status === 'in_progress' && 'group-hover:text-blue-600',
          isResolved && 'group-hover:text-emerald-700'
        ]"
      >
        {{ item.title }}
      </h4>
      <p class="text-xs line-clamp-2 leading-relaxed whitespace-pre-line" :class="isResolved ? 'text-slate-400' : 'text-slate-500'">
        {{ item.description || 'ไม่มีรายละเอียดเพิ่มเติม' }}
      </p>
    </div>

    <!-- Image Thumbnails (pending only, matches original behavior) -->
    <div v-if="item.status === 'pending' && item.imageUrls && item.imageUrls.length > 0" class="flex items-center gap-1.5 overflow-x-auto pt-0.5">
      <img
        v-for="(img, idx) in item.imageUrls.slice(0, 3)"
        :key="idx"
        :src="resolveImageUrl(img)"
        :alt="`รูปประกอบการแจ้งซ่อม ${idx + 1}`"
        class="w-11 h-11 rounded-xl object-cover border border-slate-200/80 shrink-0 hover:opacity-90 shadow-2xs"
      />
      <span
        v-if="item.imageUrls.length > 3"
        class="w-11 h-11 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-600 flex items-center justify-center shrink-0"
      >
        +{{ item.imageUrls.length - 3 }}
      </span>
    </div>

    <!-- Technician info or Admin Note Preview (in-progress only) -->
    <div v-if="item.status === 'in_progress' && item.technicianName" class="p-2 bg-blue-50/70 rounded-xl border border-blue-100/90 text-xs text-blue-900 font-medium flex items-center gap-1.5">
      <UserCheck class="w-3.5 h-3.5 text-blue-600 shrink-0" />
      <span class="truncate"><strong>ช่าง:</strong> {{ item.technicianName }}</span>
    </div>
    <div v-else-if="item.status === 'in_progress' && item.adminNote" class="p-2 bg-slate-50 rounded-xl border-l-4 border-l-blue-500 border-y border-r border-slate-100 text-xs text-slate-700 line-clamp-2">
      <strong class="text-blue-700">ตอบแล้ว:</strong> {{ item.adminNote }}
    </div>

    <!-- Cost / Admin Note (resolved only) -->
    <div v-if="isResolved && Number(item.repairCost || 0) > 0" class="p-2 bg-emerald-50/80 rounded-xl border border-emerald-200/80 text-xs text-emerald-800 font-bold space-y-1">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-1.5">
          <Coins class="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>ค่าใช้จ่าย/ค่าซ่อม:</span>
        </div>
        <span class="font-mono text-emerald-700">฿{{ Number(item.repairCost).toLocaleString() }}</span>
      </div>
      <div class="flex items-center gap-1.5 flex-wrap">
        <Badge :variant="item.payer === 'TENANT' ? 'warning' : 'neutral'">
          {{ item.payer === 'TENANT' ? 'ลูกบ้านจ่ายเอง' : 'นิติออกให้' }}
        </Badge>
        <Badge v-if="item.payer === 'TENANT'" :variant="item.billedInvoiceId ? 'success' : 'warning'">
          {{ item.billedInvoiceId ? 'รวมในบิลแล้ว' : 'รอรวมบิลรอบถัดไป' }}
        </Badge>
      </div>
    </div>
    <div v-else-if="isResolved && item.adminNote" class="p-2 bg-emerald-50/50 rounded-xl border-l-4 border-l-emerald-500 border-y border-r border-emerald-100 text-xs text-slate-700 line-clamp-2">
      <strong class="text-emerald-800">คำตอบกลับ:</strong> {{ item.adminNote }}
    </div>

    <!-- Card Bottom Bar -->
    <div class="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
      <div class="flex items-center gap-1.5 truncate max-w-[140px]" :class="isResolved ? 'text-slate-500' : 'text-slate-600'">
        <div
          class="w-5 h-5 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold shrink-0"
          :class="isResolved ? 'text-slate-500' : 'text-slate-600'"
        >
          {{ getTenantAvatarInitial(item) }}
        </div>
        <span class="truncate font-medium text-xs" :class="isResolved ? 'text-slate-600' : 'text-slate-700'">{{ getTenantDisplayName(item) }}</span>
      </div>

      <Button
        v-if="item.status === 'pending'"
        size="sm"
        variant="outline"
        class="text-blue-700 border-blue-200 bg-blue-50 hover:bg-blue-100"
        @click.stop="emit('quick-status', 'in_progress')"
      >
        <Zap class="w-3 h-3" />
        <span>กำลังทำ</span>
      </Button>
      <Button
        v-else-if="item.status === 'in_progress'"
        size="sm"
        variant="outline"
        class="text-emerald-700 border-emerald-200 bg-emerald-50 hover:bg-emerald-100"
        @click.stop="emit('quick-status', 'resolved')"
      >
        <CheckCircle2 class="w-3 h-3" />
        <span>เสร็จสิ้น</span>
      </Button>
      <Badge v-else variant="success">
        <CheckCircle2 class="w-3 h-3" />
        <span>ปิดเรื่องแล้ว</span>
      </Badge>
    </div>
  </Card>
</template>

<script setup>
import { computed } from 'vue';
import { Clock, Zap, CheckCircle2, UserCheck, Coins, DoorClosed } from 'lucide-vue-next';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  getCategoryLabel,
  getCategoryIcon,
  getCategoryBadgeVariant,
  getTenantDisplayName,
  getTenantAvatarInitial,
  formatRelativeTime,
  resolveImageUrl
} from '@/utils/maintenanceTicket';

const props = defineProps({
  item: { type: Object, required: true }
});

const emit = defineEmits(['open', 'quick-status']);

const isResolved = computed(() => ['resolved', 'completed', 'cancelled'].includes(props.item.status));
</script>
