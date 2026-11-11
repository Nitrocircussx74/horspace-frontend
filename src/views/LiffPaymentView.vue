<template>
  <div class="space-y-4 pb-6 font-sans text-slate-800">
    <div class="space-y-4">
      <!-- Loading State -->
      <Card v-if="loading" class="p-8 text-center text-slate-400 text-xs">
        <div class="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2.5"></div>
        กำลังโหลดข้อมูลชำระเงิน...
      </Card>

      <!-- Error State -->
      <div v-else-if="errorMessage" class="p-4 bg-rose-50 border border-rose-100 text-rose-700 rounded-xl text-xs text-center font-medium">
        {{ errorMessage }}
      </div>

      <!-- Invoice & Payment Details Card -->
      <div v-else class="space-y-4">
        <!-- Verification Success Banner -->
        <Card v-if="verificationResult" class="p-5 text-center space-y-2 shadow-xs"
          :class="verificationResult.autoApproved ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950' : 'bg-amber-50/70 border-amber-200 text-amber-950'"
        >
          <div class="w-10 h-10 rounded-full flex items-center justify-center text-lg mx-auto font-bold"
            :class="verificationResult.autoApproved ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'"
          >
            {{ verificationResult.autoApproved ? '' : '!' }}
          </div>

          <h3 class="text-sm font-bold">
            {{ verificationResult.autoApproved ? 'ชำระเงินสำเร็จแล้ว (Paid)' : 'แนบสลิปเรียบร้อยแล้ว' }}
          </h3>

          <p class="text-xs text-slate-600 leading-relaxed">
            {{ verificationResult.message }}
          </p>

          <div class="pt-2">
            <Button as-child class="bg-slate-800 hover:bg-slate-900">
              <router-link to="/liff/profile">กลับสู่หน้าหลัก</router-link>
            </Button>
          </div>
        </Card>

        <template v-else>
          <!-- Header Info -->
          <div class="p-5 bg-gradient-to-br from-primary via-primary to-primary/80 text-white rounded-xl shadow-md space-y-2">
            <div class="flex items-center justify-between text-xs text-white/80">
              <span>{{ invoice.billingCycle }}</span>
              <span class="font-mono bg-white/20 px-2 py-0.5 rounded-md text-xs">{{ invoice.invoiceNumber }}</span>
            </div>
            <div class="text-xl font-bold">ห้อง {{ invoice.room?.roomNumber }}</div>
            <div class="mt-3 pt-2.5 border-t border-white/20 flex items-center justify-between">
              <span class="text-xs text-white/80 font-medium">ยอดชำระสุทธิ</span>
              <span class="text-xl font-bold font-mono">฿{{ Number(invoice.grandTotal).toLocaleString() }}</span>
            </div>
          </div>

          <!-- Breakdown Details -->
          <Card class="p-4 space-y-2.5">
            <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider">รายละเอียดค่าใช้จ่าย</h3>

            <div class="space-y-2 text-xs divide-y divide-slate-100">
              <div class="flex justify-between text-slate-600 pt-1">
                <span>ค่าเช่าห้องพัก</span>
                <span class="font-mono text-slate-800 font-bold">฿{{ Number(invoice.roomPrice || 0).toLocaleString() }}</span>
              </div>
              <div class="flex justify-between text-slate-600 pt-2">
                <span>ค่าน้ำประปา</span>
                <span class="font-mono text-slate-800 font-bold">฿{{ Number(invoice.waterTotal || 0).toLocaleString() }}</span>
              </div>
              <div class="flex justify-between text-slate-600 pt-2">
                <span>ค่าไฟฟ้า</span>
                <span class="font-mono text-slate-800 font-bold">฿{{ Number(invoice.electricTotal || 0).toLocaleString() }}</span>
              </div>
              <div class="flex justify-between text-slate-600 pt-2">
                <span>ค่าส่วนกลาง</span>
                <span class="font-mono text-slate-800 font-bold">฿{{ Number(invoice.commonFee || 0).toLocaleString() }}</span>
              </div>

              <!-- รายการค่าใช้จ่ายอื่นๆ (Other Fees / Itemized Additional Charges) -->
              <template v-if="parsedOtherFees.length > 0">
                <div
                  v-for="(item, idx) in parsedOtherFees"
                  :key="idx"
                  class="flex justify-between text-slate-600 pt-2"
                >
                  <span class="text-slate-700">
                    {{ item.note || 'ค่าบริการอื่นๆ' }}
                  </span>
                  <span class="font-mono text-slate-800 font-bold">฿{{ Number(item.amount || 0).toLocaleString() }}</span>
                </div>
              </template>
              <div v-else-if="Number(invoice.otherFee) > 0" class="flex justify-between text-slate-600 pt-2">
                <span class="text-slate-700">ค่าบริการอื่นๆ {{ invoice.otherFeeNote ? `(${invoice.otherFeeNote})` : '' }}</span>
                <span class="font-mono text-slate-800 font-bold">฿{{ Number(invoice.otherFee).toLocaleString() }}</span>
              </div>

              <!-- ค่าปรับชำระล่าช้า (Late Fee) -->
              <div v-if="Number(invoice.lateFeeCharge) > 0" class="flex justify-between items-center pt-2 text-rose-600 font-bold bg-rose-50/60 p-2 rounded-xl border border-rose-100 mt-1">
                <span class="flex items-center gap-1.5">
                  
                  <span>ค่าปรับชำระล่าช้า (Late Fee)</span>
                </span>
                <span class="font-mono text-sm font-extrabold">+฿{{ Number(invoice.lateFeeCharge).toLocaleString() }}</span>
              </div>
            </div>
          </Card>

          <!-- PromptPay QR Code Box (Capture Card Area) -->
          <!-- Note: kept as a plain div, NOT the Card component — `qrCardRef` is captured directly
               via html2canvas in handleSaveQrCode(), which needs a real DOM element ref, not a
               Vue component instance. Buttons inside are left as native <button> for the same reason. -->
          <div ref="qrCardRef" class="p-5 bg-white rounded-xl border border-slate-100 shadow-xs text-center space-y-3">
            <div class="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-bold px-3.5 py-1.5 rounded-full border border-primary/20 shadow-2xs">
              <QrCode class="w-3.5 h-3.5 text-primary" />
              <span>PromptPay QR Code (สแกนชำระเงิน)</span>
            </div>

            <div v-if="qrData.qrDataUrl" class="py-1">
              <img :src="qrData.qrDataUrl" alt="PromptPay QR Code" class="w-48 h-48 mx-auto rounded-xl border border-slate-200/80 shadow-sm p-1.5 bg-white" />
            </div>

            <div class="text-xs text-slate-600 space-y-1 font-mono">
              <div class="flex items-center justify-center gap-2">
                <span>พร้อมเพย์:</span>
                <span class="font-bold text-slate-800">{{ qrData.promptpayNumber || '-' }}</span>
                <button
                  v-if="qrData.promptpayNumber"
                  type="button"
                  @click="copyPromptPayNumber"
                  class="text-xs px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-sans font-medium transition-colors cursor-pointer"
                >
                  {{ isCopied ? 'คัดลอกแล้ว ' : 'คัดลอก' }}
                </button>
              </div>
              <div>ยอดชำระ: <span class="font-bold text-emerald-600 text-base font-mono">฿{{ Number(paymentAmount).toLocaleString() }}</span></div>
            </div>

            <!-- ปุ่มบันทึกรูปภาพ QR Code ลงเครื่อง (ไม่ติดในรูปภาพที่แคป) -->
            <div v-if="qrData.qrDataUrl" class="pt-1 no-capture">
              <button
                type="button"
                @click="handleSaveQrCode"
                :disabled="savingQr"
                class="w-full sm:w-auto px-5 py-2.5 bg-primary/5 hover:bg-primary/10 active:bg-primary/20 text-primary border border-primary/20 rounded-xl text-xs font-bold transition-all shadow-2xs inline-flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
              >
                <Download class="w-4 h-4 text-primary" />
                <span>{{ savingQr ? 'กำลังบันทึกภาพ...' : 'บันทึกรูป QR Code ลงเครื่อง' }}</span>
              </button>
            </div>
          </div>

          <!-- Upload Slip Form -->
          <Card class="p-5 space-y-3">
            <h3 class="text-xs font-bold text-slate-800">แนบสลิปโอนเงิน (Upload Slip)</h3>

            <form @submit.prevent="handleUploadSlip" class="space-y-3">
              <div>
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/jpg"
                  required
                  @change="handleFileChange"
                  class="block w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-3.5 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                />
              </div>

              <!-- Optional Amount Override for Testing Auto Verification -->
              <div>
                <label for="payment-declared-amount" class="block text-xs font-medium text-slate-400 mb-1">ยอดเงินในสลิป (ระบุเพื่อยืนยันยอดชำระ)</label>
                <Input id="payment-declared-amount" v-model="declaredAmount" type="number" step="0.01" :placeholder="`฿${invoice.grandTotal || 0}`" class="font-mono" />
              </div>

              <div v-if="previewUrl" class="text-center">
                <img :src="previewUrl" alt="ตัวอย่างสลิปโอนเงินที่อัปโหลด" class="h-40 mx-auto object-cover rounded-xl border border-slate-100 shadow-xs" />
              </div>

              <Button type="submit" class="w-full bg-emerald-500 hover:bg-emerald-600" :disabled="submitting || !selectedFile">
                {{ submitting ? 'กำลังตรวจสอบสลิป...' : 'ส่งสลิป & ยืนยันการชำระเงิน' }}
              </Button>
            </form>
          </Card>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { initLiff } from '@/utils/liff';
