<template>
  <div class="space-y-5 pb-6 font-sans text-slate-800 selection:bg-teal-500 selection:text-white">
    <!-- Loading Skeleton State -->
    <div v-if="loading" class="space-y-4 animate-pulse">
      <!-- 1. Header Profile Skeleton -->
      <div class="p-5 sm:p-6 rounded-xl bg-slate-900/10 border border-slate-200/60 shadow-xs space-y-4">
        <div class="flex items-center justify-between gap-3.5 flex-wrap sm:flex-nowrap">
          <div class="flex items-center gap-3.5">
            <div class="w-14 h-14 rounded-full bg-slate-200 shrink-0"></div>
            <div class="space-y-2 flex-1">
              <div class="h-5 w-36 bg-slate-200 rounded-lg"></div>
              <div class="h-3.5 w-24 bg-slate-200 rounded-md"></div>
              <div class="h-5 w-28 bg-slate-200 rounded-full"></div>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <div class="h-8 w-20 bg-slate-200 rounded-xl"></div>
            <div class="h-8 w-24 bg-slate-200 rounded-xl"></div>
          </div>
        </div>
      </div>

      <!-- 2. Action Items / Alerts Skeleton -->
      <div class="p-4 sm:p-5 rounded-xl bg-white border border-slate-100 shadow-xs space-y-3">
        <div class="flex items-center justify-between">
          <div class="h-4 w-28 bg-slate-200 rounded-md"></div>
          <div class="h-5 w-16 bg-slate-200 rounded-full"></div>
        </div>
        <div class="h-16 w-full bg-slate-100 rounded-xl"></div>
      </div>

      <!-- 3. Quick Actions Grid Skeleton (4 cards) -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div v-for="i in 4" :key="i" class="p-4 rounded-xl bg-white border border-slate-100 shadow-xs space-y-3">
          <div class="w-10 h-10 rounded-xl bg-slate-100"></div>
          <div class="space-y-1.5">
            <div class="h-4 w-20 bg-slate-200 rounded-md"></div>
            <div class="h-3 w-28 bg-slate-100 rounded-md"></div>
          </div>
        </div>
      </div>

      <!-- 4. Recent Announcements Skeleton -->
      <div class="p-5 rounded-xl bg-white border border-slate-100 shadow-xs space-y-3.5">
        <div class="flex items-center justify-between">
          <div class="h-4 w-32 bg-slate-200 rounded-md"></div>
          <div class="h-4 w-12 bg-slate-200 rounded-md"></div>
        </div>
        <div class="space-y-2.5">
          <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
            <div class="h-4 w-3/4 bg-slate-200 rounded-md"></div>
            <div class="h-3 w-1/2 bg-slate-100 rounded-md"></div>
          </div>
          <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
            <div class="h-4 w-2/3 bg-slate-200 rounded-md"></div>
            <div class="h-3 w-1/3 bg-slate-100 rounded-md"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loaded Content -->
    <div v-else class="space-y-5">
      <!-- Session Expired / Not Verified Warning Card -->
      <Card v-if="sessionExpired" class="p-4 bg-amber-50 border-amber-200/70 space-y-3">
        <div class="flex items-center justify-between text-xs font-semibold text-amber-900">
          <span>เซสชัน LINE หมดอายุ หรือยังไม่ได้ยืนยันตัวตน</span>
          <Badge variant="warning">Expired</Badge>
        </div>
        <p class="text-xs text-amber-800 leading-relaxed">
          ไม่พบการเข้าสู่ระบบ LINE หรือ Token หมดอายุ กรุณากดปุ่มด้านล่างเพื่อยืนยันตัวตนผ่าน LINE
        </p>
        <Button
          @click="loginLiff()"
          class="w-full bg-[#06C755] hover:bg-[#05b34c] text-white"
        >
          <span>เข้าสู่ระบบด้วย LINE เพื่อต่ออายุเซสชัน</span>
        </Button>
      </Card>

      <!-- 0. Tenant Preview Mode Banner for Owners -->
      <div
        v-if="isPreviewMode || (authStore.isOwner && !tenantProfile.lineUserId)"
        class="p-4 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 rounded-xl flex items-center justify-between gap-3 shadow-md border border-amber-300"
      >
        <div class="flex items-center gap-3 min-w-0">
          <div class="w-10 h-10 rounded-xl bg-black/15 text-slate-950 flex items-center justify-center shrink-0">
            <Eye class="w-5 h-5" />
          </div>
          <div class="min-w-0">
            <div class="text-xs font-black text-slate-950 flex items-center gap-1.5">
              <span>โหมดจำลองมุมมองลูกบ้าน</span>
              <Badge class="bg-black/20 text-slate-950 font-bold uppercase rounded-md px-1.5 py-0.2">Preview</Badge>
            </div>
            <div class="text-xs text-slate-900 truncate">
              คุณกำลังดูหน้าจอเสมือนที่ลูกบ้านเห็น
            </div>
          </div>
        </div>
        <router-link
          to="/liff/owner-dashboard"
          @click="authStore.setActiveRole('owner')"
          class="shrink-0 px-3.5 py-2 bg-slate-950 hover:bg-slate-900 active:scale-95 text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowRightLeft class="w-3.5 h-3.5" />
          <span>กลับแดชบอร์ด</span>
        </router-link>
      </div>

      <!-- 1. Header Section: Profile & Digital ID Card -->
      <div
        class="p-5 sm:p-6 text-white rounded-xl shadow-xs relative overflow-hidden transition-all duration-500"
        :style="{
          background: `linear-gradient(135deg, ${themeColor}, ${adjustBrightness(themeColor, -25)})`
        }"
      >
        <div class="flex items-start justify-between gap-3.5 flex-wrap sm:flex-nowrap">
          <div class="flex items-center gap-3.5">
            <!-- Avatar จาก LINE Profile -->
            <div class="relative shrink-0">
              <img
                v-if="tenantProfile.avatarUrl && !imageLoadError"
                :src="tenantProfile.avatarUrl"
                alt="Tenant Avatar"
                class="w-14 h-14 rounded-full object-cover border-2 border-white/80 shadow-xs bg-white/20"
                @error="handleAvatarError"
              />
              <div
                v-else
                class="w-14 h-14 rounded-full bg-white/20 backdrop-blur-xs border-2 border-white/80 shadow-xs flex items-center justify-center text-xl font-bold text-white select-none"
              >
                {{ tenantInitial }}
              </div>
              <span class="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full"></span>
            </div>

            <!-- ข้อมูลชื่อ และ Badge หมายเลขห้องพัก -->
            <div class="space-y-1">
              <h1 class="font-bold text-base sm:text-lg truncate text-white">
                {{ tenantProfile.firstName }} {{ tenantProfile.lastName }}
              </h1>
              <p class="text-xs text-teal-100/90 font-mono">{{ tenantProfile.phone || '-' }}</p>

              <!-- Current Active Room Badge & Role Badge -->
              <div class="pt-0.5 flex items-center gap-1.5 flex-wrap">
                <span class="px-2.5 py-0.5 bg-white/20 backdrop-blur-xs text-white font-medium text-xs rounded-full border border-white/30 inline-flex items-center gap-1.5">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>ห้อง {{ selectedRoom?.roomNumber || tenantProfile.roomNumber || '-' }}</span>
                  <span v-if="selectedRoom?.buildingName || tenantProfile.buildingName" class="text-xs text-white/80">
                    ({{ selectedRoom?.buildingName || tenantProfile.buildingName }})
                  </span>
                </span>
                <Badge
                  class="font-bold border"
                  :class="tenantProfile.isPrimaryTenant !== false ? 'bg-amber-400/25 text-amber-100 border-amber-300/40' : 'bg-sky-400/25 text-sky-100 border-sky-300/40'"
                >
                  {{ tenantProfile.isPrimaryTenant !== false ? 'ผู้เช่าหลัก' : 'ผู้อยู่อาศัยร่วม' }}
                </Badge>
              </div>
            </div>
          </div>

          <!-- Action Bar: Digital ID & Link More Rooms -->
          <div class="flex items-center gap-2 self-end sm:self-center w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-white/20 justify-end">
            <Button
              variant="ghost"
              size="sm"
              @click="showLinkRoomModal = true"
              class="bg-white/15 hover:bg-white/25 text-white border border-white/20"
            >
              <PlusCircle class="w-3.5 h-3.5" />
              <span>ผูกห้องเพิ่ม</span>
            </Button>

            <!-- Digital ID Button -->
            <Button
              v-if="featureStore.isEnabled('ENABLE_DIGITAL_ID')"
              variant="ghost"
              size="sm"
              @click="showQrModal = true"
              class="bg-white/20 hover:bg-white/30 text-white font-semibold border border-white/30"
            >
              <QrCode class="w-3.5 h-3.5" />
              <span>Digital ID</span>
            </Button>
          </div>
        </div>
      </div>

      <!-- 1.2 Owner Mode Quick Switch Banner (สำหรับผู้ใช้ที่มีสิทธิ์เจ้าของตึก) -->
      <div
        v-if="authStore.isOwner || tenantProfile.isOwner"
        class="p-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-xl flex items-center justify-between gap-3 shadow-md border border-slate-700/60"
      >
        <div class="flex items-center gap-3 min-w-0">
          <div class="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-500/30 flex items-center justify-center shrink-0">
            <Building2 class="w-5 h-5" />
          </div>
          <div class="min-w-0">
            <div class="text-xs font-bold text-white flex items-center gap-1.5">
              <span>คุณมีสิทธิ์เจ้าของตึก</span>
              <Badge class="bg-teal-500 text-slate-950 font-black rounded-md px-1.5 py-0.2">Owner</Badge>
            </div>
            <div class="text-xs text-slate-300 truncate">
              ดูยอดเงิน อัตราห้องพัก และเรื่องด่วน
            </div>
          </div>
        </div>
        <router-link
          to="/liff/owner-dashboard"
          @click="authStore.setActiveRole('owner')"
          class="shrink-0 px-3.5 py-2 bg-teal-500 hover:bg-teal-400 active:scale-95 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowRightLeft class="w-3.5 h-3.5" />
          <span>แดชบอร์ดตึก</span>
        </router-link>
      </div>

      <!-- 1.5 Web Tenant LINE Binding Banner (แนะนำให้ผูก LINE OA หากยังไม่มี LINE ID) -->
      <div
        v-if="!tenantProfile.lineUserId && !currentLineUserId"
        class="p-4 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/5 border border-emerald-500/30 rounded-xl flex items-center justify-between gap-3 shadow-xs"
      >
        <div class="flex items-center gap-3 min-w-0">
          <div class="w-10 h-10 rounded-xl bg-[#06C755] text-white flex items-center justify-center shrink-0 shadow-sm shadow-[#06C755]/20">
            <MessageSquare class="w-5 h-5 fill-current text-white" />
          </div>
          <div class="min-w-0">
            <div class="text-xs font-bold text-slate-800">
              รับแจ้งเตือนบิลและพัสดุผ่าน LINE
            </div>
            <div class="text-xs text-slate-500">
              เพิ่มเพื่อนกับ LINE Official เพื่อรับการแจ้งเตือนแบบเรียลไทม์
            </div>
          </div>
        </div>
        <Button
          @click="openAddFriendLine()"
          class="shrink-0 bg-[#06C755] hover:bg-[#05b34c] text-white font-bold active:scale-95"
        >
          <span>เพิ่มเพื่อน</span>
        </Button>
      </div>

      <!-- 2. Multi-Room Selector (Shown if > 1 room) -->
      <Card v-if="tenantProfile.rooms && tenantProfile.rooms.length > 1" class="p-4 sm:p-5 space-y-3">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-xs font-bold text-slate-700">
              ห้องพักของคุณ ({{ tenantProfile.rooms.length }} ห้อง)
            </h2>
            <p class="text-xs text-slate-400 mt-0.5">แตะที่ห้องเพื่อสลับดูข้อมูล</p>
          </div>
          <button
            @click="showLinkRoomModal = true"
            class="text-xs font-semibold hover:opacity-80 transition-opacity cursor-pointer flex items-center gap-1 text-teal-600"
            :style="{ color: themeColor }"
          >
            <PlusCircle class="w-3.5 h-3.5" />
            <span>ผูกห้องเพิ่ม</span>
          </button>
        </div>

        <!-- Room Selector Buttons Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
          <button
            v-for="room in tenantProfile.rooms"
            :key="room.id"
            @click="selectRoom(room)"
            :aria-pressed="selectedRoomId === room.id"
            class="p-3 sm:p-3.5 rounded-xl border text-left transition-all duration-200 flex items-center justify-between gap-3 cursor-pointer relative overflow-hidden active:scale-[0.99]"
            :class="selectedRoomId === room.id 
              ? 'bg-teal-50/60 border-teal-200 shadow-2xs' 
              : 'bg-slate-50/60 hover:bg-slate-100/70 border-slate-100/90 text-slate-600'"
            :style="selectedRoomId === room.id ? { backgroundColor: `${themeColor}0D`, borderColor: `${themeColor}55` } : {}"
          >
            <!-- Left: Room Icon & Room Details -->
            <div class="flex items-center gap-3 min-w-0 flex-1">
              <div
                class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200 overflow-hidden"
                :class="selectedRoomId === room.id
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-white text-slate-500 border border-slate-200/60'"
                :style="selectedRoomId === room.id && (!room.logoUrl || failedRoomLogoIds.has(room.id)) ? { backgroundColor: themeColor } : {}"
              >
                <img
                  v-if="room.logoUrl && !failedRoomLogoIds.has(room.id)"
                  :src="room.logoUrl"
                  alt=""
                  class="w-full h-full object-contain p-1"
                  @error="handleRoomLogoError(room.id)"
                />
                <component v-else :is="getRoomIcon(room.unitType)" class="w-4.5 h-4.5" />
              </div>
              
              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-1.5 flex-wrap">
                  <span
                    class="text-xs font-bold truncate"
                    :class="selectedRoomId === room.id ? 'text-teal-950 font-extrabold' : 'text-slate-800'"
                    :style="selectedRoomId === room.id ? { color: themeColor } : {}"
                  >
                    ห้อง {{ room.roomNumber }}
                  </span>
                  <Badge
                    v-if="selectedRoomId === room.id"
                    class="rounded-md px-1.5 py-0.5 bg-teal-100 text-teal-700"
                    :style="{ backgroundColor: `${themeColor}18`, color: themeColor }"
                  >
                    ใช้งานอยู่
                  </Badge>
                </div>
                <div class="text-xs text-slate-400 truncate mt-0.5 font-medium">
                  {{ room.buildingName || 'อาคารหลัก' }}
                </div>
              </div>
            </div>

            <!-- Right: Check Indicator -->
            <div
              v-if="selectedRoomId === room.id"
              class="w-5 h-5 rounded-full flex items-center justify-center text-white shrink-0 shadow-2xs"
              :style="{ backgroundColor: themeColor }"
            >
              <Check class="w-3 h-3 stroke-[3]" />
            </div>
            <div
              v-else
              class="w-5 h-5 rounded-full border border-slate-200/80 shrink-0"
            ></div>
          </button>
        </div>
      </Card>

      <!-- กำลังสลับห้อง: Skeleton แทนทุกส่วนที่ผูกกับห้อง/ตึก จนกว่าข้อมูลห้องใหม่ + ฟีเจอร์ตึกใหม่จะมาครบ
           (Header และรายการห้องยังอยู่ ผู้ใช้เห็นว่ากำลังโหลดห้องไหน และกดสลับต่อได้) -->
      <div v-if="switchingRoom" class="space-y-4 animate-pulse" role="status" aria-live="polite">
        <span class="sr-only">กำลังโหลดข้อมูลห้อง {{ selectedRoom?.roomNumber }}</span>
        <div class="p-4 sm:p-5 rounded-xl bg-white border border-slate-100 shadow-xs space-y-3">
          <div class="h-4 w-32 bg-slate-200 rounded-md"></div>
          <div class="h-16 w-full bg-slate-100 rounded-xl"></div>
        </div>
        <div class="space-y-2.5">
          <div class="h-4 w-20 bg-slate-200 rounded-md"></div>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div v-for="i in 4" :key="i" class="h-28 bg-white rounded-xl border border-slate-100 shadow-xs"></div>
          </div>
        </div>
        <div class="h-40 bg-white rounded-xl border border-slate-100 shadow-xs"></div>
      </div>

      <template v-else>
      <!-- 2.5 Live Action Hub & Smart Notifications (ศูนย์รวมการแจ้งเตือนและสถานะที่ต้องดำเนินการ) -->
      <div class="space-y-2.5 animate-in fade-in duration-300">
        <!-- Section Header -->
        <div class="flex items-center justify-between px-1">
          <div class="flex items-center gap-2">
            <span v-if="hasAnyActionItems" class="relative flex h-2.5 w-2.5">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
            </span>
            <span v-else class="w-2 h-2 rounded-full bg-emerald-500"></span>
            <h2 class="text-xs font-bold text-slate-800 tracking-tight">
              สถานะ & การแจ้งเตือนห้องพัก
            </h2>
          </div>
          <span v-if="!hasAnyActionItems" class="text-xs font-medium text-emerald-600 inline-flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
            <CheckCircle2 class="w-3 h-3 text-emerald-600" />
            <span>ทุกอย่างเรียบร้อยดี</span>
          </span>
        </div>

        <!-- Action Items List (เมื่อมีรายการที่ต้องทำ) -->
        <div v-if="hasAnyActionItems" class="space-y-2.5">
          <!-- 1. บิลค่าเช่าค้างชำระ / รอชำระ (Pending Invoices) -->
          <div
            v-if="featureStore.isEnabled('ENABLE_LINE_PAYMENT') && unpaidInvoices.length > 0"
            @click="goToPayment(unpaidInvoices[0])"
            class="p-4 bg-gradient-to-r from-rose-50/95 via-amber-50/40 to-white rounded-xl border border-rose-200/90 shadow-xs hover:shadow-md transition-all cursor-pointer group active:scale-[0.99] relative overflow-hidden"
          >
            <div class="flex items-center justify-between gap-3">
              <div class="flex items-center gap-3 min-w-0">
                <div class="w-11 h-11 rounded-xl bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-rose-500/20 group-hover:scale-105 transition-transform">
                  <CreditCard class="w-5 h-5" />
                </div>
                <div class="min-w-0 flex-1">
                  <div class="flex items-center gap-1.5 flex-wrap">
                    <Badge variant="danger" class="font-bold">
                      รอชำระเงิน ({{ unpaidInvoices.length }} บิล)
                    </Badge>
                    <span v-if="unpaidInvoices[0].dueDate" class="text-xs text-slate-400 font-medium">
                      ครบกำหนด {{ formatDate(unpaidInvoices[0].dueDate) }}
                    </span>
                  </div>
                  <div class="text-xs font-bold text-slate-900 mt-0.5 truncate">
                    ยอดรวมค้างชำระ: <span class="text-rose-600 font-mono font-extrabold text-sm">฿{{ Number(totalUnpaidAmount).toLocaleString() }}</span>
                  </div>
                </div>
              </div>

              <div class="flex items-center gap-1 shrink-0">
                <span class="hidden sm:inline text-xs font-bold text-rose-600">ชำระเงิน</span>
                <div class="w-7 h-7 rounded-xl bg-white border border-rose-200 text-rose-600 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                  <ChevronRight class="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>

          <!-- 2. พัสดุมาถึงรอรับ (Pending Parcels) -->
          <div
            v-if="featureStore.isEnabled('ENABLE_PARCEL_NOTIFY') && pendingParcels.length > 0"
            @click="router.push('/liff/parcels')"
            class="p-4 bg-gradient-to-r from-orange-50/95 via-amber-50/40 to-white rounded-xl border border-orange-200/90 shadow-xs hover:shadow-md transition-all cursor-pointer group active:scale-[0.99] relative overflow-hidden"
          >
            <div class="flex items-center justify-between gap-3">
              <div class="flex items-center gap-3 min-w-0">
                <div class="w-11 h-11 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
                  <Package class="w-5 h-5" />
                </div>
                <div class="min-w-0 flex-1">
                  <div class="flex items-center gap-1.5 flex-wrap">
                    <span class="px-2 py-0.5 text-xs font-bold rounded-full bg-orange-100 text-orange-700">
                      พัสดุมาถึงห้อง ({{ pendingParcels.length }} ชิ้น)
                    </span>
                    <span v-if="pendingParcels[0].courier" class="text-xs text-slate-400 font-medium">
                      {{ pendingParcels[0].courier }}
                    </span>
                  </div>
                  <div class="text-xs font-bold text-slate-900 mt-0.5 truncate">
                    รหัสรับของ: <span class="font-mono text-orange-600 font-semibold">{{ pendingParcels[0].trackingNumber || pendingParcels[0].packageCode || 'พร้อมรับที่นิติบุคคล' }}</span>
                  </div>
                </div>
              </div>

              <div class="flex items-center gap-1 shrink-0">
                <span class="hidden sm:inline text-xs font-bold text-orange-600">ดูพัสดุ</span>
                <div class="w-7 h-7 rounded-xl bg-white border border-orange-200 text-orange-600 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                  <ChevronRight class="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>

          <!-- 3. รายการแจ้งซ่อมกำลังดำเนินการ (Active Maintenance) -->
          <div
            v-if="featureStore.isEnabled('ENABLE_MAINTENANCE_REQUEST') && activeMaintenance.length > 0"
            @click="router.push('/liff/issues')"
            class="p-4 bg-gradient-to-r from-sky-50/95 via-teal-50/40 to-white rounded-xl border border-sky-200/90 shadow-xs hover:shadow-md transition-all cursor-pointer group active:scale-[0.99] relative overflow-hidden"
          >
            <div class="flex items-center justify-between gap-3">
              <div class="flex items-center gap-3 min-w-0">
                <div class="w-11 h-11 rounded-xl bg-sky-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
                  <Wrench class="w-5 h-5" />
                </div>
                <div class="min-w-0 flex-1">
                  <div class="flex items-center gap-1.5 flex-wrap">
                    <span class="px-2 py-0.5 text-xs font-bold rounded-full bg-sky-100 text-sky-700">
                      กำลังดำเนินการซ่อม ({{ activeMaintenance.length }} งาน)
                    </span>
                    <span class="text-xs text-slate-400 font-medium">
                      {{ formatMaintenanceStatus(activeMaintenance[0].status) }}
                    </span>
                  </div>
                  <div class="text-xs font-bold text-slate-900 mt-0.5 truncate">
                    {{ activeMaintenance[0].title || 'รายการแจ้งซ่อมห้องพัก' }}
                  </div>
                </div>
              </div>

              <div class="flex items-center gap-1 shrink-0">
                <span class="hidden sm:inline text-xs font-bold text-sky-600">ติดตามงาน</span>
                <div class="w-7 h-7 rounded-xl bg-white border border-sky-200 text-sky-600 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                  <ChevronRight class="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 4. All Clear Status Card (กรณีไม่มีรายการค้างชำระ/ตกค้าง) -->
        <div
          v-else
          class="p-4 bg-white rounded-xl border border-slate-100/90 shadow-2xs flex items-center justify-between gap-3"
        >
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 class="w-5 h-5" />
            </div>
            <div>
              <div class="text-xs font-bold text-slate-800">ไม่มีรายการค้างชำระหรือพัสดุตกค้าง</div>
              <div class="text-xs text-slate-400">สถานะห้องพักและบัญชีของคุณเป็นปัจจุบันเรียบร้อยครับ</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 3. Dynamic Quick Actions Grid (Responsive 2 to 4 cols) -->
      <div class="space-y-2.5" v-if="availableQuickActions.length > 0">
        <h2 class="text-xs font-semibold text-slate-400 uppercase tracking-wider px-0.5">
          เมนูด่วน
        </h2>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            v-for="menu in availableQuickActions"
            :key="menu.id"
            @click="handleMenuClick(menu)"
            class="p-4 bg-white hover:bg-slate-50/80 rounded-xl border border-slate-100 shadow-xs text-left transition-all group flex flex-col justify-between h-28 cursor-pointer active:scale-[0.99] relative overflow-hidden"
          >
            <div
              class="relative w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105"
              :class="menu.bgClass"
            >
              <component :is="menu.icon" class="w-4.5 h-4.5" :class="menu.iconClass" />
              <!-- Badges on Quick Actions -->
              <span
                v-if="menu.id === 'invoices' && unpaidInvoices.length > 0"
                class="absolute -top-1 -right-1 flex h-2.5 w-2.5"
              >
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500 border border-white"></span>
              </span>
              <span
                v-else-if="menu.id === 'parcels' && pendingParcels.length > 0"
                class="absolute -top-1 -right-1 flex h-2.5 w-2.5"
              >
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500 border border-white"></span>
              </span>
              <span
                v-else-if="menu.id === 'maintenance' && activeMaintenance.length > 0"
                class="absolute -top-1 -right-1 flex h-2.5 w-2.5"
              >
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-sky-500 border border-white"></span>
              </span>
              <span
                v-else-if="menu.id === 'announcements' && unreadCount > 0"
                class="absolute -top-1 -right-1 flex h-2.5 w-2.5"
              >
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 border border-white"></span>
              </span>
            </div>
            <div>
              <div class="font-bold text-xs text-slate-800 group-hover:text-teal-600 transition-colors">
                {{ menu.title }}
              </div>
              <div class="text-xs text-slate-400 font-medium truncate mt-0.5">{{ menu.subtitle }}</div>
            </div>
          </button>
        </div>
      </div>

      <!-- 3.5 Featured News & Announcements Showcase (ข่าวสาร & ประกาศหอพัก) -->
      <div v-if="featureStore.isEnabled('ENABLE_ANNOUNCEMENTS') && announcements && announcements.length > 0" class="space-y-3">
        <!-- Section Header -->
        <div class="flex items-center justify-between px-1">
          <div class="flex items-center gap-2">
            <div class="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Megaphone class="w-3.5 h-3.5" />
            </div>
            <h2 class="text-xs font-bold text-slate-800 tracking-tight flex items-center gap-1.5">
              <span>ข่าวสาร & ประกาศหอพัก</span>
              <span
                v-if="unreadCount > 0"
                class="px-2 py-0.5 text-xs font-bold rounded-full bg-rose-500 text-white animate-pulse shadow-2xs"
              >
                {{ unreadCount }} ใหม่
              </span>
            </h2>
          </div>

          <router-link
            to="/liff/announcements"
            class="text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors inline-flex items-center gap-0.5 group"
          >
            <span>ดูทั้งหมด ({{ announcements.length }})</span>
            <ChevronRight class="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </router-link>
        </div>

        <!-- 1 Announcement: Featured Full Card -->
        <div
          v-if="announcements.length === 1"
          @click="openAnnouncementModal(announcements[0])"
          class="bg-white rounded-xl border border-slate-100/90 shadow-xs hover:shadow-md transition-all overflow-hidden cursor-pointer group active:scale-[0.99]"
        >
          <div v-if="announcements[0].imageUrl && !failedAnnouncementImageIds.has(announcements[0].id)" class="w-full h-36 sm:h-44 relative overflow-hidden bg-slate-100">
            <img
              :src="announcements[0].imageUrl"
              :alt="announcements[0].title"
              class="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
              @error="handleAnnouncementImageError(announcements[0].id)"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
            <span
              v-if="!isRead(announcements[0].id)"
              class="absolute top-3 left-3 px-2 py-0.5 text-xs font-bold rounded-full bg-rose-500 text-white shadow-md animate-pulse"
            >
              ข่าวใหม่
            </span>
            <span
              class="absolute bottom-3 left-3 px-2 py-0.5 text-xs font-medium rounded-lg bg-black/60 text-white backdrop-blur-md"
            >
              {{ announcements[0].building?.name || 'ประกาศทั่วไป' }}
            </span>
          </div>
          <div v-else class="p-3.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-teal-600 text-white flex items-center justify-between">
            <span class="text-xs font-semibold bg-white/20 px-2 py-0.5 rounded-md backdrop-blur-xs">
              {{ announcements[0].building?.name || 'ประกาศทั่วไป' }}
            </span>
            <span v-if="!isRead(announcements[0].id)" class="text-xs font-bold bg-rose-500 text-white px-2 py-0.5 rounded-full shadow-2xs animate-pulse">
              ข่าวใหม่
            </span>
          </div>

          <div class="p-4 space-y-2">
            <div class="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>{{ formatDate(announcements[0].createdAt) }}</span>
              <span>{{ announcements[0].createdBy || 'ผู้ดูแลหอพัก' }}</span>
            </div>
            <h3 class="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
              {{ announcements[0].title }}
            </h3>
            <p class="text-xs text-slate-500 line-clamp-2 leading-relaxed">
              {{ announcements[0].content }}
            </p>
            <div class="pt-2 flex items-center justify-between text-xs font-semibold text-emerald-600 border-t border-slate-50">
              <span>อ่านรายละเอียดข่าว</span>
              <ChevronRight class="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>

        <!-- Multiple Announcements: Horizontal Swipeable Showcase -->
        <!-- ครอบด้วย relative + เพิ่มเงาไล่สีขอบขวา เพื่อบอกใบ้ว่ายังเลื่อนดูการ์ดถัดไปได้อีก ไม่ให้การ์ดสุดท้ายดูเหมือนถูกตัดขาดดื้อๆ -->
        <div v-else class="relative">
          <div
            class="flex gap-3 overflow-x-auto pb-1.5 scrollbar-none snap-x snap-mandatory"
          >
            <div
              v-for="item in announcements"
              :key="item.id"
              @click="openAnnouncementModal(item)"
              class="w-[270px] sm:w-[300px] shrink-0 snap-start bg-white rounded-xl border border-slate-100/90 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group cursor-pointer active:scale-[0.99]"
            >
              <!-- Cover or Header -->
              <div>
                <div v-if="item.imageUrl && !failedAnnouncementImageIds.has(item.id)" class="w-full h-28 relative overflow-hidden bg-slate-100">
                  <img
                    :src="item.imageUrl"
                    :alt="item.title"
                    class="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    @error="handleAnnouncementImageError(item.id)"
                  />
                  <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                  <span
                    v-if="!isRead(item.id)"
                    class="absolute top-2.5 left-2.5 px-2 py-0.5 text-xs font-bold rounded-full bg-rose-500 text-white shadow-2xs animate-pulse"
                  >
                    ใหม่
                  </span>
                  <span
                    class="absolute bottom-2 left-2 px-2 py-0.5 text-xs font-medium rounded-md bg-black/60 text-white backdrop-blur-md"
                  >
                    {{ item.building?.name || 'ประกาศทั่วไป' }}
                  </span>
                </div>
                <div v-else class="p-2.5 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-teal-500/10 border-b border-slate-100/80 flex items-center justify-between">
                  <span class="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                    {{ item.building?.name || 'ประกาศทั่วไป' }}
                  </span>
                  <span v-if="!isRead(item.id)" class="text-xs font-bold bg-rose-500 text-white px-2 py-0.5 rounded-full shadow-2xs animate-pulse">
                    ใหม่
                  </span>
                </div>

                <!-- Content Body -->
                <div class="p-3.5 space-y-1.5">
                  <div class="text-xs text-slate-400 font-mono">
                    {{ formatDate(item.createdAt) }}
                  </div>
                  <h3 class="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
                    {{ item.title }}
                  </h3>
                  <p class="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {{ item.content }}
                  </p>
                </div>
              </div>

              <div class="p-3 pt-0 flex items-center justify-between text-xs font-semibold text-emerald-600 border-t border-slate-50 mt-1">
                <span>อ่านต่อ</span>
                <ChevronRight class="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>

          <!-- Edge Fade: บอกใบ้ว่าเลื่อนดูต่อได้ (แสดงเฉพาะตอนมีมากกว่า 1 การ์ด) -->
          <div class="pointer-events-none absolute top-0 right-0 bottom-1.5 w-10 bg-gradient-to-l from-slate-50 via-slate-50/70 to-transparent"></div>
        </div>
      </div>

      <!-- 3.8 Roommates & Co-Residents Section (สมาชิกในห้องพัก) -->
      <div class="p-4 sm:p-5 bg-white rounded-xl border border-slate-100 shadow-xs space-y-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="w-7 h-7 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
              <Users class="w-4 h-4" />
            </div>
            <div>
              <h2 class="text-xs font-bold text-slate-800">
                สมาชิกร่วมห้องพัก
              </h2>
              <p class="text-xs text-slate-400 mt-0.5">
                ห้อง {{ selectedRoom?.roomNumber || tenantProfile.roomNumber }} ({{ 1 + (tenantProfile.roommates?.length || 0) }} คน)
              </p>
            </div>
          </div>

          <button
            v-if="tenantProfile.isPrimaryTenant !== false"
            @click="handleCreateRoommateInvite"
            :disabled="generatingInvite"
            class="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            :style="{ backgroundColor: themeColor }"
          >
            <UserPlus class="w-3.5 h-3.5" />
            <span>{{ generatingInvite ? 'กำลังสร้าง...' : 'เชิญรูมเมท' }}</span>
          </button>
        </div>

        <!-- Roommates List -->
        <div class="space-y-2 pt-1">
          <!-- Self (Current User) -->
          <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3">
            <div class="flex items-center gap-2.5 min-w-0">
              <img
                v-if="tenantProfile.avatarUrl"
                :src="tenantProfile.avatarUrl"
                :alt="`${tenantProfile.firstName} ${tenantProfile.lastName}`"
                class="w-8 h-8 rounded-full object-cover border border-white shadow-2xs shrink-0"
              />
              <div v-else class="w-8 h-8 rounded-full bg-teal-100 text-teal-700 font-bold text-xs flex items-center justify-center shrink-0">
                {{ tenantInitial }}
              </div>
              <div class="min-w-0 flex-1">
                <div class="text-xs font-bold text-slate-800 truncate flex items-center gap-1.5">
                  <span>{{ tenantProfile.firstName }} {{ tenantProfile.lastName }}</span>
                  <span class="text-xs px-1.5 py-0.2 bg-teal-100 text-teal-700 rounded-md font-semibold">คุณ</span>
                </div>
                <div class="text-xs text-slate-400 font-mono">{{ tenantProfile.phone || '-' }}</div>
              </div>
            </div>
            <span
              class="px-2 py-0.5 text-xs font-bold rounded-full shrink-0"
              :class="tenantProfile.isPrimaryTenant !== false ? 'bg-amber-100 text-amber-800' : 'bg-sky-100 text-sky-800'"
            >
              {{ tenantProfile.isPrimaryTenant !== false ? 'ผู้เช่าหลัก' : 'ผู้อยู่อาศัยร่วม' }}
            </span>
          </div>

          <!-- Other Roommates -->
          <template v-if="tenantProfile.roommates && tenantProfile.roommates.length > 0">
            <div
              v-for="mate in tenantProfile.roommates"
              :key="mate.id"
              class="p-2.5 rounded-xl bg-white border border-slate-100/90 hover:border-slate-200 flex items-center justify-between gap-3 transition-colors"
            >
              <div class="flex items-center gap-2.5 min-w-0">
                <img
                  v-if="mate.linePictureUrl"
                  :src="mate.linePictureUrl"
                  :alt="mate.name || `${mate.firstName} ${mate.lastName}`"
                  class="w-8 h-8 rounded-full object-cover border border-slate-100 shadow-2xs shrink-0"
                />
                <div v-else class="w-8 h-8 rounded-full bg-slate-100 text-slate-600 font-bold text-xs flex items-center justify-center shrink-0">
                  {{ (mate.firstName || 'R').charAt(0) }}
                </div>
                <div class="min-w-0 flex-1">
                  <div class="text-xs font-bold text-slate-800 truncate">
                    {{ mate.name || `${mate.firstName} ${mate.lastName}` }}
                  </div>
                  <div class="text-xs text-slate-400 font-mono">{{ mate.phone || '-' }}</div>
                </div>
              </div>
              <span class="px-2 py-0.5 text-xs font-bold rounded-full bg-slate-100 text-slate-600 shrink-0">
                ผู้อยู่อาศัยร่วม
              </span>
            </div>
          </template>

          <div v-else class="p-3 text-center rounded-xl bg-slate-50/50 border border-dashed border-slate-200/80 text-xs text-slate-400">
            ยังไม่มีผู้อยู่อาศัยร่วมในห้องนี้ แตะปุ่ม "เชิญรูมเมท" เพื่อแชร์รหัสเชิญ
          </div>
        </div>
      </div>

      <!-- 3.9 Meter Usage History & Trends (สถิติการใช้น้ำ-ไฟ ย้อนหลัง 6 เดือน) -->
      <div class="p-4 sm:p-5 bg-white rounded-xl border border-slate-100 shadow-xs space-y-3.5">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div
              class="w-7 h-7 rounded-xl flex items-center justify-center shrink-0 transition-colors"
              :class="meterTypeFilter === 'electric' ? 'bg-amber-50 text-amber-600' : 'bg-cyan-50 text-cyan-600'"
            >
              <Zap v-if="meterTypeFilter === 'electric'" class="w-4 h-4" />
              <Droplets v-else class="w-4 h-4" />
            </div>
            <div>
              <h2 class="text-xs font-bold text-slate-800">
                สถิติการใช้น้ำ-ไฟ ย้อนหลัง
              </h2>
              <p class="text-xs text-slate-400 mt-0.5">
                ห้อง {{ selectedRoom?.roomNumber || tenantProfile.roomNumber }} (6 เดือนล่าสุด)
              </p>
            </div>
          </div>

          <!-- Type Switcher Pill -->
          <div class="flex items-center p-0.5 bg-slate-100 rounded-xl text-xs font-semibold">
            <button
              @click="meterTypeFilter = 'electric'"
              class="px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1"
              :class="meterTypeFilter === 'electric' ? 'bg-white text-slate-800 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-800'"
            >
              <Zap class="w-3 h-3 text-amber-500" />
              <span>ค่าไฟ</span>
            </button>
            <button
              @click="meterTypeFilter = 'water'"
              class="px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1"
              :class="meterTypeFilter === 'water' ? 'bg-white text-slate-800 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-800'"
            >
              <Droplets class="w-3 h-3 text-cyan-500" />
              <span>ค่าน้ำ</span>
            </button>
          </div>
        </div>

        <!-- Latest Summary Stats -->
        <div v-if="latestMeterUsage" class="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
          <div>
            <div class="text-xs text-slate-400 font-medium">รอบบิลล่าสุด ({{ latestMeterUsage.billingCycle }})</div>
            <div class="text-base font-bold text-slate-800 mt-0.5 flex items-baseline gap-1">
              <span>{{ Number(latestMeterUsage.unitsUsed || 0).toLocaleString() }}</span>
              <span class="text-xs font-normal text-slate-500">{{ meterTypeFilter === 'electric' ? 'kWh' : 'หน่วย' }}</span>
            </div>
          </div>
          <div v-if="meterTrendPercent !== null" class="text-right">
            <div class="text-xs text-slate-400 font-medium">เทียบเดือนก่อนหน้า</div>
            <div
              class="text-xs font-bold mt-0.5 flex items-center justify-end gap-1"
              :class="meterTrendPercent > 0 ? 'text-rose-600' : 'text-emerald-600'"
            >
              <TrendingUp v-if="meterTrendPercent > 0" class="w-3.5 h-3.5" />
              <TrendingDown v-else class="w-3.5 h-3.5" />
              <span>{{ meterTrendPercent > 0 ? `+${meterTrendPercent}%` : `${meterTrendPercent}%` }}</span>
            </div>
          </div>
        </div>

        <!-- Inline SVG Bar Chart -->
        <div v-if="filteredMeterRecords.length > 0" class="pt-2">
          <div class="h-32 w-full flex items-end justify-between gap-2 px-1">
            <div
              v-for="(rec, idx) in filteredMeterRecords"
              :key="rec.id || idx"
              class="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group"
            >
              <!-- Value Label -->
              <span class="text-xs font-bold text-slate-600 transition-transform group-hover:scale-110">
                {{ Number(rec.unitsUsed || 0) }}
              </span>

              <!-- Bar -->
              <div class="w-full max-w-[36px] bg-slate-100 rounded-t-lg relative flex items-end overflow-hidden" style="height: 72px;">
                <div
                  class="w-full rounded-t-lg transition-all duration-500"
                  :class="meterTypeFilter === 'electric' ? 'bg-gradient-to-t from-amber-500 to-amber-400 group-hover:from-amber-600 group-hover:to-amber-500' : 'bg-gradient-to-t from-cyan-500 to-cyan-400 group-hover:from-cyan-600 group-hover:to-cyan-500'"
                  :style="{ height: `${Math.max(8, Math.min(100, (Number(rec.unitsUsed || 0) / maxMeterUnits) * 100))}%` }"
                ></div>
              </div>

              <!-- Cycle Label -->
              <span class="text-xs text-slate-400 font-mono truncate max-w-full">
                {{ rec.billingCycle }}
              </span>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="p-6 text-center rounded-xl bg-slate-50/50 border border-dashed border-slate-200/80 space-y-1">
          <BarChart3 class="w-6 h-6 text-slate-300 mx-auto" />
          <div class="text-xs font-semibold text-slate-600">ยังไม่มีประวัติการจดมิเตอร์</div>
          <p class="text-xs text-slate-400">ระบบจะแสดงกราฟเมื่อมีการบันทึกมิเตอร์รอบบิลแรก</p>
        </div>
      </div>
      </template>

      <!-- 4. Personal Profile & Settings Link Card -->
      <router-link
        to="/liff/settings"
        class="p-4 bg-white hover:bg-slate-50 rounded-xl border border-slate-100 shadow-xs flex items-center justify-between transition-all group cursor-pointer block"
      >
        <div class="flex items-center gap-3 min-w-0">
          <div class="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
            <User class="w-4.5 h-4.5" />
          </div>
          <div class="min-w-0 flex-1">
            <div class="font-bold text-xs text-slate-800 group-hover:text-teal-600 transition-colors flex items-center gap-1.5 flex-wrap">
              <span>โปรไฟล์และการตั้งค่า</span>
              <span class="px-2 py-0.5 text-xs font-semibold bg-teal-50 text-teal-600 rounded-full border border-teal-100">Settings</span>
            </div>
            <div class="text-xs text-slate-400 font-medium mt-0.5 truncate">
              เปลี่ยนรหัส PIN, ข้อมูลผู้เช่า, รถยนต์/มอเตอร์ไซค์
            </div>
          </div>
        </div>
        <div class="w-7 h-7 rounded-xl bg-slate-50 group-hover:bg-teal-50 group-hover:text-teal-600 flex items-center justify-center transition-all text-slate-400 shrink-0 ml-2">
          <ChevronRight class="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </router-link>
    </div>

    <!-- Digital ID QR Code Modal -->
    <div v-if="showQrModal" class="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div class="bg-white rounded-xl p-6 max-w-sm w-full shadow-lg space-y-4 border border-slate-100 text-center relative">
        <button @click="showQrModal = false" class="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1">
          <X class="w-5 h-5" />
        </button>

        <div class="space-y-1 pt-2">
          <h3 class="text-base font-bold text-slate-900">Digital Tenant ID</h3>
          <p class="text-xs text-slate-500">แสดง QR Code นี้แก่เจ้าหน้าที่หอพัก</p>
        </div>

        <div class="py-2">
          <img :src="digitalIdQrUrl" alt="Digital ID QR" class="w-48 h-48 mx-auto rounded-xl border border-slate-100 p-1 bg-white" />
        </div>

        <div class="p-3 bg-slate-50 rounded-xl text-xs space-y-1 text-slate-600 font-mono">
          <div>ผู้เช่า: <span class="font-bold text-slate-800">{{ tenantProfile.firstName }} {{ tenantProfile.lastName }}</span></div>
          <div>ห้องพัก: <span class="font-bold text-teal-600">{{ formattedRooms }}</span></div>
        </div>

        <button
          @click="showQrModal = false"
          class="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
        >
          ปิดหน้าต่าง
        </button>
      </div>
    </div>

    <!-- Roommate Invite Modal -->
    <div v-if="showRoommateModal" class="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div class="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl space-y-4 border border-slate-100 text-center relative animate-in fade-in zoom-in-95 duration-150">
        <button @click="showRoommateModal = false" class="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-lg cursor-pointer">
          <X class="w-5 h-5" />
        </button>

        <div class="space-y-1 pt-1">
          <div class="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto mb-2">
            <UserPlus class="w-5 h-5" />
          </div>
          <h3 class="text-base font-bold text-slate-900">เชิญรูมเมทเข้าห้องพัก</h3>
          <p class="text-xs text-slate-500">
            แชร์รหัสเชิญหรือ QR Code ให้เพื่อนร่วมห้องสแกนเพื่อผูกบัญชี LINE
          </p>
        </div>

        <!-- QR Code -->
        <div v-if="roommateQrUrl" class="py-1">
          <img :src="roommateQrUrl" alt="Roommate Invite QR" class="w-44 h-44 mx-auto rounded-xl border border-slate-100 p-2 bg-white shadow-2xs" />
        </div>

        <!-- Invite Code Box -->
        <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5">
          <div class="text-xs font-semibold text-slate-400 uppercase tracking-wider">รหัสเชิญรูมเมท (6 หลัก)</div>
          <div class="text-2xl font-black font-mono tracking-widest text-teal-600" :style="{ color: themeColor }">
            {{ roommateInviteData?.code }}
          </div>
          <div class="text-xs text-slate-400">
            ห้อง {{ roommateInviteData?.roomNumber }} | หมดอายุใน 7 วัน
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="space-y-2 pt-1">
          <button
            @click="copyRoommateCode"
            class="w-full py-2.5 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-teal-600/20 flex items-center justify-center gap-1.5 cursor-pointer"
            :style="{ backgroundColor: themeColor }"
          >
            <Copy class="w-3.5 h-3.5" />
            <span>คัดลอกรหัสเชิญ</span>
          </button>
          <button
            @click="showRoommateModal = false"
            class="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>

    <!-- Link Room Modal -->
    <div v-if="showLinkRoomModal" class="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div class="bg-white rounded-xl p-6 max-w-sm w-full shadow-lg space-y-4 border border-slate-100 relative">
        <button @click="showLinkRoomModal = false" class="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1">
          <X class="w-5 h-5" />
        </button>

        <div class="space-y-1 pt-2 text-center">
          <h3 class="text-base font-bold text-slate-900">ผูกห้องพักเพิ่มเติม</h3>
          <p class="text-xs text-slate-500">กรอกรหัสเชิญ (Invite Code) ที่ได้รับจากเจ้าหน้าที่หอพัก</p>
        </div>

        <form @submit.prevent="handleLinkRoom" class="space-y-3">
          <div class="space-y-1">
            <label for="profile-link-room-invite-code" class="block text-xs font-medium text-slate-700">รหัสเชิญห้องพัก</label>
            <input
              id="profile-link-room-invite-code"
              v-model="inviteCodeInput"
              type="text"
              placeholder="เช่น ROOM-A102-XYZ"
              required
              class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-mono text-center uppercase focus:outline-hidden focus:border-teal-400"
            />
          </div>

          <div class="flex gap-2 pt-2">
            <button
              type="button"
              @click="showLinkRoomModal = false"
              class="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium text-xs transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              :disabled="linkingRoom"
              class="flex-1 py-2.5 bg-teal-500 hover:bg-teal-600 text-white rounded-xl font-semibold text-xs transition-colors disabled:opacity-50"
            >
              {{ linkingRoom ? 'กำลังผูกห้อง...' : 'ยืนยันผูกห้อง' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Announcement Detail Modal Popup -->
    <Teleport to="body">
      <div
        v-if="selectedAnnouncement"
        class="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
        @click.self="closeAnnouncementModal"
      >
        <div
          class="bg-white w-full sm:max-w-lg rounded-t-[2rem] sm:rounded-xl shadow-2xl max-h-[90dvh] flex flex-col overflow-hidden animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200"
        >
          <!-- Modal Top Header Bar -->
          <div class="shrink-0 px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-white/95 backdrop-blur-md sticky top-0 z-10">
            <div class="flex items-center gap-2">
              <span class="px-2.5 py-0.5 text-xs font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                {{ selectedAnnouncement.building?.name || 'ประกาศทั่วไป' }}
              </span>
              <span class="text-xs text-slate-400 font-mono">
                {{ formatDate(selectedAnnouncement.createdAt) }}
              </span>
            </div>

            <button
              @click="closeAnnouncementModal"
              class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X class="w-4 h-4" />
            </button>
          </div>

          <!-- Scrollable Modal Content -->
          <div class="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
            <!-- Full Cover Image -->
            <div v-if="selectedAnnouncement.imageUrl" class="w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-100 shadow-xs">
              <img
                :src="selectedAnnouncement.imageUrl"
                :alt="selectedAnnouncement.title"
                class="w-full max-h-72 object-cover object-center"
              />
            </div>

            <!-- Title -->
            <h2 class="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
              {{ selectedAnnouncement.title }}
            </h2>

            <!-- Author & Metadata Pill -->
            <div class="flex items-center gap-3 p-3 bg-slate-50/80 rounded-xl border border-slate-100 text-xs text-slate-600">
              <div class="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <User class="w-3.5 h-3.5" />
              </div>
              <div>
                <div class="text-xs text-slate-400">ผู้ประกาศ</div>
                <div class="font-semibold text-slate-800">{{ selectedAnnouncement.createdBy || 'ผู้ดูแลหอพัก' }}</div>
              </div>
            </div>

            <!-- Content Body -->
            <div class="prose prose-sm text-slate-700 leading-relaxed whitespace-pre-line text-sm pt-2 border-t border-slate-100">
              {{ selectedAnnouncement.content }}
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="shrink-0 p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
            <button
              @click="closeAnnouncementModal"
              class="w-full sm:w-auto px-6 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
            >
              รับทราบ / ปิดหน้าต่าง
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useFeatureStore } from '@/stores/useFeatureStore';
import { useDynamicTheme } from '@/composables/useDynamicTheme';
import { useAnnouncements } from '@/composables/useAnnouncements';
import { initLiff, isLiffLoggedIn, getLiffProfile, loginLiff, openAddFriendLine } from '@/utils/liff';
import api from '@/utils/api';
import { showSuccess, showError } from '@/utils/swal';
import { formatShortDate as formatDate } from '@/utils/formatters';
import QRCode from 'qrcode';
import {
  CreditCard,
  Wrench,
  Package,
  Megaphone,
  User,
  QrCode,
  ChevronRight,
  PlusCircle,
  X,
  DoorClosed,
  Store,
  Coffee,
  Car,
  CalendarCheck,
  Vote,
  Radio,
  Check,
  CheckCircle2,
  Users,
  UserPlus,
  Copy,
  MessageSquare,
  Building2,
  ArrowRightLeft,
  Eye,
  Droplets,
  Zap,
  BarChart3,
  TrendingUp,
  TrendingDown,
  FileText
} from 'lucide-vue-next';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const featureStore = useFeatureStore();
const { themeColor, applyTheme, adjustBrightness } = useDynamicTheme();
const {
  latestUnreadAnnouncements,
  announcements,
  unreadCount,
  isRead,
  checkUnread,
  markAsRead
} = useAnnouncements();

// ไอคอนตามประเภทห้อง/ยูนิต (Mapping เดียวกับ getUnitTypeIcon ใน RoomOverviewCard.vue ฝั่ง CMS Admin)
const unitTypeIconMap = {
  commercial_shop: Store,
  vending_spot: Coffee,
  parking: Car,
  storage: Package,
  billboard_rooftop: Radio
};
const getRoomIcon = (unitType) => unitTypeIconMap[unitType] || DoorClosed;

const loading = ref(true);
const isPreviewMode = ref(false);
const showQrModal = ref(false);
const showLinkRoomModal = ref(false);
const showRoommateModal = ref(false);
const generatingInvite = ref(false);
const roommateInviteData = ref(null);
const roommateQrUrl = ref('');
const sessionExpired = ref(false);
const imageLoadError = ref(false);
const inviteCodeInput = ref('');
const linkingRoom = ref(false);
const digitalIdQrUrl = ref('');
const currentLineUserId = ref('');
const selectedAnnouncement = ref(null);

const unpaidInvoices = ref([]);
const pendingParcels = ref([]);
const activeMaintenance = ref([]);

const totalUnpaidAmount = computed(() => {
  return unpaidInvoices.value.reduce((sum, inv) => sum + Number(inv.grandTotal || 0), 0);
});

const hasAnyActionItems = computed(() => {
  return (
    (featureStore.isEnabled('ENABLE_LINE_PAYMENT') && unpaidInvoices.value.length > 0) ||
    (featureStore.isEnabled('ENABLE_PARCEL_NOTIFY') && pendingParcels.value.length > 0) ||
    (featureStore.isEnabled('ENABLE_MAINTENANCE_REQUEST') && activeMaintenance.value.length > 0)
  );
});

const formatMaintenanceStatus = (status) => {
  const map = {
    pending: 'รอดำเนินการ',
    in_progress: 'กำลังเข้าซ่อม',
    assigned: 'มอบหมายช่างแล้ว',
    resolved: 'เสร็จสิ้น',
    completed: 'เสร็จสิ้น'
  };
  return map[status] || status || 'กำลังดำเนินการ';
};

const goToPayment = (invoice) => {
  if (invoice?.id) {
    router.push(`/liff/pay/${invoice.id}`);
  } else {
    router.push('/liff/invoices');
  }
};

const fetchLiveActionMetrics = async (lineUserId = '') => {
  try {
    const params = {};
    if (lineUserId) params.lineUserId = lineUserId;
    const requestedRoomId = selectedRoomId.value;

    const [invoicesRes, parcelsRes, maintenanceRes, issuesRes] = await Promise.allSettled([
      api.get('/api/v1/liff/invoices/history', { params }),
      api.get('/api/v1/liff/parcels', { params }),
      api.get('/api/v1/liff/maintenance', { params }),
      api.get('/api/v1/liff/issues', { params })
    ]);
    // ผู้ใช้สลับห้องไปแล้วระหว่างรอ: ทิ้งผลของห้องเก่า กันเขียนทับข้อมูลห้องใหม่ (Race Condition)
    if (requestedRoomId !== selectedRoomId.value) return;

    // 1. Unpaid Invoices
    if (invoicesRes.status === 'fulfilled') {
      const invList = invoicesRes.value.data?.data || [];
      unpaidInvoices.value = invList.filter((i) =>
        ['unpaid', 'issued', 'overdue', 'pending_payment', 'partially_paid'].includes((i.status || '').toLowerCase())
      );
    }

    // 2. Pending Parcels
    if (parcelsRes.status === 'fulfilled') {
      const parcelList = parcelsRes.value.data?.data || [];
      pendingParcels.value = parcelList.filter((p) =>
        ['pending', 'arrived'].includes((p.status || '').toLowerCase())
      );
    }

    // 3. Active Maintenance & Issues (รวม 2 ระบบหลังบ้านเป็นตัวเลขเดียว ให้ตรงกับหน้า /liff/issues ที่ปุ่มนี้พาไป)
    const activeStatuses = ['pending', 'in_progress', 'assigned'];
    let activeTickets = [];
    if (maintenanceRes.status === 'fulfilled') {
      const mList = maintenanceRes.value.data?.data || [];
      activeTickets = activeTickets.concat(
        mList.filter((m) => activeStatuses.includes((m.status || '').toLowerCase()))
      );
    }
    if (issuesRes.status === 'fulfilled') {
      const iList = issuesRes.value.data?.data || [];
      activeTickets = activeTickets.concat(
        iList.filter((i) => activeStatuses.includes((i.status || '').toLowerCase()))
      );
    }
    activeMaintenance.value = activeTickets;
  } catch (err) {
    console.warn('Live action metrics fetch warning:', err);
  }
};

// Meter Usage History & Trends (สถิติการใช้น้ำ-ไฟ)
const meterHistory = ref([]);
const meterTypeFilter = ref('electric'); // 'electric' | 'water'
const loadingMeters = ref(false);

const fetchMeterHistory = async () => {
  try {
    loadingMeters.value = true;
    const params = {};
    const requestedRoomId = selectedRoomId.value;
    if (requestedRoomId) params.roomId = requestedRoomId;
    const res = await api.get('/api/v1/liff/meter-history', { params });
    if (requestedRoomId !== selectedRoomId.value) return;
    if (res.data?.success) {
      meterHistory.value = res.data.data || [];
    }
  } catch (err) {
    console.warn('Failed to fetch meter history:', err.message);
  } finally {
    loadingMeters.value = false;
  }
};

const filteredMeterRecords = computed(() => {
  return (meterHistory.value || []).filter((r) => r.meterType === meterTypeFilter.value);
});

const latestMeterUsage = computed(() => {
  const records = filteredMeterRecords.value;
  if (!records.length) return null;
  return records[records.length - 1];
});

const previousMeterUsage = computed(() => {
  const records = filteredMeterRecords.value;
  if (records.length < 2) return null;
  return records[records.length - 2];
});

const meterTrendPercent = computed(() => {
  if (!latestMeterUsage.value || !previousMeterUsage.value) return null;
  const curr = Number(latestMeterUsage.value.unitsUsed || 0);
  const prev = Number(previousMeterUsage.value.unitsUsed || 0);
  if (prev === 0) return null;
  return Math.round(((curr - prev) / prev) * 100);
});

const maxMeterUnits = computed(() => {
  const units = filteredMeterRecords.value.map((r) => Number(r.unitsUsed || 0));
  if (!units.length) return 100;
  const max = Math.max(...units);
  return max > 0 ? max : 100;
});

const openAnnouncementModal = (item) => {
  selectedAnnouncement.value = item;
  if (item?.id) {
    markAsRead(item.id);
  }
};

const closeAnnouncementModal = () => {
  selectedAnnouncement.value = null;
};

const tenantProfile = reactive({
  firstName: authStore.tenant?.firstName || '',
  lastName: authStore.tenant?.lastName || '',
  roomNumber: authStore.tenant?.roomNumber || '',
  rooms: authStore.tenant?.rooms || [],
  phone: authStore.tenant?.phone || '',
  lineUserId: authStore.tenant?.lineUserId || '',
  avatarUrl: authStore.tenant?.avatarUrl || authStore.tenant?.linePictureUrl || '',
  isOwner: Boolean(authStore.tenant?.isOwner || authStore.isOwner),
  availableRoles: authStore.availableRoles || []
});

const tenantInitial = computed(() => {
  if (tenantProfile.firstName && tenantProfile.firstName.trim()) {
    return tenantProfile.firstName.trim().charAt(0).toUpperCase();
  }
  return 'U';
});

const handleAvatarError = () => {
  imageLoadError.value = true;
};

// รูปปกข่าวสาร/ประกาศที่โหลดไม่สำเร็จ (ลิงก์เสีย) - เก็บ id ไว้เพื่อสลับไปแสดงหัวการ์ดแบบไม่มีรูปแทน กันไม่ให้เห็นกล่องว่างๆ
const failedAnnouncementImageIds = ref(new Set());
const handleAnnouncementImageError = (id) => {
  failedAnnouncementImageIds.value.add(id);
  // ต้องสร้าง Set ใหม่เพื่อให้ Vue reactivity ตรวจจับการเปลี่ยนแปลงได้
  failedAnnouncementImageIds.value = new Set(failedAnnouncementImageIds.value);
};

const failedRoomLogoIds = ref(new Set());
const handleRoomLogoError = (id) => {
  failedRoomLogoIds.value.add(id);
  failedRoomLogoIds.value = new Set(failedRoomLogoIds.value);
};

const selectedRoomId = ref('');

const selectedRoom = computed(() => {
  if (!tenantProfile.rooms || tenantProfile.rooms.length === 0) return null;
  return tenantProfile.rooms.find((r) => r.id === selectedRoomId.value) || tenantProfile.rooms[0];
});

// true ระหว่างโหลดข้อมูลห้องใหม่: ส่วนที่ผูกกับห้อง (แจ้งเตือน/เมนู/ข่าว/รูมเมท/มิเตอร์) แสดง Skeleton แทน
// ไม่ให้เห็นข้อมูลห้องเก่าค้างแวบหนึ่ง หรือเมนูของตึกเก่าที่กดได้ก่อนฟีเจอร์ตึกใหม่โหลดเสร็จ
const switchingRoom = ref(false);

const clearRoomScopedData = () => {
  unpaidInvoices.value = [];
  pendingParcels.value = [];
  activeMaintenance.value = [];
  meterHistory.value = [];
};

const selectRoom = async (room) => {
  if (!room || room.id === selectedRoomId.value) return;
  switchingRoom.value = true;
  clearRoomScopedData();
  selectedRoomId.value = room.id;
  authStore.setActiveRoom(room);
  tenantProfile.roomNumber = room.roomNumber;
  applyTheme(room);
  const lineUserId = currentLineUserId.value || tenantProfile.lineUserId;
  try {
    await Promise.allSettled([
      featureStore.fetchFeatures(authStore.activeBuildingId),
      fetchMeterHistory(),
      fetchLiveActionMetrics(lineUserId),
      checkUnread(lineUserId)
    ]);
  } finally {
    // กดสลับรัวๆ: ให้ห้องล่าสุดเป็นคนปิด Skeleton เท่านั้น
    if (selectedRoomId.value === room.id) switchingRoom.value = false;
  }
};

const formattedRooms = computed(() => {
  if (tenantProfile.rooms && tenantProfile.rooms.length > 0) {
    return tenantProfile.rooms.map((r) => `ห้อง ${r.roomNumber}`).join(', ');
  }
  return `ห้อง ${tenantProfile.roomNumber || '-'}`;
});

/**
 * หาตึกที่ควรใช้เช็ค Feature Toggle ตอนเจ้าของ/แอดมินเปิด LIFF แบบ "โหมดจำลอง" (ไม่มีข้อมูลผู้เช่าจริงผูกอยู่)
 * เรียงลำดับความน่าเชื่อถือ: ตึกที่เพิ่งเลือกใน Owner Dashboard (horspace_selected_building_id) ก่อน แล้วค่อย
 * Fallback ไปตึกที่กำลังเปิดอยู่ฝั่ง CMS Admin (activeBuildingId, เผื่อทดสอบผ่าน Browser เดียวกัน) —
 * ไม่งั้นจะ Fetch แบบ Global ที่ไม่เคยถูกปิด ทำให้พรีวิวเห็นฟีเจอร์เปิดหมดทั้งที่ปิดไว้เฉพาะตึกแล้วจริงๆ
 */
const resolvePreviewBuildingId = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('horspace_selected_building_id') || localStorage.getItem('activeBuildingId') || null;
};

