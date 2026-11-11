<template>
  <div class="space-y-5 font-sans">
    <!-- Header & Action Controls -->
    <AdminPageHeader
      :icon="Kanban"
      description="ติดตามงานแจ้งซ่อม มอบหมายช่าง ตรวจสอบข้อร้องเรียน และส่งคำตอบกลับเข้า LINE ลูกบ้านได้ในที่เดียว"
    >
      <template #title>
        <span>ศูนย์รวมแจ้งซ่อม & ร้องเรียน</span>
        <span class="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-100/80 hidden sm:inline-block">
          Unified Service Board
        </span>
      </template>

      <template #actions>
        <div class="hidden xl:flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-600">
          <span class="font-bold text-slate-900">{{ unifiedTickets.length }}</span> รายการทั้งหมด
          <span class="text-slate-300">|</span>
          <span class="font-bold text-amber-600">{{ pendingList.length }}</span> รอดำเนินการ
          <span class="text-slate-300">|</span>
          <span class="font-bold text-emerald-600">{{ resolvedList.length }}</span> เสร็จสิ้น
        </div>

        <Button @click="showNewModal = true">
          <Plus class="w-4 h-4" />
          <span>สร้างใบแจ้งซ่อมใหม่</span>
        </Button>

        <Button variant="outline" @click="handleRefresh" title="รีเฟรชข้อมูล">
          <RefreshCw class="w-3.5 h-3.5" :class="{ 'animate-spin': loading }" />
          <span>รีเฟรช</span>
        </Button>
      </template>
    </AdminPageHeader>

    <!-- Filter Pills & Search Bar -->
    <Card class="p-3.5 sm:p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
      <!-- Category Filter Pills -->
      <div class="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 text-xs">
        <Button
          v-for="cat in categoryFilters"
          :key="cat.value"
          type="button"
          size="sm"
          variant="outline"
          @click="selectedCategory = cat.value"
          class="shrink-0 font-bold gap-1.5"
          :class="selectedCategory === cat.value ? 'bg-slate-900 text-white border-slate-900 hover:bg-slate-900' : 'bg-slate-50 hover:bg-slate-100 text-slate-600'"
        >
          <component :is="cat.icon" class="w-3.5 h-3.5" :class="selectedCategory === cat.value ? 'text-white' : cat.iconClass" />
          <span>{{ cat.label }}</span>
          <span
            class="px-1.5 py-0.5 rounded-md text-xs font-mono font-bold"
            :class="selectedCategory === cat.value ? 'bg-white/20 text-white' : 'bg-slate-200/80 text-slate-700'"
          >
            {{ cat.count }}
          </span>
        </Button>
      </div>

      <!-- Search Input -->
      <div class="relative min-w-[260px]">
        <Input
          v-model="searchQuery"
          type="text"
          placeholder="ค้นหาห้อง, ผู้เช่า, รายละเอียด..."
          class="pl-9 pr-8 text-xs"
        />
        <span class="absolute left-3 top-2.5 text-muted-foreground"><Search class="w-4 h-4" /></span>
        <button
          v-if="searchQuery"
          @click="searchQuery = ''"
          class="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer p-0.5"
          aria-label="ล้างคำค้นหา"
          title="ล้างคำค้นหา"
        >
          <X class="w-3.5 h-3.5" />
        </button>
      </div>
    </Card>

    <!-- Loading State -->
    <AdminLoadingState
      v-if="loading && pendingList.length === 0 && inProgressList.length === 0 && resolvedList.length === 0"
      message="กำลังโหลดรายการแจ้งซ่อม..."
    />

    <!-- Unified Kanban Board Grid (3 Independent Scrollable Columns) -->
    <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
      <!-- Column 1: Pending (รอดำเนินการ / รอรับเรื่อง) -->
      <div class="bg-slate-50/70 rounded-xl border border-slate-200/80 flex flex-col max-h-[calc(100vh-250px)] min-h-[580px] shadow-xs">
        <!-- Column Header -->
        <div class="p-4 pb-3 flex items-center justify-between border-b border-slate-200/60 bg-white/70 backdrop-blur-xs rounded-t-xl">
          <div class="flex items-center gap-2">
            <span class="relative flex h-2.5 w-2.5">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
            </span>
            <h3 class="font-bold text-slate-800 text-sm">รอรับเรื่อง</h3>
            <span class="text-slate-400 text-xs font-normal">(Pending)</span>
          </div>
          <Badge variant="warning" class="font-mono">{{ pendingList.length }}</Badge>
        </div>

        <!-- Cards Container (Scrollable) -->
        <div class="p-3.5 space-y-3 overflow-y-auto flex-1 custom-scrollbar">
          <MaintenanceTicketCard
            v-for="item in pendingList"
            :key="item.uniqueId"
            :item="item"
            @open="openDetailModal(item)"
            @quick-status="(status) => handleQuickStatusChange(item, status)"
          />

          <!-- Empty State -->
          <Card v-if="pendingList.length === 0" class="p-8 text-center border-dashed border-slate-200/80 shadow-none bg-white/70 space-y-1.5 my-2">
            <div class="w-9 h-9 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center mx-auto">
              <Sparkles class="w-4 h-4" />
            </div>
            <p class="text-xs font-bold text-slate-700">ไม่มีรายการรอดำเนินการ</p>
            <p class="text-xs text-slate-400">เมื่อมีรายการใหม่จะปรากฏที่นี่</p>
          </Card>
        </div>
      </div>

      <!-- Column 2: In Progress (กำลังดำเนินการ / ส่งช่าง) -->
      <div class="bg-slate-50/70 rounded-xl border border-slate-200/80 flex flex-col max-h-[calc(100vh-250px)] min-h-[580px] shadow-xs">
        <!-- Column Header -->
        <div class="p-4 pb-3 flex items-center justify-between border-b border-slate-200/60 bg-white/70 backdrop-blur-xs rounded-t-xl">
          <div class="flex items-center gap-2">
            <span class="relative flex h-2.5 w-2.5">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
            </span>
            <h3 class="font-bold text-slate-800 text-sm">กำลังดำเนินการ</h3>
            <span class="text-slate-400 text-xs font-normal">(In Progress)</span>
          </div>
          <Badge variant="warning" class="font-mono">{{ inProgressList.length }}</Badge>
        </div>

        <!-- Cards Container (Scrollable) -->
        <div class="p-3.5 space-y-3 overflow-y-auto flex-1 custom-scrollbar">
          <Card
            v-for="item in inProgressList"
            :key="item.uniqueId"
            @click="openDetailModal(item)"
            class="p-4 hover:shadow-md hover:border-blue-400/80 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer space-y-3 group"
          >
            <!-- Card Top -->
            <div class="flex items-center justify-between gap-2">
              <div class="flex items-center gap-1.5 flex-wrap">
                <Badge :variant="getCategoryBadgeVariant(item.category)" class="font-bold">
                  <component :is="getCategoryIcon(item.category)" class="w-3 h-3" />
                  <span>{{ getCategoryLabel(item.category) }}</span>
                </Badge>

                <span class="text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200/80 font-mono flex items-center gap-1">
                  <DoorClosed class="w-3 h-3 text-cyan-600" />
                  <span>ห้อง {{ item.room?.roomNumber || '-' }}</span>
                </span>
              </div>

              <span class="text-xs text-slate-400 font-medium whitespace-nowrap flex items-center gap-0.5">
                <Clock class="w-3 h-3 text-slate-300" />
                <span>{{ formatRelativeTime(item.createdAt) }}</span>
              </span>
            </div>

            <!-- Title & Description -->
            <div class="space-y-1">
              <h4 class="font-bold text-slate-900 text-xs sm:text-sm group-hover:text-blue-600 transition-colors line-clamp-1">
                {{ item.title }}
              </h4>
              <p class="text-xs text-slate-500 line-clamp-2 leading-relaxed whitespace-pre-line">
                {{ item.description || 'ไม่มีรายละเอียดเพิ่มเติม' }}
              </p>
            </div>

            <!-- Technician info or Admin Note Preview -->
            <div v-if="item.technicianName" class="p-2 bg-blue-50/70 rounded-xl border border-blue-100/90 text-xs text-blue-900 font-medium flex items-center gap-1.5">
              <UserCheck class="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span class="truncate"><strong>ช่าง:</strong> {{ item.technicianName }}</span>
            </div>
            <div v-else-if="item.adminNote" class="p-2 bg-slate-50 rounded-xl border-l-4 border-l-blue-500 border-y border-r border-slate-100 text-xs text-slate-700 line-clamp-2">
              <strong class="text-blue-700">ตอบแล้ว:</strong> {{ item.adminNote }}
            </div>

            <!-- Card Bottom Bar -->
            <div class="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
              <div class="flex items-center gap-1.5 truncate max-w-[140px] text-slate-600">
                <div class="w-5 h-5 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 shrink-0">
                  {{ getTenantAvatarInitial(item) }}
                </div>
                <span class="truncate font-medium text-slate-700 text-xs">{{ getTenantDisplayName(item) }}</span>
              </div>

              <Button
                size="sm"
                variant="outline"
                class="text-emerald-700 border-emerald-200 bg-emerald-50 hover:bg-emerald-100"
                @click.stop="handleQuickStatusChange(item, 'resolved')"
              >
                <CheckCircle2 class="w-3 h-3" />
                <span>เสร็จสิ้น</span>
              </Button>
            </div>
          </Card>

          <!-- Empty State -->
          <Card v-if="inProgressList.length === 0" class="p-8 text-center border-dashed border-slate-200/80 shadow-none bg-white/70 space-y-1.5 my-2">
            <div class="w-9 h-9 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center mx-auto">
              <Zap class="w-4 h-4" />
            </div>
            <p class="text-xs font-bold text-slate-700">ไม่มีรายการที่กำลังดำเนินการ</p>
            <p class="text-xs text-slate-400">กดรับเรื่องจากคอลัมน์แรกเพื่อเริ่มงาน</p>
          </Card>
        </div>
      </div>

      <!-- Column 3: Resolved (เสร็จสิ้น / ปิดเรื่องแล้ว) -->
      <div class="bg-slate-50/70 rounded-xl border border-slate-200/80 flex flex-col max-h-[calc(100vh-250px)] min-h-[580px] shadow-xs">
        <!-- Column Header -->
        <div class="p-4 pb-3 flex items-center justify-between border-b border-slate-200/60 bg-white/70 backdrop-blur-xs rounded-t-xl">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <h3 class="font-bold text-slate-800 text-sm">เสร็จสิ้นแล้ว</h3>
            <span class="text-slate-400 text-xs font-normal">(Resolved)</span>
          </div>
          <Badge variant="success" class="font-mono">{{ resolvedList.length }}</Badge>
        </div>

        <!-- Cards Container (Scrollable) -->
        <div class="p-3.5 space-y-3 overflow-y-auto flex-1 custom-scrollbar">
          <Card
            v-for="item in resolvedList"
            :key="item.uniqueId"
            @click="openDetailModal(item)"
            class="p-4 bg-white/95 hover:shadow-md hover:border-emerald-400/80 transition-all duration-200 cursor-pointer space-y-3 group"
          >
            <!-- Card Top -->
            <div class="flex items-center justify-between gap-2">
              <div class="flex items-center gap-1.5 flex-wrap">
                <Badge :variant="getCategoryBadgeVariant(item.category)" class="font-bold">
                  <component :is="getCategoryIcon(item.category)" class="w-3 h-3" />
                  <span>{{ getCategoryLabel(item.category) }}</span>
                </Badge>

                <span class="text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200/80 font-mono flex items-center gap-1">
                  <DoorClosed class="w-3 h-3 text-slate-500" />
                  <span>ห้อง {{ item.room?.roomNumber || '-' }}</span>
                </span>
              </div>

              <span class="text-xs text-slate-400 font-medium whitespace-nowrap flex items-center gap-0.5">
                <CheckCircle2 class="w-3 h-3 text-emerald-500" />
                <span>{{ formatRelativeTime(item.resolvedAt || item.createdAt) }}</span>
              </span>
            </div>

            <!-- Title & Description (Clean & Modern typography without harsh strikethrough) -->
            <div class="space-y-1">
              <h4 class="font-bold text-slate-800 text-xs sm:text-sm group-hover:text-emerald-700 transition-colors line-clamp-1">
                {{ item.title }}
              </h4>
              <p class="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                {{ item.description || 'ไม่มีรายละเอียดเพิ่มเติม' }}
              </p>
            </div>

            <!-- Cost / Admin Note -->
            <div v-if="Number(item.repairCost || 0) > 0" class="p-2 bg-emerald-50/80 rounded-xl border border-emerald-200/80 text-xs text-emerald-800 font-bold space-y-1">
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
            <div v-else-if="item.adminNote" class="p-2 bg-emerald-50/50 rounded-xl border-l-4 border-l-emerald-500 border-y border-r border-emerald-100 text-xs text-slate-700 line-clamp-2">
              <strong class="text-emerald-800">คำตอบกลับ:</strong> {{ item.adminNote }}
            </div>

            <!-- Card Bottom Bar -->
            <div class="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
              <div class="flex items-center gap-1.5 truncate max-w-[140px] text-slate-500">
                <div class="w-5 h-5 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-500 shrink-0">
                  {{ getTenantAvatarInitial(item) }}
                </div>
                <span class="truncate font-medium text-slate-600 text-xs">{{ getTenantDisplayName(item) }}</span>
              </div>

              <Badge variant="success">
                <CheckCircle2 class="w-3 h-3" />
                <span>ปิดเรื่องแล้ว</span>
              </Badge>
            </div>
          </Card>

          <!-- Empty State -->
          <Card v-if="resolvedList.length === 0" class="p-8 text-center border-dashed border-slate-200/80 shadow-none bg-white/70 space-y-1.5 my-2">
            <div class="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto">
              <CheckCircle2 class="w-4 h-4" />
            </div>
            <p class="text-xs font-bold text-slate-700">ยังไม่มีงานที่เสร็จสิ้น</p>
            <p class="text-xs text-slate-400">รายการที่ทำเสร็จแล้วจะมาแสดงที่นี่</p>
          </Card>
        </div>
      </div>
    </div>

    <!-- ==================== UNIFIED DETAIL & EDIT MODAL ==================== -->
    <Dialog :open="!!selectedTicket" @update:open="(val) => { if (!val) selectedTicket = null }">
      <DialogContent v-if="selectedTicket" class="max-w-lg">
        <DialogHeader>
          <DialogTitle class="flex items-center gap-2 flex-wrap">
            <Badge :variant="getCategoryBadgeVariant(selectedTicket.category)" class="font-bold">
              <component :is="getCategoryIcon(selectedTicket.category)" class="w-3.5 h-3.5" />
              {{ getCategoryLabel(selectedTicket.category) }}
            </Badge>
            <span class="text-xs text-cyan-700 bg-cyan-50 px-2.5 py-1 rounded-xl border border-cyan-100 font-mono font-bold flex items-center gap-1">
              <DoorClosed class="w-3.5 h-3.5 text-cyan-500" />
              ห้อง {{ selectedTicket.room?.roomNumber || '-' }} {{ selectedTicket.building?.name ? `(${selectedTicket.building.name})` : '' }}
            </span>
          </DialogTitle>
        </DialogHeader>

        <!-- Tenant Information Card -->
        <div class="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs">
          <div class="flex items-center gap-2.5">
            <div class="w-9 h-9 rounded-xl bg-cyan-100 text-cyan-700 font-bold flex items-center justify-center text-xs shadow-2xs">
              {{ getTenantAvatarInitial(selectedTicket) }}
            </div>
            <div>
              <div class="font-bold text-slate-900 text-sm">
                {{ getTenantDisplayName(selectedTicket) }}
              </div>
              <div v-if="selectedTicket.tenant?.phone" class="text-slate-500 font-mono text-xs flex items-center gap-1">
                <Phone class="w-3 h-3 text-slate-400" />
                <span>{{ selectedTicket.tenant.phone }}</span>
              </div>
            </div>
          </div>

          <div class="text-right">
            <div class="text-xs text-slate-400">วันเวลาที่แจ้ง</div>
            <div class="font-mono text-slate-700 font-semibold text-xs">
              {{ formatDate(selectedTicket.createdAt) }}
            </div>
          </div>
        </div>

        <!-- Description Details -->
        <div class="space-y-1.5">
          <label class="block text-xs font-bold text-slate-700">รายละเอียดปัญหา / เรื่องที่แจ้ง:</label>
          <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-800 leading-relaxed whitespace-pre-line">
            {{ selectedTicket.description || 'ไม่มีรายละเอียด' }}
          </div>
        </div>

        <!-- Attached Images Gallery -->
        <div v-if="selectedTicket.imageUrls && selectedTicket.imageUrls.length > 0" class="space-y-1.5">
          <label class="block text-xs font-bold text-slate-700">รูปภาพประกอบ ({{ selectedTicket.imageUrls.length }} รูป - แตะเพื่อเปิดรูปเต็ม):</label>
          <div class="grid grid-cols-3 gap-2">
            <a
              v-for="(img, idx) in selectedTicket.imageUrls"
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
          <div class="grid grid-cols-2 gap-3" v-if="selectedTicket.category === 'REPAIR'">
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
                :disabled="Boolean(selectedTicket.billedInvoiceId)"
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
                  :disabled="Boolean(selectedTicket.billedInvoiceId)"
                  class="font-bold"
                  :class="editForm.payer === 'MANAGEMENT' ? 'bg-slate-800 border-slate-800 text-white hover:bg-slate-800' : 'bg-slate-50 text-slate-600'"
                >
                  นิติออกให้
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  @click="editForm.payer = 'TENANT'"
                  :disabled="Boolean(selectedTicket.billedInvoiceId)"
                  class="font-bold"
                  :class="editForm.payer === 'TENANT' ? 'bg-amber-700 border-amber-700 text-white hover:bg-amber-700' : 'bg-slate-50 text-slate-600'"
                >
                  ลูกบ้านจ่ายเอง
                </Button>
              </div>
              <p v-if="editForm.payer === 'TENANT'" class="text-xs text-amber-700 font-medium">
                ค่าซ่อมนี้จะถูกรวมเข้าบิลค่าเช่ารอบถัดไปของห้องนี้โดยอัตโนมัติเมื่อสถานะเป็น "เสร็จสิ้นแล้ว"
              </p>
              <p v-if="selectedTicket.billedInvoiceId" class="text-xs text-emerald-700 font-medium">
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
              v-if="selectedTicket.sourceType === 'maintenance'"
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
              <Button type="button" variant="outline" @click="selectedTicket = null">ยกเลิก</Button>
              <Button type="submit" :disabled="submitting">
                {{ submitting ? 'กำลังบันทึก...' : 'บันทึก & ตอบกลับ' }}
              </Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>

    <!-- ==================== CREATE MAINTENANCE MODAL ==================== -->
    <Dialog :open="showNewModal" @update:open="showNewModal = $event">
      <DialogContent class="max-w-lg">
        <DialogHeader>
          <DialogTitle class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center">
              <Wrench class="w-4 h-4" />
            </div>
            <span>สร้างใบแจ้งซ่อมใหม่ (Manual)</span>
          </DialogTitle>
        </DialogHeader>

        <form @submit.prevent="handleCreateSubmit" class="space-y-4 text-xs text-slate-700">
          <div>
            <label for="maintenance-new-room" class="block font-bold text-slate-800 mb-1">เลือกห้องพัก <span class="text-rose-500">*</span></label>
            <Select id="maintenance-new-room" v-model="newForm.roomId" required class="font-bold">
              <option value="" disabled>-- เลือกห้องพัก --</option>
              <option v-for="room in roomStore.rooms" :key="room.id" :value="room.id">
                ห้อง {{ room.roomNumber }} {{ room.building?.name ? `(${room.building.name})` : '' }}
              </option>
            </Select>
          </div>

          <div>
            <label for="maintenance-new-title" class="block font-bold text-slate-800 mb-1">หัวข้อเรื่องแจ้งซ่อม <span class="text-rose-500">*</span></label>
            <Input
              id="maintenance-new-title"
              v-model="newForm.title"
              type="text"
              placeholder="e.g. เครื่องปรับอากาศมีเสียงดัง / หลอดไฟห้องน้ำเสีย"
              required
              class="font-semibold"
            />
          </div>

          <div>
            <label for="maintenance-new-description" class="block font-bold text-slate-800 mb-1">รายละเอียดเพิ่มเติม <span class="text-rose-500">*</span></label>
            <textarea
              id="maintenance-new-description"
              v-model="newForm.description"
              rows="3"
              placeholder="ระบุอาการชำรุด หรือตำแหน่งที่ต้องการให้ช่างเข้าตรวจสอบ..."
              required
              class="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:bg-white focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 focus:outline-hidden leading-relaxed"
            ></textarea>
          </div>

          <div>
            <label for="maintenance-new-image" class="block font-bold text-slate-800 mb-1">อัปโหลดรูปภาพประกอบ</label>
            <input
              id="maintenance-new-image"
              type="file"
              accept="image/*"
              @change="handleFileChange"
              class="block w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-3.5 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100 cursor-pointer"
            />
            <div v-if="newForm.imageUrl" class="mt-2">
              <img :src="resolveImageUrl(newForm.imageUrl)" alt="ตัวอย่างรูปประกอบที่อัปโหลด" class="w-20 h-20 rounded-xl object-cover border border-slate-200" />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" @click="showNewModal = false">ยกเลิก</Button>
            <Button type="submit" :disabled="submitting || uploading">
              {{ submitting ? 'กำลังบันทึก...' : 'สร้างตั๋วแจ้งซ่อม' }}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue';