import api from '@/utils/api';
import { showError, showSuccess } from '@/utils/swal';
import { captureAndDownloadElement, downloadImage } from '@/utils/downloadHelper';
import { Download, QrCode } from 'lucide-vue-next';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const route = useRoute();
const authStore = useAuthStore();
const invoiceId = route.params.invoiceId;

const qrCardRef = ref(null);
const loading = ref(true);
const submitting = ref(false);
const savingQr = ref(false);
const isCopied = ref(false);
const errorMessage = ref('');
const invoice = ref({});
const qrData = ref({});
const selectedFile = ref(null);
const previewUrl = ref('');
const declaredAmount = ref('');
const verificationResult = ref(null);

const paymentAmount = computed(() => {
  const qrAmt = Number(qrData.value?.amount);
  if (!isNaN(qrAmt) && qrAmt > 0) return qrAmt;
  const invAmt = Number(invoice.value?.grandTotal);
  if (!isNaN(invAmt) && invAmt > 0) return invAmt;
  return 0;
});

const parsedOtherFees = computed(() => {
  const note = invoice.value?.otherFeeNote;
  const totalOther = Number(invoice.value?.otherFee || 0);

  if (note && typeof note === 'string' && note.trim().startsWith('[')) {
    try {
      const list = JSON.parse(note);
      if (Array.isArray(list) && list.length > 0) {
        return list;
      }
    } catch {
      // fallback to single entry
    }
  }

  if (totalOther > 0) {
    return [{ note: note || 'ค่าบริการอื่นๆ', amount: totalOther }];
  }

  return [];
});