const fetchTenantProfile = async (lineUserId = '') => {
  try {
    const params = {};
    if (lineUserId) params.lineUserId = lineUserId;
    if (route.query.room) params.room = route.query.room;
    if (route.query.roomNumber) params.roomNumber = route.query.roomNumber;
    if (route.query.tenantId) params.tenantId = route.query.tenantId;

    const res = await api.get('/api/v1/liff/profile', { params });
    if (res.data?.success && res.data?.data) {
      sessionExpired.value = false;
      const data = res.data.data;
      tenantProfile.firstName = data.firstName || 'ผู้เช่า';
      tenantProfile.lastName = data.lastName || '';
      tenantProfile.roomNumber = data.roomNumber || '-';
      tenantProfile.rooms = data.rooms || [];
      tenantProfile.phone = data.phone || '';
      tenantProfile.lineUserId = data.lineUserId || '';
      tenantProfile.residentRole = data.residentRole || 'PRIMARY';
      tenantProfile.isPrimaryTenant = data.isPrimaryTenant ?? true;
      tenantProfile.roommates = data.roommates || [];
      tenantProfile.isOwner = Boolean(data.isOwner);
      tenantProfile.availableRoles = data.availableRoles || (data.isOwner ? ['tenant', 'owner'] : ['tenant']);

      // อัปเดตข้อมูลสิทธิ์ลง Pinia authStore แบบเรียลไทม์
      authStore.setTenant(data);
      if (data.availableRoles && data.availableRoles.length > 0) {
        authStore.setAvailableRoles(data.availableRoles);
      } else if (data.isOwner) {
        authStore.setAvailableRoles(['tenant', 'owner']);
      }

      if (data.linePictureUrl && !tenantProfile.avatarUrl) {
        tenantProfile.avatarUrl = data.linePictureUrl;
      }

      let targetBuildingId = data.buildingId || null;
      if (tenantProfile.rooms.length > 0) {
        const storedRoomId = localStorage.getItem('active_tenant_room_id');
        const matched = tenantProfile.rooms.find((r) => r.id === storedRoomId) || tenantProfile.rooms[0];
        selectedRoomId.value = matched.id;
        tenantProfile.roomNumber = matched.roomNumber;
        targetBuildingId = matched.buildingId || targetBuildingId;
        authStore.setActiveRoom({ ...matched, buildingId: targetBuildingId });
        applyTheme(matched);
      } else {
        authStore.setActiveRoom({ id: null, buildingId: targetBuildingId });
        applyTheme(data);
      }
      await featureStore.fetchFeatures(targetBuildingId);
    } else if (authStore.isOwner) {
      // Pure Owner / Executive with no tenant record -> Activate Preview Mode gracefully
      // ใช้ตึกที่เจ้าของเลือกไว้ล่าสุดจาก Owner Dashboard (horspace_selected_building_id) แทนการดึงแบบ
      // Global เสมอ — เดิม fetchFeatures(null) ทำให้พรีวิวเห็นฟีเจอร์ที่ปิดไว้เฉพาะตึกยังเปิดอยู่ (Global
      // Default ไม่เคยถูกแตะ มีแต่ Override รายตึกเท่านั้น)
      isPreviewMode.value = true;
      sessionExpired.value = false;
      tenantProfile.firstName = authStore.user?.name || authStore.currentUser?.name || 'ผู้ดูแลอาคาร';
      tenantProfile.lastName = '(โหมดจำลอง)';
      tenantProfile.roomNumber = 'PREVIEW';
      tenantProfile.isOwner = true;
      tenantProfile.isPrimaryTenant = true;
      await featureStore.fetchFeatures(resolvePreviewBuildingId());
    }
  } catch (err) {
    console.warn('Failed to fetch tenant profile from API:', err.message);
    if (authStore.isOwner) {
      isPreviewMode.value = true;
      sessionExpired.value = false;
      tenantProfile.firstName = authStore.user?.name || authStore.currentUser?.name || 'ผู้ดูแลอาคาร';
      tenantProfile.lastName = '(โหมดจำลอง)';
      tenantProfile.roomNumber = 'PREVIEW';
      tenantProfile.isOwner = true;
      tenantProfile.isPrimaryTenant = true;
      // เดิมไม่เคยเรียก fetchFeatures() เลยในสาขานี้ (Error ตอนโหลดโปรไฟล์) ทำให้ featureMap ค้างว่าง
      // isEnabled() จะ Default คืน true ทุก Key เหมือนไม่ได้ปิดอะไรไว้เลย
      await featureStore.fetchFeatures(resolvePreviewBuildingId());
      return;
    }
    if (err.response?.status === 401 || err.response?.status === 403 || !isLiffLoggedIn()) {
      sessionExpired.value = true;
      authStore.clearLiffAuth();
      router.replace('/liff');
      return;
    }
  } finally {
    loading.value = false;
  }
};

