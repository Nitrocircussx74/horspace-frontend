<template>
  <div class="space-y-4 pb-6 font-sans text-slate-800">
    <div class="space-y-4">
      <!-- Loading Skeleton State -->
      <div v-if="loading" class="space-y-4 animate-pulse">
        <div class="p-6 bg-slate-200/70 skeleton-shimmer rounded-xl h-36"></div>
        <div class="p-5 bg-white rounded-xl border border-slate-100 shadow-xs space-y-3">
          <div class="h-4 w-28 bg-slate-100 skeleton-shimmer rounded-md"></div>
          <div class="space-y-2 pt-2">
            <div class="h-3 w-full bg-slate-100 skeleton-shimmer rounded-md"></div>
            <div class="h-3 w-full bg-slate-100 skeleton-shimmer rounded-md"></div>
            <div class="h-3 w-3/4 bg-slate-100 skeleton-shimmer rounded-md"></div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="errorMessage" class="p-4 bg-rose-50 border border-rose-100 text-rose-700 rounded-xl text-xs text-center font-medium">
        {{ errorMessage }}
      </div>

      <div v-else class="space-y-4">
        <!-- 0. Due Date & Late Fee Alert Banner -->
        <div
          v-if="invoice.status === 'overdue' || Number(invoice.lateFeeCharge) > 0"
          class="p-3.5 bg-rose-50 border border-rose-200/80 rounded-xl flex items-start gap-2.5 text-rose-800 text-xs shadow-2xs"
        >

          <div class="space-y-0.5">
            <div class="font-bold">บิลนี้เกินกำหนดชำระ (ครบกำหนด: {{ formatDate(invoice.dueDate) }})</div>
            <p class="text-xs text-rose-700 leading-relaxed">
              มีค่าปรับชำระล่าช้าเพิ่มขึ้น <strong class="font-mono">฿{{ Number(invoice.lateFeeCharge).toLocaleString() }}</strong> กรุณาชำระเงินและแนบสลิปโดยเร็ว
            </p>
          </div>
        </div>

        <div
          v-else-if="invoice.status === 'pending'"
          class="p-3.5 bg-amber-50/80 border border-amber-200/80 rounded-xl flex items-start gap-2.5 text-amber-900 text-xs shadow-2xs"
        >

          <div class="space-y-0.5">
            <div class="font-bold">ครบกำหนดชำระ: {{ formatDate(invoice.dueDate) }}</div>
            <p class="text-xs text-amber-800 leading-relaxed">
              กรุณาชำระเงินภายในวันครบกำหนด เพื่อหลีกเลี่ยงค่าปรับชำระล่าช้า
            </p>
          </div>
        </div>

        <!-- 1. Header Card (ยอดสุทธิ & สถานะบิล) -->
        <div class="p-5 bg-gradient-to-br from-primary to-theme-primary-dark text-primary-foreground rounded-xl shadow-md relative overflow-hidden space-y-2.5">
          <div class="flex items-center justify-between text-xs text-white/80">
            <span>รอบบิล {{ invoice.billingCycle }}</span>
            <span class="font-mono bg-white/20 px-2 py-0.5 rounded-md text-xs">{{ invoice.invoiceNumber }}</span>
          </div>

          <div>
            <div class="text-xs text-white/80 font-medium">ห้องพักหมายเลข</div>
            <div class="text-xl font-bold">ห้อง {{ invoice.room?.roomNumber }}</div>
          </div>

          <div class="pt-2.5 border-t border-white/20 flex items-center justify-between">
            <div>
              <div class="text-xs text-white/70">สถานะชำระเงิน</div>
              <Badge :variant="statusBadgeVariant" class="mt-0.5 font-bold">
                {{ statusBadgeText }}
              </Badge>
            </div>

            <div class="text-right">
              <div class="text-xs text-white/70">ยอดชำระสุทธิ</div>
              <div class="text-xl font-bold font-mono">฿{{ Number(invoice.grandTotal).toLocaleString() }}</div>
            </div>
          </div>
        </div>

        <!-- 2. Bill Breakdown Table (แจกแจงค่าเช่า, ค่าน้ำ, ค่าไฟ, ค่าส่วนกลาง, ค่าปรับ) -->
        <div class="p-4 bg-white rounded-xl border border-slate-100 shadow-xs space-y-2.5">
          <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider">รายละเอียดค่าใช้จ่าย (Bill Breakdown)</h3>

          <div class="space-y-2 text-xs divide-y divide-slate-100">
            <div class="flex justify-between items-center pt-1">
              <span class="text-slate-600">ค่าเช่าห้องพัก</span>
              <span class="font-bold text-slate-800 font-mono">฿{{ Number(invoice.roomPrice).toLocaleString() }}</span>
            </div>

            <div class="pt-2 space-y-0.5">
              <div class="flex justify-between items-center">
                <span class="text-slate-600">ค่าน้ำประปา</span>
                <span class="font-bold text-slate-800 font-mono">฿{{ Number(invoice.waterTotal).toLocaleString() }}</span>
              </div>
              <div class="text-xs text-slate-400 font-mono">
                มิเตอร์: {{ invoice.waterPrevious || 100 }} → {{ invoice.waterCurrent || 115 }} ({{ (invoice.waterCurrent || 115) - (invoice.waterPrevious || 100) }} หน่วย)
              </div>
            </div>

            <div class="pt-2 space-y-0.5">
              <div class="flex justify-between items-center">
                <span class="text-slate-600">ค่าไฟฟ้า</span>
                <span class="font-bold text-slate-800 font-mono">฿{{ Number(invoice.electricTotal).toLocaleString() }}</span>
              </div>
              <div class="text-xs text-slate-400 font-mono">
                มิเตอร์: {{ invoice.electricPrevious || 1000 }} → {{ invoice.electricCurrent || 1080 }} ({{ (invoice.electricCurrent || 1080) - (invoice.electricPrevious || 1000) }} หน่วย)
              </div>
            </div>

            <div class="flex justify-between items-center pt-2">
              <span class="text-slate-600">ค่าส่วนกลาง</span>
              <span class="font-bold text-slate-800 font-mono">฿{{ Number(invoice.commonFee).toLocaleString() }}</span>
            </div>

            <!-- รายการค่าใช้จ่ายอื่นๆ (Other Fees / Itemized Additional Charges) -->
            <template v-if="parsedOtherFees.length > 0">
              <div
                v-for="(item, idx) in parsedOtherFees"
                :key="idx"
                class="flex justify-between items-center pt-2"
              >
                <span class="text-slate-600">{{ item.note || 'ค่าบริการอื่นๆ' }}</span>
                <span class="font-bold text-slate-800 font-mono">฿{{ Number(item.amount || 0).toLocaleString() }}</span>
              </div>
            </template>
            <div v-else-if="Number(invoice.otherFee) > 0" class="flex justify-between items-center pt-2">
              <span class="text-slate-600">ค่าบริการอื่นๆ {{ invoice.otherFeeNote ? `(${invoice.otherFeeNote})` : '' }}</span>
              <span class="font-bold text-slate-800 font-mono">฿{{ Number(invoice.otherFee).toLocaleString() }}</span>
            </div>

            <!-- Late Fee Line Item (Red Highlight) -->
            <div v-if="Number(invoice.lateFeeCharge) > 0" class="flex justify-between items-center pt-2 text-rose-600 font-bold bg-rose-50/50 p-2 rounded-xl border border-rose-100">
              <span class="flex items-center gap-1.5">
                
                <span>ค่าปรับชำระล่าช้า (Late Fee)</span>
              </span>
              <span class="font-mono text-sm">+฿{{ Number(invoice.lateFeeCharge).toLocaleString() }}</span>
            </div>
          </div>
        </div>

        <!-- 3. Payment Section: PromptPay QR Code & Slip Upload -->
        <div v-if="invoice.status === 'pending' || invoice.status === 'overdue'" class="space-y-3">
          <!-- PromptPay QR Box -->
          <div ref="qrCardRef" class="p-5 bg-white rounded-xl border border-slate-100 shadow-xs text-center space-y-3">
            <div class="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-bold px-3.5 py-1.5 rounded-full border border-primary/20 shadow-2xs">
              <QrCode class="w-3.5 h-3.5 text-primary" />
              <span>PromptPay QR Code (สแกนชำระเงิน)</span>
            </div>

            <div class="py-1">
              <img :src="qrData.qrDataUrl || mockQrUrl" alt="PromptPay QR Code" class="w-48 h-48 mx-auto rounded-xl border border-slate-200/80 shadow-sm p-1.5 bg-white" />
            </div>

            <div class="text-xs text-slate-600 space-y-1 font-mono">
              <div class="flex items-center justify-center gap-2">
                <span>พร้อมเพย์:</span>
                <span class="font-bold text-slate-800">{{ qrData.promptpayNumber || '081-234-5678' }}</span>
                <button
                  v-if="qrData.promptpayNumber"
                  type="button"
                  @click="copyPromptPayNumber"
                  class="text-xs px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-sans font-medium transition-colors cursor-pointer"
                >
                  {{ isCopied ? 'คัดลอกแล้ว ' : 'คัดลอก' }}
                </button>
              </div>
              <div>ยอดเงิน: <span class="font-bold text-emerald-600 text-base font-mono">฿{{ Number(paymentAmount).toLocaleString() }}</span></div>
            </div>

            <!-- ปุ่มบันทึกรูปภาพ QR Code ลงเครื่อง (ไม่ติดในรูปภาพที่แคป) -->
            <div v-if="qrData.qrDataUrl" class="pt-1 no-capture">
              <button
                type="button"
                @click="handleSaveQrCode"
                :disabled="savingQr"
                class="w-full sm:w-auto px-5 py-2.5 bg-primary/5 hover:bg-primary/10 active:bg-primary/15 text-primary border border-primary/20 rounded-xl text-xs font-bold transition-all shadow-2xs inline-flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
              >
                <Download class="w-4 h-4 text-primary" />
                <span>{{ savingQr ? 'กำลังบันทึกภาพ...' : 'บันทึกรูป QR Code ลงเครื่อง' }}</span>
              </button>
            </div>
          </div>

          <!-- Slip Upload Form -->
          <div class="p-5 bg-white rounded-xl border border-slate-100 shadow-xs space-y-3">
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

              <div v-if="previewUrl" class="text-center">
                <img :src="previewUrl" alt="ตัวอย่างสลิปโอนเงินที่อัปโหลด" class="h-40 mx-auto object-cover rounded-xl border border-slate-100 shadow-xs" />
              </div>

              <button
                type="submit"
                :disabled="submitting || !selectedFile"
                class="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white rounded-xl font-bold text-xs transition-all shadow-xs disabled:opacity-50 cursor-pointer active:scale-[0.99]"
              >
                {{ submitting ? 'กำลังส่งข้อมูลสลิป...' : 'ส่งสลิปโอนเงิน (Submit Slip)' }}
              </button>
            </form>
          </div>
        </div>

        <!-- 4. Reviewing State Message Box -->
        <div v-else-if="invoice.status === 'reviewing'" class="p-5 bg-sky-50/80 border border-sky-100 rounded-xl text-center space-y-1.5">
          <h3 class="text-xs font-bold text-sky-900">กำลังอยู่ระหว่างการตรวจสอบสลิป</h3>
          <p class="text-xs text-sky-700 leading-relaxed">
            ระบบได้รับสลิปโอนเงินเรียบร้อยแล้ว เจ้าหน้าที่กำลังดำเนินการตรวจสอบครับ
          </p>
        </div>

        <!-- 5. Paid State Message Box -->
        <div v-else-if="invoice.status === 'paid'" class="p-5 bg-emerald-50/70 border border-emerald-100 rounded-xl text-center space-y-1.5">
          <h3 class="text-xs font-bold text-emerald-900">ชำระเงินเรียบร้อยแล้ว (Paid)</h3>
          <p class="text-xs text-emerald-700 leading-relaxed">
            ขอบคุณสำหรับการชำระเงิน คุณสามารถดาวน์โหลดใบเสร็จรับเงินหรือใบแจ้งหนี้ได้ด้านล่างนี้ครับ
          </p>
        </div>

        <!-- 6. Document Downloads Action Box (Always accessible) -->
        <div class="p-4 bg-white rounded-xl border border-slate-100 shadow-xs space-y-2.5">
          <div class="flex items-center justify-between">
            <h3 class="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <FileText class="w-3.5 h-3.5 text-primary" />
              <span>เอกสารดาวน์โหลด (PDF)</span>
            </h3>
            <span class="text-xs text-slate-400 font-mono">{{ invoice.invoiceNumber }}</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <!-- Download Invoice PDF -->
            <button
              type="button"
              :disabled="downloadingInvoice"
              @click="downloadInvoicePdf"
              class="w-full py-2.5 px-3 bg-primary/5 hover:bg-primary/10 active:bg-primary/15 text-primary rounded-xl text-xs font-semibold transition-all border border-primary/20 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 active:scale-[0.98]"
            >
              <span v-if="downloadingInvoice" class="animate-spin w-3.5 h-3.5 border-2 border-primary border-t-transparent rounded-full"></span>
              <Download v-else class="w-3.5 h-3.5" />
              <span>{{ downloadingInvoice ? 'กำลังสร้างไฟล์ PDF...' : 'ดาวน์โหลดใบแจ้งหนี้ (PDF)' }}</span>
            </button>

            <!-- Download Receipt PDF (Only if paid) -->
            <button
              v-if="invoice.status === 'paid'"
              type="button"
              :disabled="downloadingReceipt"
              @click="downloadReceiptPdf"
              class="w-full py-2.5 px-3 bg-emerald-50 hover:bg-emerald-100 active:bg-emerald-200 text-emerald-700 rounded-xl text-xs font-semibold transition-all border border-emerald-200/70 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 active:scale-[0.98]"
            >
              <span v-if="downloadingReceipt" class="animate-spin w-3.5 h-3.5 border-2 border-emerald-600 border-t-transparent rounded-full"></span>
              <Receipt v-else class="w-3.5 h-3.5" />
              <span>{{ downloadingReceipt ? 'กำลังสร้างใบเสร็จ...' : 'ดาวน์โหลดใบเสร็จ (E-Receipt)' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { initLiff, isLiffLoggedIn, getLiffProfile, getLiffIdToken } from '@/utils/liff';
import { downloadOrSharePdf, captureAndDownloadElement, downloadImage } from '@/utils/downloadHelper';
import api from '@/utils/api';
import { showSuccess, showError } from '@/utils/swal';
import { formatShortDate as formatDate } from '@/utils/formatters';
import { FileText, Download, Receipt, QrCode } from 'lucide-vue-next';
import { Badge } from '@/components/ui/badge';

const route = useRoute();
const authStore = useAuthStore();
const invoiceId = route.params.id;

const qrCardRef = ref(null);
const loading = ref(true);
const submitting = ref(false);
const downloadingInvoice = ref(false);
const downloadingReceipt = ref(false);
const savingQr = ref(false);
const isCopied = ref(false);
const errorMessage = ref('');
const invoice = ref({});
const qrData = ref({});
const selectedFile = ref(null);
const previewUrl = ref('');
const lineUserId = ref('');

const mockQrUrl = 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=400&q=80';

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
      // fallback
    }
  }

  if (totalOther > 0) {
    return [{ note: note || 'ค่าบริการอื่นๆ', amount: totalOther }];
  }

  return [];
});

