<template>
  <div class="min-h-full flex flex-col items-center justify-center py-6 px-4 font-sans text-slate-800">
    <!-- Ambient Background Lighting -->
    <div class="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      <div class="absolute -top-36 -left-36 w-96 h-96 bg-emerald-300/20 rounded-full blur-3xl"></div>
      <div class="absolute top-1/2 -right-36 w-96 h-96 bg-teal-200/25 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-36 left-1/3 w-80 h-80 bg-teal-200/20 rounded-full blur-3xl"></div>
    </div>

    <div class="w-full max-w-md mx-auto">
      <!-- 0. Mandatory Add Friend State (หน้าแจ้งเตือนและบังคับเพิ่มเพื่อน LINE Official) -->
      <Card
        v-if="needsAddFriend"
        class="bg-white/95 backdrop-blur-xl border-slate-100 shadow-xl shadow-emerald-950/5 p-6 sm:p-8 space-y-6 text-center animate-in fade-in zoom-in-95 duration-200"
      >
        <!-- Hero Graphic with Glowing Icon -->
        <div class="relative inline-flex items-center justify-center">
          <div class="w-20 h-20 rounded-xl bg-gradient-to-tr from-[#06C755] to-emerald-400 p-4 shadow-xl shadow-[#06C755]/25 flex items-center justify-center ring-8 ring-emerald-50/80">
            <svg class="w-full h-full fill-current text-white" viewBox="0 0 24 24">
              <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.477.254l2.486 3.37V8.108c0-.345.282-.63.63-.63.345 0 .624.285.624.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
            </svg>
          </div>
          <span class="absolute -bottom-1 -right-1 flex h-6 w-6">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-6 w-6 bg-emerald-500 border-2 border-white items-center justify-center text-white text-xs font-bold">
              <UserPlus class="w-3.5 h-3.5" />
            </span>
          </span>
        </div>

        <!-- Typography & Descriptions -->
        <div class="space-y-2">
          <Badge variant="success" class="font-bold tracking-wide">
            <Sparkles class="w-3.5 h-3.5" />
            <span>ช่องทางทางการของหอพัก</span>
          </Badge>
          <h1 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            เพิ่มเพื่อนกับ LINE Official
          </h1>
          <p class="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-sm mx-auto">
            กรุณาเพิ่มเพื่อนกับบัญชี LINE Official Account ของหอพัก เพื่อเริ่มต้นใช้งานและรับการแจ้งเตือนห้องพักแบบเรียลไทม์
          </p>
        </div>

        <!-- Feature Benefit Grid Cards -->
        <div class="grid grid-cols-2 gap-2.5 text-left pt-1">
          <div class="p-3 rounded-xl bg-slate-50/80 border border-slate-100 flex items-start gap-2.5">
            <div class="w-7 h-7 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
              <Bell class="w-3.5 h-3.5" />
            </div>
            <div class="min-w-0">
              <div class="text-xs font-bold text-slate-800">แจ้งเตือนบิล</div>
              <div class="text-xs text-slate-400 leading-tight">ค่าน้ำ ค่าไฟ ทุกเดือน</div>
            </div>
          </div>

          <div class="p-3 rounded-xl bg-slate-50/80 border border-slate-100 flex items-start gap-2.5">
            <div class="w-7 h-7 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0 mt-0.5">
              <Package class="w-3.5 h-3.5" />
            </div>
            <div class="min-w-0">
              <div class="text-xs font-bold text-slate-800">แจ้งเตือนพัสดุ</div>
              <div class="text-xs text-slate-400 leading-tight">รู้ทันทีเมื่อของมาถึง</div>
            </div>
          </div>

          <div class="p-3 rounded-xl bg-slate-50/80 border border-slate-100 flex items-start gap-2.5">
            <div class="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
              <Wrench class="w-3.5 h-3.5" />
            </div>
            <div class="min-w-0">
              <div class="text-xs font-bold text-slate-800">แจ้งซ่อม 24 ชม.</div>
              <div class="text-xs text-slate-400 leading-tight">ส่งรูปและติดตามช่าง</div>
            </div>
          </div>

          <div class="p-3 rounded-xl bg-slate-50/80 border border-slate-100 flex items-start gap-2.5">
            <div class="w-7 h-7 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center shrink-0 mt-0.5">
              <Receipt class="w-3.5 h-3.5" />
            </div>
            <div class="min-w-0">
              <div class="text-xs font-bold text-slate-800">ใบเสร็จ e-Receipt</div>
              <div class="text-xs text-slate-400 leading-tight">ดูและโหลดสลิปง่าย</div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="space-y-3 pt-2">
          <Button
            class="w-full bg-gradient-to-r from-[#06C755] to-emerald-600 hover:from-[#05b34c] hover:to-emerald-700 shadow-lg shadow-[#06C755]/25"
            @click="openAddFriendLine()"
          >
            <UserPlus class="w-4 h-4" />
            <span>กดเพิ่มเพื่อน (Add Friend)</span>
          </Button>

          <Button
            variant="secondary"
            class="w-full"
            :disabled="checkingFriendship"
            @click="recheckFriendshipInEntry()"
          >
            <span v-if="checkingFriendship" class="animate-spin w-3.5 h-3.5 border-2 border-slate-600 border-t-transparent rounded-full"></span>
            <RotateCw v-else class="w-3.5 h-3.5" />
            <span>{{ checkingFriendship ? 'กำลังตรวจสอบ...' : 'ฉันเพิ่มเพื่อนแล้ว (ตรวจสอบอีกครั้ง)' }}</span>
          </Button>

          <button
            type="button"
            @click="bypassFriendshipAndContinue"
            class="w-full py-2 px-3 text-slate-400 hover:text-slate-600 text-xs font-medium transition-colors cursor-pointer"
          >
            เพิ่มเพื่อนแล้ว / ดำเนินการต่อเข้าสู่ระบบ →
          </button>
        </div>
      </Card>

      <!-- 1. Loading Indicator (Initial Check) - Splash Screen ใช้ Icon ของแอปเป็นหลัก -->
      <Card
        v-else-if="loading"
        class="bg-white/95 backdrop-blur-xl border-slate-100 shadow-xl shadow-slate-200/50 p-8 sm:p-10 space-y-5 text-center animate-in fade-in duration-200"
      >
        <!-- App Icon พร้อมวงแหวน Pulse ล้อมรอบแบบหน้า Splash ของแอป -->
        <div class="relative w-24 h-24 mx-auto flex items-center justify-center">
          <span class="absolute inset-0 rounded-xl bg-emerald-400/20 animate-ping"></span>
          <span class="absolute inset-0 rounded-xl border-3 border-emerald-500/15"></span>
          <div class="absolute inset-0 rounded-xl border-3 border-transparent border-t-emerald-500 border-r-emerald-500 animate-spin"></div>
          <div class="w-16 h-16 rounded-xl bg-white p-2 shadow-lg shadow-emerald-900/10 ring-1 ring-slate-100 flex items-center justify-center overflow-hidden">
            <img src="/horspace-app-icon.webp" alt="Horspace App Icon" width="64" height="64" class="w-full h-full object-contain" loading="eager" decoding="async" />
          </div>
        </div>
        <div class="space-y-1">
          <h2 class="text-sm font-bold text-slate-800">Horspace (ฮอร์สเปซ)</h2>
          <p class="text-xs font-medium text-slate-500">{{ statusText }}</p>
        </div>
      </Card>

      <!-- 2. Phone Verification & Existing User PIN Confirmation Form -->
      <Card
        v-else-if="showPhoneVerifyForm"
        class="bg-white/95 backdrop-blur-xl border-slate-100 shadow-xl shadow-slate-200/50 p-6 sm:p-8 space-y-5 text-left animate-in fade-in zoom-in-95 duration-200"
      >
        <!-- State A: Existing User Detected -> Prompt for Central PIN -->
        <div v-if="isExistingUserPrompt" class="space-y-4">
          <div class="flex items-center justify-between">
            <Badge variant="neutral" class="bg-teal-50 text-teal-700 border border-teal-200/80 font-bold">
              พบข้อมูลใน Horspace
            </Badge>
            <button
              type="button"
              @click="isExistingUserPrompt = false; existingPinInput = ''; phoneErrorMessage = ''"
              class="text-xs text-slate-400 hover:text-slate-600 font-medium cursor-pointer"
            >
              ← เปลี่ยนเบอร์โทร
            </button>
          </div>

          <div class="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-100/80 flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-emerald-500 text-white font-bold flex items-center justify-center text-sm shrink-0">
              {{ existingUserName ? existingUserName.charAt(0).toUpperCase() : 'U' }}
            </div>
            <div class="min-w-0">
              <div class="text-xs font-bold text-slate-800 truncate">{{ existingUserName || 'ลูกบ้าน Horspace' }}</div>
              <div class="text-xs text-slate-500 font-mono">{{ verifyPhoneInput }}</div>
            </div>
          </div>

          <div class="space-y-1">
            <h2 class="text-base font-bold text-slate-900">{{ existingUserHasPin ? 'กรอกรหัส PIN 6 หลัก' : 'ตั้งรหัส PIN 6 หลักใหม่' }}</h2>
            <p class="text-xs text-slate-500 leading-relaxed">
              {{ existingUserHasPin
                ? 'กรอกรหัส PIN เดิมของคุณเพื่อยืนยันตัวตนและผูก LINE กับหอพักนี้ทันที'
                : 'บัญชีนี้ยังไม่เคยตั้งรหัส PIN กรุณาตั้งรหัส PIN 6 หลักใหม่ ระบบจะบันทึกและผูก LINE กับหอพักนี้ทันที' }}
            </p>
          </div>

          <form @submit.prevent="handleLinkAndLogin" class="space-y-4">
            <div>
              <PasswordInput
                v-model="existingPinInput"
                inputmode="numeric"
                pattern="[0-9]*"
                maxlength="6"
                placeholder="••••••"
                required
                autofocus
                class="h-auto px-4 py-3.5 bg-slate-50 border-slate-200 rounded-xl text-2xl font-mono font-bold text-center tracking-[0.4em] placeholder:text-slate-300 placeholder:tracking-normal focus-visible:bg-white"
              />
            </div>

            <!-- ลืมรหัส PIN (แสดงเฉพาะกรณีที่เคยตั้ง PIN ไว้แล้วเท่านั้น) -->
            <div v-if="existingUserHasPin" class="flex items-center justify-end px-1">
              <button
                type="button"
                @click="handleForgotPin"
                class="text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline cursor-pointer transition-colors"
              >
                ลืมรหัส PIN?
              </button>
            </div>

            <div v-if="phoneErrorMessage" class="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-xs font-medium space-y-1.5">
              <div>{{ phoneErrorMessage }}</div>
              <div v-if="existingUserHasPin" class="pt-0.5">
                <button
                  type="button"
                  @click="handleForgotPin"
                  class="font-bold text-rose-700 underline hover:text-rose-900 cursor-pointer"
                >
                  คลิกที่นี่เพื่อตั้งรหัส PIN ใหม่
                </button>
              </div>
            </div>

            <Button type="submit" class="w-full" :disabled="verifyingPhone || existingPinInput.length !== 6">
              <span v-if="verifyingPhone" class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
              <span>{{ verifyingPhone
                ? (existingUserHasPin ? 'กำลังผูกบัญชีและเข้าสู่ระบบ...' : 'กำลังตั้ง PIN และผูกบัญชี...')
                : (existingUserHasPin ? 'ยืนยัน PIN & เข้าสู่ระบบ' : 'ตั้งรหัส PIN ใหม่ & เข้าสู่ระบบ') }}</span>
            </Button>
          </form>
        </div>

        <!-- State B: Enter Phone Number (New or Unchecked) -->
        <div v-else class="space-y-5">
          <!-- User Profile Header -->
          <div class="flex items-center justify-between">
            <Badge variant="success" class="font-bold border border-emerald-200/80">
              ยินดีต้อนรับลูกบ้านใหม่
            </Badge>
            <span class="text-xs text-slate-400 font-medium">ขั้นตอนที่ 1 จาก 2</span>
          </div>

          <div v-if="lineProfile" class="flex items-center gap-3 p-3.5 bg-slate-50/80 rounded-xl border border-slate-100">
            <img
              v-if="lineProfile.pictureUrl"
              :src="lineProfile.pictureUrl"
              alt="LINE Avatar"
              class="w-11 h-11 rounded-full border border-emerald-200 shadow-xs object-cover"
            />
            <div v-else class="w-11 h-11 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-sm">
              U
            </div>
            <div class="min-w-0 flex-1">
              <div class="text-xs text-slate-400 font-medium uppercase tracking-wider">บัญชี LINE</div>
              <div class="text-sm font-bold text-slate-800 truncate">{{ lineProfile.displayName || 'ผู้ใช้งาน LINE' }}</div>
            </div>
          </div>

          <div class="space-y-1">
            <h2 class="text-base font-bold text-slate-900">ยืนยันเบอร์โทรศัพท์</h2>
            <p class="text-xs text-slate-500 leading-relaxed">
              กรอกเบอร์โทรศัพท์ที่แจ้งไว้กับหอพัก เพื่อผูกข้อมูลห้องพักและตั้งรหัส PIN ความปลอดภัย
            </p>
          </div>

          <!-- Phone Verification Input & Submit -->
          <form @submit.prevent="handleVerifyByPhone" class="space-y-4">
            <div>
              <Input
                v-model="verifyPhoneInput"
                type="tel"
                maxlength="10"
                placeholder="08xxxxxxxx"
                required
                autofocus
                class="h-auto px-4 py-3 bg-slate-50 border-slate-200 rounded-xl text-base font-mono font-bold text-center tracking-widest placeholder:text-slate-300 placeholder:font-normal focus-visible:bg-white"
              />
            </div>

            <!-- Error Alert Banner -->
            <div v-if="phoneErrorMessage" class="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-xs font-medium">
              {{ phoneErrorMessage }}
            </div>

            <!-- Submit Button -->
            <Button type="submit" class="w-full" :disabled="verifyingPhone || !verifyPhoneInput">
              <span v-if="verifyingPhone" class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
              <span>{{ verifyingPhone ? 'กำลังค้นหาและตรวจสอบ...' : 'ยืนยันเบอร์โทรศัพท์' }}</span>
            </Button>
          </form>

          <!-- Option 2: Invite Code Link Card -->
          <div class="pt-3 text-center border-t border-slate-100 space-y-2">
            <div class="text-xs text-slate-400 font-medium">หรือหากคุณได้รับรหัสเชิญเข้าพักจากผู้ดูแล</div>
            <router-link
              to="/liff/register"
              class="w-full py-2.5 px-3 bg-slate-50 hover:bg-slate-100 active:bg-slate-200 text-slate-600 rounded-xl text-xs font-semibold inline-flex items-center justify-center transition-all border border-slate-200/70"
            >
              ลงทะเบียนด้วยรหัสเชิญ (Invite Code)
            </router-link>
          </div>
        </div>
      </Card>

      <!-- 3. LINE Login Prompt (When opened in external browser without active LINE session) -->
      <Card
        v-else
        class="bg-white/95 backdrop-blur-xl border-slate-100 shadow-xl shadow-slate-200/50 p-6 sm:p-8 space-y-5 text-center"
      >
        <div class="w-16 h-16 rounded-xl bg-[#06C755] p-3.5 shadow-lg shadow-[#06C755]/25 mx-auto flex items-center justify-center text-white">
          <svg class="w-full h-full fill-current text-white" viewBox="0 0 24 24">
            <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.477.254l2.486 3.37V8.108c0-.345.282-.63.63-.63.345 0 .624.285.624.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
          </svg>
        </div>

        <div class="space-y-1">
          <h2 class="text-base font-bold text-slate-800">เข้าสู่ระบบด้วย LINE</h2>
          <p class="text-xs text-slate-500">กรุณาเข้าสู่ระบบผ่านบัญชี LINE เพื่อเริ่มต้นใช้งานระบบหอพัก</p>
        </div>

        <Button
          class="w-full bg-[#06C755] hover:bg-[#05b34c] shadow-md shadow-[#06C755]/25"
          :disabled="isLoggingIn"
          @click="handleLineLogin"
        >
          <span>{{ isLoggingIn ? 'กำลังเชื่อมต่อ LINE...' : 'เข้าสู่ระบบด้วย LINE' }}</span>
        </Button>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { initLiff, isLiffLoggedIn, loginLiff, getLiffProfile, getLiffIdToken, getLiffFriendship, openAddFriendLine } from '@/utils/liff';
