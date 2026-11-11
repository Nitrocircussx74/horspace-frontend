# 🏢 Dormitory Management System - Frontend (Vue 3 + Vite + Tailwind CSS + LINE LIFF)

เว็บแอปพลิเคชันระบบบริหารจัดการหอพักและอพาร์ตเมนต์ครบวงจร พัฒนาด้วย **Vue 3 (Composition API / `<script setup>`)**, **Vite**, **Pinia**, **Vue Router**, **Tailwind CSS v3** และ **LINE LIFF SDK (`@line/liff`)** ออกแบบตามสถาปัตยกรรมระดับองค์กร รองรับทั้งระบบผู้ดูแล (Admin Backoffice) และระบบลูกบ้านผ่านแอป LINE (LINE LIFF Tenant Portal) ใน Repository เดียวกัน

---

## 🌟 ภาพรวมฟีเจอร์ของระบบทั้งหมด (Comprehensive Feature List)

### 🏢 1. ระบบจัดการสำหรับผู้ดูแลและนิติบุคคล (Admin Backoffice CMS)
- **📊 Business Analytics & Executive Dashboard (`/dashboard`)**:
  - สรุปอัตราการเช่าห้องพัก (Occupancy Rate) พร้อมการกระจายสถานะห้องแบบ Real-time
  - สรุปรายรับประจำเดือน และอัตราการเติบโต MoM (Month-over-Month)
  - ติดตามยอดหนี้ค้างชำระ (Debt Tracking) และรายชื่อห้องที่ค้างชำระ
  - แจ้งเตือนสัญญาเช่าที่ใกล้หมดอายุใน 30 วันล่วงหน้า (Expiring Leases)
  - สรุปจำนวนรายการแจ้งซ่อมที่รอดำเนินการ (Pending Maintenance)
  - กราฟแนวโน้มรายรับย้อนหลัง 6 เดือน (Revenue Trend Chart)
  - ตัวเลือกสลับดูสถิติรายอาคาร หรือภาพรวมทุกอาคาร (Multi-Building Consolidated View)
  - ส่งออกรายงานสรุปงบการเงินเป็นไฟล์ PDF (ภาษาไทย Sarabun) และรายงานใบแจ้งหนี้เป็นไฟล์ CSV (UTF-8 BOM)
- **🏢 Multi-Building Management (`/buildings`)**:
  - จัดการรายชื่ออาคารและสาขาในระบบเดียว
  - กำหนดอัตราค่าน้ำ ค่าไฟ วันครบกำหนดชำระ ค่าปรับรายวัน และ PromptPay QR Code ประจำแต่ละอาคาร
  - สวิตช์สลับอาคารทำงานได้สะดวกรวดเร็วจาก Topbar
- **🏠 ระบบจัดการห้องพัก & ผู้เช่า (`/rooms`)**:
  - ผังแสดงห้องพักแบบ Interactive Grid พร้อมตัวกรองสถานะ (ว่าง, มีผู้เช่า, ปิดปรับปรุง)
  - ออกรหัสเชิญลงทะเบียนเข้าพัก 6 หลัก (Invite Code 48 ชม.) พร้อม QR Code ให้ผู้เช่าสแกน
  - ระบบลงทะเบียนผู้เช่าเข้าห้องพักแบบ Manual (Check-in Modal)
  - กำหนดเจ้าของห้อง (Room Owner) แยกจากผู้เช่า และดูประวัติผู้เช่าย้อนหลังรายห้อง (Room Tenancy History Modal)
  - จัดการสัญญาเช่า และระบบบันทึกการย้ายออกพร้อมคำนวณคืนเงินมัดจำ (Move-Out Inspection & Deposit Settlement)
- **⚡ ระบบบันทึกมิเตอร์น้ำ-ไฟ (`/meters`)**:
  - ตารางบันทึกเลขมิเตอร์น้ำ-ไฟประจำรอบบิล พร้อมคำนวณหน่วยที่ใช้และยอดเงินอัตโนมัติ
  - ระบบ Anomaly Detection แจ้งเตือนเมื่อตัวเลขมิเตอร์ผิดปกติหรือน้อยกว่าเดือนก่อน
  - นำเข้าข้อมูลมิเตอร์จากไฟล์ Excel / CSV
