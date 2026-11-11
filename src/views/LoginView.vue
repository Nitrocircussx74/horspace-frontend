<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden bg-slate-900 font-sans selection:bg-cyan-600 selection:text-white">
    <!-- Ambient Glow Background Meshes -->
    <div class="absolute inset-0 pointer-events-none overflow-hidden z-0">
      <div class="absolute -top-40 -left-40 w-96 h-96 bg-cyan-600/30 rounded-full blur-[100px]"></div>
      <div class="absolute top-1/2 -right-40 w-[30rem] h-[30rem] bg-teal-600/25 rounded-full blur-[120px]"></div>
      <div class="absolute -bottom-40 left-1/3 w-96 h-96 bg-teal-400/15 rounded-full blur-[100px]"></div>
    </div>

    <!-- Login Card Container -->
    <div class="w-full max-w-md relative z-10">
      <Card class="border-slate-800/80 bg-slate-900/80 backdrop-blur-2xl shadow-2xl shadow-cyan-950/50 rounded-3xl overflow-hidden text-slate-100">
        <CardHeader class="space-y-3 text-center pb-6 pt-8 px-6 sm:px-8 border-b border-slate-800/60 bg-gradient-to-b from-slate-800/40 to-transparent">
          <div class="relative mx-auto inline-flex">
            <div class="w-16 h-16 rounded-2xl bg-white/95 p-1 flex items-center justify-center shadow-xl shadow-cyan-600/30 ring-4 ring-cyan-500/20 overflow-hidden">
              <img src="/horspace-app-icon.webp" alt="Horspace App Icon" width="64" height="64" class="w-full h-full object-contain rounded-xl" loading="eager" decoding="async" />
            </div>
            <span class="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-3.5 w-3.5 bg-cyan-500 border-2 border-slate-900"></span>
            </span>
          </div>

          <div>
            <CardTitle as="h1" class="text-2xl font-extrabold tracking-tight text-white">
              Horspace <span class="text-cyan-400 font-bold">CMS</span>
            </CardTitle>
            <p class="text-xs font-semibold text-cyan-400 tracking-wide mt-1">
              Central Management System for Properties
            </p>
          </div>
          <CardDescription class="text-slate-400 text-xs">
            เข้าสู่ระบบสำหรับผู้ดูแลระบบและเจ้าของหอพัก
          </CardDescription>
        </CardHeader>

        <CardContent class="px-6 sm:px-8 pt-6 space-y-5">
          <!-- Local Password Login Form -->
          <form @submit.prevent="handleLocalLogin" class="space-y-4">
            <div class="space-y-1.5">
              <label for="identifier" class="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between">
                <div class="flex items-center gap-1.5">
                  <User class="w-3.5 h-3.5 text-cyan-400" />
                  <span>อีเมล หรือ เบอร์โทรศัพท์</span>
                </div>
              </label>
              <Input
                id="identifier"
                v-model="identifier"
                type="text"
                placeholder="เช่น owner@dorm.com หรือ 0812345678"
                required
                data-testid="identifier-input"
                :disabled="authStore.loading"
                class="bg-slate-950/60 border-slate-800 text-white placeholder:text-slate-500 rounded-xl focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 h-11 transition-all text-xs"
              />
            </div>

            <div class="space-y-1.5">
              <label for="password" class="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Lock class="w-3.5 h-3.5 text-cyan-400" />
                <span>รหัสผ่าน (Password)</span>
              </label>
              <PasswordInput
                id="password"
                v-model="password"
                placeholder="••••••••"
                required
                data-testid="password-input"
                :disabled="authStore.loading"
                class="bg-slate-950/60 border-slate-800 text-white placeholder:text-slate-500 rounded-xl focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 h-11 transition-all text-xs"
              />
            </div>

            <div v-if="errorMessage" data-testid="error-message" class="p-3.5 text-xs text-rose-300 bg-rose-950/50 border border-rose-800/60 rounded-xl text-center font-medium shadow-sm flex items-center justify-center gap-2">
              <AlertCircle class="w-4 h-4 text-rose-400 shrink-0" />
              <span>{{ errorMessage }}</span>
            </div>

            <!-- Quick Demo Credential Autofill Helper (dev only — never ships to production) -->
            <div v-if="isDev" class="pt-1 flex items-center justify-between gap-2">
              <span class="text-xs text-slate-400">กรอกข้อมูลทดสอบ:</span>
              <div class="flex items-center gap-3">
                <button
                  type="button"
                  @click="fillDemoAccount('owner')"
                  class="text-xs font-bold text-cyan-400 hover:text-cyan-300 underline underline-offset-2 transition-colors cursor-pointer"
                >
                  เจ้าของหอพัก (Owner)
                </button>
                <span class="text-slate-600 text-xs">|</span>
                <button
                  type="button"
                  @click="fillDemoAccount('superadmin')"
                  class="text-xs font-bold text-cyan-400 hover:text-cyan-300 underline underline-offset-2 transition-colors cursor-pointer"
                >
                  Super Admin
                </button>
              </div>
            </div>

            <Button
              type="submit"
              data-testid="login-button"
              class="w-full bg-gradient-to-r from-cyan-700 via-teal-700 to-cyan-700 hover:from-cyan-800 hover:to-teal-800 text-white font-bold rounded-xl shadow-lg shadow-cyan-600/30 h-11 transition-all duration-200 cursor-pointer active:scale-[0.99]"
              :disabled="authStore.loading"
            >
              <span v-if="authStore.loading" class="flex items-center justify-center gap-2">
                <Loader2 class="w-4 h-4 animate-spin" />
                กำลังตรวจสอบสิทธิ์...
              </span>
              <span v-else class="flex items-center justify-center gap-2">
                <LogIn class="w-4 h-4" />
                <span>เข้าสู่ระบบ (Sign In)</span>
              </span>
            </Button>
          </form>
        </CardContent>

        <CardFooter class="px-6 sm:px-8 pb-8 pt-2">
          <div class="w-full p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-xs space-y-1.5">
            <div class="flex items-center gap-1.5 text-cyan-300 font-bold">
              <ShieldCheck class="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Enterprise Security Authentication</span>
            </div>
            <div class="text-slate-400 leading-relaxed">
              ระบบรักษาความปลอดภัยมาตรฐาน พร้อมการควบคุมสิทธิ์ตามบทบาท (Role-Based Access Control)
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter, useRoute } from 'vue-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import PasswordInput from '@/components/common/PasswordInput.vue';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { Lock, Loader2, ShieldCheck, AlertCircle, User, LogIn } from 'lucide-vue-next';

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const isDev = import.meta.env.DEV;

const identifier = ref(isDev ? 'owner@dorm.com' : '');
const password = ref(isDev ? 'password123' : '');
const errorMessage = ref('');

const fillDemoAccount = (role = 'owner') => {
  if (role === 'superadmin') {
    identifier.value = 'superadmin@dorm.com';
  } else {
    identifier.value = 'owner@dorm.com';
  }
  password.value = 'password123';
};

const handleLocalLogin = async () => {
  errorMessage.value = '';
  try {
    const rawInput = identifier.value.trim();
    const isEmail = rawInput.includes('@');

    let res;
    if (isEmail) {
      res = await authStore.login(rawInput, password.value);
    } else {
      res = await authStore.loginLocal(rawInput, password.value);
    }

    const redirectPath = route.query.redirect || (res.user?.role === 'tenant' ? '/liff/profile' : '/dashboard');
    router.push(redirectPath);
  } catch (error) {
    errorMessage.value =
      error.response?.data?.message || 'เข้าสู่ระบบไม่สำเร็จ โปรดตรวจสอบข้อมูลและรหัสผ่าน';
  }
};
</script>
