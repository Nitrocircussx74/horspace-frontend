<template>
  <div class="space-y-4 pb-8 font-sans text-slate-800 selection:bg-teal-500 selection:text-white">
    <!-- 1. Header & Executive Profile Banner -->
    <div
      class="p-5 sm:p-6 text-white rounded-xl shadow-xs relative overflow-hidden transition-all duration-500"
      :style="{
        background: `linear-gradient(135deg, ${themeColor}, ${adjustBrightness(themeColor, -30)})`
      }"
    >
      <div class="flex items-start justify-between gap-3 flex-wrap sm:flex-nowrap">
        <div class="space-y-1.5 min-w-0">
          <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-xs text-xs font-bold tracking-wide border border-white/30">
            <Building2 class="w-3.5 h-3.5" />
            <span>{{ activeScopeLabel }}</span>
          </div>

          <h1 class="text-lg sm:text-xl font-black text-white truncate">
            {{ ownerDisplayName }}
          </h1>

          <div class="flex items-center gap-2 text-xs text-white/80">
            <span class="px-2 py-0.5 rounded-md bg-white/15 text-xs font-semibold uppercase tracking-wider">
              แดชบอร์ดเจ้าของตึก (Executive View)
            </span>
          </div>
        </div>

        <!-- Refresh Button & Quick Actions -->
        <div class="flex items-center gap-2 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            :disabled="dashboardStore.isLoading"
            class="rounded-xl bg-white/15 hover:bg-white/25 active:scale-95 text-white backdrop-blur-xs border border-white/20"
            title="รีเฟรชข้อมูล"
            @click="handleRefresh"
          >
            <RefreshCw class="w-4 h-4" :class="{ 'animate-spin': dashboardStore.isLoading }" />
          </Button>
        </div>
      </div>

      <!-- Building Selector Chips (สลับดูภาพรวมทุกตึก หรือเลือกเฉพาะตึกที่ดูแล) -->
      <div v-if="buildingsList.length > 0" class="mt-4 pt-3.5 border-t border-white/20 space-y-2">
        <div class="flex items-center justify-between text-xs text-white/90 font-medium">
          <div class="flex items-center gap-1.5">
            <Layers class="w-3.5 h-3.5" />
            <span>เลือกดูตึกที่ดูแล ({{ buildingsList.length }} อาคาร):</span>
          </div>
          <button
            v-if="selectedBuildingId"
            @click="selectBuilding('')"
            class="text-xs underline text-teal-200 hover:text-white cursor-pointer font-bold"
          >
            กลับสู่ภาพรวมทุกตึก
          </button>
        </div>

        <!-- Scrollable Building Pill Buttons -->
        <div class="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          <button
            @click="selectBuilding('')"
            class="px-3 py-1.5 rounded-xl font-bold text-xs shrink-0 transition-all cursor-pointer flex items-center gap-1.5"
            :class="!selectedBuildingId ? 'bg-white text-slate-900 shadow-xs' : 'bg-black/20 hover:bg-black/30 text-white/90 border border-white/15'"
          >
            <Building2 class="w-3.5 h-3.5" />
            <span>ภาพรวมทุกตึก ({{ buildingsList.length }})</span>
          </button>

          <button
            v-for="b in buildingsList"
            :key="b.id"
            @click="selectBuilding(b.id)"
            class="px-3 py-1.5 rounded-xl font-medium text-xs shrink-0 transition-all cursor-pointer flex items-center gap-1.5"
            :class="selectedBuildingId === b.id ? 'bg-white text-slate-900 font-bold shadow-xs' : 'bg-black/20 hover:bg-black/30 text-white/90 border border-white/15'"
          >
            <span>{{ b.name }}</span>
            <span v-if="b._count?.rooms || b.totalRooms" class="text-xs opacity-75 font-mono">
              ({{ b._count?.rooms || b.totalRooms }} ห้อง)
            </span>
          </button>
        </div>
      </div>

      <!-- Dual-Role & Tenant Preview Mode Switcher Bar -->
      <div class="mt-3 pt-3 border-t border-white/15 flex items-center justify-between gap-3 flex-wrap">
        <div class="text-xs text-white/90 font-medium flex items-center gap-1.5">
          <ArrowRightLeft class="w-3.5 h-3.5" />
          <span>สลับบทบาทการใช้งาน:</span>
        </div>
        <div class="inline-flex p-1 rounded-xl bg-black/20 backdrop-blur-md border border-white/10 text-xs">
          <button
            class="px-3 py-1 rounded-lg font-bold text-xs transition-all bg-white text-slate-900 shadow-xs"
          >
            โหมดเจ้าของตึก
          </button>
          <button
            @click="switchToTenantView"
            class="px-3 py-1 rounded-lg font-medium text-xs text-white/80 hover:text-white transition-all cursor-pointer"
          >
            {{ authStore.isDualRole || authStore.tenant ? 'ห้องพักของฉัน (ลูกบ้าน)' : 'จำลองมุมมองลูกบ้าน (Preview)' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Active Filter Scope Indicator -->
    <div
      v-if="selectedBuildingId"
      class="px-4 py-2.5 bg-teal-50 border border-teal-200/80 rounded-xl flex items-center justify-between text-xs text-teal-950 shadow-xs"
    >
      <div class="flex items-center gap-2 min-w-0">
        <Building2 class="w-4 h-4 text-teal-700 shrink-0" />
        <span class="truncate">กำลังแสดงข้อมูลเฉพาะอาคาร: <strong class="font-bold">{{ currentBuildingName }}</strong></span>
      </div>
      <button
        @click="selectBuilding('')"
        class="shrink-0 text-teal-700 hover:text-teal-900 font-bold underline cursor-pointer text-xs"
      >
        ดูภาพรวมทั้งหมด
      </button>
    </div>

    <!-- Error Alert Banner -->
    <div v-if="dashboardStore.errorMessage" class="p-4 bg-rose-50 border border-rose-200/80 rounded-xl flex items-center justify-between text-xs text-rose-800 shadow-xs">
      <div class="flex items-center gap-2">
        <AlertCircle class="w-4 h-4 text-rose-600 shrink-0" />
        <span>{{ dashboardStore.errorMessage }}</span>
      </div>
      <button @click="handleRefresh" class="font-bold underline cursor-pointer shrink-0">
        ลองใหม่
      </button>
    </div>

    <!-- 2. Financial Overview Section -->
    <div class="space-y-2.5">
      <div class="flex items-center justify-between px-1">
        <div class="flex items-center gap-2">
          <Wallet class="w-4 h-4 text-slate-700" />
          <h2 class="text-xs font-bold text-slate-800 uppercase tracking-wider">
            สรุปการเงินรอบบิลปัจจุบัน ({{ financialData.currentCycle || 'เดือนนี้' }})
          </h2>
        </div>
        <span class="text-xs text-slate-400 font-mono">
          หน่วย: บาท
        </span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <!-- ยอดชำระแล้ว -->
        <OwnerMetricCard
          title="ยอดรับชำระแล้ว"
          :value="formatCurrency(financialData.currentTotal)"
          :subtitle="`รอบบิลก่อนหน้า: ${formatCurrency(financialData.prevTotal)}`"
          :trend="financialData.momGrowth"
          :icon="TrendingUp"
          variant="emerald"
          :loading="dashboardStore.isLoading"
        />

        <!-- ยอดค้างชำระ -->
        <OwnerMetricCard
          title="ยอดค้างชำระสะสม"
          :value="formatCurrency(debtData.totalDebt)"
          :subtitle="`ค้างชำระทั้งหมด ${debtData.debtorCount || 0} ห้อง`"
          :icon="AlertCircle"
          variant="rose"
          :loading="dashboardStore.isLoading"
        />

        <!-- อัตราการเข้าพัก -->
        <OwnerMetricCard
          title="อัตราการเข้าพัก"
          :value="`${occupancyData.occupancyRate || 0}%`"
          :subtitle="`เข้าพัก ${occupancyData.occupiedRooms || 0} จาก ${occupancyData.totalRooms || 0} ห้อง`"
          :icon="DoorOpen"
          variant="teal"
          :loading="dashboardStore.isLoading"
        />
      </div>
    </div>

    <!-- 3. Building Portfolio Summary (แสดงเฉพาะเมื่อดูภาพรวมทุกตึก) -->
    <div
      v-if="!selectedBuildingId && buildingBreakdownList.length > 0"
      class="p-4 sm:p-5 rounded-xl bg-white border border-slate-100 shadow-xs space-y-3.5"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <Building2 class="w-4 h-4 text-slate-700" />
          <h3 class="text-xs font-bold text-slate-800">
            สถานะรายอาคารที่ดูแล ({{ buildingBreakdownList.length }} ตึก)
          </h3>
        </div>
        <span class="text-xs text-slate-400">แตะเพื่อดูรายตึก</span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <div
          v-for="b in buildingBreakdownList"
          :key="b.id"
          @click="selectBuilding(b.id)"
          class="p-3.5 rounded-xl bg-slate-50 hover:bg-teal-50/50 active:scale-[0.99] border border-slate-100 hover:border-teal-300 transition-all cursor-pointer space-y-2.5"
        >
          <div class="flex items-start justify-between gap-2">
            <div class="min-w-0">
              <h4 class="font-bold text-xs text-slate-900 truncate flex items-center gap-1.5">
                <Building2 class="w-3.5 h-3.5 text-teal-600 shrink-0" />
                <span>{{ b.name }}</span>
              </h4>
              <p class="text-xs text-slate-500 font-mono">
                เข้าพัก {{ b.occupiedRooms || 0 }} / {{ b.totalRooms || 0 }} ห้อง
              </p>
            </div>
            <span
              class="shrink-0 px-2 py-0.5 rounded-lg text-xs font-black font-mono"
              :class="(b.occupancyRate || 0) >= 80 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'"
            >
              {{ b.occupancyRate || 0 }}%
            </span>
          </div>

          <!-- Progress Bar -->
          <div class="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              class="h-full bg-teal-500 rounded-full transition-all duration-500"
              :style="{ width: `${b.occupancyRate || 0}%` }"
            ></div>
          </div>

          <!-- Financial Snapshot -->
          <div class="flex items-center justify-between text-xs pt-1 border-t border-slate-200/60">
            <span class="text-slate-500">รายรับรอบนี้</span>
            <span class="font-bold text-slate-800 font-mono">
              ฿{{ formatCurrency(b.currentRevenue || 0) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 4. Occupancy Progress & Room Breakdown -->
    <div class="p-4 sm:p-5 rounded-xl bg-white border border-slate-100 shadow-xs space-y-3.5">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <DoorOpen class="w-4 h-4 text-slate-700" />
          <h3 class="text-xs font-bold text-slate-800">
            สถานะห้องพัก{{ selectedBuildingId ? ` (${currentBuildingName})` : 'ทุกตึก' }} ({{ occupancyData.totalRooms || 0 }} ห้อง)
          </h3>
        </div>
        <span class="text-xs font-black text-teal-700 font-mono">
          {{ occupancyData.occupancyRate || 0 }}% Occupied
        </span>
      </div>

      <!-- Visual Multi-segment Progress Bar -->
      <div class="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex gap-0.5">
        <div
          class="h-full bg-emerald-500 transition-all duration-500"
          :style="{ width: `${getOccupiedPercentage}%` }"
          title="มีผู้เช่าแล้ว"
        ></div>
        <div
          class="h-full bg-sky-400 transition-all duration-500"
          :style="{ width: `${getAvailablePercentage}%` }"
          title="ห้องว่างพร้อมเช่า"
        ></div>
        <div
          class="h-full bg-amber-400 transition-all duration-500"
          :style="{ width: `${getMaintenancePercentage}%` }"
          title="ห้องรอซ่อม/ปรับปรุง"
        ></div>
      </div>

      <!-- Status Legend & Room Numbers -->
      <div class="grid grid-cols-3 gap-2 pt-1">
        <div class="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100/80 text-center space-y-0.5">
          <div class="text-xs font-semibold text-emerald-800 flex items-center justify-center gap-1">
            <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>มีผู้เช่า</span>
          </div>
          <div class="text-base font-black text-emerald-900 font-mono">
            {{ occupancyData.occupiedRooms || 0 }}
          </div>
        </div>

        <div class="p-2.5 rounded-xl bg-sky-50/70 border border-sky-100/80 text-center space-y-0.5">
          <div class="text-xs font-semibold text-sky-800 flex items-center justify-center gap-1">
            <span class="w-2 h-2 rounded-full bg-sky-500"></span>
            <span>ห้องว่าง</span>
          </div>
          <div class="text-base font-black text-sky-900 font-mono">
            {{ occupancyData.availableRooms || 0 }}
          </div>
        </div>

        <div class="p-2.5 rounded-xl bg-amber-50/70 border border-amber-100/80 text-center space-y-0.5">
          <div class="text-xs font-semibold text-amber-800 flex items-center justify-center gap-1">
            <span class="w-2 h-2 rounded-full bg-amber-500"></span>
            <span>รอซ่อม/ปรับปรุง</span>
          </div>
          <div class="text-base font-black text-amber-900 font-mono">
            {{ occupancyData.maintenanceRooms || 0 }}
          </div>
        </div>
      </div>
    </div>

    <!-- 5. Urgent Action Counters & Operations (Actionable Hub) -->
    <div class="p-4 sm:p-5 rounded-xl bg-white border border-slate-100 shadow-xs space-y-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <Wrench class="w-4 h-4 text-slate-700" />
          <h3 class="text-xs font-bold text-slate-800">
            งานปฏิบัติการ & เรื่องด่วน (Action Items)
          </h3>
        </div>
        <span class="text-xs text-slate-400">แตะเพื่อจัดการทันที</span>
      </div>

      <div class="space-y-2">
        <!-- สลิปโอนเงินรอยืนยัน -->
        <div
          @click="openSlipModal"
          class="p-3 rounded-xl bg-slate-50 hover:bg-emerald-50/60 active:scale-[0.99] border border-slate-100 hover:border-emerald-300 transition-all cursor-pointer flex items-center justify-between gap-3"
        >
          <div class="flex items-center gap-2.5 min-w-0">
            <div class="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <Receipt class="w-4 h-4" />
            </div>
            <div class="min-w-0">
              <div class="text-xs font-bold text-slate-800 truncate">สลิปโอนเงินรอยืนยัน</div>
              <div class="text-xs text-slate-400">ตรวจสอบและอนุมัติการชำระเงิน</div>
            </div>
          </div>
          <div class="flex items-center gap-2 shrink-0">
            <span
              class="px-2.5 py-1 text-xs font-black rounded-lg font-mono"
              :class="pendingSlipsList.length > 0 ? 'bg-emerald-100 text-emerald-800 animate-pulse' : 'bg-slate-100 text-slate-600'"
            >
              {{ pendingSlipsList.length }} สลิป
            </span>
            <ChevronRight class="w-4 h-4 text-slate-400" />
          </div>
        </div>

        <!-- งานแจ้งซ่อมค้าง -->
        <div
          @click="openMaintenanceModal"
          class="p-3 rounded-xl bg-slate-50 hover:bg-amber-50/60 active:scale-[0.99] border border-slate-100 hover:border-amber-300 transition-all cursor-pointer flex items-center justify-between gap-3"
        >
          <div class="flex items-center gap-2.5 min-w-0">
            <div class="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <Wrench class="w-4 h-4" />
            </div>
            <div class="min-w-0">
              <div class="text-xs font-bold text-slate-800 truncate">งานแจ้งซ่อมรอดำเนินการ</div>
              <div class="text-xs text-slate-400">รายการแจ้งซ่อมที่ยังไม่ปิดงาน</div>
            </div>
          </div>
          <div class="flex items-center gap-2 shrink-0">
            <span
              class="px-2.5 py-1 text-xs font-black rounded-lg font-mono"
              :class="pendingMaintenanceList.length > 0 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'"
            >
              {{ pendingMaintenanceList.length }} รายการ
            </span>
            <ChevronRight class="w-4 h-4 text-slate-400" />
          </div>
        </div>

        <!-- สัญญาจะหมดอายุใน 30 วัน -->
        <div
          @click="openLeasesModal"
          class="p-3 rounded-xl bg-slate-50 hover:bg-blue-50/60 active:scale-[0.99] border border-slate-100 hover:border-blue-300 transition-all cursor-pointer flex items-center justify-between gap-3"
        >
          <div class="flex items-center gap-2.5 min-w-0">
            <div class="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <FileText class="w-4 h-4" />
            </div>
            <div class="min-w-0">
              <div class="text-xs font-bold text-slate-800 truncate">สัญญาเช่าใกล้หมดอายุ (30 วัน)</div>
              <div class="text-xs text-slate-400">ติดตามการต่อสัญญา/แจ้งย้ายออก</div>
            </div>
          </div>
          <div class="flex items-center gap-2 shrink-0">
            <span
              class="px-2.5 py-1 text-xs font-black rounded-lg font-mono"
              :class="expiringLeasesList.length > 0 ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-600'"
            >
              {{ expiringLeasesList.length }} สัญญา
            </span>
            <ChevronRight class="w-4 h-4 text-slate-400" />
          </div>
        </div>
      </div>
    </div>

    <!-- Modal 1: Slip Review Queue -->
    <div
      v-if="showSlipModal"
      class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 transition-all"
    >
      <div class="w-full max-w-lg bg-white rounded-t-xl sm:rounded-xl max-h-[88vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom duration-200">
        <div class="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div class="flex items-center gap-2">
            <Receipt class="w-4 h-4 text-emerald-600" />
            <h3 class="font-bold text-sm text-slate-900">
              รายการสลิปรอตรวจสอบ ({{ pendingSlipsList.length }})
            </h3>
          </div>
          <button @click="closeSlipModal" class="w-11 h-11 flex items-center justify-center rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700 cursor-pointer">
            <X class="w-4 h-4" />
          </button>
        </div>

        <div class="p-4 overflow-y-auto space-y-3 flex-1">
          <div v-if="pendingSlipsList.length === 0" class="py-12 text-center text-slate-400 space-y-2">
            <CheckCircle2 class="w-10 h-10 text-emerald-500 mx-auto opacity-80" />
            <p class="text-xs">ไม่มีสลิปที่รอการตรวจสอบในขณะนี้</p>
          </div>

          <div
            v-for="inv in pendingSlipsList"
            :key="inv.id"
            class="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 space-y-3"
          >
            <div class="flex items-start justify-between gap-2">
              <div>
                <div class="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                  <span class="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-xs font-mono font-bold">
                    ห้อง {{ inv.room?.roomNumber || 'N/A' }}
                  </span>
                  <span>{{ inv.tenant?.firstName }} {{ inv.tenant?.lastName }}</span>
                </div>
                <div class="text-xs text-slate-500 font-mono mt-0.5">
                  รอบบิล: {{ inv.billingCycle }} | เลขที่: {{ inv.invoiceNumber }}
                </div>
              </div>
              <div class="text-right">
                <div class="text-xs font-black text-slate-900 font-mono">
                  ฿{{ formatCurrency(inv.grandTotal) }}
                </div>
                <div class="text-xs text-amber-600 font-medium">
                  รอยืนยัน
                </div>
              </div>
            </div>

            <!-- Slip Image Thumbnail -->
            <div v-if="inv.slipUrl" class="relative group">
              <img
                :src="inv.slipUrl"
                alt="สลิปโอนเงิน"
                loading="lazy"
                decoding="async"
                @click="previewImage(inv.slipUrl)"
                class="w-full h-32 object-cover rounded-xl border border-slate-200 cursor-pointer hover:opacity-90 transition-all"
              />
              <div
                @click="previewImage(inv.slipUrl)"
                class="absolute bottom-2 right-2 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-xs text-white text-xs font-medium flex items-center gap-1 cursor-pointer"
              >
                <Maximize2 class="w-3 h-3" />
                <span>แตะเพื่อขยาย</span>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="grid grid-cols-2 gap-2 pt-1">
              <Button
                variant="outline"
                :disabled="isProcessingAction"
                class="border-rose-200 bg-rose-50 hover:bg-rose-100 active:scale-95 text-rose-700"
                @click="handleRejectSlip(inv)"
              >
                ขอให้ส่งสลิปใหม่
              </Button>
              <Button
                :disabled="isProcessingAction"
                class="bg-emerald-600 hover:bg-emerald-700 active:scale-95"
                @click="handleApproveSlip(inv)"
              >
                <Check class="w-3.5 h-3.5" />
                <span>อนุมัติรับชำระ</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal 2: Urgent Maintenance Action -->
    <div
      v-if="showMaintenanceModal"
      class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 transition-all"
    >
      <div class="w-full max-w-lg bg-white rounded-t-xl sm:rounded-xl max-h-[88vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom duration-200">
        <div class="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div class="flex items-center gap-2">
            <Wrench class="w-4 h-4 text-amber-600" />
            <h3 class="font-bold text-sm text-slate-900">
              งานแจ้งซ่อมรอดำเนินการ ({{ pendingMaintenanceList.length }})
            </h3>
          </div>
          <button @click="closeMaintenanceModal" class="w-11 h-11 flex items-center justify-center rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700 cursor-pointer">
            <X class="w-4 h-4" />
          </button>
        </div>

        <div class="p-4 overflow-y-auto space-y-3 flex-1">
          <div v-if="pendingMaintenanceList.length === 0" class="py-12 text-center text-slate-400 space-y-2">
            <CheckCircle2 class="w-10 h-10 text-emerald-500 mx-auto opacity-80" />
            <p class="text-xs">ไม่มีรายการแจ้งซ่อมที่ค้างอยู่</p>
          </div>

          <div
            v-for="req in pendingMaintenanceList"
            :key="req.id"
            class="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 space-y-3"
          >
            <div class="flex items-start justify-between gap-2">
              <div class="min-w-0">
                <div class="flex items-center gap-1.5">
                  <span class="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-xs font-mono font-bold">
                    ห้อง {{ req.room?.roomNumber || 'N/A' }}
                  </span>
                  <Badge :variant="req.status === 'in_progress' ? 'neutral' : 'warning'">
                    {{ req.status === 'in_progress' ? 'กำลังซ่อม' : 'รอดำเนินการ' }}
                  </Badge>
                </div>
                <h4 class="font-bold text-xs text-slate-900 mt-1 truncate">
                  {{ req.title }}
                </h4>
                <p class="text-xs text-slate-600 line-clamp-2 mt-0.5">
                  {{ req.description }}
                </p>
              </div>
            </div>

            <!-- Maintenance Photo -->
            <div v-if="req.photoUrl || req.imageUrl" class="relative group">
              <img
                :src="req.photoUrl || req.imageUrl"
                alt="รูปแจ้งซ่อม"
                loading="lazy"
                decoding="async"
                @click="previewImage(req.photoUrl || req.imageUrl)"
                class="w-full h-32 object-cover rounded-xl border border-slate-200 cursor-pointer hover:opacity-90 transition-all"
              />
            </div>

            <!-- Action Buttons -->
            <div class="flex items-center gap-2 pt-1">
              <Button
                v-if="req.status === 'pending'"
                :disabled="isProcessingAction"
                class="flex-1 bg-sky-600 hover:bg-sky-700 active:scale-95"
                @click="handleUpdateMaintenance(req, 'in_progress')"
              >
                <Clock class="w-3.5 h-3.5" />
                <span>รับเรื่อง / กำลังซ่อม</span>
              </Button>
              <Button
                :disabled="isProcessingAction"
                class="flex-1 bg-emerald-600 hover:bg-emerald-700 active:scale-95"
                @click="handleUpdateMaintenance(req, 'resolved')"
              >
                <Check class="w-3.5 h-3.5" />
                <span>ปิดงานซ่อมเสร็จสิ้น</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal 3: Expiring Leases List -->
    <div
      v-if="showLeasesModal"
      class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 transition-all"
    >
      <div class="w-full max-w-lg bg-white rounded-t-xl sm:rounded-xl max-h-[88vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom duration-200">
        <div class="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div class="flex items-center gap-2">
            <FileText class="w-4 h-4 text-blue-600" />
            <h3 class="font-bold text-sm text-slate-900">
              สัญญาเช่าใกล้หมดอายุใน 30 วัน ({{ expiringLeasesList.length }})
            </h3>
          </div>
          <button @click="closeLeasesModal" class="w-11 h-11 flex items-center justify-center rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700 cursor-pointer">
            <X class="w-4 h-4" />
          </button>
        </div>

        <div class="p-4 overflow-y-auto space-y-3 flex-1">
          <div v-if="expiringLeasesList.length === 0" class="py-12 text-center text-slate-400 space-y-2">
            <CheckCircle2 class="w-10 h-10 text-emerald-500 mx-auto opacity-80" />
            <p class="text-xs">ไม่มีสัญญาเช่าที่จะหมดอายุใน 30 วันนี้</p>
          </div>

          <div
            v-for="lease in expiringLeasesList"
            :key="lease.id"
            class="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 space-y-2.5"
          >
            <div class="flex items-start justify-between gap-2">
              <div>
                <div class="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                  <span class="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-xs font-mono font-bold">
                    ห้อง {{ lease.room?.roomNumber || 'N/A' }}
                  </span>
                  <span>{{ lease.tenant?.firstName }} {{ lease.tenant?.lastName }}</span>
                </div>
                <div class="text-xs text-slate-500 font-mono mt-0.5">
                  สิ้นสุดสัญญา: {{ formatDate(lease.expectedEndDate) }}
                </div>
              </div>

              <span class="px-2 py-0.5 rounded-lg bg-rose-100 text-rose-800 text-xs font-bold font-mono">
                เหลือ {{ getDaysRemaining(lease.expectedEndDate) }} วัน
              </span>
            </div>

            <div class="flex items-center justify-between pt-1 border-t border-slate-200/60 text-xs">
              <span class="text-slate-500 text-xs">เบอร์ติดต่อ: {{ lease.tenant?.phone || '-' }}</span>
              <a
                v-if="lease.tenant?.phone"
                :href="`tel:${lease.tenant.phone}`"
                class="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all"
              >
                <Phone class="w-3 h-3" />
                <span>โทรติดต่อ</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Full Image Preview Lightbox -->
    <div
      v-if="previewImageUrl"
      @click="previewImageUrl = ''"
      class="fixed inset-0 z-60 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 cursor-pointer"
    >
      <div class="relative max-w-full max-h-full flex flex-col items-center">
        <!-- Top Toolbar -->
        <div class="w-full flex items-center justify-between pb-3 px-1" @click.stop>
          <a
            :href="previewImageUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold backdrop-blur-md border border-white/20 transition-all cursor-pointer"
          >
            <ExternalLink class="w-3.5 h-3.5" />
            <span>เปิดภาพขนาดเต็ม</span>
          </a>

          <button
            @click.stop="previewImageUrl = ''"
            class="w-11 h-11 flex items-center justify-center rounded-full bg-white/15 hover:bg-white/25 text-white backdrop-blur-md border border-white/20 transition-all cursor-pointer"
            title="ปิด"
          >
            <X class="w-4 h-4" />
          </button>
        </div>

        <img :src="previewImageUrl" alt="รูปขยาย" class="max-w-full max-h-[82vh] object-contain rounded-xl shadow-2xl border border-white/10" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useDashboardStore } from '@/stores/useDashboardStore';
import { useBuildingStore } from '@/stores/useBuildingStore';
import { useDynamicTheme } from '@/composables/useDynamicTheme';
import invoiceService from '@/services/invoiceService';
import maintenanceService from '@/services/maintenanceService';
import { showSuccess, showError, showConfirm, showPrompt } from '@/utils/swal';
import OwnerMetricCard from '@/components/owner/OwnerMetricCard.vue';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Building2,
  RefreshCw,
  Wallet,
  TrendingUp,
  AlertCircle,
  DoorOpen,
  Wrench,
  FileText,
  ArrowRightLeft,
  Layers,
  Receipt,
  ChevronRight,
  X,
  Check,
  CheckCircle2,
  Clock,
  Maximize2,
  Phone,
  ExternalLink
} from 'lucide-vue-next';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const dashboardStore = useDashboardStore();
const buildingStore = useBuildingStore();
const { themeColor, applyTheme, adjustBrightness } = useDynamicTheme();

const selectedBuildingId = ref('');
const isProcessingAction = ref(false);

// Modals State
const showSlipModal = ref(false);
const showMaintenanceModal = ref(false);
const showLeasesModal = ref(false);
const previewImageUrl = ref('');

const ownerDisplayName = computed(() => {
  return (
    authStore.user?.name ||
    authStore.currentUser?.name ||
    authStore.tenant?.name ||
    'ผู้ดูแลหอพัก'
  );
});

const buildingsList = computed(() => {
  return buildingStore.buildings || [];
});

const buildingBreakdownList = computed(() => {
  return dashboardStore.summary?.buildingBreakdown || [];
});

const currentBuildingName = computed(() => {
  if (selectedBuildingId.value) {
    const found = buildingsList.value.find((b) => b.id === selectedBuildingId.value);
    if (found) return found.name;
  }
  return 'ภาพรวมทุกตึก';
});

const activeScopeLabel = computed(() => {
  if (selectedBuildingId.value) {
    return currentBuildingName.value;
  }
  if (buildingsList.value.length > 0) {
    return `ภาพรวมทุกตึก (${buildingsList.value.length} อาคาร)`;
  }
  return 'ภาพรวมโครงการ';
});

const financialData = computed(() => dashboardStore.summary?.financial || {});
const debtData = computed(() => dashboardStore.summary?.debt || {});
const occupancyData = computed(() => dashboardStore.summary?.occupancy || {});
const pendingSlipsList = computed(() => dashboardStore.summary?.pendingSlips || []);
const pendingMaintenanceList = computed(() => dashboardStore.summary?.pendingMaintenanceRequests || []);
const expiringLeasesList = computed(() => dashboardStore.summary?.expiringLeases || []);

const getOccupiedPercentage = computed(() => {
  const total = occupancyData.value.totalRooms || 0;
  if (!total) return 0;
  return ((occupancyData.value.occupiedRooms || 0) / total) * 100;
});

const getAvailablePercentage = computed(() => {
  const total = occupancyData.value.totalRooms || 0;
  if (!total) return 0;
  return ((occupancyData.value.availableRooms || 0) / total) * 100;
});

const getMaintenancePercentage = computed(() => {
  const total = occupancyData.value.totalRooms || 0;
  if (!total) return 0;
  return ((occupancyData.value.maintenanceRooms || 0) / total) * 100;
});

const formatCurrency = (val) => {
  if (val === undefined || val === null) return '0.00';
  return Number(val).toLocaleString('th-TH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleDateString('th-TH', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

const getDaysRemaining = (dateStr) => {
  if (!dateStr) return 0;
  const target = new Date(dateStr).getTime();
  const now = new Date().getTime();
  const diff = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
  return Math.max(0, diff);
};

const openSlipModal = () => {
  showSlipModal.value = true;
};

const closeSlipModal = () => {
  showSlipModal.value = false;
  if (route?.query?.tab === 'slips') {
    router?.replace?.({ path: '/liff/owner-dashboard' });
  }
};

const openMaintenanceModal = () => {
  showMaintenanceModal.value = true;
};

const closeMaintenanceModal = () => {
  showMaintenanceModal.value = false;
  if (route?.query?.tab === 'maintenance') {
    router?.replace?.({ path: '/liff/owner-dashboard' });
  }
};

const openLeasesModal = () => {
  showLeasesModal.value = true;
};

const closeLeasesModal = () => {
  showLeasesModal.value = false;
  if (route?.query?.tab === 'leases') {
    router?.replace?.({ path: '/liff/owner-dashboard' });
  }
};

if (route) {
  watch(
    () => route.query?.tab,
    (tab) => {
      if (tab === 'slips') {
        showSlipModal.value = true;
        showMaintenanceModal.value = false;
        showLeasesModal.value = false;
      } else if (tab === 'maintenance') {
        showMaintenanceModal.value = true;
        showSlipModal.value = false;
        showLeasesModal.value = false;
      } else if (tab === 'leases') {
        showLeasesModal.value = true;
        showSlipModal.value = false;
        showMaintenanceModal.value = false;
      }
    },
    { immediate: true }
  );
}

const previewImage = (url) => {
  if (url) {
    previewImageUrl.value = url;
  }
};

const handleApproveSlip = async (invoice) => {
  const confirm = await showConfirm(
    'ยืนยันการอนุมัติสลิป?',
    `ยืนยันยอดเงิน ฿${formatCurrency(invoice.grandTotal)} ของห้อง ${invoice.room?.roomNumber || ''}`
  );
  if (!confirm) return;

  isProcessingAction.value = true;
  try {
    await invoiceService.updateInvoiceStatus(invoice.id, { status: 'paid' });
    showSuccess('อนุมัติสลิปเรียบร้อยแล้ว');
    await dashboardStore.fetchSummary(selectedBuildingId.value || undefined);
  } catch (err) {
    showError(err.response?.data?.message || 'ไม่สามารถอนุมัติสลิปได้');
  } finally {
    isProcessingAction.value = false;
  }
};

const handleRejectSlip = async (invoice) => {
  const reason = await showPrompt(
    'ขอให้ส่งสลิปใหม่',
    `ปฏิเสธสลิปของห้อง ${invoice.room?.roomNumber || ''} (ยอด ฿${formatCurrency(invoice.grandTotal)}) และแจ้งเตือนลูกบ้าน`,
    'ระบุเหตุผล (เช่น ยอดเงินไม่ตรง, สลิปไม่ชัดเจน)'
  );
  if (reason === null) return; // User clicked Cancel

  isProcessingAction.value = true;
  try {
    await invoiceService.updateInvoiceStatus(invoice.id, {
      status: 'pending',
      rejectionReason: reason.trim() || undefined
    });
    showSuccess('ส่งคำขอสลิปใหม่ไปยังลูกบ้านเรียบร้อย');
    await dashboardStore.fetchSummary(selectedBuildingId.value || undefined);
  } catch (err) {
    showError(err.response?.data?.message || 'ไม่สามารถดำเนินการได้');
  } finally {
    isProcessingAction.value = false;
  }
};

const handleUpdateMaintenance = async (req, newStatus) => {
  const actionText = newStatus === 'resolved' ? 'ปิดงานซ่อมเสร็จสิ้น' : 'รับเรื่องเข้าดำเนินการ';
  const confirm = await showConfirm(
    `ยืนยัน${actionText}?`,
    `งาน: ${req.title} (ห้อง ${req.room?.roomNumber || ''})`
  );
  if (!confirm) return;

  isProcessingAction.value = true;
  try {
    await maintenanceService.updateMaintenanceRequest(req.id, { status: newStatus });
    showSuccess(`${actionText}เรียบร้อยแล้ว`);
    await dashboardStore.fetchSummary(selectedBuildingId.value || undefined);
  } catch (err) {
    showError(err.response?.data?.message || 'ไม่สามารถอัปเดตสถานะได้');
  } finally {
    isProcessingAction.value = false;
  }
};

const selectBuilding = async (buildingId) => {
  selectedBuildingId.value = buildingId;
  if (typeof window !== 'undefined') {
    if (buildingId) {
      localStorage.setItem('horspace_selected_building_id', buildingId);
    } else {
      localStorage.removeItem('horspace_selected_building_id');
    }
  }
  const found = buildingsList.value.find((b) => b.id === buildingId);
  if (found) {
    applyTheme(found);
  }
  await dashboardStore.fetchSummary(buildingId || undefined);
};

const handleRefresh = async () => {
  await Promise.allSettled([
    buildingStore.fetchBuildings(),
    dashboardStore.fetchSummary(selectedBuildingId.value || undefined)
  ]);
};

const switchToTenantView = () => {
  authStore.setActiveRole('tenant');
  router.push('/liff/profile');
};

onMounted(async () => {
  if (typeof window !== 'undefined') {
    const savedBuildingId = localStorage.getItem('horspace_selected_building_id');
    if (savedBuildingId) {
      selectedBuildingId.value = savedBuildingId;
    }
  }
  await Promise.allSettled([
    buildingStore.fetchBuildings(),
    dashboardStore.fetchSummary(selectedBuildingId.value || undefined)
  ]);
  if (selectedBuildingId.value) {
    const found = buildingsList.value.find((b) => b.id === selectedBuildingId.value);
    if (found) applyTheme(found);
  }
});
</script>