- **🧾 ระบบใบแจ้งหนี้ & การชำระเงิน (`/invoices`)**:
  - ออกบิลค่าเช่าประจำรอบบิลอัตโนมัติแบบรวม
  - ออกบิลปรับแต่งรายห้อง (Custom Invoice) ปรับค่าน้ำ ค่าไฟ ละเว้นค่าส่วนกลาง และเพิ่มค่าบริการอื่นๆ
  - ตรวจทานและแก้ไขบิล Draft (Review & Publish) ก่อนเผยแพร่ให้ผู้เช่าเห็น
  - **ระบบส่ง LINE ทวงถามยอดค้างชำระ**:
    - ปุ่มส่ง LINE แจ้งเตือนรายห้อง (`💬 เตือน LINE`) สำหรับบิลค้างชำระ
    - ปุ่มส่ง LINE แจ้งเตือนยอดค้างชำระทั้งหมดในคลิกเดียว (`💬 ส่ง LINE เตือนยอดค้างทั้งหมด`) พร้อม Real-time Badge แสดงจำนวนบิล
  - บันทึกรับชำระเงินสดหรือโอนเงินผ่านเคาน์เตอร์ (Manual Payment)
  - พรีวิวและสั่งพิมพ์ใบแจ้งหนี้/ใบเสร็จรับเงิน (Print Preview & Browser Print)
  - ส่งออกใบแจ้งหนี้ PDF และใบเสร็จรับเงิน PDF พร้อมภาษาไทยถูกต้อง 100%
- **🔧 ระบบจัดการงานแจ้งซ่อม (`/maintenance`)**:
  - รายการงานแจ้งซ่อมแบบ Kanban / List แยกตามระดับความเร่งด่วนและสถานะ
  - ดูรูปถ่ายจุดที่ชำรุด มอบหมายช่าง บันทึกค่าซ่อม และอัปเดตสถานะงาน
  - เลือกผู้รับผิดชอบค่าซ่อม (นิติออกให้ / ลูกบ้านจ่ายเอง) พร้อม Badge แสดงว่ารวมเข้าบิลรอบถัดไปแล้วหรือยัง
  - แจ้งเตือน LINE อัตโนมัติไปยังลูกบ้านเมื่อสถานะงานซ่อมเปลี่ยนแปลง
- **📢 ระบบประกาศข่าวสาร (`/announcements`)**:
  - สร้างและเผยแพร่ข่าวสารหอพักพร้อมแนบรูปภาพ
  - ส่ง LINE Flex Message Broadcast / Multicast แจ้งเตือนลูกบ้านทุกคน
- **📦 ระบบจัดการพัสดุ (`/parcels`)**:
  - บันทึกรับพัสดุ ถ่ายรูปกล่อง ระบุบริษัทขนส่งและเลข Tracking
  - ส่ง LINE Flex Message แจ้งเตือนลูกบ้านทันทีเมื่อพัสดุมาถึง
  - สแกน QR Code เพื่อบันทึกการรับพัสดุ (Claimed)
- **📅 ระบบจองพื้นที่ส่วนกลาง (`/facility-bookings`)** — สำหรับคอนโด/หมู่บ้าน:
  - จัดการพื้นที่ส่วนกลางที่เปิดให้จอง ดูรายการจองทั้งหมด ยกเลิกการจองของลูกบ้านได้
- **🚗 ระบบยานพาหนะ & ผู้มาเยือน (`/vehicles`)** — สำหรับคอนโด/หมู่บ้าน:
  - อนุมัติ/ปฏิเสธทะเบียนรถของลูกบ้าน ดูรายชื่อแขก/ผู้มาเยือนที่แจ้งล่วงหน้าทั้งตึก
- **🗳️ ระบบโหวต & แบบสำรวจความเห็น (`/polls`)** — สำหรับคอนโด/หมู่บ้าน:
  - สร้างโพล (1 คน 1 โหวต) ดูผลโหวตแบบเรียลไทม์ ปิดรับโหวตได้เมื่อต้องการ
- **🛡️ ระบบความปลอดภัย & ผู้ใช้งาน (`/users`, `/audit-logs`)**:
  - จัดการรายชื่อผู้ดูแล กำหนดบทบาท (Super Admin, Owner, Manager, Admin)
  - บันทึกประวัติการแก้ไขข้อมูลสำคัญ (Audit Logs Viewer)
