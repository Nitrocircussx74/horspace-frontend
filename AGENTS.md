# 🤖 คำสั่งและข้อตกลงการทำงานสำหรับ AI Agents (AGENTS.md)

ไฟล์นี้เป็นคู่มือกลางสำหรับ AI Coding Assistants ทั้งหมด (รวมถึง **Gemini** และ **Claude**) ที่เข้ามาทำงานใน repository นี้ เพื่อให้เข้าใจโครงสร้างโปรเจกต์ กฎการเขียนโค้ด และแนวทางการทำงานร่วมกัน

---

## 🚫 กฎเหล็ก (Strict Rule): ห้ามใส่ Credit ของ AI หรือ Agent

> **ห้ามใส่ Credit, ลายเซ็น, ป้ายโลโก้ หรือข้อความอ้างอิงถึง AI / Agent ทุกประเภท** ลงในไฟล์โค้ด, คอมเมนต์, เอกสาร (Documentation), Commit messages หรือไฟล์ใดๆ ในโปรเจกต์นี้โดยเด็ดขาด

---

## 📌 ข้อมูลโปรเจกต์ (Project Overview)

- **Architecture Overview**: โปรเจกต์นี้ทำงานร่วมกันเป็นคู่ (Full-Stack Architecture) และฝั่ง Frontend เป็นแบบ **Multi-System Single Repo**:
  - 🖥️ **`playground-frontend`**:
    - **Admin Portal (`/admin`)**: เว็บจัดการหลังบ้านสำหรับผู้ดูแลหอพัก (ผูกกับ `AdminLayout.vue` มี Sidebar/Navbar + JWT Guard)
    - **Tenant LIFF App (`/liff`)**: เว็บสำหรับผู้เช่าเปิดผ่านแอป LINE (ผูกกับ `LiffLayout.vue` โมบายวิว + `@line/liff` SDK)
  - ⚙️ **`playground-api`**: ระบบ Backend (Node.js + Express + PostgreSQL + JWT + HTTP-Only Cookie)