const handleLinkRoom = async () => {
  if (!inviteCodeInput.value.trim()) return;
  linkingRoom.value = true;
  try {
    const rawName = `${tenantProfile.firstName || ''} ${tenantProfile.lastName || ''}`.trim() || 'ลูกบ้าน';
    const nameParts = rawName.split(' ');
    const firstName = tenantProfile.firstName || nameParts[0] || 'ลูกบ้าน';
    const lastName = tenantProfile.lastName || (nameParts.length > 1 ? nameParts.slice(1).join(' ') : '-');

    const payload = {
      inviteCode: inviteCodeInput.value.trim().toUpperCase(),
      firstName,
      lastName,
      phone: tenantProfile.phone || '0800000000',
      lineDisplayName: firstName,
      linePictureUrl: tenantProfile.avatarUrl || undefined
    };

    const res = await api.post('/api/v1/liff/register/invite', payload);
    if (res.data?.success) {
      await showSuccess('สำเร็จ', 'เพิ่มห้องพักใหม่เข้าสู่บัญชีของคุณเรียบร้อยแล้ว');
      showLinkRoomModal.value = false;
      inviteCodeInput.value = '';
      await fetchTenantProfile(currentLineUserId.value);
    }
  } catch (err) {
    showError('เกิดข้อผิดพลาด', err.response?.data?.message || 'ไม่สามารถผูกห้องพักได้');
  } finally {
    linkingRoom.value = false;
  }
};