- **💬 ติดตามการแจ้งเตือน LINE (`/building-settings`)**:
  - การ์ดแสดงโควต้าข้อความ LINE OA ที่เหลือ/ใช้ไปประจำแต่ละอาคาร (LineQuotaCard)
  - ประวัติการส่งแจ้งเตือน LINE/SMS ทุกช่องทาง (บิล, แจ้งซ่อม, พัสดุ, ทั่วไป) พร้อมสถานะสำเร็จ/ล้มเหลว (DeliveryLogsTab)
- **🔔 กระดิ่งแจ้งเตือนในระบบ (Header ทุกหน้า, ต้องเลือกตึกก่อน)**:
  - เห็นทันทีเมื่อลูกบ้านแจ้งซ่อมใหม่/แนบสลิปรอตรวจสอบ/ขอจองพื้นที่/ขอจดทะเบียนรถ/ลงทะเบียนใหม่ กดแล้วพาไปหน้าที่เกี่ยวข้องทันที

---

### 📱 2. ระบบพอร์ทัลลูกบ้านผ่าน LINE (LINE LIFF Tenant Portal)
- **🔑 ลงทะเบียน & ผูกบัญชี (`/liff/onboarding`, `/liff/link-room`)**:
  - ลงทะเบียนเข้าพักใหม่ผ่าน Invite Code 6 หลัก
  - ผูกบัญชี LINE กับห้องพักเดิมด้วยเบอร์โทรศัพท์ 4 ตัวท้าย
  - ยืนยันตัวตนข้ามอาคาร (Centralized Identity) ด้วยเบอร์โทร + PIN เดิมที่ตั้งไว้แล้วเท่านั้น (ต้องตั้ง PIN ผ่าน Invite Code ก่อน ป้องกัน Account Takeover ด้วยเบอร์โทรอย่างเดียว)
  - Auto-Sync ข้อมูลโปรไฟล์ LINE (ชื่อ, รูปภาพ)
  - ส่ง Welcome Flex Message ต้อนรับเมื่อผูกบัญชีสำเร็จ
- **🌐 เข้าใช้งานผ่านเว็บเบราว์เซอร์ปกติ (`/web/login`, ไม่ผ่าน LINE)**:
  - ลูกบ้านที่ไม่ได้เปิดผ่านแอป LINE Login ด้วยเบอร์โทร + PIN ได้โดยตรง (Session เก็บใน `localStorage` เพราะไม่มี LINE SDK ให้ Silent Re-Auth)
  - หน้า LIFF Entry ตรวจจับอัตโนมัติว่าอยู่ใน LINE App หรือไม่ ถ้าไม่ใช่ (หรือ LINE Login ใช้ไม่ได้) จะพามาหน้านี้ให้เอง
- **🔄 สลับห้อง/ตึกที่เช่าอยู่ (Multi-Room Tenancy, `/liff/profile`)**:
  - ผู้เช่าที่มีหลายห้อง (รวมข้ามตึก) แตะเลือกห้องจากรายการเพื่อสลับดูข้อมูลได้ทันที
  - เมนูด่วน ธีมสี ยอดค้างชำระ พัสดุ และแจ้งซ่อม จะเปลี่ยนตามตึกของห้องที่เลือกเสมอ (Feature Toggle ที่ปิดไว้เฉพาะตึกมีผลทันที)
  - มี Skeleton ระหว่างโหลดข้อมูลห้องใหม่ กันเห็นข้อมูลห้องเก่าค้างแวบหนึ่ง
- **🆔 บัตรประจำตัวลูกบ้านดิจิทัล (`/liff/profile`)**:
  - Digital Tenant ID QR Code สำหรับยืนยันตัวตนกับ รปภ.
  - ดูรายละเอียดสัญญาเช่า หมายเลขห้องพัก และข้อมูลติดต่อหอพัก
- **💳 บิลค่าเช่า & ชำระเงินออนไลน์ (`/liff/invoices`)**:
  - ตรวจสอบบิลค้างชำระ (Pending / Overdue) และประวัติบิลที่ชำระแล้ว (Paid / Reviewing)
  - Dynamic PromptPay QR Code สแกนชำระเงินตามยอดจริงสุทธิ
  - อัปโหลดสลิปโอนเงินผ่านมือถือ
  - Auto Slip Verification ตรวจสอบยอดเงินอัตโนมัติและปรับสถานะเป็นชำระแล้วทันที
  - ดาวน์โหลดใบเสร็จรับเงินอิเล็กทรอนิกส์ (E-Receipt PDF)