import api, { isLineTokenInvalid } from '@/utils/api';
import authService from '@/services/authService';
import { useAuthStore } from '@/stores/auth';
import { useDynamicTheme } from '@/composables/useDynamicTheme';
import { showSuccess, showWarning, showConfirm } from '@/utils/swal';
import {
  UserPlus,
  RotateCw,
  Sparkles,
  Bell,
  Package,
  Wrench,
  Receipt,
  Building2
} from 'lucide-vue-next';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import PasswordInput from '@/components/common/PasswordInput.vue';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const { fetchAndApplyBuildingTheme, buildingName } = useDynamicTheme();

const loading = ref(true);
const statusText = ref('กำลังเชื่อมต่อ LINE SDK...');
const isLoggingIn = ref(false);
const showPhoneVerifyForm = ref(false);
const isExistingUserPrompt = ref(false);
const existingUserHasPin = ref(true);
const existingUserName = ref('');
const existingPinInput = ref('');
const lineProfile = ref(null);
const verifyPhoneInput = ref('');
const verifyingPhone = ref(false);
const phoneErrorMessage = ref('');
const needsAddFriend = ref(false);
const checkingFriendship = ref(false);

const checkEntryFriendship = async () => {
  try {
    const friendship = await getLiffFriendship();
    console.log('[LIFF Entry] Friendship status:', friendship);
    if (friendship && friendship.noBotLinked) {
      console.warn('LINE Login Channel has no linked OA bot. Skipping friendship block to prevent endless loop.');
      needsAddFriend.value = false;
      return true;
    }
    if (friendship && friendship.friendFlag === false) {
      needsAddFriend.value = true;
      loading.value = false;
      return false;
    }
    needsAddFriend.value = false;
    return true;
  } catch (err) {
    console.warn('Friendship check in entry error:', err);
    return true;
  }
};