onMounted(async () => {
  try {
    await initLiff();

    const response = await api.get(`/api/v1/liff/invoices/${invoiceId}`);
    invoice.value = response.data.data.invoice;
    qrData.value = response.data.data.qrData || {};
    declaredAmount.value = invoice.value.grandTotal;
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'ไม่สามารถดึงข้อมูลบิลได้';
  } finally {
    loading.value = false;
  }
});

const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  selectedFile.value = file;
  previewUrl.value = URL.createObjectURL(file);
};

const copyPromptPayNumber = async () => {
  if (!qrData.value?.promptpayNumber) return;
  try {
    await navigator.clipboard.writeText(qrData.value.promptpayNumber);
    isCopied.value = true;
    setTimeout(() => {
      isCopied.value = false;
    }, 2000);
  } catch (err) {
    console.warn('Clipboard write error:', err);
  }
};

const handleSaveQrCode = async () => {
  if (!qrData.value?.qrDataUrl) {
    showError('ไม่สามารถบันทึกได้', 'ไม่พบรูปภาพ QR Code');
    return;
  }

  savingQr.value = true;
  try {
    const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
    const cleanBaseUrl = rawBaseUrl.replace(/\/+$/, '');
    const token = authStore.liffToken || '';
    const directUrl = `${cleanBaseUrl}/api/v1/liff/invoices/${invoiceId}/qr-image?token=${encodeURIComponent(token)}`;
    const filename = `promptpay-qr-${invoice.value?.invoiceNumber || invoice.value?.room?.roomNumber || 'invoice'}.png`;

    if (qrCardRef.value) {
      await captureAndDownloadElement(qrCardRef.value, filename, directUrl);
    } else {
      await downloadImage(qrData.value.qrDataUrl, filename, directUrl);
    }
  } catch (err) {
    console.error('Save QR error:', err);
    try {
      if (qrData.value?.qrDataUrl) {
        const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
        const cleanBaseUrl = rawBaseUrl.replace(/\/+$/, '');
        const token = authStore.liffToken || '';
        const directUrl = `${cleanBaseUrl}/api/v1/liff/invoices/${invoiceId}/qr-image?token=${encodeURIComponent(token)}`;
        const fallbackFilename = `promptpay-qr-${invoice.value?.invoiceNumber || invoice.value?.room?.roomNumber || 'invoice'}.png`;
        await downloadImage(qrData.value.qrDataUrl, fallbackFilename, directUrl);
        return;
      }
    } catch (fallbackErr) {
      console.error('Fallback save error:', fallbackErr);
    }
    showError('เกิดข้อผิดพลาด', 'ไม่สามารถบันทึกรูปภาพ QR Code ได้ กรุณาลองใหม่อีกครั้ง');
  } finally {
    savingQr.value = false;
  }
};

const handleUploadSlip = async () => {
  if (!selectedFile.value) return;

  submitting.value = true;
  try {
    const formData = new FormData();
    formData.append('file', selectedFile.value);
    if (declaredAmount.value) {
      formData.append('declaredAmount', declaredAmount.value);
    }

    const res = await api.post(`/api/v1/liff/invoices/${invoiceId}/slip`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    verificationResult.value = {
      autoApproved: res.data.data.autoApproved,
      message: res.data.message
    };
  } catch (error) {
    showError('เกิดข้อผิดพลาด', error.response?.data?.message || 'เกิดข้อผิดพลาดในการแนบสลิป');
  } finally {
    submitting.value = false;
  }
};
</script>