- **🔧 แจ้งซ่อม & ร้องเรียนออนไลน์ (`/liff/issues`)**:
  - สร้างคำขอแจ้งซ่อม/ร้องเรียน แนบรูปได้สูงสุด 5 รูป และติดตามสถานะแบบ Real-time
  - รวมประวัติจากระบบแจ้งซ่อมเดิม (`/liff/maintenance` - Redirect มาที่นี่) ให้ลูกบ้านเห็นครบในที่เดียว
- **📦 พัสดุของฉัน (`/liff/parcels`)**:
  - ตรวจสอบรายการพัสดุที่รอรับ พร้อมรูปถ่ายและเลข Tracking
- **📢 ข่าวสาร & ประกาศ (`/liff/announcements`)**:
  - อ่านข่าวสารและประกาศย้อนหลังของหอพัก
- **🔔 กระดิ่งแจ้งเตือนในแอป (Header ทุกหน้าหลัง Login)**:
  - ดูประวัติแจ้งเตือนที่ระบบเคยส่งหาตนเอง (บิล, พัสดุ, แจ้งซ่อม, จองพื้นที่, รถ, โพล) พร้อมสถานะอ่านแล้ว/ยังไม่อ่าน
- **📅 จองพื้นที่ส่วนกลาง (`/liff/facility-bookings`)** — สำหรับคอนโด/หมู่บ้าน:
  - เลือกพื้นที่ส่วนกลางและช่วงเวลาที่ต้องการจองด้วยตนเอง ยกเลิกได้
- **🚗 ยานพาหนะ/ผู้มาเยือน (`/liff/vehicles`)** — สำหรับคอนโด/หมู่บ้าน:
  - ลงทะเบียนทะเบียนรถ (รออนุมัติ) และแจ้งแขกมาเยือนล่วงหน้า
- **🗳️ โหวต & แบบสำรวจ (`/liff/polls`)** — สำหรับคอนโด/หมู่บ้าน:
  - ร่วมโหวตโพลที่นิติบุคคล/ผู้ดูแลสร้างขึ้น

---

## 📁 โครงสร้างโปรเจกต์ (Directory Structure)

```text
playground-frontend/
├── .env                          # ตั้งค่า API Base URL & LINE LIFF ID
├── index.html                    # Root HTML Template (Google Fonts: Sarabun & Inter)
├── package.json                  # Dependencies (Vue 3, Vite, Axios, Pinia, Tailwind CSS)
├── vite.config.js                # Vite Configuration
└── src/
    ├── main.js                   # Application Entry Point & Library Initialization
    ├── App.vue                   # Root Vue Component
    ├── assets/
    │   └── main.css              # Global Tailwind CSS & Custom Theme Tokens
    ├── components/
    │   ├── common/               # Modal, Button, Badge, DataTable, Card, Alert
    │   └── layout/               # Sidebar, Topbar, LiffHeader, LiffBottomNav
    ├── composables/              # Reusable Composables (useToast, useConfirmModal)
    ├── router/
    │   └── index.js              # Vue Router + Role-based & LIFF Auth Guards
    ├── services/                 # Axios Service Layer
    │   ├── api.js                # Axios Instance with Silent Refresh Interceptors
    │   ├── authService.js        # Authentication & Session Management
    │   ├── buildingService.js    # Multi-building CRUD & Settings
    │   ├── dashboardService.js   # Analytics, Charts, Export PDF/CSV
    │   ├── invoiceService.js     # Billing, LINE Reminders, PDF/Receipt
    │   ├── liffService.js        # LIFF SDK Integration & Tenant APIs
    │   ├── maintenanceService.js # Maintenance Tickets & Statuses
    │   ├── meterService.js       # Utility Meter Readings & Import
    │   ├── parcelService.js      # Parcel Logging & QR Claiming
    │   └── roomService.js        # Room Status, Invites, Check-in/out
    ├── stores/
    │   ├── auth.js               # Pinia Auth State (In-Memory Access Token)
    │   └── building.js           # Selected Building Store
    └── views/
        ├── admin/                # Views สำหรับ Admin Backoffice
        │   ├── DashboardView.vue
        │   ├── RoomsView.vue
        │   ├── InvoicesView.vue
        │   ├── MetersView.vue
        │   ├── MaintenanceView.vue
        │   ├── ParcelsView.vue
        │   ├── AnnouncementsView.vue
        │   ├── BuildingsView.vue
        │   ├── UsersView.vue
        │   └── AuditLogsView.vue
        └── liff/                 # Views สำหรับ LINE LIFF Tenant Portal
            ├── LiffHomeView.vue
            ├── LiffInvoiceListView.vue
            ├── LiffInvoiceDetailView.vue
            ├── LiffMaintenanceView.vue
            ├── LiffParcelListView.vue
            ├── LiffAnnouncementListView.vue
            ├── LiffProfileView.vue
            ├── LiffOnboardingView.vue
            └── LiffLinkRoomView.vue
```