const copyPromptPayNumber = async () => {
  const num = qrData.value?.promptpayNumber;
  if (!num) return;
  try {
    await navigator.clipboard.writeText(num);
    isCopied.value = true;
    setTimeout(() => {
      isCopied.value = false;
    }, 2000);
  } catch (err) {
    console.warn('Clipboard write error:', err);
  }
};

const handleSaveQrCode = async () => {
  const dataUrl = qrData.value?.qrDataUrl || mockQrUrl;
  if (!dataUrl && !qrCardRef.value) {
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
      await downloadImage(dataUrl, filename, directUrl);
    }
  } catch (err) {
    console.error('Save QR error:', err);
    try {
      if (dataUrl) {
        const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
        const cleanBaseUrl = rawBaseUrl.replace(/\/+$/, '');
        const token = authStore.liffToken || '';
        const directUrl = `${cleanBaseUrl}/api/v1/liff/invoices/${invoiceId}/qr-image?token=${encodeURIComponent(token)}`;
        const fallbackFilename = `promptpay-qr-${invoice.value?.invoiceNumber || invoice.value?.room?.roomNumber || 'invoice'}.png`;
        await downloadImage(dataUrl, fallbackFilename, directUrl);
        return;
      }
    } catch (fallbackErr) {
      console.error('Fallback save error:', fallbackErr);
    }
    showError('เกิดข้อผิดพลาด', 'ไม่สามารถบันทึกรูปภาพ QR Code ได้');
  } finally {
    savingQr.value = false;
  }
};