import {
  Kanban,
  Wrench,
  Plus,
  RefreshCw,
  Clock,
  Zap,
  CheckCircle2,
  UserCheck,
  Coins,
  MessageSquareWarning,
  HelpCircle,
  Sparkles,
  Trash2,
  Search,
  DoorClosed,
  Phone,
  X
} from 'lucide-vue-next';
import { useRoomStore } from '@/stores/useRoomStore';
import { useBuildingStore } from '@/stores/useBuildingStore';
import uploadService from '@/services/uploadService';
import maintenanceService from '@/services/maintenanceService';
import api from '@/utils/api';
import { showSuccess, showError, showToast, showConfirm } from '@/utils/swal';
import { formatDateTime as formatDate } from '@/utils/formatters';
import AdminPageHeader from '@/components/common/AdminPageHeader.vue';
import AdminLoadingState from '@/components/common/AdminLoadingState.vue';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

const roomStore = useRoomStore();
const buildingStore = useBuildingStore();

const requests = ref([]);
const issueList = ref([]);
const loading = ref(false);
const uploading = ref(false);
const submitting = ref(false);

const showNewModal = ref(false);
const selectedTicket = ref(null);
const selectedCategory = ref('ALL');
const searchQuery = ref('');

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

const newForm = reactive({
  roomId: '',
  title: '',
  description: '',
  imageUrl: ''
});