const handleCreateRoommateInvite = async () => {
  generatingInvite.value = true;
  try {
    const res = await api.post('/api/v1/liff/invites/roommate');
    if (res.data?.success && res.data?.data) {
      roommateInviteData.value = res.data.data;
      // ต้องใช้ https://liff.line.me/{LIFF_ID}/... ไม่ใช่ window.location.origin มิฉะนั้นสแกน/แชร์แล้วจะเปิดเป็นเว็บปกติ
      // ไม่ใช่แอป LIFF ใน LINE — เหมือน pattern เดียวกับ router/index.js, utils/liff.js
      const liffId = import.meta.env.VITE_LINE_LIFF_ID || import.meta.env.VITE_LIFF_ID || '';
      const inviteLink = liffId
        ? `https://liff.line.me/${liffId}/register?invite=${res.data.data.code}`
        : `${window.location.origin}/liff/register?invite=${res.data.data.code}`;
      roommateQrUrl.value = await QRCode.toDataURL(inviteLink, { margin: 1, width: 260 });
      showRoommateModal.value = true;
    }
  } catch (err) {
    showError('เกิดข้อผิดพลาด', err.response?.data?.message || 'ไม่สามารถสร้างรหัสเชิญได้');
  } finally {
    generatingInvite.value = false;
  }
};