const continueToSmartEntry = async () => {
  loading.value = true;
  needsAddFriend.value = false;
  try {
    statusText.value = 'กำลังตรวจสอบข้อมูลสัญญาเช่าหอพัก...';

    // 2. ดึง LINE Profile สดจาก LINE SDK
    lineProfile.value = await getLiffProfile();

    // 3. เช็คสถานะการผูกห้องพักและการตั้งค่า PIN ในฐานข้อมูล
    const idToken = getLiffIdToken() || (import.meta.env.DEV && typeof window !== 'undefined' ? localStorage.getItem('dev_line_user_id') : null);
    let statusRes = null;
    if (idToken) {
      try {
        statusRes = await authService.checkLiffStatus(idToken);
      } catch (e) {
        console.warn('Check status fallback:', e.message);
        // ID Token เสีย: interceptor กำลัง login LINE ใหม่ (หน้าโหลดใหม่) ห้ามแสดงฟอร์มสมัครลูกบ้านใหม่ให้คนที่มีบัญชีอยู่แล้ว
        if (isLineTokenInvalid(e) && e.liffRecovering) {
          statusText.value = 'กำลังเข้าสู่ระบบ LINE ใหม่อีกครั้ง...';
          return;
        }
      }
    }

    const isLinked = statusRes?.isLinked || statusRes?.isRegistered || statusRes?.data?.isLinked;
    const hasPin = statusRes?.hasPin || statusRes?.data?.hasPin;

    // ส่งต่อปลายทางเดิม (ถ้ามี) จาก Route Guard ที่เด้งมาเพราะยังไม่ได้ Login เพื่อกลับไปหน้านั้นให้อัตโนมัติหลัง Login สำเร็จ
    const redirectQuery = route.query.redirect ? { redirect: route.query.redirect } : {};

    if (isLinked) {
      if (!hasPin) {
        // [CASE 1: ลูกบ้านที่ผูกแล้วแต่ยังไม่มี PIN] -> บังคับตั้ง PIN ครั้งแรก
        statusText.value = 'พบข้อมูลลูกบ้าน กำลังพาไปตั้งรหัส PIN 6 หลัก...';
        router.replace({ path: '/liff/setup-pin', query: redirectQuery });
      } else {
        // [CASE 2: ลูกบ้านที่มี PIN แล้ว] -> พาไปหน้ากรอก PIN Auto-Login
        statusText.value = 'พบข้อมูลลูกบ้าน กำลังเปิดหน้าระบุ PIN...';
        router.replace({ path: '/liff/pin-login', query: redirectQuery });
      }
    } else {
      // [CASE 3: ลูกบ้านใหม่ / ยังไม่เคยผูกห้อง] -> แสดงหน้าสำหรับลูกบ้านใหม่
      loading.value = false;
      showPhoneVerifyForm.value = true;
    }
  } catch (err) {
    console.error('Continue entry error:', err);
    loading.value = false;
    showPhoneVerifyForm.value = true;
  }
};