onMounted(async () => {
  try {
    await initLiff();
    if (isLiffLoggedIn()) {
      const profile = await getLiffProfile();
      if (profile?.userId) {
        lineUserId.value = profile.userId;
      }
    }
  } catch (liffErr) {
    console.warn('LIFF init fallback mode:', liffErr.message);
  }

  try {
    const params = {};
    if (lineUserId.value) params.lineUserId = lineUserId.value;
    if (route.query.room) params.room = route.query.room;
    if (route.query.tenantId) params.tenantId = route.query.tenantId;

    const res = await api.get(`/api/v1/liff/invoices/${invoiceId}`, { params });
    invoice.value = res.data.data.invoice;
    qrData.value = res.data.data.qrData || {};
  } catch (err) {
    errorMessage.value = err.response?.data?.message || 'ไม่สามารถดึงข้อมูลบิลค่าเช่าได้';
  } finally {
    loading.value = false;
  }
});

const statusBadgeText = computed(() => {
  const map = {
    pending: 'รอชำระเงิน',
    overdue: 'เกินกำหนดชำระ',
    reviewing: 'กำลังตรวจสอบสลิป',
    paid: 'PAID (ชำระแล้ว)'
  };
  return map[invoice.value.status] || invoice.value.status;
});

const statusBadgeVariant = computed(() => {
  const map = {
    pending: 'warning',
    overdue: 'danger',
    reviewing: 'neutral',
    paid: 'success'
  };
  return map[invoice.value.status] || 'neutral';
});

