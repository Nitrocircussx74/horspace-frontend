# ==========================================
# STAGE 1: Build Vue 3 App ด้วย Vite
# ==========================================
FROM node:22-alpine AS builder

WORKDIR /app

# VITE_API_BASE_URL ไม่ใช่ secret (ฝังอยู่ใน JS bundle ที่ใครก็ดูได้อยู่แล้ว) แต่ .env ถูกกัน
# ไม่ให้เข้า build context ไว้ (.dockerignore) เลยต้องรับผ่าน build arg แทน ไม่งั้น vite build
# fallback ไปใช้ localhost:3000 เงียบๆ แล้ว frontend ที่ deploy จริงจะยิง API ผิดที่
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# เหตุผลเดียวกับ VITE_API_BASE_URL ข้างบน — ไม่รับผ่าน build arg ตัวนี้ Vite build จะได้ liffId
# ว่าง แล้ว src/utils/liff.js จะไม่เรียก liff.init() เลย (เข้า Standalone Dev Mode เงียบๆ) ทำให้
# ผู้เช่าจริงที่เปิดผ่าน LINE app ไม่มี LINE ID Token ส่งไป backend เลย
ARG VITE_LINE_LIFF_ID
ENV VITE_LINE_LIFF_ID=$VITE_LINE_LIFF_ID

# คัดลอกไฟล์จัดการความสัมพันธ์ Dependencies
COPY package.json yarn.lock ./

# ติดตั้ง Dependencies ทั้งหมด
RUN yarn install --frozen-lockfile

# คัดลอกโค้ดทั้งหมดเข้า Builder Container
COPY . .

# ประกอบโปรเจกต์ (Production Build)
# ponytail: droplet RAM น้อย (1-2GB) V8 default heap limit ตรวจจาก RAM จริงไม่สนใจ swap เลย OOM ตอน build
# บังคับ heap สูงขึ้นให้ swap ที่เพิ่มไว้บน droplet มารองรับได้ ถ้าเครื่อง build ใหญ่ขึ้นในอนาคตค่อยถอดได้
ENV NODE_OPTIONS=--max-old-space-size=2048
RUN yarn build

# ==========================================
# STAGE 2: Nginx Web Server สำหรับ Production
# ==========================================
FROM nginx:alpine

# คัดลอก Static Files จาก Stage Builder ไปยัง Nginx Web Root
COPY --from=builder /app/dist /usr/share/nginx/html

# คัดลอกไฟล์ตั้งค่า Nginx (SPA Routing & API Proxy)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# เปิดพอร์ต 80
EXPOSE 80

# เริ่มต้นการทำงานของ Nginx Web Server
CMD ["nginx", "-g", "daemon off;"]