const bypassFriendshipAndContinue = async () => {
  await continueToSmartEntry();
};

const recheckFriendshipInEntry = async () => {
  checkingFriendship.value = true;
  try {
    const isFriend = await checkEntryFriendship();
    if (isFriend) {
      await showSuccess('ยินดีต้อนรับ!', 'ตรวจสอบพบการเพิ่มเพื่อนเรียบร้อยแล้ว');
      await continueToSmartEntry();
    } else {
      showWarning('ยังไม่พบการเพิ่มเพื่อน', 'กรุณากดปุ่ม "กดเพิ่มเพื่อน" เพื่อเพิ่มเพื่อนกับ LINE Official Account ก่อนเข้าใช้งานนะครับ');
    }
  } finally {
    checkingFriendship.value = false;
  }
};

onMounted(async () => {
  const targetBuilding = route.query.building || route.query.buildingId || (typeof window !== 'undefined' ? localStorage.getItem('liff_target_building') : null);
  if (targetBuilding) {
    fetchAndApplyBuildingTheme(targetBuilding);
  }

  try {
    statusText.value = 'กำลังยืนยันตัวตนบัญชี LINE...';
    await initLiff();

    if (isLiffLoggedIn()) {
      // 1. ตรวจสอบสถานะความเป็นเพื่อนก่อนเป็นอันดับแรก
      const isFriend = await checkEntryFriendship();
      if (!isFriend) {
        return;
      }

      await continueToSmartEntry();
      return;
    }

    // เดิมเช็ค liff.isInClient() ก่อนตัดสินใจ ทำให้พลาดกรณี liff.init() ล้มเงียบๆ (เช่น Endpoint URL
    // ไม่ตรงกับ origin ปัจจุบัน) หรือผู้ใช้เปิดผ่าน LINE แบบ External Browser — isInClient() จะ false
    // ทั้งที่เข้ามาจาก Rich Menu/ลิงก์ LINE จริงๆ
    // แก้โดยไม่พึ่ง isInClient() แล้ว: ลอง loginLiff() ก่อนเสมอ (จำกัด 1 ครั้งต่อ Session กัน Loop)
    // เพราะ liff.login() รองรับทั้งสองบริบทอยู่แล้ว (ในแอป LINE เข้าแบบ Silent, นอกแอปจะ Redirect ผ่าน
    // LINE Login OAuth) — ระบบเปิดให้เข้าผ่าน LINE เท่านั้น ไม่มีช่องทาง Web Login สำรองแล้ว
    const loginAttempted = sessionStorage.getItem('liff_auto_login_attempted');
    if (!loginAttempted) {
      sessionStorage.setItem('liff_auto_login_attempted', 'true');
      const loginStarted = await loginLiff(undefined, 'aggressive');
      if (loginStarted) return; // liff.login() จะ Redirect ออกจากหน้านี้เอง
    }

    // loginLiff() เรียกไม่สำเร็จจริงๆ (LIFF ใช้งานไม่ได้เลย) -> แจ้งให้เปิดผ่านแอป LINE เท่านั้น
    loading.value = false;
    statusText.value = 'กรุณาเข้าใช้งานผ่านแอป LINE เท่านั้น';
  } catch (err) {
    console.error('LIFF Smart Entry init error:', err);
    loading.value = false;
  }
});

