<template>
  <div class="space-y-6">
    <!-- Summary Metrics Header -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <!-- Metric 1: Total Maintenance Requests -->
      <Card class="p-5 space-y-1">
        <div class="text-xs font-bold text-slate-500 uppercase tracking-wider">แจ้งซ่อมทั้งหมด</div>
        <div class="text-xl sm:text-2xl font-extrabold text-slate-900">{{ tenant.maintenanceRequests?.length || 0 }} ครั้ง</div>
        <div class="text-xs text-slate-400">ประวัติขอรับบริการซ่อม</div>
      </Card>

      <!-- Metric 2: Resolved Requests -->
      <Card class="p-5 space-y-1">
        <div class="text-xs font-bold text-slate-500 uppercase tracking-wider">ซ่อมเสร็จสิ้น</div>
        <div class="text-xl sm:text-2xl font-extrabold text-emerald-600">{{ resolvedMaintenanceCount }} รายการ</div>
        <div class="text-xs text-slate-400">สถานะ Resolved</div>
      </Card>

      <!-- Metric 3: In Progress / Pending -->
      <Card class="p-5 space-y-1">
        <div class="text-xs font-bold text-slate-500 uppercase tracking-wider">กำลังดำเนินการ</div>
        <div class="text-xl sm:text-2xl font-extrabold text-amber-600">{{ pendingMaintenanceCount }} รายการ</div>
        <div class="text-xs text-slate-400">รอดำเนินการหรือกำลังซ่อม</div>
      </Card>

      <!-- Metric 4: Total Repair Cost -->
      <Card class="p-5 space-y-1">
        <div class="text-xs font-bold text-slate-500 uppercase tracking-wider">ค่าซ่อมแซมรวม</div>
        <div class="text-xl sm:text-2xl font-extrabold text-cyan-700">{{ formatCurrency(totalRepairCost) }}</div>
        <div class="text-xs text-slate-400">รวมทุกรายการแจ้งซ่อม</div>
      </Card>
    </div>

    <!-- Maintenance Request Log Cards / List -->
    <Card class="p-6 space-y-4">
      <div class="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h3 class="text-base font-bold text-slate-900 flex items-center gap-2">
            <Wrench class="w-4 h-4" />
            <span>บันทึกการแจ้งซ่อมแซมสิ่งอำนวยความสะดวก (Maintenance Log)</span>
          </h3>
          <p class="text-xs text-slate-500">
            แสดงข้อมูลการใช้งานห้องและประวัติเรียกช่างซ่อมบำรุง
          </p>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="!tenant.maintenanceRequests || tenant.maintenanceRequests.length === 0" class="p-12 text-center text-slate-400 space-y-2">
        <div class="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mx-auto text-slate-400 mb-2"><Wrench class="w-6 h-6" /></div>
        <div class="text-xs font-bold text-slate-600">ยังไม่มีรายการแจ้งซ่อม</div>
        <p class="text-xs">ผู้เช่าคนนี้ไม่เคยส่งคำขอแจ้งซ่อมแซมสิ่งของในห้องพัก</p>
      </div>

      <!-- Maintenance Log Items -->
      <div v-else class="space-y-4">
        <div
          v-for="req in tenant.maintenanceRequests"
          :key="req.id"
          class="p-5 rounded-xl border bg-slate-50/70 border-slate-200 hover:border-cyan-300 transition-all space-y-3"
        >
          <div class="flex flex-wrap items-start justify-between gap-3">
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <span class="text-base font-bold text-slate-900">{{ req.title }}</span>
                <span class="text-xs text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                  ห้อง {{ req.room?.roomNumber || '-' }}
                </span>
              </div>
              <p class="text-xs text-slate-600 leading-relaxed">{{ req.description }}</p>
            </div>

            <!-- Status Badge -->
            <Badge :variant="req.status === 'resolved' ? 'success' : req.status === 'cancelled' ? 'neutral' : 'warning'">
              {{
                req.status === 'pending' ? 'รอดำเนินการ' :
                req.status === 'in_progress' ? 'กำลังซ่อม' :
                req.status === 'resolved' ? 'ซ่อมเสร็จสิ้น' : 'ยกเลิก'
              }}
            </Badge>
          </div>

          <!-- Details Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-white p-3 rounded-xl border border-slate-200/80 text-xs">
            <div>
              <span class="text-slate-400 block text-xs">ช่างผู้รับผิดชอบ:</span>
              <span class="font-bold text-slate-800">{{ req.technicianName || 'ยังไม่มอบหมาย' }}</span>
            </div>

            <div>
              <span class="text-slate-400 block text-xs">ค่าซ่อมแซม:</span>
              <span class="font-bold text-cyan-700">{{ formatCurrency(req.repairCost) }}</span>
            </div>

            <div v-if="Number(req.repairCost || 0) > 0">
              <span class="text-slate-400 block text-xs">ผู้รับผิดชอบค่าใช้จ่าย:</span>
              <span class="font-bold" :class="req.payer === 'TENANT' ? 'text-amber-700' : 'text-slate-800'">
                {{ req.payer === 'TENANT' ? 'ลูกบ้านจ่ายเอง' : 'นิติออกให้' }}
                <span v-if="req.payer === 'TENANT'" class="font-normal text-slate-400">
                  ({{ req.billedInvoiceId ? 'รวมในบิลแล้ว' : 'รอรวมบิลรอบถัดไป' }})
                </span>
              </span>
            </div>

            <div>
              <span class="text-slate-400 block text-xs">วันที่แจ้ง:</span>
              <span class="font-mono text-slate-700">{{ formatDate(req.createdAt) }}</span>
            </div>
          </div>

          <!-- Admin Note if present -->
          <div v-if="req.adminNote" class="p-2.5 bg-cyan-50/60 border border-cyan-200/70 rounded-xl text-xs text-cyan-900">
            <span class="font-bold">บันทึกแอดมิน/ช่าง:</span> {{ req.adminNote }}
          </div>
        </div>
      </div>
    </Card>
  </div>
</template>

<script setup>
import { Wrench } from 'lucide-vue-next';
import { formatShortDate as formatDate, formatCurrency } from '@/utils/formatters';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

defineProps({
  tenant: { type: Object, required: true },
  resolvedMaintenanceCount: { type: Number, default: 0 },
  pendingMaintenanceCount: { type: Number, default: 0 },
  totalRepairCost: { type: Number, default: 0 }
});
</script>