---

## 🛠️ การติดตั้งและรันโปรเจกต์ (Getting Started)

```bash
# 1. ติดตั้ง Dependencies
yarn install

# 2. ตั้งค่า Environment Variables
cp .env.example .env

# 3. รันในโหมดพัฒนา
yarn dev

# 4. รันพร้อมเปิด Cloudflare Tunnel สำหรับทดสอบ LINE LIFF บนอุปกรณ์จริง
yarn dev:tunnel
# หมายเหตุ: หลังแก้ vite.config.js หรือ Restart แล้ว Hash ของ Vite เปลี่ยน ถ้าเปิดผ่าน Tunnel แล้วเจอ Pinia error ให้ล้าง Site Data ของโดเมนหนึ่งครั้ง (Safari/iOS ไม่รองรับ Clear-Site-Data)
# หมายเหตุ: ถ้าเข้า /liff ผ่าน Tunnel แล้วโดน LINE เด้ง error400 "invalid url" — Endpoint URL ของ LIFF app ใน LINE Developers Console ไม่ตรงกับ hostname tunnel ปัจจุบัน ต้องแก้ใน Console เอง (ดู docs/ACTIVITY_LOG.md Phase 26)
# หมายเหตุ: 401 ในหน้า /liff ไม่ควรเด้งไป CMS login อีก (api.js นับหน้า /liff เป็น LIFF) และถ้า LINE ID Token หมดอายุ (อายุ 1 ชม.) ระบบจะ login ใหม่แล้วกลับหน้าเดิม (ดู docs/ACTIVITY_LOG.md Phase 28)

# 5. ตรวจสอบการ Build สำหรับ Production
yarn build
```

## 🌐 Production Deployment

Live ที่ `https://horspace.com` — รันบน DigitalOcean Droplet เดี่ยวคู่กับ `playground-api` ผ่าน Docker Compose ไฟล์เดียว (ไม่ใช่ repo นี้ อยู่ที่ root ของโปรเจกต์คู่) + Caddy reverse proxy

**สำคัญ**: `VITE_API_BASE_URL` ต้องส่งผ่าน Docker build arg เสมอ (ดู `Dockerfile` + `docker-compose.yml build.args`) ห้ามพึ่งไฟล์ `.env` เพราะ `.dockerignore` กันไฟล์นี้ไม่ให้เข้า build context — ลืมตั้งจะ fallback เป็น `localhost:3000` เงียบๆ โดยไม่มี error ทำให้ frontend ที่ deploy จริงยิง API ผิดที่

**เหมือนกันสำหรับ `VITE_LINE_LIFF_ID`**: ต้องส่งผ่าน build arg เสมอด้วย (เพิ่มแล้วใน `Dockerfile`/`docker-compose.yml`) ไม่งั้น `liff.init()` จะไม่ถูกเรียกเลยบน production จริง ผู้เช่าทุกคนที่เปิดผ่าน LINE จะโดน `401 UNAUTHORIZED` ตลอด — เช็คให้แน่ใจว่าค่าฝังเข้า build จริงด้วย `docker inspect <image> --format "{{.Config.Env}}"` ก่อนเชื่อผล

รายละเอียดเต็ม ดู `docs/ACTIVITY_LOG.md` Phase 25 (VITE_API_BASE_URL) และ Phase 27 (VITE_LINE_LIFF_ID)