const handleVerifyByPhone = async () => {
  if (!verifyPhoneInput.value || !verifyPhoneInput.value.trim()) return;
  verifyingPhone.value = true;
  phoneErrorMessage.value = '';

  const cleanPhone = verifyPhoneInput.value.trim();
  const targetBuilding = route.query.building || route.query.buildingId || (typeof window !== 'undefined' ? localStorage.getItem('liff_target_building') : null);

  try {
    // 1. ตรวจสอบสถานะเบอร์โทรศัพท์ในระบบ Horspace ก่อน (Centralized Identity Check)
    const phoneStatus = await authService.verifyPhoneStatus({ phone: cleanPhone, building: targetBuilding || undefined });

    if (phoneStatus?.isExistingUser) {
      // ผู้ใช้เดิมที่มีบัญชีอยู่แล้วในระบบ -> ให้กรอก PIN เดิม (ถ้ามี) หรือตั้ง PIN ใหม่ (ถ้ายังไม่เคยตั้ง) เพื่อผูกบัญชีทันที
      existingUserName.value = phoneStatus.userName || phoneStatus.tenantName || 'ลูกบ้าน Horspace';
      existingUserHasPin.value = Boolean(phoneStatus.hasPin);
      isExistingUserPrompt.value = true;
      verifyingPhone.value = false;
      return;
    }

    // 2. หากเป็นลูกบ้านใหม่หรือไม่เคยตั้ง PIN -> ทำการ verify phone ตามปกติ
    const payload = {
      phone: cleanPhone,
      building: targetBuilding || undefined,
      lineDisplayName: lineProfile.value?.displayName || null,
      linePictureUrl: lineProfile.value?.pictureUrl || null,
      lineStatusMessage: lineProfile.value?.statusMessage || null
    };

    const res = await api.post('/api/v1/liff/auth/verify-phone', payload);

    if (res.data?.success) {
      const accessToken = res.data.accessToken || res.data.data?.accessToken;
      const tenantData = res.data.data?.tenant || res.data.tenant;
      if (accessToken) {
        authStore.setLiffAuth(accessToken, tenantData);
      }

      await showSuccess('ยืนยันตัวตนสำเร็จ!', res.data.message || 'เชื่อมต่อบัญชี LINE ของคุณกับห้องพักเรียบร้อยแล้ว กรุณาตั้งรหัส PIN 6 หลัก');
      // พาลูกบ้านใหม่ไปตั้งรหัส PIN 6 หลักทันทีเพื่อความปลอดภัยในครั้งต่อไป
      router.replace('/liff/setup-pin');
    } else {
      router.replace('/liff/setup-pin');
    }
  } catch (err) {
    console.error('Verify phone error:', err);
    phoneErrorMessage.value = err.response?.data?.message || 'ไม่พบข้อมูลลูกบ้านที่ตรงกับเบอร์โทรศัพท์นี้ กรุณาตรวจสอบเบอร์โทรศัพท์อีกครั้งหรือติดต่อผู้ดูแลหอพัก';
  } finally {
    verifyingPhone.value = false;
  }
};