const copyRoommateCode = async () => {
  if (!roommateInviteData.value?.code) return;
  try {
    await navigator.clipboard.writeText(roommateInviteData.value.code);
    await showSuccess('คัดลอกแล้ว', `คัดลอกรหัส ${roommateInviteData.value.code} เรียบร้อยแล้ว`);
  } catch (e) {
    console.warn('Clipboard write error:', e);
  }
};

// Quick Actions Grid Config
const quickActionsConfig = [
  {
    id: 'invoices',
    title: 'บิลค่าเช่า',
    subtitle: 'ชำระเงิน & ดูยอดเงิน',
    icon: CreditCard,
    bgClass: 'bg-teal-50',
    iconClass: 'text-teal-600',
    route: '/liff/invoices',
    featureKey: 'ENABLE_LINE_PAYMENT'
  },
  {
    id: 'maintenance',
    title: 'แจ้งซ่อม & ร้องเรียน',
    subtitle: 'ส่งเรื่อง & ติดตามสถานะ',
    icon: Wrench,
    bgClass: 'bg-amber-50',
    iconClass: 'text-amber-600',
    route: '/liff/issues',
    featureKey: 'ENABLE_MAINTENANCE_REQUEST'
  },
  {
    id: 'parcels',
    title: 'พัสดุของฉัน',
    subtitle: 'แจ้งเตือน & สแกนรับของ',
    icon: Package,
    bgClass: 'bg-orange-50',
    iconClass: 'text-orange-600',
    route: '/liff/parcels',
    featureKey: 'ENABLE_PARCEL_NOTIFY'
  },
  {
    id: 'announcements',
    title: 'ข่าวสาร & ประกาศ',
    subtitle: 'ประกาศสำคัญจากหอพัก',
    icon: Megaphone,
    bgClass: 'bg-sky-50',
    iconClass: 'text-sky-600',
    route: '/liff/announcements',
    featureKey: 'ENABLE_ANNOUNCEMENTS'
  },
  {
    id: 'facility',
    title: 'จองพื้นที่ส่วนกลาง',
    subtitle: 'ฟิตเนส สระว่ายน้ำ ฯลฯ',
    icon: CalendarCheck,
    bgClass: 'bg-blue-50',
    iconClass: 'text-blue-600',
    route: '/liff/facility-bookings',
    featureKey: 'ENABLE_FACILITY_BOOKING'
  },
  {
    id: 'vehicles',
    title: 'ยานพาหนะ & แขก',
    subtitle: 'ลงทะเบียนรถ & บัตรผู้มาเยือน',
    icon: Car,
    bgClass: 'bg-cyan-50',
    iconClass: 'text-cyan-600',
    route: '/liff/vehicles',
    featureKey: 'ENABLE_VEHICLE_MANAGEMENT'
  },
  {
    id: 'polls',
    title: 'โหวต & แบบสำรวจ',
    subtitle: 'ร่วมแสดงความคิดเห็น',
    icon: Vote,
    bgClass: 'bg-pink-50',
    iconClass: 'text-pink-600',
    route: '/liff/polls',
    featureKey: 'ENABLE_VOTING'
  },
  {
    id: 'contract',
    title: 'สัญญาเช่าห้องพัก',
    subtitle: 'ดูสัญญา & บันทึก PDF',
    icon: FileText,
    bgClass: 'bg-emerald-50',
    iconClass: 'text-emerald-600',
    route: '/liff/contract',
    featureKey: 'ENABLE_E_CONTRACT'
  }
];

