# 📜 Activity Log & Project History (docs/ACTIVITY_LOG.md)

บันทึกประวัติการพัฒนา การแก้ไขไฟล์ และสถานะของโปรเจกต์ `playground-frontend`

---

## 📅 [2026-08-26] - Initial Vue 3 Clean Architecture Setup & Git Repository Push

### 📌 รายการกิจกรรมที่ดำเนินการ:
1. **โปรเจกต์ Initialization**:
   - สร้างโครงสร้างโปรเจกต์ Vue 3 (Vite) ใน `playground-frontend`
   - ติดตั้ง Dependencies หลักด้วย Yarn: `axios`, `pinia`, `vue-router`
2. **Axios Configuration (Silent Refresh Queue)**:
   - สร้างไฟล์ `src/utils/api.js` พร้อมตั้งค่า `withCredentials: true`
   - เขียน Request Interceptor แนบ Access Token จาก Pinia State
   - เขียน Response Interceptor ดัก 401 Unauthorized และทำ Silent Refresh ด้วย HTTP-Only Cookie พร้อมระบบ Queueing (`failedQueue`)
3. **Auth Service Layer**:
   - สร้างไฟล์ `src/services/authService.js` รวบรวม API Endpoints (`login`, `logout`, `refreshToken`, `getProfile`)
4. **Pinia Auth Store (In-Memory Access Token)**:
   - สร้างไฟล์ `src/stores/auth.js` เก็บ Access Token และ User Data ใน Memory (RAM) ป้องกัน XSS
5. **Vue Router & Route Guards**:
   - สร้างไฟล์ `src/router/index.js` พร้อมระบบ Auto Silent Refresh เมื่อกด F5 และตรวจสอบ Protected / Guest Routes
6. **UI Components & Glassmorphism Design**:
   - สร้าง `LoginView.vue`, `DashboardView.vue`, `ProfileView.vue`, `App.vue`, `main.css`
7. **Git Repository Setup**:
   - สร้าง Git Repository `https://github.com/Nitrocircussx74/playground-frontend` และ Push ขึ้น Remote `main` branch เรียบร้อย
10. **Tailwind CSS & Shadcn Vue Integration**:
    - ติดตั้ง `tailwindcss`, `postcss`, `autoprefixer`, `radix-vue`, `clsx`, `tailwind-merge`, `class-variance-authority`, `tailwindcss-animate`
    - สร้าง `tailwind.config.js`, `postcss.config.js`, `jsconfig.json`, `components.json`, และ `src/lib/utils.js` (`cn` helper)
    - สร้าง Shadcn Components: `Button`, `Card`, `Input` ใน `src/components/ui/`
12. **Multi-System Architecture (Admin Portal & LINE LIFF Tenant App)**:
    - ติดตั้ง `@line/liff` SDK ด้วย Yarn (`yarn add @line/liff`)
    - สร้าง `AdminLayout.vue` (Sidebar/Navbar สำหรับจัดการหอพัก) และ `LiffLayout.vue` (Blank Mobile Layout สำหรับแอป LINE)
    - สร้าง `adminAuth.js` Store (จัดการ JWT Admin) และ `liffAuth.js` Store (จัดการ LINE User Profile)
    - ตั้งค่า Vue Router Nested Routes แยกกิ่ง `/admin` (JWT Guard) และ `/liff` (LIFF SDK Auth)
    - สร้าง `LiffHome.vue` พร้อมระบบ `liff.init()` & `liff.getProfile()`


---

## 📅 [2026-09-07] - Theme-Driven UI/UX Redesign (Modern Purple-Indigo & Thai Font Support)

### 📌 รายการกิจกรรมที่ดำเนินการ:
1. **Typography & Google Fonts Setup**:
   - เพิ่มฟอนต์ `Prompt` (สำหรับภาษาไทย) และ `Plus Jakarta Sans` (สำหรับภาษาอังกฤษ) ใน `index.html` และกำหนด fallback font stack ใน `src/assets/main.css`
2. **Glassmorphism & Global Design System**:
   - เพิ่ม Custom Utility Classes ใน `main.css` (`glass-panel`, `glass-dark`, `card-hover`, `animate-soft-pulse`, custom scrollbar)
   - ปรับแต่งโทนสีหลัก Purple-Indigo พร้อมสีสถานะ Emerald, Amber, Rose ให้กลมกลืนและอ่านง่าย
3. **App Shell & Admin Navigation (`App.vue` & `AdminLayout.vue`)**:
   - ปรับโฉม Sidebar ให้มีความลึก (Depth), โลโก้เรืองแสง, เมนูนำทาง Active Pill Gradient พร้อมไอคอน Lucide Vue Next
   - ปรับปรุง Top Header เป็นสไตล์ Frosted Glass (`backdrop-blur-md`) พร้อม Capsule Dropdown เลือกตึก และปุ่มคู่มือใช้งาน
4. **LINE LIFF Mobile Shell (`LiffLayout.vue`)**:
   - ปรับปรุงกรอบโมบายแอปและ Floating Bottom Navigation Bar ให้สวยงาม ลื่นไหลสไตล์ Mobile App ชั้นนำ
5. **Views Redesign & Polish**:
   - `LoginView.vue`: ปรับแต่งหน้าเข้าสู่ระบบด้วย Ambient Glow Backdrop, Frosted Card และปุ่มกรอกบัญชีทดสอบด่วน
   - `DashboardView.vue`: ปรับแต่ง Stat Cards, Charts, Mode Banner และตาราง Overdue / Expiring Leases ให้สวยงาม สะอาดตา
   - `RoomsView.vue` & `RoomOverviewCard.vue`: ปรับปรุงการ์ดห้องพัก สเตตัส Badge ไฟกระพริบ และปุ่มกรองสถานะ

---

## 📅 [2026-09-07] - Commercial & Rental Spaces Multi-Asset Feature Implementation

### 📌 รายการกิจกรรมที่ดำเนินการ:
1. **Database & Schema Extension**:
   - เพิ่มฟิลด์ `unitType` (`residential`, `commercial_shop`, `vending_spot`, `parking`, `storage`, `billboard_rooftop`), `areaSqm`, `locationZone`, `billingModel`, `revSharePercent`, และ `companyTaxId` ลงในตาราง `rooms`
   - ซิงค์โครงสร้างฐานข้อมูลผ่าน Prisma (`npx prisma db push`)
2. **Backend API & Controllers (`roomController.js`)**:
   - อัปเดต `createRoom` และ `getRooms` ให้รองรับการรับ บันทึก และกรองตาม `unitType`
3. **Frontend UI/UX (`RoomsView.vue` & `RoomOverviewCard.vue`)**:
   - เพิ่มแถบแท็บตัวกรองแยกตามประเภทพื้นที่ (Asset Type Tabs): ห้องพัก, ร้านค้า/ล็อค, ตู้บริการ/เต่าบิน, ที่จอดรถ, ห้องสต็อก, ดาดฟ้า/ป้ายโฆษณา
   - ปรับแต่งการ์ด `RoomOverviewCard` ให้แสดงไอคอน, ป้ายประเภท, ขนาด ตร.ม., และโซนที่ตั้ง
   - ขยายแบบฟอร์มสร้างยูนิตใหม่ให้สามารถกำหนดประเภทสินทรัพย์, ขนาดพื้นที่, โซน, และโมเดลการคิดเงิน (เหมาจ่าย / ส่วนแบ่ง GP %)
---

## 📅 [2026-09-07] - Dual Onboarding Workflow (LINE vs Non-LINE & Seamless Later Linking)

### 📌 รายการกิจกรรมที่ดำเนินการ:
1. **ครบวงจร 2 ทางเลือก (Dual Onboarding Channels)**:
   - **ทางเลือกที่ 1 (ผ่าน LINE)**: แอดมินกดสร้าง Invite Code แล้วส่งให้ผู้เช่าลงทะเบียนผ่าน LINE LIFF
   - **ทางเลือกที่ 2 (ไม่ผ่าน LINE / Walk-in)**: แอดมินกด `+ เช็คอินผู้เช่า (Walk-in)` กรอกข้อมูลและทำสัญญาเช่าเข้าพักทันที