const handleLinkAndLogin = async () => {
  if (!existingPinInput.value || existingPinInput.value.length !== 6) return;
  verifyingPhone.value = true;
  phoneErrorMessage.value = '';

  const targetBuilding = route.query.building || route.query.buildingId || (typeof window !== 'undefined' ? localStorage.getItem('liff_target_building') : null);

  try {
    const idToken = getLiffIdToken() || (import.meta.env.DEV && typeof window !== 'undefined' ? localStorage.getItem('dev_line_user_id') : null);
    const payload = {
      phone: verifyPhoneInput.value.trim(),
      pin: existingPinInput.value,
      building: targetBuilding || undefined,
      lineIdToken: idToken,
      lineDisplayName: lineProfile.value?.displayName || null,
      linePictureUrl: lineProfile.value?.pictureUrl || null,
      lineStatusMessage: lineProfile.value?.statusMessage || null
    };

    const res = await authService.linkAndLogin(payload);

    if (res?.success) {
      const token = res.accessToken || res.data?.accessToken;
      const tenantData = res.user || res.tenant || res.data?.tenant || res.data?.user;
      if (token) {
        authStore.setLiffAuth(token, tenantData);
      }

      const pinCreated = res.pinCreated ?? res.data?.pinCreated;
      await showSuccess(
        pinCreated ? 'ตั้งรหัส PIN ใหม่และเข้าสู่ระบบสำเร็จ!' : 'เชื่อมต่อบัญชีสำเร็จ!',
        `ยินดีต้อนรับคุณ ${existingUserName.value || 'ลูกบ้าน'} เข้าสู่ระบบหอพัก`
      );
      router.replace('/liff/profile');
    } else {
      phoneErrorMessage.value = res?.message || 'รหัส PIN 6 หลักไม่ถูกต้อง';
    }
  } catch (err) {
    console.error('Link and login error:', err);
    phoneErrorMessage.value = err.response?.data?.message || 'รหัส PIN 6 หลักไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง';
  } finally {
    verifyingPhone.value = false;
  }
};

const handleForgotPin = async () => {
  const phone = verifyPhoneInput.value?.trim();
  const confirmed = await showConfirm(
    'ลืมรหัส PIN?',
    `ต้องการตั้งรหัส PIN ใหม่สำหรับเบอร์ ${phone} ใช่หรือไม่?`,
    'ตั้งรหัส PIN ใหม่',
    'ยกเลิก'
  );

  if (confirmed) {
    router.push({
      path: '/liff/setup-pin',
      query: {
        phone: phone || undefined,
        name: existingUserName.value || undefined,
        mode: 'reset'
      }
    });
  }
};

const handleLineLogin = async () => {
  isLoggingIn.value = true;
  try {
    const liffId = import.meta.env.VITE_LINE_LIFF_ID || import.meta.env.VITE_LIFF_ID || '';
    if (liffId) {
      const targetUri = window.location.origin + '/liff';
      await loginLiff(targetUri, 'aggressive');
    } else {
      router.push('/liff');
    }
  } catch (err) {
    console.error('LINE Login error:', err);
    router.push('/liff');
  } finally {
    isLoggingIn.value = false;
  }
};
</script>
