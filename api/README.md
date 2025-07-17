# 📦 SGN Register API

API สำหรับระบบลงทะเบียนผู้ใช้ พร้อมรองรับการอัปโหลดไฟล์ (รูปภาพ, PDF, Word) สร้างด้วย Node.js + Express + TypeScript

## ⚙️ ความต้องการเบื้องต้น

- Node.js (แนะนำ v18 ขึ้นไป)
- npm

## 📥 การติดตั้ง

1. Clone โปรเจกต์
2. npm install
3. npm start

**เปลี่ยน Network Local IP

ไฟล์อยู่ที่ controolers/registercontroller.ts
ที่ function getFiles ที่

fileUrl: 'http://192.168.1.101:3000' + `/uploads/${file.fileName}`

เปลี่ยนจาก 192.168.1.101 เป็น Local IP ของเครื่อง