const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  selectedFile.value = file;
  previewUrl.value = URL.createObjectURL(file);
};

const handleUploadSlip = async () => {
  if (!selectedFile.value) return;

  submitting.value = true;
  try {
    const formData = new FormData();
    formData.append('file', selectedFile.value);
    if (lineUserId.value) {
      formData.append('lineUserId', lineUserId.value);
    }

    await api.post(`/api/v1/liff/invoices/${invoiceId}/slip`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    // อัปเดตสถานะเป็น reviewing ทันทีโดยไม่ต้องโหลดใหม่
    invoice.value.status = 'reviewing';
    await showSuccess('สำเร็จ!', 'ส่งสลิปโอนเงินเรียบร้อยแล้ว! แอดมินกำลังทำการตรวจสอบยอดเงินครับ');
  } catch (err) {
    showError('เกิดข้อผิดพลาด', err.response?.data?.message || 'เกิดข้อผิดพลาดในการแนบสลิป');
  } finally {
    submitting.value = false;
  }
};

const downloadInvoicePdf = async () => {
  downloadingInvoice.value = true;
  try {
    const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
    const cleanBaseUrl = rawBaseUrl.replace(/\/+$/, '');
    const token = authStore.liffToken || '';
    const directUrl = `${cleanBaseUrl}/api/v1/liff/invoices/${invoiceId}/invoice-pdf?token=${encodeURIComponent(token)}`;

    const res = await api.get(`/api/v1/liff/invoices/${invoiceId}/invoice-pdf`, {
      responseType: 'blob'
    });
    const blob = new Blob([res.data], { type: 'application/pdf' });
    const filename = `Invoice-${invoice.value.invoiceNumber || invoiceId}.pdf`;

    await downloadOrSharePdf(blob, filename, directUrl);
  } catch (err) {
    showError('เกิดข้อผิดพลาด', err.response?.data?.message || 'ไม่สามารถดาวน์โหลดใบแจ้งหนี้ได้');
  } finally {
    downloadingInvoice.value = false;
  }
};

const downloadReceiptPdf = async () => {
  downloadingReceipt.value = true;
  try {
    const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
    const cleanBaseUrl = rawBaseUrl.replace(/\/+$/, '');
    const token = authStore.liffToken || '';
    const directUrl = `${cleanBaseUrl}/api/v1/liff/invoices/${invoiceId}/receipt-pdf?token=${encodeURIComponent(token)}`;

    const res = await api.get(`/api/v1/liff/invoices/${invoiceId}/receipt-pdf`, {
      responseType: 'blob'
    });
    const blob = new Blob([res.data], { type: 'application/pdf' });
    const filename = `Official-Receipt-REC-${invoice.value.invoiceNumber || invoiceId}.pdf`;

    await downloadOrSharePdf(blob, filename, directUrl);
  } catch (err) {
    showError('เกิดข้อผิดพลาด', err.response?.data?.message || 'ไม่สามารถดาวน์โหลดใบเสร็จรับเงินได้');
  } finally {
    downloadingReceipt.value = false;
  }
};
</script>