2. **การเชื่อมต่อ LINE ย้อนหลัง (Seamless Later Linking)**:
   - ในหน้า [TenantDetail.vue](file:///Users/user/Desktop/playgroud/playground/playground-frontend/src/views/TenantDetail.vue) สำหรับผู้เช่า Walk-in ที่ยังไม่มี LINE จะมีปุ่ม **"💬 สร้างรหัส/QR เชื่อมต่อบัญชี LINE"**
   - แอดมินสามารถสร้าง Invite Code 6 หลัก และพิมพ์หรือส่ง QR Code ให้ลูกบ้านสแกนเปิด LINE เพื่อผูกบัญชีได้ทันที
   - ปรับปรุง [LiffOnboardingView.vue](file:///Users/user/Desktop/playgroud/playground/playground-frontend/src/views/LiffOnboardingView.vue) ให้อ่านรหัสเชิญจาก QR Code อัตโนมัติ (`?code=...`)
3. **Build Verification**:
   - รันคำสั่ง `yarn build` สำเร็จ 100% (0 Errors)

### STATUS: 🟢 COMPLETE & FULLY VERIFIED

---

## 📅 [2026-09-09] - LIFF Security Audit: ตัด Token ออกจาก LocalStorage, ปิด Dev Bypass และ Unify ระบบแจ้งซ่อม

### 📌 รายการกิจกรรมที่ดำเนินการ:
1. **Audit Flow ฝั่งลูกบ้าน (LIFF Tenant Portal)**:
   - ไล่ตรวจ Flow ทั้งหมดตั้งแต่ [LiffEntryView.vue](file:///Users/user/Desktop/playgroud/playground/playground-frontend/src/views/LiffEntryView.vue) → Friendship Check → Auth Check → PIN → Main App พบจุดเสี่ยงด้าน Security และ Data Consistency หลายจุด
2. **Security Fix #1 - ย้าย `liff_token` ออกจาก LocalStorage**:
   - แก้ [stores/auth.js](file:///Users/user/Desktop/playgroud/playground/playground-frontend/src/stores/auth.js) ให้เก็บ `liffToken` แบบ Memory-only ผ่าน Pinia เท่านั้น (ของเดิมเขียน/อ่าน `localStorage.liff_token` ตรงๆ ขัดกับกฎใน AGENTS.md)
   - เพิ่ม Action `restoreLiffSession()` กู้คืน Session หลังรีเฟรชหน้าด้วย LINE ID Token ผ่าน Silent Login (`authService.silentLoginLiff()`) แทนการอ่านค่าจาก LocalStorage
   - อัปเดต [utils/api.js](file:///Users/user/Desktop/playgroud/playground/playground-frontend/src/utils/api.js), [router/index.js](file:///Users/user/Desktop/playgroud/playground/playground-frontend/src/router/index.js) และหน้าที่เคยอ่าน `liff_token` จาก LocalStorage โดยตรง (LiffReceiptHistoryView, LiffInvoiceDetailView, LiffInvoiceListView) ให้ใช้ Memory State แทนทั้งหมด
3. **Security Fix #2 - ตัด Hardcoded Dev Bypass**:
   - ลบ Mock User ID (`U_mock_tenant_user_1`) ที่ Hardcode ไว้ใน LiffPinLogin.vue, LiffSetupPin.vue, PinLoginView.vue ออกทั้งหมด
   - Gate กลไก `dev_line_user_id` / Header `X-Line-User-Id` ทั้งหมดด้วย `import.meta.env.DEV` ป้องกันการสวมรอยผู้ใช้อื่นใน Production Build
4. **Unify ระบบแจ้งซ่อม/ร้องเรียนที่ซ้อนกัน (Maintenance vs Issues)**:
   - พบว่า `/liff/maintenance` และ `/liff/issues` เป็นคนละ Endpoint/ตารางกันจริงในฝั่ง Backend (`playground-api`) แต่ฝั่ง Admin CMS Unify แสดงผลรวมเป็น Kanban Board เดียวไปแล้วก่อนหน้านี้
   - ปรับ Bottom Nav "แจ้งซ่อม" ให้ชี้ไปที่ `/liff/issues` (ฟอร์มใหม่ที่ครบกว่า: แนบได้ 5 รูป, แยกหมวดซ่อม/ร้องเรียน/อื่นๆ) และเปลี่ยน `/liff/maintenance` เป็น Redirect แทนการแสดงฟอร์มแยก เพื่อไม่ให้มีการเขียนข้อมูลใหม่เข้าตารางเดิมอีก
   - [IssueHistory.vue](file:///Users/user/Desktop/playgroud/playground/playground-frontend/src/views/IssueHistory.vue) ดึงข้อมูลจากทั้ง 2 Endpoint มารวมกันและ Normalize ให้อยู่ในรูปแบบเดียวกัน เพื่อไม่ให้ประวัติแจ้งซ่อมเก่าของลูกบ้านหายไป
   - แก้ Badge จำนวนงานค้างใน LiffProfileView.vue ให้นับรวมจากทั้ง 2 Endpoint ให้ตรงกับสิ่งที่กดเข้าไปดูจริง
5. **Build Verification**:
   - รัน `yarn build` ผ่าน 100% (0 Errors) และ `yarn test` ไม่มี Regression เพิ่มจากที่มีอยู่ก่อนแล้ว (4 Test เดิมที่ Fail จาก Pinia Setup ใน `LiffLayout.test.js` ยังไม่ได้แก้ในรอบนี้)
6. **Git**: Commit และ Push ขึ้น Branch `fix/liff-security-audit-and-unify-maintenance`

### ⏭️ งานที่เหลือ (Follow-up Items จาก Audit):
- ลบ `LiffOnboardingView.vue` (Dead Code, ไม่มี Route ไหนลิงก์มาเลย, ตรรกะซ้ำกับ LiffEntryView.vue)
- แก้บั๊ก `liff` undefined ใน `LiffRegisterView.vue` (บรรทัด 216) ทำให้ LINE Profile ไม่ถูกแนบไปกับ Payload ลงทะเบียน
- ตัด Route PIN ที่ซ้ำกัน (`/pin-login`, `/setup-pin`, `/change-pin` ระดับบนสุด vs ชุดเดียวกันใต้ `/liff/*`)
- เพิ่ม Route Guard สำหรับหน้า LIFF ที่ต้อง Login (เช่น `/liff/invoices`, `/liff/pay/:id`)
- ลด Friendship Check ที่ยิงซ้ำทุกครั้งที่เปลี่ยนแท็บใน LiffLayout.vue
- พิจารณาลบไฟล์ `LiffMaintenanceView.vue` ที่กลายเป็น Dead Code แล้วหลังข้อ 4

### STATUS: 🟢 COMPLETE & VERIFIED (รอ Merge เข้า `main` — ยังไม่ลบไฟล์ Dead Code ในรอบนี้)

---

## 📅 [2026-09-09] - PIN Verify-and-Set Flow, Maintenance Payer UI, UI Polish, Android/LINE PDF Download Fix

### 📌 รายการกิจกรรมที่ดำเนินการ:
1. **Audit ระบบ PIN (LIFF)**: พบว่าตอนยืนยันตัวตนข้ามอาคาร (`linkAndLogin`) ถ้าบัญชียังไม่เคยตั้ง PIN มาก่อนจะโดนบล็อกเฉยๆ ไม่มีทางตั้ง PIN ใหม่ในหน้าเดียวกันได้ — ประสาน Backend แก้ให้ตั้ง PIN ใหม่พร้อมยืนยันตัวตนได้ในคำขอเดียว แล้วปรับ UI ให้สอดคล้อง:
   - [LiffEntryView.vue](file:///Users/user/Desktop/playgroud/playground/playground-frontend/src/views/LiffEntryView.vue) และ [LiffOnboardingView.vue](file:///Users/user/Desktop/playgroud/playground/playground-frontend/src/views/LiffOnboardingView.vue): เดิมพาไปหน้ากรอก PIN เฉพาะกรณีมี PIN แล้วเท่านั้น ปรับให้เข้าหน้าเดียวกันทุกกรณีที่เป็นผู้ใช้เดิม แล้วสลับข้อความ/ปุ่มอัตโนมัติ ("กรอก PIN เดิม" vs "ตั้ง PIN ใหม่") ซ่อนปุ่ม "ลืม PIN" เมื่อยังไม่เคยมี PIN
   - [LiffOnboardingView.vue](file:///Users/user/Desktop/playgroud/playground/playground-frontend/src/views/LiffOnboardingView.vue) MODE 2 (ผูกบัญชีด้วย Invite Code) และ [LiffRegisterView.vue](file:///Users/user/Desktop/playgroud/playground/playground-frontend/src/views/LiffRegisterView.vue) (ลงทะเบียนใหม่ด้วย Invite Code): เดิมไม่เคยพาลูกบ้านไปตั้ง PIN เลยหลังผูกบัญชี/ลงทะเบียนสำเร็จ ปรับให้เช็ค `hasPin` จาก Backend แล้วพาไป `/liff/setup-pin` อัตโนมัติถ้ายังไม่มี
   - ⚠️ **แก้ไขบันทึกเดิม**: Follow-up item "ลบ LiffOnboardingView.vue (Dead Code)" จากบันทึกวันเดียวกันด้านบน **ไม่ถูกต้อง** — หน้านี้ยังมี Route (`/liff/onboarding`) ใช้งานจริงในเซสชันนี้ ไม่ควรลบ
2. **UI/Design Audit หน้าโปรไฟล์ลูกบ้าน ([LiffProfileView.vue](file:///Users/user/Desktop/playgroud/playground/playground-frontend/src/views/LiffProfileView.vue))**: จากภาพหน้าจอที่ผู้ใช้ส่งมา
   - การ์ดข่าวสารเลื่อนแนวนอนถูกตัดขาดที่ขอบขวาโดยไม่มีสัญญาณว่าเลื่อนดูต่อได้ → เพิ่มเงาไล่สีจางบอกใบ้ (Edge Fade)
   - รูปปกข่าวสารที่โหลดพัง (ลิงก์เสีย) โชว์เป็นกล่องเทาว่างๆ → เพิ่ม `@error` fallback สลับไปโชว์หัวการ์ดแบบไม่มีรูปแทน (มี Pattern เดิมสำหรับ Avatar อยู่แล้วแต่ลืมทำให้การ์ดข่าวสาร)
   - **พบและแก้บั๊กจริงระหว่างตรวจ**: รูปโปรไฟล์ LINE ไม่ขึ้น เพราะ (ก) DB ของ Tenant ทดสอบถูกอินทิเกรชันเทสเขียนทับด้วย URL ปลอม (ล้างข้อมูลให้แล้ว) และ (ข) `fetchTenantProfile()` ให้ค่า `linePictureUrl` จาก DB ทับรูปสดจาก LIFF SDK เสมอ ทั้งที่ควรให้รูปสดชนะ — แก้ให้ใช้รูปสดจาก LIFF ก่อนเสมอถ้ามี ค่อย fallback ไป DB
3. **ระบบผู้รับผิดชอบค่าซ่อม (Maintenance Payer) ฝั่ง UI**:
   - [MaintenanceView.vue](file:///Users/user/Desktop/playgroud/playground/playground-frontend/src/views/MaintenanceView.vue): เพิ่มปุ่มเลือก "นิติออกให้" / "ลูกบ้านจ่ายเอง" ตอนปิดงานซ่อม + Badge สถานะ "รอรวมบิล / รวมในบิลแล้ว" (ล็อกฟิลด์เมื่อรวมบิลไปแล้ว)
   - [IssueHistory.vue](file:///Users/user/Desktop/playgroud/playground/playground-frontend/src/views/IssueHistory.vue) และ [TenantDetail.vue](file:///Users/user/Desktop/playgroud/playground/playground-frontend/src/views/TenantDetail.vue): โชว์ผู้รับผิดชอบค่าใช้จ่ายให้ลูกบ้านและแอดมินเห็นตรงกัน
4. **แก้บั๊กดาวน์โหลดใบแจ้งหนี้/QR Code ไม่ได้บน Android ใน LINE**:
   - [downloadHelper.js](file:///Users/user/Desktop/playgroud/playground/playground-frontend/src/utils/downloadHelper.js): เอา `target="_blank"` ออกจาก Anchor ที่มี `download` attribute ทั้งใน `downloadPdf` และ `downloadImage` (คู่กันแล้วบาง Android WebView/LINE In-App Browser ตีความเป็นเปิดแท็บใหม่แทนดาวน์โหลด แล้วพังเงียบๆ)
   - Backend แก้ `Content-Disposition` จาก `inline` เป็น `attachment` ที่ Endpoint PDF ใบแจ้งหนี้/ใบเสร็จ (ดู `playground-api/docs/ACTIVITY_LOG.md` Phase 12) — เป็นสาเหตุหลักที่ทำให้ Android ดาวน์โหลดไม่ได้
5. **Build Verification**: รัน `yarn build` ผ่าน 100% (0 Errors) ทุกครั้งหลังแก้แต่ละส่วน

---

## 📅 [2026-09-10] - Audit Flow Login ลูกบ้านผ่าน LINE/Web, แก้บั๊ก Web Login พัง & LINE Entry Bounce ผิดที่

### 📌 รายการกิจกรรมที่ดำเนินการ:
1. **Audit Flow Login ลูกบ้านทั้งผ่าน LINE และผ่านเว็บปกติ**: ไล่ตรวจ [WebLogin.vue](file:///Users/user/Desktop/playgroud/playground/playground-frontend/src/views/WebLogin.vue), [LiffPinLogin.vue](file:///Users/user/Desktop/playgroud/playground/playground-frontend/src/views/LiffPinLogin.vue), [LiffEntryView.vue](file:///Users/user/Desktop/playgroud/playground/playground-frontend/src/views/LiffEntryView.vue), router guard และฝั่ง Backend ที่เกี่ยวข้องทั้งหมด (ดูช่องโหว่ความปลอดภัยที่พบและแก้ใน `playground-api/docs/ACTIVITY_LOG.md` Phase 13)
2. **แก้บั๊ก Web Login พังทุกครั้งแม้เบอร์โทร/PIN ถูกต้อง**: [WebLogin.vue](file:///Users/user/Desktop/playgroud/playground/playground-frontend/src/views/WebLogin.vue) — `handleWebLogin` อ้างตัวแปร `tenant`/`user`/`rooms`/`building`/`accessToken` โดยไม่เคย Destructure จาก `res.data.data` เลย → Login สำเร็จทุกครั้งแต่โยน `ReferenceError` แล้วโดน `catch` กลืนไปแสดงเป็น "เบอร์โทรศัพท์หรือรหัส PIN ไม่ถูกต้อง" ทำให้ลูกบ้านที่ Login ผ่านเว็บ (ไม่ผ่าน LINE) เข้าระบบไม่ได้เลย — แก้ให้ Destructure ค่าจาก Response ให้ครบ
3. **แก้บั๊กเข้าจาก Rich Menu/LIFF Link แล้วโดนเด้งไปหน้า Web Login ผิดๆ**: [LiffEntryView.vue](file:///Users/user/Desktop/playgroud/playground/playground-frontend/src/views/LiffEntryView.vue) — เดิมเช็ค `liff.isInClient()` ก่อนตัดสินใจว่าจะ Auto-Login ด้วย LINE หรือเด้งไป `/web/login` แต่ค่านี้ไม่น่าเชื่อถือ 100% (LIFF `init()` ล้มเงียบๆ ได้ถ้า Endpoint URL ไม่ตรงกับ Origin ปัจจุบัน, หรือผู้ใช้เปิดผ่าน LINE แบบ External Browser) ทำให้ลูกบ้านที่เข้าจาก Rich Menu/ลิงก์ LINE จริงๆ โดนเด้งไปหน้าเบอร์โทร+PIN ผิดๆ แทนที่จะได้ Login ด้วย LINE — แก้โดยไม่พึ่ง `isInClient()` อีกต่อไป: ลอง `loginLiff()` ก่อนเสมอ (จำกัด 1 ครั้งต่อ Session กัน Loop เหมือนเดิม) เพราะ `liff.login()` รองรับทั้งสองบริบทอยู่แล้วผ่าน LINE Login OAuth Redirect ถ้าเรียกไม่สำเร็จจริงๆ ค่อย Fallback ไปหน้า Web Login
4. **Build Verification**: รัน `yarn build` ผ่าน 100% (0 Errors)
5. **รวม Commit งาน UI ที่ค้างอยู่**: Commit งานที่พัฒนาไว้ก่อนหน้าแต่ยังไม่เคย Commit เข้า Git History — UI จัดการ Room Owner (มอบหมายเจ้าของห้อง, แสดงใน [RoomOverviewCard.vue](file:///Users/user/Desktop/playgroud/playground/playground-frontend/src/components/RoomOverviewCard.vue)/[RoomTenancyHistoryModal.vue](file:///Users/user/Desktop/playgroud/playground/playground-frontend/src/components/RoomTenancyHistoryModal.vue)), [LineQuotaCard.vue](file:///Users/user/Desktop/playgroud/playground/playground-frontend/src/components/LineQuotaCard.vue) และ [DeliveryLogsTab.vue](file:///Users/user/Desktop/playgroud/playground/playground-frontend/src/components/DeliveryLogsTab.vue) สำหรับติดตามโควต้า/ประวัติการส่งแจ้งเตือน LINE ราย Building, `thaiBanks` constants และ `ui/progress` component — Build ผ่านครบก่อน Commit

### STATUS: 🟢 COMPLETE & VERIFIED

---

## 📅 [2026-09-10] - LIFF Client Redirect Guard, Brand Color Rebrand (Teal), Room Type/Building Icons

### 📌 รายการกิจกรรมที่ดำเนินการ:
1. **Debug Session ทดสอบ Onboarding จริง**: ไล่ตาม User ทดสอบ Flow "ผูกบัญชี → ตั้ง PIN" ผ่าน Browser/Tunnel จนพบว่าระบบมี **Invite Code 2 ชุดซ้อนกัน** ที่หน้าตาคล้ายกันจนสับสนได้ง่าย: `/liff/onboarding` (LiffOnboardingView.vue, ใช้ `Tenant.inviteCode` — สำหรับผู้เช่า**เดิม**ที่มีข้อมูลอยู่แล้ว) กับ `/liff/register` (LiffRegisterView.vue, ใช้ `RoomInvite.code` — สำหรับผู้เช่า**ใหม่**เอี่ยม) ปุ่ม "ลงทะเบียนด้วยรหัสเชิญ" ที่ [LiffEntryView.vue](file:///Users/user/Desktop/playgroud/playground/playground-frontend/src/views/LiffEntryView.vue) พาไปแค่หน้าเดียว (`/liff/register`) ทำให้ผู้เช่าเดิมที่มีรหัสเชิญแบบแรกเข้าผิดหน้าแล้วเจอ "ไม่พบรหัสเชิญ" — **ยังไม่ได้แก้ในรอบนี้** (เป็น Backend Design Issue ข้ามระบบ ดู `playground-api/docs/ACTIVITY_LOG.md` Phase 14 ข้อ 4) บันทึกไว้เป็น Follow-up
2. **LIFF Client Redirect Guard** ([router/index.js](file:///Users/user/Desktop/playgroud/playground/playground-frontend/src/router/index.js)): เพิ่ม Check ต้นทาง `liffNavigationGuard` — ถ้าเปิดหน้า `/liff/*` ผ่าน Browser ธรรมดา (ไม่ใช่แอป LINE จริง, เช็คด้วย `liff.isInClient()`) จะ `window.location.href` เด้งไปเปิดผ่าน `https://liff.line.me/<LIFF_ID><path เดิม>` ให้อัตโนมัติ (LINE จัดการเปิดแอป LINE ต่อเองถ้ามีติดตั้ง) กันปัญหา LINE ID Token Verify ไม่ผ่านเพราะไม่มี Session LINE จริงที่เจอกันมาทั้ง Session — **ปิดกลไกนี้ใน `import.meta.env.DEV`** (ไม่งั้นจะไปรบกวนการทดสอบผ่าน Browser ด้วย `?devLineUserId=`) และเว้น `/web/login`/`isTenantWeb` ไว้เพราะตั้งใจออกแบบให้ใช้นอก LINE ได้อยู่แล้ว
3. **Dev Testing Convenience** ([main.js](file:///Users/user/Desktop/playgroud/playground/playground-frontend/src/main.js)): พบว่าโค้ดเดิมมีแค่ "อ่าน"/"ลบ" `localStorage.dev_line_user_id` (`utils/liff.js`, `utils/api.js`) แต่ไม่เคยมีจุด "ตั้งค่า" เลยสักที่ — เพิ่ม Dev-only Bootstrap อ่าน Query Param `?devLineUserId=xxx` แล้ว Persist ลง localStorage ให้ครั้งเดียว ใช้ร่วมกับ `LINE_AUTH_MOCK_MODE=true` ฝั่ง Backend เพื่อทดสอบผ่าน Browser ธรรมดาได้แบบไม่ต้องพึ่งมือถือจริง (ดู `playground-api/docs/ACTIVITY_LOG.md` Phase 15 เรื่อง Mock Mode)
4. **Brand Color Rebrand — Horspace Teal**: Sample สีจากไฟล์โลโก้จริง (`public/horspace-app-icon.png` ฯลฯ) ด้วยสคริปต์อ่าน Pixel ได้ค่าเฉลี่ยใกล้เคียง Tailwind `cyan-700` (`#0E7490`) มากที่สุด — สีเดิมของทั้งระบบ (Purple/Indigo ฝั่ง CMS, Blue-500 Default ฝั่ง Theme) ไม่ตรงกับโลโก้เลย:
   - Sed ทั่ว `src/` แทนที่ Tailwind Class `purple-*` → `cyan-*` และ `indigo-*` → `teal-*` (คงเฉดเดิมทุกจุด 50-950) ครอบคลุม 55 ไฟล์ทั่วทั้ง CMS Admin
   - `tailwind.config.js`, `assets/main.css`, `composables/useDynamicTheme.js`: เปลี่ยน Default `--theme-primary`/Fallback จาก Blue (`#3B82F6` / `59 130 246`) เป็น Teal (`#0E7490` / `14 116 144`)
   - `components/common/CycleDatePicker.vue`: `--dp-primary-color` จาก Purple (`#9333ea`) เป็น Cyan (`#0891b2`)
   - `views/BuildingSettingsView.vue`: เพิ่ม Preset สี **"Horspace Teal"** เป็นตัวเลือกแรกในรายการสีให้แอดมินเลือกได้ (นอกเหนือจาก Blue/Ruby/Emerald/Indigo/Amber/Sky/Rose/Slate เดิม) และเปลี่ยน Default ฟอร์มสร้าง/แก้ตึกให้เป็น Horspace Teal
   - **ตั้งใจไม่แตะ**: Preset สีอื่นๆ ที่ให้แอดมินเลือกเอง (เป็น Theme เฉพาะของแต่ละตึก ไม่ใช่ของแอป), สี Categorical ใน Chart ของ `DashboardView.vue` (Indigo/Emerald แยกแยะ Data Series คนละเรื่องกับ Brand), สี Emerald ในหน้า LIFF (`LiffOnboardingView.vue` ฯลฯ) ที่ยังไม่ชัดว่าเป็น Brand หรือ Semantic Success Color ปนกัน — รอ Confirm ก่อนแก้เพิ่ม
5. **ไอคอนห้องพักตามประเภท + โลโก้ตึก** ([LiffProfileView.vue](file:///Users/user/Desktop/playgroud/playground/playground-frontend/src/views/LiffProfileView.vue)): Multi-Room Selector เดิมใช้ไอคอนประตู (`DoorClosed`) เดียวกันทุกห้องไม่ว่าจะเป็นห้องพักจริงหรือ Unit ประเภทอื่น (เช่น `vending_spot` ตู้เต่าบิน) — เพิ่ม `getRoomIcon(unitType)` reuse Mapping เดียวกับ `getUnitTypeIcon` ใน `RoomOverviewCard.vue` ฝั่ง CMS Admin (🏪 ร้านค้า, ☕ ตู้บริการ, 🚗 ที่จอดรถ, 📦 ห้องเก็บของ, 📡 ป้าย/ดาดฟ้า, 🚪 ห้องพักปกติ) และถ้าตึกนั้นตั้งโลโก้ไว้ (`room.logoUrl`) ให้แสดงโลโก้ตึกแทนไอคอนเลย ช่วยแยกห้องข้ามหลายตึกของผู้เช่าคนเดียวได้ง่ายขึ้น
6. **Build Verification**: รัน `yarn build` ผ่าน 100% (0 Errors) ทุกครั้งหลังแก้แต่ละส่วน (ระหว่างทางเจอ Duplicate Import `Package` ของตัวเองทำ Build พังชั่วคราว แก้แล้ว)

### ⏭️ งานที่เหลือ (Follow-up Items):
- แก้ปุ่ม "ลงทะเบียนด้วยรหัสเชิญ" ใน `LiffEntryView.vue` ให้ฉลาดขึ้น (เช็คเบอร์โทร/สถานะก่อนแล้วพาไปหน้าที่ถูกต้องอัตโนมัติ แทนที่จะพาไปหน้าเดียวตายตัว) — หรือรวม 2 ระบบ Invite Code เป็นระบบเดียวฝั่ง Backend
- ตัดสินใจว่าสี Emerald ในหน้า LIFF ควรเปลี่ยนเป็น Horspace Teal ด้วยหรือไม่ (บาง Component ใช้เป็น Brand บาง Component ใช้เป็น Success Semantic ปนกัน ต้องแยกทีละจุด)

---

## 📅 [2026-09-11] - Facility Booking / Vehicle & Visitor / Voting Modules (Frontend) + แก้บั๊ก Invite QR ไม่เปิด LIFF + Auto-Login รวมศูนย์

### 📌 รายการกิจกรรมที่ดำเนินการ:
1. **หน้าจอใหม่ 6 หน้า** รองรับ Backend 3 โมดูลใหม่ (ดู `playground-api/docs/ACTIVITY_LOG.md` Phase 16 คู่กัน) — ตามรูปแบบ [AdminParcelView.vue](file:///Users/user/Desktop/playgroud/playground/playground-frontend/src/views/AdminParcelView.vue)/[LiffParcelsView.vue](file:///Users/user/Desktop/playgroud/playground/playground-frontend/src/views/LiffParcelsView.vue) เป๊ะ (เรียก `@/utils/api` ตรงๆ ไม่มี Store/Service แยก):
   - `AdminFacilityBookingView.vue` + `LiffFacilityBookingView.vue` (`/facility-bookings`, `/liff/facility-bookings`)
   - `AdminVehicleView.vue` + `LiffVehicleView.vue` (`/vehicles`, `/liff/vehicles`)
   - `AdminPollView.vue` + `LiffPollView.vue` (`/polls`, `/liff/polls`)
   - เพิ่ม `ENABLE_FACILITY_BOOKING`/`ENABLE_VOTING` ใน [FeatureSettingsView.vue](file:///Users/user/Desktop/playgroud/playground/playground-frontend/src/views/FeatureSettingsView.vue) (ไอคอน/สี), เพิ่มเมนู Sidebar ใน [App.vue](file:///Users/user/Desktop/playgroud/playground/playground-frontend/src/App.vue) ที่พลาดไปตอนแรก (สร้าง Route ไว้แต่ลืมผูกเมนู ผู้ใช้ถามว่า "menu อยู่ไหน" ถึงรู้ตัว)
2. **🐛 แก้บั๊ก Invite QR/ลิงก์ไม่เปิด LIFF (ผู้ใช้รายงานว่าสแกนแล้วไม่เปิด LIFF)**: ไล่หาต้นตอเจอ 4 จุดสร้างลิงก์ผิดรูปแบบเหมือนกันหมด (`${window.location.origin}/liff/...` แทน `https://liff.line.me/{LIFF_ID}/...`):
   - [TenantDetail.vue](file:///Users/user/Desktop/playgroud/playground/playground-frontend/src/views/TenantDetail.vue) — Modal "เชื่อมต่อบัญชี LINE ให้ผู้เช่า" (จุดที่ผู้ใช้เจอจริงในภาพหน้าจอ)
   - [TenantSecurityTab.vue](file:///Users/user/Desktop/playgroud/playground/playground-frontend/src/components/TenantSecurityTab.vue) — Modal เดียวกันแต่โค้ดซ้ำอีกชุด เรียกจากแท็บ "ความปลอดภัย" หน้าเดียวกัน
   - [RoomInviteModal.vue](file:///Users/user/Desktop/playgroud/playground/playground-frontend/src/components/RoomInviteModal.vue) — ลิงก์เชิญรูมเมทที่แอดมินคัดลอกไปแชร์
   - [LiffProfileView.vue](file:///Users/user/Desktop/playgroud/playground/playground-frontend/src/views/LiffProfileView.vue) — QR เชิญรูมเมทที่ลูกบ้านสร้างเอง
   - แก้ทั้ง 4 จุดให้ใช้ `VITE_LINE_LIFF_ID`/`VITE_LIFF_ID` ประกอบเป็น `https://liff.line.me/{LIFF_ID}/...` เหมือน Pattern ที่ `router/index.js`/`utils/liff.js` ใช้อยู่แล้ว (Fallback เป็นของเดิมถ้าไม่มี Env Var ตั้งไว้)
3. **🐛 แก้บั๊กต่อเนื่อง "กรุณาเข้าสู่ระบบก่อน" หลังแก้ข้อ 2**: สแกน QR ที่แก้แล้วเปิด LIFF ถูกแล้ว แต่ยัง 401 เพราะ [LiffOnboardingView.vue](file:///Users/user/Desktop/playgroud/playground/playground-frontend/src/views/LiffOnboardingView.vue) ไม่เคยเรียก `loginLiff()` เลย (มีแค่ `LiffEntryView.vue` ที่ทำ) — ผู้ใช้ถามต่อว่า "ถ้ามาผ่าน liff ควร auto login ทุกครั้ง" เลย**ย้าย Auto-Login ไปรวมศูนย์ที่ `liffNavigationGuard`** (`router/index.js`) แทนที่จะเขียนเช็คซ้ำทีละหน้า — Guard เรียก `isLiffLoggedIn()`/`loginLiff()` ให้ทุกหน้าที่ผ่าน Guard นี้อัตโนมัติ (จำกัด 1 ครั้ง/Session เหมือนเดิม) ลบโค้ด Auto-Login ที่เพิ่งแปะไว้ใน `LiffOnboardingView.vue` ทิ้งเพราะซ้ำกับ Guard แล้ว
4. **Build Verification**: รัน `yarn build` ผ่าน 100% (0 Errors) ทุกครั้งหลังแก้แต่ละส่วน

### STATUS: 🟢 COMPLETE & VERIFIED (Backend ส่วนที่เกี่ยวข้องดู `playground-api/docs/ACTIVITY_LOG.md` Phase 16)

---

## 📅 [2026-09-11] - In-App Notification Bell (Admin CMS + Tenant LIFF)

### 📌 รายการกิจกรรมที่ดำเนินการ:
1. **`src/services/notificationService.js` (ใหม่)**: ครอบ `@/utils/api` เรียก Endpoint กระดิ่งทั้งฝั่ง Admin (`/api/admin/buildings/:id/notifications`) และฝั่ง Tenant (`/api/v1/liff/notifications`) — Interceptor เดิมใน `utils/api.js` แนบ Header/Token ให้อัตโนมัติอยู่แล้วทั้งสองฝั่ง ไม่ต้องตั้งค่าเพิ่ม
2. **`src/components/NotificationBell.vue` (ใหม่)**: กระดิ่งเดียวใช้ได้ 2 โหมดผ่าน Prop `mode` (`admin` ต้องมี `buildingId`, `tenant` ใช้ตัวตนจาก LIFF Token) — Badge นับ Unread, Dropdown List กด Mark Read + Deep Link ไปหน้าที่เกี่ยวข้องตาม `notificationType`, Poll ทุก 45s (`setInterval`), ปิดเมื่อคลิกนอกกล่องด้วย `document.addEventListener('mousedown', ...)` (ไม่มี Dropdown/Popover Primitive ใน `components/ui/` ให้ใช้ เลยเขียน Outside-Click เองแบบ Native)
3. **ติดตั้งใน 2 Layout**:
   - [App.vue](file:///Users/user/Desktop/playgroud/playground/playground-frontend/src/App.vue): Header Admin CMS ข้าง Building Switcher — แสดงเฉพาะตอนเลือกตึกแล้ว (`buildingStore.activeBuildingId`) เพราะ Endpoint ฝั่ง Admin สโคปตามตึกเสมอ
   - [LiffLayout.vue](file:///Users/user/Desktop/playgroud/playground/playground-frontend/src/layouts/LiffLayout.vue): Header Tenant หลังป้าย "LIFF"/"Web Portal" (ผู้ใช้ขอย้ายจากก่อนป้ายมาไว้หลังป้าย) — Reuse `showBottomNav` เดิมเป็นตัวเช็คว่าอยู่ในหน้าที่ Login แล้วหรือยัง (True = ไม่ใช่หน้า Entry/Register/Onboarding/PIN)
4. **Build Verification**: รัน `yarn build` ผ่าน 100% (0 Errors)
5. **🐛 พบบั๊ก Pre-existing ระหว่างรัน `yarn test`**: [LiffLayout.test.js](file:///Users/user/Desktop/playgroud/playground/playground-frontend/src/layouts/LiffLayout.test.js) 4 เทส Fail เพราะ `mount()` ไม่ได้ใส่ Pinia Plugin เลย (`global: { plugins: [router] }` ขาด Pinia) — `useAuthStore()`/`useFeatureStore()` ที่ถูกเรียกไม่มีเงื่อนไขใน `<script setup>` เลยโยน Error ทันทีตอน Mount ไม่เกี่ยวกับโค้ดที่แก้ใน Phase นี้เลย (Component อื่นอีก 2 ไฟล์ Test ผ่านปกติ) — บันทึกไว้เป็น Follow-up ยังไม่ได้แก้

### STATUS: 🟢 COMPLETE & VERIFIED (Backend ส่วนที่เกี่ยวข้องดู `playground-api/docs/ACTIVITY_LOG.md` Phase 17)

### ⏭️ งานที่เหลือ (Follow-up Items):
- แก้ `LiffLayout.test.js` ให้ใส่ `createTestingPinia()` เข้า `global.plugins` (Pre-existing Bug ไม่เกี่ยวกับ Phase นี้) — **แก้แล้วใน Phase ถัดไป (ยืนยันผ่าน `yarn vitest run` 7/7 ณ วันที่ทำ Phase 20 ด้านล่าง)**
- ประกาศข่าวสาร (Announcement Broadcast) ยังไม่ขึ้นกระดิ่ง Tenant — รอ Backend แก้ `sendAnnouncementBroadcast` ให้ Log ก่อน (ดู `playground-api/docs/ACTIVITY_LOG.md` Phase 17) — **แก้แล้วฝั่ง Backend ใน Phase 19 (ดู `playground-api/docs/ACTIVITY_LOG.md`)**

---

> **หมายเหตุ**: Log ฉบับนี้ขาดบันทึกของ Phase 18 (LIFF Building Owner Dashboard) และ Phase 19 (Rebranding/Announcement Gap) ที่ทำไปแล้วจริงในโค้ด (ดู Commit `3bae5b6`, `a936737` และ `playground-api/docs/ACTIVITY_LOG.md` Phase 18-19 ที่มีรายละเอียดฝั่ง Frontend ระบุไว้คู่กัน) — ไม่ได้ Backfill ในรอบนี้ เพราะนอกขอบเขตงานที่ขอ (Audit + Fix บั๊ก) บันทึกไว้เผื่อ Sync ภายหลัง

---

### Phase 20 (2026-09-23): Full Flow & Bug Audit (API + CMS) — แก้ทุกจุดที่ยืนยันเป็นบั๊กจริง

- **บริบท**: ผู้ใช้ขอให้ไล่ตรวจ Flow และบั๊กทั้งหมดของทั้ง `playground-api` และ `playground-frontend` แล้ววางแผน — ส่ง Sub-Agent 2 ตัวไล่อ่านโค้ดจริงคู่ขนานกัน แล้วแก้ทุกข้อที่ยืนยันว่าเป็นบั๊กจริงตามคำขอ (รายละเอียดฝั่ง Backend ดู `playground-api/docs/ACTIVITY_LOG.md` Phase 20)
- **🐛 Dual-Role Token ทำให้ Feature Toggle ผิดตึก**: หลายหน้า LIFF (`LiffReceiptHistoryView`, `LiffUpdateProfileView`, `LiffFacilityBookingView`, `LiffAnnouncementsView`, `IssueHistory`, `LiffParcelsView`, `ReportIssue`, `LiffVehicleView`, `LiffPollView` — รวม 9 หน้า) เรียก `featureStore.fetchFeatures()` โดยไม่ส่ง `buildingId` เลย ไปแข่ง Race กับ `LiffLayout.vue` ที่ Fetch ถูกตึกอยู่แล้วตอน Mount — สำหรับผู้ใช้ Dual-Role (Owner+Tenant, Login ทั้ง CMS Admin Token และ LIFF Tenant Token พร้อมกัน) Backend อาจถอด Feature Map จาก Admin Token แทน Tenant Token แล้วได้ตึกผิด — แก้ที่จุดเดียวใน `stores/useFeatureStore.js`: `fetchFeatures()` ถ้าไม่ระบุ `buildingId` มา จะ Derive จาก `authStore.tenant` เองก่อนยิง API เสมอ (ไม่ต้องแก้ทีละ 9 หน้า)
- **🐛 Race Condition สลับตึกเร็วๆ ใน `FeatureSettingsView.vue`**: ไม่มีการ Cancel/Sequence Request เดิม คลิกสลับตึกเร็วๆ อาจโชว์ Feature Map ผิดตึกถ้า Response เก่ามาถึงทีหลัง Response ใหม่ — เพิ่ม Request-Sequence Guard ใน `fetchFeatures()` ตัวเดียวกับข้อบน (จุดเดียวคุมทุกหน้าที่เรียก Store นี้)
- **🐛 Invite Code 2 ระบบซ้อนกัน (ค้างมาตั้งแต่ 2026-09-10)**: `LiffRegisterView.vue` เดิมพิมพ์รหัสของระบบ `Tenant.inviteCode` (สำหรับผู้เช่าเดิม) แล้วเจอแค่ "รหัสเชิญไม่ถูกต้อง" เฉยๆ — Backend เพิ่ม Error Code `TENANT_LINK_CODE` ตอนเจอ Code ประเภทนี้ (ดู `playground-api` Phase 20), ฝั่งนี้เจอ Code ดังกล่าวแล้ว Auto-Redirect ไป `/liff/onboarding?code=...` ให้เอง (พรีฟิลรหัสไว้ให้ เหลือแค่กรอกเบอร์โทร 4 ตัวท้าย)
- **สี Icon ชนกัน**: `ENABLE_E_CONTRACT` ใน `FeatureSettingsView.vue` ชนกับ `ENABLE_DIGITAL_ID` (Emerald ซ้ำกัน ตกหล่นตอนเพิ่ม E-Contract) — เปลี่ยนเป็น Rose
- **✅ ตรวจแล้วพบว่า "ไม่ใช่บั๊กจริง"**: Feature Toggle ไม่ครอบ Endpoint เขียนฝั่ง LIFF ที่ Audit รอบแรกสงสัย — Backend เช็คแบบ Inline อยู่แล้วทุกจุด (ดู `playground-api` Phase 20)
- **Build & Test Verification**: `yarn build` ผ่าน 100% (0 Errors), `yarn vitest run` ผ่าน **22/22** (5 Test Files) — ระหว่างทางพบว่า Follow-up เดิม "`LiffLayout.test.js` ขาด Pinia Plugin" ถูกแก้ไปแล้วในบาง Phase ก่อนหน้าที่ไม่ได้ลง Log (7/7 ผ่านแล้วตอนนี้)

#### Follow-up จากการทดสอบจริงของผู้ใช้หลัง Phase 20 (วันเดียวกัน): 2 บั๊กเพิ่มเติมที่เจอตอน Live Test

- **🐛 Feature Card ผีในหน้า Feature Settings**: ผู้ใช้ส่ง Screenshot เจอการ์ด `ENABLE_TENANT_POLLS`/`ENABLE_VISITOR_PASS` ไม่มี Title/คำอธิบายจริง (โชว์ Raw Key) — ต้นเหตุเป็น Row เก่าค้างในตาราง `FeatureToggle` ของ Backend จากการ Rename Key (`ENABLE_VOTING`/`ENABLE_VEHICLE_MANAGEMENT` เป็น Key ปัจจุบันแล้ว) แก้ที่ `featureController.getFeatures()` ให้กรอง Key ที่ไม่รู้จักทิ้งก่อน Merge (ดูรายละเอียดฝั่ง Backend `playground-api/docs/ACTIVITY_LOG.md` Phase 20) — ฝั่งนี้ไม่ต้องแก้อะไร แค่รีเฟรชก็หายไป
- **🐛 Owner Preview Mode ไม่ผูกตึก ทำให้เห็นฟีเจอร์เปิดหมดทั้งที่ปิดไว้เฉพาะตึกแล้ว**: ผู้ใช้ Report "ปิดฟีเจอร์ใน CMS ครบทุกตัวสำหรับอาคาร B แล้วแต่หน้า 'เมนูด่วน' ใน LIFF ไม่ซ่อนตามสักอัน" — ไล่ตรวจ Backend ด้วยการจำลอง Fetch จากฐานข้อมูลจริงตรงๆ (ใช้ Tenant จริงในอาคาร B) ได้ผลถูกต้อง 100% (Toggle ที่ปิดไว้คืน `false` ครบ) สรุปว่าเป็นบั๊กฝั่งนี้ — ถามผู้ใช้ยืนยันว่า Login เข้า LIFF ด้วยบัญชีแอดมิน/เจ้าของอาคาร (ไม่มี Tenant Record ผูกอยู่) ทำให้เข้า **"โหมดจำลอง (Preview Mode)"** ใน `LiffProfileView.vue` ซึ่งเดิมเรียก `featureStore.fetchFeatures(null)` เสมอ (Global Default ที่ไม่เคยถูกปิด เพราะการปิดทุกครั้งเป็น Override เฉพาะอาคาร B เท่านั้น) — แก้เพิ่มฟังก์ชัน `resolvePreviewBuildingId()`: ใช้ตึกที่เจ้าของเลือกล่าสุดใน Owner Dashboard (`localStorage.horspace_selected_building_id`) ก่อน แล้ว Fallback ไปตึกที่กำลังเปิดอยู่ฝั่ง CMS Admin ในเบราว์เซอร์เดียวกัน (`localStorage.activeBuildingId`) แทน Global เสมอ — พ่วงแก้อีกจุด: เดิมถ้าโหลดโปรไฟล์ Error (Catch Branch) จะไม่เรียก `fetchFeatures()` เลยแม้แต่ครั้งเดียว ทำให้ `isEnabled()` Default คืน `true` ทุก Key เหมือนไม่ได้ปิดอะไร — เพิ่มให้เรียกด้วย Building เดียวกัน
- **Build & Test Verification**: `yarn build` ผ่าน 100% (0 Errors), `yarn vitest run` ผ่าน **22/22** ไม่มี Regression

### STATUS: 🟢 COMPLETE & VERIFIED (Backend ส่วนที่เกี่ยวข้องดู `playground-api/docs/ACTIVITY_LOG.md` Phase 20)

### ⏭️ งานที่เหลือ (Deferred ตาม YAGNI ไม่ใช่บั๊ก):
- Facility Booking ยังไม่มี Workflow อนุมัติ, Poll ยังไม่รองรับ AGM/Quorum ถ่วงน้ำหนักตามกรรมสิทธิ์ (ดูรายละเอียดฝั่ง Backend)
- ฟีเจอร์เก่าอื่นๆ (แจ้งซ่อม/บิล/พัสดุ/ข่าวสาร/ใบเสร็จ/Digital ID) Toggle ยังบังคับแค่ฝั่ง Frontend (ซ่อน UI) ไม่มีการเช็คฝั่ง Backend เหมือน `ENABLE_E_CONTRACT`/Facility/Vehicle/Poll — Known Limitation ตั้งใจ ไม่ใช่บั๊ก

---

### Phase 21 (2026-09-23): Delete Building UI & Store Action

- **บริบท**: เพิ่มความสามารถในการลบอาคาร/ตึกที่ไม่ใช้งานออกจากระบบ พร้อมระบบยืนยัน (Confirmation) และตรวจสอบความปลอดภัย
- **Store Action (`useBuildingStore.deleteBuilding`)**: ยิง `DELETE /api/v1/buildings/${id}` และหากตึกที่ถูกลบตรงกับ `activeBuildingId` จะทำการ Reset เป็นค่าว่างทันที พร้อมดึงรายการตึกใหม่
- **Building Management View (`BuildingManagementView.vue`)**:
  - เพิ่มปุ่มลบ (Trash Icon) บนการ์ดของแต่ละตึก
  - เชื่อมต่อ `showConfirm` จาก SweetAlert2 เพื่อยืนยันการลบก่อนส่งคำขอ
  - มี Guard ฝั่ง Client ป้องกันการกดลบหากยังมีห้องพักผูกอยู่ (`b._count.rooms > 0`) หรือเหลือตึกเดียวในระบบ
  - จัดการ Error Alert อย่างชัดเจนหาก Backend ปฏิเสธ
- **Build & Test Verification**: `yarn build` ผ่าน 100%, `yarn vitest run` ผ่าน **24/24** (6 Test Files เพิ่ม `useBuildingStore.test.js` 2 เทส)

---

### Phase 22 (2026-09-24): Room Invite Modal Availability Guard & Endpoint Alignment

- **บริบท**: ตรวจสอบและแก้ไขข้อผิดพลาด `ไม่พบ Endpoint นี้ - /api/v1/invites` (404) เมื่อเปิดหน้าต่างจัดการรหัสเชิญห้องพัก
- **UI Enhancement (`RoomInviteModal.vue`)**:
  - เพิ่มการตรวจสอบสถานะห้องพัก: หากห้องไม่อยู่ในสถานะ `available` (เช่น `occupied` หรือมีผู้เช่าอยู่แล้ว) จะแสดงข้อความแจ้งเตือนสีเหลืองอำพัน และซ่อน/ปิดการสร้างรหัสเชิญใหม่ ป้องกันการสร้างรหัสซ้ำซ้อน
  - แสดงเฉพาะประวัติรหัสเชิญเดิมด้านล่างกรณีห้องมีผู้เช่าแล้ว
- **Build & Test Verification**: `yarn build` ผ่าน 100% (0 Errors), `yarn vitest run` ผ่าน **24/24**

---

### Phase 23 (2026-09-24): Multi-Room Switching — เชื่อมโยงฟีเจอร์/ข้อมูลตามห้องที่เลือกทั้งหมด + Security Hardening

- **บริบท**: ผู้ใช้ Report ว่าสลับห้องข้ามตึกใน `/liff/profile` แล้ว "เมนูด่วน"/Feature Toggle ไม่เปลี่ยนตามตึก ขอให้ไล่ตรวจและทำให้ทุกอย่างที่เกี่ยวข้องกับห้อง (ฟีเจอร์, ข้อมูล, ความปลอดภัย, UX ระหว่างโหลด) เชื่อมโยงกันทั้งหมด — ระหว่างทางเจอว่า Backend ที่รันอยู่จริงเป็น Nodemon ตัวเก่าที่ไม่ยอมรีโหลดโค้ดใหม่ (Restart แล้วแก้หาย) และ CORS ไม่ได้อนุญาต Header `X-Building-Id`/`X-Room-Id` ที่ Frontend แนบไปอยู่แล้ว
- **รวมจุดเขียน Active Room เป็นที่เดียว (`stores/auth.js`)**: เพิ่ม `setActiveRoom(room)` เขียน `active_tenant_room_id`/`active_tenant_building_id`/`liff_target_building` ที่เดียว (เดิมกระจายเขียนซ้ำ 3 จุดใน `LiffProfileView.vue`) เรียกจาก `selectRoom()` และตอนโหลดโปรไฟล์ครั้งแรก, ล้างค่าตอน `clearLiffAuth()` (Logout)
- **`selectRoom()` เคลียร์ State ห้องเก่าก่อนเสมอ (`LiffProfileView.vue`)**: ล้าง `unpaidInvoices`/`pendingParcels`/`activeMaintenance`/`meterHistory` ก่อนสลับ กันเห็นข้อมูลห้องเก่าค้างแวบหนึ่งระหว่างรอ Fetch ห้องใหม่ — เพิ่ม `switchingRoom` Skeleton ครอบเฉพาะส่วนที่ผูกกับห้อง (แจ้งเตือน/เมนู/ข่าว/รูมเมท/มิเตอร์) ไม่ใช้ Overlay เต็มจอ (Header + รายการห้องยังกดสลับต่อได้ระหว่างโหลด)
- **Race-Guard กันข้อมูลห้องเก่าทับห้องใหม่**: `fetchLiveActionMetrics()`, `fetchMeterHistory()` เทียบ `selectedRoomId` ก่อน Apply Response, `useAnnouncements.js` เพิ่ม Request-Sequence Guard แบบเดียวกับ `useFeatureStore.js` เดิม (กดสลับห้องรัวๆ Response เก่ามาถึงทีหลัง Response ใหม่จะถูกทิ้ง)
- **`LiffLayout.vue` Refetch Feature Toggle อัตโนมัติ**: เดิม Fetch ครั้งเดียวตอน Mount เท่านั้น เพิ่ม Refetch ทุกครั้งที่เปลี่ยนหน้า (`watch route.path`) และตอนกลับเข้าแอป (`document.visibilitychange`) ให้แอดมินปิดฟีเจอร์ใน CMS แล้วมีผลกับ LIFF ที่เปิดค้างไว้โดยไม่ต้องปิดแอป (ponytail: Poll ตอนเปลี่ยนหน้า ไม่ใช่ Realtime, ถ้าต้องการทันทีค่อยต่อ SSE/WebSocket)
- **`route.meta.feature` Guard กัน Deep Link เข้าหน้าที่ปิดฟีเจอร์**: เพิ่ม `meta.feature` ให้ 12 Route ใน `router/index.js` ที่ผูกกับ Feature Toggle (บิล, ประกาศ, พัสดุ, จองพื้นที่, ยานพาหนะ, โหวต, แจ้งซ่อม, ใบเสร็จ, สัญญาเช่า) — `LiffLayout.vue` เช็คก่อน Render `<router-view>` ถ้าปิดอยู่ขึ้นข้อความ "ฟีเจอร์นี้ถูกปิดใช้งานสำหรับอาคารนี้" แทนหน้านั้นเลย (เดิมเข้าผ่านลิงก์ตรง/หน้าที่เปิดค้างไว้ยังใช้งานได้แม้ปิดฟีเจอร์แล้ว)
- **Backend Companion (`playground-api`, สรุปย่อ — ไม่ได้ลง Log ฝั่งนั้นในรอบนี้)**: ระหว่างไล่ตรวจพบช่องโหว่ IDOR/Account-Takeover หลายจุดที่ไม่เกี่ยวกับ Ticket เดิมแต่แก้ไปพร้อมกัน — เพิ่ม `scopeTenantRooms` Middleware ตรวจว่า `X-Room-Id`/`X-Building-Id` ที่ Client ส่งมาเป็นห้องที่ผู้เช่าคนนั้นมีสิทธิ์จริง (ถือครอง/ผู้อยู่ร่วม ACTIVE/สัญญา ACTIVE) ก่อนใช้ ไม่งั้น Fallback เป็นห้องแรกของตัวเอง, เพิ่ม `requireOwnInvoice` Guard ปิดช่องเปิดบิล/QR/แนบสลิป/PDF ของคนอื่นได้ (เดิม QR ไม่เช็คเลย), ปิดช่องยึดบัญชีคนอื่นผ่าน `sync-profile`/`check-status` ที่ไม่ผ่านการยืนยัน PIN/Invite, เพิ่ม `isFeatureEnabled()` กลางให้ Endpoint ที่เขียนข้อมูล (แจ้งซ่อม/สลิป/โหวต) เช็ค Feature Toggle ระดับ Global ด้วยไม่ใช่แค่ระดับตึก
- **Dev Environment**: พบว่า `nodemon` ที่รันค้างไม่ยอมรีโหลดโค้ดใหม่ ต้อง Restart `yarn dev:tunnel` ตรงๆ ถึงจะเห็นผล, เพิ่ม `X-Building-Id`/`X-Room-Id`/`X-Line-User-Id` ใน `allowedHeaders` ของ CORS (`playground-api/src/app.js`) ที่ขาดไปตั้งแต่แรกทำให้ Browser Block Request เงียบๆ (ไม่ขึ้น Error ชัดเจนใน UI)
- **Build & Test Verification**: `yarn build` ผ่าน 100% (0 Errors), `yarn vitest run` ผ่าน **24/24** (ไม่มี Regression, Logic หลักที่เพิ่ม Test ใหม่อยู่ฝั่ง Backend), ทดสอบจริงผ่าน Playwright (`headless chrome`) จำลองสลับห้องข้ามตึก ยืนยัน Skeleton ขึ้น/หาย, ข้อมูลห้องเก่าไม่ค้าง, และปิดฟีเจอร์ระดับตึกมีผลกับเมนูจริง

### STATUS: 🟢 COMPLETE & VERIFIED

### ⏭️ งานที่เหลือ (Deferred ตาม YAGNI ไม่ใช่บั๊ก):
- Fetch ห้องใหม่ล้มเหลว (Network Error) ยังไม่มีปุ่ม Retry แค่ Fail เงียบๆ เหมือน Pattern เดิมของหน้านี้ก่อน Phase นี้
- Feature Toggle Refetch เป็น Poll ตอนเปลี่ยนหน้า/กลับเข้าแอป ไม่ใช่ Realtime (ตั้งใจ ดู `ponytail:` Comment ใน `LiffLayout.vue`)

---

### Phase 24 (2026-09-24): แก้ Pinia "no active Pinia" / "Failed to fetch dynamically imported module" ผ่าน Cloudflare Tunnel

- **อาการ**: กดสลับเมนูใน LIFF แล้ว `getActivePinia()` was called but there was no active Pinia (`LiffOwnerDashboardView.vue:707`, `LiffLayout.vue:214`) และ `Failed to fetch dynamically imported module .../LiffProfileView.vue` — Store ตัวแรกใน `setup` ผ่าน ตัวที่สองพังเสมอ
- **Root Cause**: Cloudflare Tunnel ทับ `Cache-Control` ของไฟล์ `.js` ใต้ `/src` (เดิม Vite ส่ง `no-cache`) เป็น `max-age=14400` (4 ชม.) ส่วนไฟล์ `.vue` ไม่โดน — Browser จึงค้าง `main.js`/`auth.js` เก่าที่ Import `pinia.js?v=<hash เก่า>` ปนกับโมดูลที่โหลดใหม่ (`useFeatureStore.js`, `useDashboardStore.js`) ที่ได้ `pinia.js?v=<hash ใหม่>` — Browser มองเป็นคนละโมดูล ได้ Pinia 2 สำเนา, Server ตอบ 200 กับทุกค่า `?v=` จึงไม่เห็นความผิดปกติฝั่ง Server
- **สมมติฐานที่ตัดทิ้ง**: Vite Optimize Deps re-optimize กลางทาง (แค่ทำให้ Hash เปลี่ยนบ่อยขึ้น ไม่ใช่ต้นเหตุ), Duplicate Package ใน `node_modules` (มีสำเนาเดียว), `main.js` เรียก `app.use(pinia)` ผิด (ถูกต้อง)
- **แก้ไข (`vite.config.js`)**: เพิ่ม Plugin `dev-src-no-store` (`apply: 'serve'`) บังคับ `Cache-Control: no-store` ให้ทุก Response ใต้ `/src/` — ทดสอบผ่านโดเมนจริงแล้ว `cf-cache-status: BYPASS`; เพิ่ม `optimizeDeps.include` ครบทุก Dependency กัน re-optimize; เพิ่ม `Clear-Site-Data: "cache"` ชั่วคราวบน Response HTML ให้ Browser ทิ้ง `.js` เก่าที่ค้าง (`ponytail:` ลบได้เมื่อทุกเครื่องโหลดใหม่แล้ว, Safari/iOS ไม่รองรับ)
- **บทเรียน**: ห้ามลบ `node_modules/.vite/deps` ตอน Dev Server ยังรันอยู่ (ทำให้ `deps_temp` ค้างและ `504 Outdated Optimize Dep`), และเจออาการ Module ซ้ำผ่าน Tunnel ให้เทียบ Response Header ระหว่าง `localhost` กับโดเมนจริงก่อน
- **Build & Test Verification**: `yarn build` ผ่าน (Plugin ใช้เฉพาะ `serve` ไม่กระทบ Production); ยังไม่ได้รัน `yarn vitest run` รอบนี้; **ยังไม่ได้ยืนยันใน Browser/LINE จริงว่า Error หาย** (ทดสอบได้เฉพาะ Header ผ่านโดเมนด้วย curl)

### STATUS: 🟡 FIX APPLIED — รอผู้ใช้ยืนยันใน Browser จริง

### ⏭️ งานที่เหลือ:
- ผู้ใช้ล้าง Site Data / รีเฟรชหน้า LIFF แล้วยืนยันว่า `pinia.js?v=` เหลือค่าเดียวและ Error หาย
- ลบบล็อก `Clear-Site-Data` ใน `vite.config.js` หลังทุกเครื่องโหลดใหม่ครบ (เก็บ Plugin `no-store` ไว้)

---

### Phase 25 (2026-10-16): Production Deployment บน DigitalOcean — Dockerfile Fixes, VITE_API_BASE_URL Build Arg

- **บริบท**: ร่วม deploy production จริงครั้งแรกคู่กับ `playground-api` (ดูภาพรวม infra เต็มใน `playground-api/docs/ACTIVITY_LOG.md` Phase 24) — Droplet เดี่ยว, Docker Compose, Caddy reverse proxy, ไม่ใช้ K8s
- **Bug ที่เจอจากรัน `docker compose up` จริงเท่านั้น**:
  - `nopt` (dependency ของ vite) ต้องการ Node `>=22` แต่ Dockerfile builder stage ใช้ `node:20-alpine` — `yarn install` fail ทันที แก้เป็น `node:22-alpine`
  - `vite build` OOM บน droplet RAM 1GB (`FATAL ERROR: Ineffective mark-compacts near heap limit`) — V8 default heap limit (~487MB) ตรวจจาก RAM จริงที่ detect ได้ตอน build ไม่สนใจ swap ที่เพิ่มเข้ามาทีหลังเลย ต้องบังคับ heap สูงขึ้นตรงๆ ให้ swap มารองรับได้ แก้ด้วย `ENV NODE_OPTIONS=--max-old-space-size=2048` ก่อน `RUN yarn build`
  - **`VITE_API_BASE_URL` หายเงียบๆ ตอน build บน droplet**: `.dockerignore` กัน `.env` ไม่ให้เข้า Docker build context (ถูกต้องสำหรับ secret ทั่วไป) แต่ `VITE_API_BASE_URL` ไม่ใช่ secret จริง (ค่าถูกฝังอยู่ใน JS bundle ที่ดู source ได้อยู่แล้ว) — ผลคือ `vite build` fallback ไปใช้ `http://localhost:3000` (ค่า default ใน `src/utils/api.js`) โดยไม่มี error ใดๆ frontend ที่ build เสร็จแล้ว deploy ขึ้นจริงเลยยิง API ไปที่ `localhost:3000` ของ**เครื่อง client เอง** ไม่ใช่ `api.horspace.com` — อาการที่สังเกตได้คือ **login แล้ว refresh หน้าทีไรหลุดกลับไปหน้า login ทุกครั้ง** เพราะ `stores/auth.js: silentRefresh()` เรียก `POST /auth/refresh` ไป `localhost:3000` ซึ่งไม่มีอะไรฟังอยู่บนเครื่อง browser ของ user จริง (เจอ root cause จากดู Network tab เห็น request จริงไปที่ `localhost:3000`) — **แก้**: ส่ง `VITE_API_BASE_URL` ผ่าน Docker **build arg** แทน (`ARG VITE_API_BASE_URL` + `ENV VITE_API_BASE_URL=$VITE_API_BASE_URL` ก่อน `COPY`/`yarn build` ใน Dockerfile, คู่กับ `docker-compose.yml`: `build.args.VITE_API_BASE_URL: ${VITE_API_BASE_URL}` อ่านจาก `.env`) — vite build-time var (`import.meta.env.VITE_*`) อ่านจาก `process.env` ได้โดยตรงอยู่แล้ว ไม่ต้องพึ่งไฟล์ `.env` เลย
- **พบ `main` ตามหลัง branch ที่มีงานจริง 21 commits ไม่มี PR เปิดอยู่เลย**: `fix/auth-phase-3` มีงาน redesign Admin/LIFF ทั้งหมด + Dockerfile fix ข้างต้น แต่ไม่เคย merge เข้า `main` — เปิด PR `#12` merge เข้า main แล้ว (ไม่มี merge conflict)
- **Dev Tunnel hostname ชนกับ production**: `scripts/dev-tunnel.js` + `~/.cloudflared/config.yml` เดิมใช้ `app.horspace.com`/`api.horspace.com` ชี้เข้า Cloudflare Named Tunnel สำหรับทดสอบ LINE LIFF ตอน dev — ตอนนี้ `api.horspace.com` ถูกใช้เป็น A record ของ production droplet ไปแล้ว ชนกันเต็มๆ แก้โดยเปลี่ยนชื่อ dev tunnel เป็น `dev.horspace.com`/`dev-api.horspace.com` ทั้งใน `config.yml` และรัน `cloudflared tunnel route dns horspace-dev <hostname>` สร้าง CNAME ใหม่ให้ครบ — `app.horspace.com` เดิมอาจมี DNS record ค้างอยู่ใน Cloudflare dashboard ที่ไม่ได้ใช้แล้ว ยังไม่ได้ลบ
- **Status**: 🟢 Live ที่ `https://horspace.com`, login + silent refresh ทำงานถูกต้องแล้วหลังแก้ build arg
- **ยังไม่เสร็จ**: ลบ DNS record เก่า (`app.horspace.com` CNAME) ใน Cloudflare dashboard ถ้ายังค้างอยู่ ดู `playground-api/docs/ACTIVITY_LOG.md` Phase 24 สำหรับงานค้างฝั่ง infra ที่เหลือ (UFW, backup cron, monitoring)

---

### Phase 26 (2026-11-11): วินิจฉัย LINE OAuth 400 "invalid url" ตอนเข้า `/liff` ผ่าน Dev Tunnel

- **อาการ**: เข้า `https://dev.horspace.com/liff` แล้วถูก redirect ไปหน้า LINE แล้วเจอ `access.line.me/oauth2/v2.1/error400?error=Bad%20Request&error_description=invalid%20url.%20channelId%3D2011289517%2CredirectUriString%3Dhttps%3A%2F%2Fdev.horspace.com%2Fliff`
- **Root Cause**: LINE ตรวจ `redirect_uri` (URL หน้าปัจจุบันตอน `liff.init()` ยิง OAuth) กับ **Endpoint URL** ที่ตั้งไว้ในหน้า LIFF app ของ LINE Developers Console เสมอ — `.env` เครื่อง dev ใช้ `VITE_LINE_LIFF_ID=2011289517-SB8YziXL` ซึ่งเป็น **LIFF ID ตัวเดียวกับ production** (channel `2011289517`) แต่ Endpoint URL ที่ Console เคยตั้งไว้คือ hostname เก่า (`app.horspace.com` ก่อนเปลี่ยนชื่อ tunnel ใน Phase 25 หรือ `horspace.com` จริงของ production) — ไม่เคยอัปเดตตามตอนย้าย dev tunnel ไปเป็น `dev.horspace.com` เลย จึงชนกันทุกครั้งที่เปิด dev ผ่าน tunnel
- **ยืนยันไม่ได้ฝั่ง Agent**: การแก้ Endpoint URL ต้อง Login เข้า LINE Developers Console ด้วยบัญชีผู้ใช้เอง — Agent เข้าไปเช็ค/แก้ให้ไม่ได้ ต้องให้ผู้ใช้ทำเอง
- **ทางแก้ที่เสนอ (ยังไม่ได้ทำ)**:
  1. แก้ Endpoint URL ของ LIFF app `2011289517-SB8YziXL` ใน Console ให้ตรง `https://dev.horspace.com/liff` ทุกครั้งที่สลับ dev ↔ production (เสี่ยงลืมสลับกลับ)
  2. **(แนะนำ)** สร้าง LIFF app ใหม่แยกสำหรับ dev โดยเฉพาะ (Channel/LIFF ID คนละตัวกับ production) แล้วตั้ง `VITE_LINE_LIFF_ID` แยกใน `.env` เครื่อง dev — ไม่ต้องแก้ Endpoint URL ของ production LIFF ไปมาอีก
- **Status**: 🔴 รอผู้ใช้ตัดสินใจทางแก้ + เข้า Console เอง — ยังไม่ปิดงาน

---

### Phase 27 (2026-11-11): `VITE_LINE_LIFF_ID` Build Arg Incident — ผู้เช่าทุกคนที่เปิดผ่าน LINE จริงเจอ UNAUTHORIZED

- **บริบท**: ผู้ใช้รายงาน error `UNAUTHORIZED` "กรุณาเข้าสู่ระบบผ่าน LINE ก่อนใช้งาน (ไม่พบ LINE ID Token)" ตอนเปิด LIFF ผ่าน production จริง — รูปแบบปัญหาเดียวกับ `VITE_API_BASE_URL` ใน Phase 25 เป๊ะ แต่เป็นอีกตัวแปรที่ไม่เคยถูกเอาเข้า build chain เลยตั้งแต่แรก (เส้นแยกจากปัญหา dev tunnel ของ Phase 26 ข้างบน — คนละอาการ คนละสาเหตุ บังเอิญแตะตัวแปรเดียวกัน)
- **Root cause**: `src/utils/liff.js` (`initLiff()`) อ่าน `import.meta.env.VITE_LINE_LIFF_ID` — ถ้าว่างจะ**ไม่เรียก `liff.init()` เลย** (เข้า "Standalone Dev Mode" เงียบๆ พร้อม `console.warn`) ทำให้ `getLiffIdToken()` คืน `null` ตลอด ไม่มี header `X-Line-Id-Token` ส่งไป backend เลยสักครั้ง — ตัวแปรนี้ไม่เคยอยู่ใน `Dockerfile` (มีแค่ `ARG VITE_API_BASE_URL`) และไม่เคยอยู่ใน `.env.production.example`/`.env.staging.example`/`.env.local.example` ที่ root มาตั้งแต่ Phase 25 เลย (ตกหล่นตอนทำ fix ตัวแรก ไม่ใช่ regression)
- **แก้**: เพิ่ม `ARG VITE_LINE_LIFF_ID` + `ENV VITE_LINE_LIFF_ID=$VITE_LINE_LIFF_ID` ใน `Dockerfile` (รูปแบบเดียวกับ `VITE_API_BASE_URL`), เพิ่ม `VITE_LINE_LIFF_ID: ${VITE_LINE_LIFF_ID}` ใน `docker-compose.yml` ที่ root ใต้ `frontend.build.args`, เพิ่ม placeholder ใน 3 ไฟล์ `.env.*.example` ที่ root
- **สิ่งที่เรียนรู้จากการ debug รอบนี้ (ใช้ได้กับทุก Vite env var ในอนาคต)**:
  - **False positive จาก grep เจอค่าใน JS bundle**: เช็ครอบแรกด้วย `docker exec ... grep "<LIFF ID>" assets/*.js` เจอค่าจริงใน `BuildingSettingsView-xxx.js` แล้วเข้าใจผิดว่า build ถูกต้องแล้ว — ที่จริงคือ `placeholder="เช่น 2011289517-SB8YziXL"` ใน [BuildingSettingsView.vue:876](file:///Users/user/Desktop/playgroud/playground/playground-frontend/src/views/BuildingSettingsView.vue#L876) (ตัวอย่างฟอร์มกรอก LIFF ID รายตึก ไม่เกี่ยวกับ env varตัวนี้เลย) บังเอิญเลขตรงกัน — **วิธีเช็คที่ถูกต้อง**: grep เฉพาะ **entry chunk หลัก** (ไฟล์ที่ `index.html` ชี้ `src=` ตรงๆ ผ่าน `curl https://horspace.com/ | grep -oE 'src="[^"]*\.js"'`) ไม่ใช่ chunk ไหนก็ได้ที่เจอค่า
  - **`docker compose build` เสร็จเร็วผิดปกติ (1.7s) = cache hit ไม่ได้ build จริง** — สาเหตุคือ `Dockerfile` แก้ไว้ local แล้วแต่ยัง**ไม่ commit/push** ขึ้น GitHub เลย droplet `git pull` ไปแล้วไม่ได้อะไรใหม่ (`docker-compose.yml`/`Caddyfile` ที่ root ไม่อยู่ใน git repo ไหนเลย ต้องแก้มือบน droplet เองเสมอ แยกจาก repo `playground-frontend`/`playground-api`)
  - **แก้ `docker-compose.yml` บน droplet ด้วย `nano` แล้ว YAML พัง** (`go-yaml load error ... did not find expected key`) — บรรทัด `container_name` ที่ตามหลังบรรทัดที่เพิ่งพิมพ์ใหม่ indent เหลือ 1 space จากที่ควรเป็น 4 (เพี้ยนจาก auto-indent ของ `nano`) แก้ด้วย `sed -i` เจาะจงบรรทัด แล้วเช็ค `docker compose config > /dev/null && echo "YAML OK"` ก่อน build ทุกครั้งที่แก้ไฟล์นี้
  - **วิธีเช็คที่เชื่อถือได้ที่สุด**: `docker inspect <image>:latest --format "{{.Config.Env}}"` เช็คว่า ENV ฝังเข้า image จริงไหม (ก่อน grep JS หรือเปิด browser เช็คเลย) — ตัดปัญหา browser/LINE in-app cache ออกไปได้ทั้งหมด
- **สร้างคู่มือ deploy แยกเป็น Artifact** (ไม่ได้เก็บในโค้ด) สรุป: ภาพรวม infra, ขั้นตอน deploy ปกติ (แรก vs ครั้งต่อไปแยก backend/frontend), ตาราง pitfall ทั้งหมดข้างต้น, checklist verify, คำสั่งดู log — ลิงก์อยู่ที่ที่ผู้ใช้ขอให้สร้างในแชท ไม่ใช่ไฟล์ใน repo
- **Status**: 🟢 แก้แล้ว ยืนยันด้วย `docker inspect` + `curl` grep entry chunk หลัก เจอค่าจริง — รอผู้ใช้ทดสอบ flow LIFF จริงผ่าน LINE app ยืนยันปิดเคสสุดท้าย