- **Repository**: `https://github.com/Nitrocircussx74/playground-frontend` (GitHub Account: `Nitrocircussx74`)
- **Package Manager**: **Yarn** (`yarn.lock`)
- **Framework & Build Tool**: Vue 3 + Vite + Tailwind CSS v3 + Shadcn Vue
- **State Management**: **Pinia** (`src/stores/adminAuth.js`, `src/stores/liffAuth.js`, `src/stores/auth.js`)
- **LINE Integration**: **LINE Front-end Framework SDK** (`@line/liff` v2.30) - จัดการ LINE User Profile
- **Routing & Guards**: **Vue Router 4** (`src/router/index.js`) - Nested Routes แยกกิ่ง `/admin` และ `/liff`
- **HTTP Client**: **Axios** (`src/utils/api.js`) - ตั้งค่า `withCredentials: true` รองรับ HTTP-Only Cookie จาก `playground-api`
- **Production Deployment (Phase 25, 2026-10-16)**: Live ที่ `https://horspace.com` บน DigitalOcean Droplet เดี่ยว (Docker Compose, Node 22 Alpine — อัปเกรดจาก 20 เพราะ `nopt`/vite ต้องการ `>=22`) — `VITE_API_BASE_URL` ต้องส่งผ่าน Docker **build arg** เท่านั้น (`ARG`/`ENV` ใน Dockerfile + `docker-compose.yml build.args`) ห้ามพึ่ง `.env` เพราะ `.dockerignore` กันไฟล์นี้ไม่ให้เข้า build context — ถ้าลืมตั้งจะ fallback เป็น `localhost:3000` เงียบๆ ทำให้ frontend จริงยิง API ผิดที่ (Silent Refresh ตอน reload หน้า fail ทุกครั้ง หลุดกลับไปหน้า login) รายละเอียดเต็ม `docs/ACTIVITY_LOG.md` Phase 25
- **ทุก `VITE_*` env var ใหม่ต้องส่งผ่าน Docker build arg เสมอ ไม่ใช่แค่ `VITE_API_BASE_URL`** (Phase 27, 2026-11-11): `VITE_LINE_LIFF_ID` หลุดรูปแบบเดียวกันตั้งแต่ Phase 25 — ไม่เคยอยู่ใน `Dockerfile`/`docker-compose.yml` เลย ทำให้ [liff.js](file:///Users/user/Desktop/playgroud/playground/playground-frontend/src/utils/liff.js) ไม่เรียก `liff.init()` บน production จริง ผู้เช่าทุกคนที่เปิดผ่าน LINE โดน `401 UNAUTHORIZED` ทุกครั้ง (เพิ่ม `ARG`/`ENV` ใน Dockerfile + `build.args` ใน `docker-compose.yml` ครบแล้ว) — เช็ค env var ใหม่ฝังเข้า build จริงด้วย `docker inspect <image> --format "{{.Config.Env}}"` หรือ grep **entry chunk หลักเท่านั้น** (ไฟล์ที่ `index.html` ชี้ `src=` ตรงๆ) ห้ามเชื่อ grep เจอค่าใน chunk ไหนก็ได้ (เจอ false positive จาก hardcoded placeholder ใน `BuildingSettingsView.vue` มาแล้ว) รายละเอียดเต็ม `docs/ACTIVITY_LOG.md` Phase 27 — ดู Phase 26 คู่กันสำหรับปัญหาคนละแบบของตัวแปรเดียวกัน (LIFF Endpoint URL ชนกันระหว่าง dev tunnel กับ production)
- **Language Policy**: ตอบผู้ใช้และเขียนข้อความคอมเมนต์เป็น **ภาษาไทย** เท่านั้น
- **Maintenance & Issue Tracking**: Backend (`playground-api`) ยังแยก 2 ตาราง/Endpoint กันจริง (`maintenance-requests` ระบบเดิม กับ `issues` ระบบใหม่ที่รองรับทั้งซ่อม/ร้องเรียน/อื่นๆ) แต่ Frontend Unify การแสดงผลเป็นหน้าเดียวแล้วทั้งฝั่ง Admin (`MaintenanceView.vue` Kanban) และฝั่ง LIFF (`IssueHistory.vue`) - การเขียนข้อมูลใหม่จากฝั่งลูกบ้านให้ผ่าน `/liff/issues` เท่านั้น (`/liff/maintenance` เป็นแค่ Redirect เพื่อ Backward-compat)
- **LIFF Entry Detection**: [LiffEntryView.vue](file:///Users/user/Desktop/playgroud/playground/playground-frontend/src/views/LiffEntryView.vue) **ห้าม** ใช้ `liff.isInClient()` ตัดสินว่าอยู่ใน LINE App หรือไม่อีกต่อไป (ค่านี้ Unreliable ถ้า `liff.init()` ล้มเงียบๆ หรือผู้ใช้เปิดผ่าน External Browser) — ให้ลอง `loginLiff()` ก่อนเสมอ (LINE SDK จัดการทั้ง Silent Login ในแอปและ OAuth Redirect นอกแอปให้เอง) ถ้าเรียกไม่สำเร็จจริงๆ ค่อย Fallback ไป `/web/login`
- **LIFF Client Redirect Guard + Auto-Login รวมศูนย์ที่ Router Guard** ([router/index.js](file:///Users/user/Desktop/playgroud/playground/playground-frontend/src/router/index.js)): `liffNavigationGuard` เช็ค `liff.isInClient()` ก่อนทุกหน้า `/liff/*` — ถ้าไม่ได้เปิดผ่านแอป LINE จริง จะ `window.location.href` เด้งไป `https://liff.line.me/<LIFF_ID><path เดิม>` ให้อัตโนมัติ (ปิดใน `import.meta.env.DEV` เพื่อไม่รบกวนการทดสอบผ่าน Browser, เว้น `/web/login`) — ต่อจากนั้น Guard ยังเช็ค `isLiffLoggedIn()` และเรียก `loginLiff()` ให้อัตโนมัติด้วย (จำกัด 1 ครั้ง/Session ผ่าน `sessionStorage.liff_auto_login_attempted`) **ครอบคลุมทุกหน้าที่ผ่าน Guard นี้ ไม่ใช่แค่ `LiffEntryView.vue`** (เดิมมีแค่ `LiffEntryView.vue` เช็คเอง ทำให้ Deep Link เข้าหน้าอื่นตรงๆ เช่น `/liff/onboarding`, `/liff/register` ไม่มี LINE ID Token ให้ Backend ตรวจ โดน 401 "กรุณาเข้าสู่ระบบผ่าน LINE ก่อนใช้งาน") — ห้ามเพิ่ม Auto-Login Logic ซ้ำในแต่ละหน้าอีก ให้พึ่ง Guard นี้จุดเดียว
- **⚠️ Invite QR/ลิงก์ต้องเป็น `https://liff.line.me/{LIFF_ID}/...` เท่านั้น**: เคยมีบั๊กซ้ำ 4 จุด ([TenantDetail.vue](file:///Users/user/Desktop/playgroud/playground/playground-frontend/src/views/TenantDetail.vue), [TenantSecurityTab.vue](file:///Users/user/Desktop/playgroud/playground/playground-frontend/src/components/TenantSecurityTab.vue), [RoomInviteModal.vue](file:///Users/user/Desktop/playgroud/playground/playground-frontend/src/components/RoomInviteModal.vue), [LiffProfileView.vue](file:///Users/user/Desktop/playgroud/playground/playground-frontend/src/views/LiffProfileView.vue)) ที่สร้างลิงก์เชิญ/QR ด้วย `${window.location.origin}/liff/...` แทนที่จะเป็น `https://liff.line.me/{LIFF_ID}/...` — สแกน/แตะแล้วเปิดเป็นเว็บปกตินอก LINE ไม่ได้เปิดแอป LIFF จริง แก้ครบแล้วทั้ง 4 จุด (Fallback เป็น `window.location.origin` เฉพาะตอนไม่มี `VITE_LINE_LIFF_ID` ตั้งไว้เท่านั้น) — จุดใหม่ที่สร้างลิงก์/QR สำหรับเปิดผ่าน LIFF ต้องเช็ค Pattern นี้เสมอ
- **Dev Testing ผ่าน Browser (ไม่ใช้มือถือจริง)**: เติม `?devLineUserId=xxx` ต่อท้าย URL ครั้งเดียว (`main.js` Bootstrap จะ Persist ลง `localStorage.dev_line_user_id` ให้) คู่กับเปิด `LINE_AUTH_MOCK_MODE=true` ฝั่ง `playground-api/.env` — ใช้ได้เฉพาะ Dev Build (`yarn dev`) เท่านั้น เพราะกลไกนี้ถูก Gate ด้วย `import.meta.env.DEV` ทุกจุด
- **Horspace Brand Color = Teal `#0E7490`** (Sample จากโลโก้จริง, ใกล้เคียง Tailwind `cyan-700` ที่สุด) — สีนี้คือ Default ของทั้งระบบ (`tailwind.config.js`, `main.css`, `useDynamicTheme.js`) **ไม่ใช่** Purple/Indigo หรือ Blue-500 เดิม แต่ละตึกยังเปลี่ยน Theme สีของตัวเองได้ผ่าน `BuildingSettingsView.vue` (มี Preset "Horspace Teal" เป็นตัวเลือกแรก) — ห้ามใช้ `purple-*`/`indigo-*` เป็นสี CTA/Active State หลักของ CMS อีก ให้ใช้ `cyan-*`/`teal-*` แทน
- **Invite Code 2 ระบบซ้อนกัน (Auto-Redirect แล้วตั้งแต่ Phase 20)**: `/liff/onboarding` (LiffOnboardingView.vue, `Tenant.inviteCode` — ผู้เช่าเดิม) vs `/liff/register` (LiffRegisterView.vue, `RoomInvite.code` — ผู้เช่าใหม่) ยังเป็นระบบแยกกันจริงฝั่ง Backend แต่ตอนนี้ถ้าพิมพ์รหัสผิดหน้าใน `LiffRegisterView.vue` (Backend ตอบ Error Code `TENANT_LINK_CODE`) จะ Auto-Redirect ไปหน้าที่ถูกต้องให้เองพร้อมพรีฟิลรหัส ไม่ต้องรู้ล่วงหน้าว่าผู้เช่า "มีอยู่แล้ว" หรือ "ใหม่เอี่ยม" อีกต่อไป — ดู `docs/ACTIVITY_LOG.md` Phase 20
- **In-App Notification Bell (Phase 17)**: `NotificationBell.vue` Component เดียวใช้ 2 โหมด (`mode="admin"` ติดใน `App.vue` header ต่อเมื่อเลือกตึกแล้ว, `mode="tenant"` ติดใน `LiffLayout.vue` header หลังป้าย LIFF/Web Portal เฉพาะตอน `showBottomNav` = true) เรียก `src/services/notificationService.js` Poll ทุก 45s ไม่ใช้ WebSocket/SSE — Backend คู่กันดู `playground-api/docs/ACTIVITY_LOG.md` Phase 17
- **[LiffLayout.test.js](file:///Users/user/Desktop/playgroud/playground/playground-frontend/src/layouts/LiffLayout.test.js)**: เดิมมี 4 เทส Fail เพราะ `mount()` ขาด Pinia Plugin (พบระหว่าง Phase 17) — **แก้แล้ว** (`createTestingPinia()` อยู่ใน `global.plugins` แล้ว ยืนยันผ่าน `yarn vitest run` 7/7 ล่าสุด)
- **Feature Toggle Fetch ต้องมี `buildingId` เสมอ**: `stores/useFeatureStore.js` `fetchFeatures()` ถ้าไม่ส่ง `buildingId` มา จะ Derive จาก `authStore.tenant` เองอัตโนมัติ (กัน Dual-Role User ที่ Login ทั้ง CMS Admin + LIFF Tenant พร้อมกันได้ Feature Map ผิดตึก) พร้อม Request-Sequence Guard กัน Response เก่ามาทับ Response ใหม่ตอนสลับตึกเร็วๆ — หน้าใหม่ที่ต้องใช้ Feature Toggle ควรพยายามส่ง `buildingId` ที่รู้แน่ชัดมาเองเสมอถ้าทำได้ (Derive อัตโนมัติเป็นแค่ Fallback) ดู `docs/ACTIVITY_LOG.md` Phase 20
- **สลับห้อง/ตึกใน LIFF (`selectRoom()` ใน `LiffProfileView.vue`)**: จุดเดียวที่เขียน `active_tenant_room_id`/`active_tenant_building_id`/`liff_target_building` คือ `authStore.setActiveRoom(room)` (`stores/auth.js`) ห้ามเขียน `localStorage` เหล่านี้ตรงๆ จากที่อื่นอีก — สลับห้องจะ Clear State ที่ผูกกับห้องเก่าก่อนเสมอ (`unpaidInvoices`/`pendingParcels`/`activeMaintenance`/`meterHistory`) แล้วโชว์ Skeleton เฉพาะส่วนที่ผูกกับห้อง (`switchingRoom`) ระหว่างรอ Fetch ใหม่ — ทุก Fetch ที่ผูกกับห้อง (`fetchLiveActionMetrics`, `fetchMeterHistory`, `useAnnouncements.checkUnread`) มี Race-Guard เทียบ `selectedRoomId`/Sequence Number กัน Response ของห้องเก่ามาถึงทีหลังแล้วทับข้อมูลห้องใหม่ — `LiffLayout.vue` Refetch `featureStore` ทุกครั้งที่เปลี่ยนหน้า/กลับเข้าแอป (`visibilitychange`) และเช็ค `route.meta.feature` ก่อนแสดงเนื้อหา (ขึ้นข้อความ "ฟีเจอร์นี้ถูกปิดใช้งานสำหรับอาคารนี้" แทนหน้า) กัน Deep Link ตรงเข้าหน้าที่ปิดฟีเจอร์ไว้แล้ว — **Backend ต้องตรวจสิทธิ์ห้องซ้ำเสมอ** (`scopeTenantRooms` middleware ใน `playground-api`) ค่า `X-Room-Id`/`X-Building-Id` จาก Client เป็นแค่ "ห้องที่อยากดู" ไม่ใช่สิทธิ์จริง ดู `docs/ACTIVITY_LOG.md` Phase 23

---

## ⚡ คำสั่งพิเศษ: `update memory` (Memory Sync Protocol)

เมื่อผู้ใช้พิมพ์คำสั่ง **`update memory`** (หรือขอให้อัปเดตความจำ/ความรู้โปรเจกต์):
> **บังคับ (Mandatory)**: AI Agents ต้องทำการอัปเดตไฟล์ข้อมูลและคอนฟิกเหล่านี้พร้อมกันทันที:
> 1. [AGENTS.md](file:///Users/user/Desktop/playgroud/playground/playground-frontend/AGENTS.md) (ไฟล์นี้)
> 2. [GEMINI.md](file:///Users/user/Desktop/playgroud/playground/playground-frontend/GEMINI.md)
> 3. [CLAUDE.md](file:///Users/user/Desktop/playgroud/playground/playground-frontend/CLAUDE.md)
> 4. [docs/ACTIVITY_LOG.md](file:///Users/user/Desktop/playgroud/playground/playground-frontend/docs/ACTIVITY_LOG.md)
> 5. [README.md](file:///Users/user/Desktop/playgroud/playground/playground-frontend/README.md)

---

## 🛠️ คำสั่งที่ใช้ในโปรเจกต์ (Yarn Commands)

```bash
# การติดตั้ง Dependencies ด้วย Yarn
yarn install

# การรันระบบในโหมดพัฒนา (Development Server)
yarn dev

# การประกอบโปรเจกต์เพื่อการใช้งานจริง (Production Build Verification)
yarn build

# การพรีวิวผลลัพธ์ Production Build
yarn preview
```

---

## 📐 กฎการเขียนโค้ดและดีไซน์ (Code Style & Conventions)

1. **Vue 3 Composition API**: ใช้ `<script setup>` เสมอ
2. **Layer Responsibilities**:
   - `utils/api.js`: จัดการ Axios Instance, Request Headers และ Response Interceptors (Silent Refresh Queue)
   - `services/authService.js`: รวมฟังก์ชันยิง API เกี่ยวกับ Authentication เพื่อลดความซับซ้อนใน Component
   - `stores/auth.js`: จัดการ State ของระบบยืนยันตัวตน (Access Token ใน RAM, User Data, Loading State)
   - `router/index.js`: กำหนดเส้นทาง และเขียน `router.beforeEach` สำหรับตรวจสอบสิทธิ์ก่อนเข้าถึงหน้าต่างๆ
   - `views/`: หน้าจอการทำงานหลัก (`LoginView.vue`, `DashboardView.vue`, `ProfileView.vue`)
3. **Security Standards**:
   - **ห้าม** เก็บ Access Token ลงใน `localStorage` หรือ `sessionStorage` ฝั่ง Admin และฝั่ง LIFF ที่ Login ผ่าน LINE (`liffToken` ใน `stores/auth.js` เป็น Memory-only, กู้คืนผ่าน `restoreLiffSession()` ด้วย LINE ID Token Silent Login แทนการเก็บ Token ไว้)
   - **ข้อยกเว้น**: ลูกบ้านที่ Login ผ่าน [WebLogin.vue](file:///Users/user/Desktop/playgroud/playground/playground-frontend/src/views/WebLogin.vue) (เบอร์โทร+PIN แบบไม่ผ่าน LINE) — `setTenantWebAuth()` ใน `stores/auth.js` **ตั้งใจ** เก็บ Token ลง `localStorage` (`horspace_tenant_token`) เพราะไม่มี LINE SDK ให้ Silent Re-Auth ได้เหมือนฝั่ง LIFF จำเป็นต้องคง Session ไว้ข้าม Page Reload
   - Refresh Token บริหารจัดการผ่าน HTTP-Only Cookie จาก Node.js Backend เสมอ
   - กลไก Dev-only Bypass ใดๆ (เช่น `dev_line_user_id`, Header `X-Line-User-Id`) ต้อง Gate ด้วย `import.meta.env.DEV` เสมอ ห้ามมี Mock/Hardcoded User ID หลุดไปกับ Production Build เด็ดขาด
4. **Language Policy**: ความคิดเห็นในโค้ด (Comments) และเอกสารคำอธิบาย ให้ใช้ **ภาษาไทย** เป็นหลัก

5. **Dev Tunnel Caching (Cloudflare)**: Cloudflare Tunnel ทับ `Cache-Control` ของไฟล์ `.js` ใต้ `/src` เป็น `max-age=14400` ทำให้ Browser ค้างโมดูลเก่าปนโมดูลใหม่ที่ได้ `pinia.js?v=<hash>` ใหม่ จน Pinia แตกเป็น 2 สำเนา (`getActivePinia()` ไม่มี) — `vite.config.js` มี Plugin `dev-src-no-store` บังคับ `no-store` เฉพาะ `serve` ห้ามลบ, ถ้าเจออาการนี้ให้ตรวจ Response Header ผ่านโดเมนจริงก่อนเดา Vite Optimize Deps
6. **LIFF Endpoint URL กับ Dev Tunnel ต้องตรงกัน (Phase 26)**: `.env` เครื่อง dev ใช้ `VITE_LINE_LIFF_ID` ตัวเดียวกับ production (`2011289517-SB8YziXL`) — ถ้า Endpoint URL ของ LIFF app นี้ใน LINE Developers Console ไม่ได้ตั้งตรงกับ hostname ของ dev tunnel ปัจจุบัน (`dev.horspace.com/liff`) จะเจอ `access.line.me/oauth2/v2.1/error400` (`invalid url. channelId=...`) ทันทีตอน `liff.init()` — เรื่องนี้ Agent แก้ให้ไม่ได้ (ต้อง Login LINE Developers Console เอง) แนะนำแยก LIFF app ต่างหากสำหรับ dev จะไม่ต้องสลับ Endpoint URL ไปมา ดู `docs/ACTIVITY_LOG.md` Phase 26

---

## 🤝 ข้อตกลงการทำงานร่วมกันระหว่าง Gemini และ Claude (Multi-Agent Protocol)

1. **อัปเดต Activity Log**: เมื่อ Agent ทำการสร้างหรือแก้ไขไฟล์งาน ให้ลงบันทึกใน [docs/ACTIVITY_LOG.md](file:///Users/user/Desktop/playgroud/playground/playground-frontend/docs/ACTIVITY_LOG.md) เสมอ
2. **รักษาความสะอาดของโค้ด**: ก่อนจบการทำงาน ให้รัน `yarn build` เพื่อตรวจสอบว่าไม่มี Compilation Errors
3. **การส่งมอบงาน (Handover)**: หากต้องส่งต่องานให้ Agent อื่น ให้ระบุสถานะล่าสุดลงใน `docs/ACTIVITY_LOG.md`