const availableQuickActions = computed(() => {
  return quickActionsConfig.filter((menu) => {
    if (!menu.featureKey) return true;
    return featureStore.isEnabled(menu.featureKey);
  });
});

const handleMenuClick = (menu) => {
  if (menu.route) {
    const query = {};
    if (selectedRoom.value?.roomNumber) query.room = selectedRoom.value.roomNumber;
    if (selectedRoom.value?.id) query.roomId = selectedRoom.value.id;
    router.push({ path: menu.route, query });
  }
};

onMounted(async () => {
  try {
    try {
      await initLiff();
      if (isLiffLoggedIn()) {
        const profile = await getLiffProfile();
        if (profile?.userId) {
          currentLineUserId.value = profile.userId;
          if (profile.pictureUrl) {
            tenantProfile.avatarUrl = profile.pictureUrl;
            imageLoadError.value = false;
          }
        }
      } else if (!authStore.liffToken && !localStorage.getItem('dev_line_user_id')) {
        authStore.clearLiffAuth();
        router.replace('/liff');
        return;
      }
    } catch (err) {
      console.warn('LIFF init fallback mode:', err.message);
    }

    await fetchTenantProfile(currentLineUserId.value);
    await Promise.allSettled([
      checkUnread(currentLineUserId.value),
      fetchLiveActionMetrics(currentLineUserId.value),
      fetchMeterHistory()
    ]);

    if (currentLineUserId.value || tenantProfile.phone) {
      api.patch('/api/v1/liff/auth/sync-profile', {
        lineUserId: currentLineUserId.value || undefined,
        lineDisplayName: tenantProfile.firstName,
        linePictureUrl: tenantProfile.avatarUrl,
        phone: tenantProfile.phone || undefined,
        roomNumber: tenantProfile.roomNumber || undefined
      }).catch(() => {});
    }

    const payload = `TENANT-ID:${tenantProfile.firstName}-ROOMS-${tenantProfile.roomNumber}-${Date.now()}`;
    digitalIdQrUrl.value = await QRCode.toDataURL(payload, { margin: 1, width: 260 });
  } finally {
    loading.value = false;
  }
});
</script>