// Helper: Parse images
const getParsedImages = (imageUrls) => {
  if (!imageUrls) return [];
  if (Array.isArray(imageUrls)) return imageUrls;
  try {
    const parsed = JSON.parse(imageUrls);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [imageUrls];
  }
};

const resolveImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
  const cleanBase = baseUrl.replace(/\/+$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${cleanBase}${cleanPath}`;
};

const formatRelativeTime = (dateStr) => {
  if (!dateStr) return '';
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now - date;
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return 'เมื่อสักครู่';
  if (diffMinutes < 60) return `${diffMinutes} นาทีที่แล้ว`;
  if (diffHours < 24) return `${diffHours} ชม. ที่แล้ว`;
  if (diffDays === 1) return 'เมื่อวานนี้';
  if (diffDays < 7) return `${diffDays} วันที่แล้ว`;
  return date.toLocaleDateString('th-TH', { month: 'short', day: 'numeric' });
};

const getTenantDisplayName = (item) => {
  if (item.tenant) {
    const name = `${item.tenant.firstName || ''} ${item.tenant.lastName || ''}`.trim();
    if (name) return name;
    if (item.tenant.lineDisplayName) return item.tenant.lineDisplayName;
  }
  return 'ลูกบ้าน';
};

const getTenantAvatarInitial = (item) => {
  const name = getTenantDisplayName(item);
  return name.charAt(0).toUpperCase() || 'U';
};

// 1. Unified Tickets List (Merge Maintenance & Issues seamlessly)
const unifiedTickets = computed(() => {
  const list = [];

  // Add Maintenance Requests
  (requests.value || []).forEach((m) => {
    list.push({
      uniqueId: `m_${m.id}`,
      rawId: m.id,
      sourceType: 'maintenance',
      category: 'REPAIR',
      title: m.title || 'รายการแจ้งซ่อมห้องพัก',
      description: m.description || '',
      status: (m.status || 'pending').toLowerCase(),
      room: m.room,
      building: m.room?.building || m.building,
      tenant: m.tenant,
      technicianName: m.technicianName,
      repairCost: m.repairCost,
      adminNote: m.adminNote,
      imageUrls: m.imageUrl || m.photoUrl ? [m.imageUrl || m.photoUrl] : [],
      createdAt: m.createdAt,
      resolvedAt: m.resolvedAt
    });
  });

  // Add Issue Tickets (Complaints, Repairs, Other)
  (issueList.value || []).forEach((iss) => {
    list.push({
      uniqueId: `iss_${iss.id}`,
      rawId: iss.id,
      sourceType: 'issue',
      category: (iss.category || 'OTHER').toUpperCase(),
      title: iss.category === 'COMPLAINT'
        ? `ข้อร้องเรียนห้อง ${iss.room?.roomNumber || '-'}`
        : (iss.category === 'REPAIR' ? `แจ้งซ่อมห้อง ${iss.room?.roomNumber || '-'}` : `เรื่องอื่นๆ ห้อง ${iss.room?.roomNumber || '-'}`),
      description: iss.description || '',
      status: (iss.status || 'PENDING').toLowerCase(),
      room: iss.room,
      building: iss.building,
      tenant: iss.user,
      technicianName: '',
      repairCost: 0,
      adminNote: iss.adminReply,
      imageUrls: getParsedImages(iss.imageUrls),
      createdAt: iss.createdAt,
      resolvedAt: iss.status === 'RESOLVED' ? iss.updatedAt : null
    });
  });

  return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
});

// Category Filter Count Definitions
const categoryFilters = computed(() => {
  const allCount = unifiedTickets.value.length;
  const repairCount = unifiedTickets.value.filter((i) => i.category === 'REPAIR').length;
  const complaintCount = unifiedTickets.value.filter((i) => i.category === 'COMPLAINT').length;
  const otherCount = unifiedTickets.value.filter((i) => i.category === 'OTHER').length;

  return [
    { value: 'ALL', label: 'ทั้งหมด', count: allCount, icon: Sparkles, iconClass: 'text-cyan-400' },
    { value: 'REPAIR', label: 'แจ้งซ่อมบำรุง', count: repairCount, icon: Wrench, iconClass: 'text-amber-500' },
    { value: 'COMPLAINT', label: 'ข้อร้องเรียน', count: complaintCount, icon: MessageSquareWarning, iconClass: 'text-rose-500' },
    { value: 'OTHER', label: 'เรื่องอื่นๆ', count: otherCount, icon: HelpCircle, iconClass: 'text-cyan-500' }
  ];
});

// Filter by Category and Search Query
const filteredTickets = computed(() => {
  return unifiedTickets.value.filter((t) => {
    const matchCategory = selectedCategory.value === 'ALL' || t.category === selectedCategory.value;
    if (!matchCategory) return false;

    if (!searchQuery.value.trim()) return true;
    const q = searchQuery.value.toLowerCase().trim();
    const roomNo = t.room?.roomNumber?.toLowerCase() || '';
    const desc = t.description?.toLowerCase() || '';
    const title = t.title?.toLowerCase() || '';
    const tenantName = `${t.tenant?.firstName || ''} ${t.tenant?.lastName || ''} ${t.tenant?.lineDisplayName || ''}`.toLowerCase();

    return roomNo.includes(q) || desc.includes(q) || title.includes(q) || tenantName.includes(q);
  });
});

// 3 Kanban Columns from Filtered List
const pendingList = computed(() => filteredTickets.value.filter((t) => t.status === 'pending'));
const inProgressList = computed(() => filteredTickets.value.filter((t) => t.status === 'in_progress'));
const resolvedList = computed(() => filteredTickets.value.filter((t) => ['resolved', 'completed', 'cancelled'].includes(t.status)));

const getCategoryLabel = (category) => {
  const map = {
    REPAIR: 'แจ้งซ่อม',
    COMPLAINT: 'ข้อร้องเรียน',
    OTHER: 'เรื่องอื่นๆ'
  };
  return map[(category || '').toUpperCase()] || 'ทั่วไป';
};

const getCategoryIcon = (category) => {
  const cat = (category || '').toUpperCase();
  if (cat === 'REPAIR') return Wrench;
  if (cat === 'COMPLAINT') return MessageSquareWarning;
  return HelpCircle;
};

// Badge variant mapping: REPAIR/pending-ish -> warning, COMPLAINT/urgent -> danger, rest -> neutral
const getCategoryBadgeVariant = (category) => {
  const cat = (category || '').toUpperCase();
  if (cat === 'REPAIR') return 'warning';
  if (cat === 'COMPLAINT') return 'danger';
  return 'neutral';
};

// Data Fetching
const fetchData = async () => {
  loading.value = true;
  try {
    const params = {};
    if (buildingStore.activeBuildingId) {
      params.buildingId = buildingStore.activeBuildingId;
    }

    const [maintenanceSettled, issuesSettled] = await Promise.allSettled([
      maintenanceService.getMaintenanceRequests(buildingStore.activeBuildingId),
      api.get('/api/admin/issues', { params })
    ]);

    if (maintenanceSettled.status === 'fulfilled') {
      const resVal = maintenanceSettled.value;
      requests.value = Array.isArray(resVal) ? resVal : (resVal?.data || []);
    } else {
      console.error('Failed to fetch maintenance requests:', maintenanceSettled.reason);
      requests.value = [];
    }

    if (issuesSettled.status === 'fulfilled') {
      const resVal = issuesSettled.value;
      issueList.value = Array.isArray(resVal?.data?.data) ? resVal.data.data : (Array.isArray(resVal?.data) ? resVal.data : []);
    } else {
      console.error('Failed to fetch issues:', issuesSettled.reason);
      issueList.value = [];
    }
  } catch (error) {
    console.error('Error fetching unified tickets:', error);
  } finally {
    loading.value = false;
  }
};

const handleRefresh = async () => {
  await fetchData();
  showToast('รีเฟรชข้อมูลบอร์ดเรียบร้อยแล้ว');
};

const openDetailModal = (item) => {
  selectedTicket.value = item;
  editForm.status = item.status || 'pending';
  editForm.technicianName = item.technicianName || '';
  editForm.repairCost = item.repairCost || 0;
  editForm.payer = item.payer || 'MANAGEMENT';
  editForm.adminNote = item.adminNote || '';
};

// Quick Status Toggle on Kanban Card
const handleQuickStatusChange = async (item, newStatus) => {
  try {
    if (item.sourceType === 'maintenance') {
      await maintenanceService.updateMaintenanceRequest(item.rawId, { status: newStatus });
    } else {
      await api.put(`/api/admin/issues/${item.rawId}`, { status: newStatus.toUpperCase() });
    }
    showToast(`อัปเดตสถานะเป็น ${newStatus} เรียบร้อยแล้ว`);
    fetchData();
  } catch (error) {
    showError('เกิดข้อผิดพลาด', 'ไม่สามารถเปลี่ยนสถานะได้');
  }
};

// Save Edit & Reply from Modal
const handleSaveTicket = async () => {
  if (!selectedTicket.value) return;
  submitting.value = true;
  try {
    if (selectedTicket.value.sourceType === 'maintenance') {
      await maintenanceService.updateMaintenanceRequest(selectedTicket.value.rawId, {
        status: editForm.status.toLowerCase(),
        technicianName: editForm.technicianName,
        repairCost: editForm.repairCost,
        payer: editForm.payer,
        adminNote: editForm.adminNote
      });
    } else {
      await api.put(`/api/admin/issues/${selectedTicket.value.rawId}`, {
        status: editForm.status.toUpperCase(),
        adminReply: editForm.adminNote
      });
    }

    showSuccess('สำเร็จ', 'บันทึกการแก้ไขและส่งข้อความตอบกลับเรียบร้อยแล้ว');
    selectedTicket.value = null;
    fetchData();
  } catch (error) {
    showError('เกิดข้อผิดพลาด', error.response?.data?.message || 'ไม่สามารถบันทึกข้อมูลได้');
  } finally {
    submitting.value = false;
  }
};

const handleFileChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  uploading.value = true;
  try {
    const res = await uploadService.uploadFile(file);
    newForm.imageUrl = res.url;
    showToast('อัปโหลดรูปภาพสำเร็จ');
  } catch (error) {
    showError('อัปโหลดล้มเหลว', 'ไม่สามารถอัปโหลดรูปภาพได้');
  } finally {
    uploading.value = false;
  }
};

const handleCreateSubmit = async () => {
  submitting.value = true;
  try {
    await maintenanceService.createMaintenanceRequest({
      roomId: newForm.roomId,
      title: newForm.title,
      description: newForm.description,
      imageUrl: newForm.imageUrl
    });
    showSuccess('สำเร็จ', 'สร้างใบแจ้งซ่อมเรียบร้อยแล้ว');
    showNewModal.value = false;
    newForm.roomId = '';
    newForm.title = '';
    newForm.description = '';
    newForm.imageUrl = '';
    fetchData();
  } catch (error) {
    showError('เกิดข้อผิดพลาด', 'ไม่สามารถสร้างใบแจ้งซ่อมได้');
  } finally {
    submitting.value = false;
  }
};

const handleDelete = async () => {
  if (!selectedTicket.value || selectedTicket.value.sourceType !== 'maintenance') return;
  const isConfirmed = await showConfirm(
    'ยืนยันการลบ',
    'คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้ออกจากระบบ?'
  );
  if (isConfirmed) {
    try {
      await maintenanceService.deleteMaintenanceRequest(selectedTicket.value.rawId);
      showSuccess('สำเร็จ', 'ลบรายการเรียบร้อยแล้ว');
      selectedTicket.value = null;
      fetchData();
    } catch (error) {
      showError('เกิดข้อผิดพลาด', 'ไม่สามารถลบรายการได้');
    }
  }
};

onMounted(() => {
  roomStore.fetchRooms();
  fetchData();
});

watch(
  () => buildingStore.activeBuildingId,
  () => {
    fetchData();
  }
);
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 9999px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
