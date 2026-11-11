<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="max-w-lg">
      <DialogHeader>
        <DialogTitle class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center">
            <Wrench class="w-4 h-4" />
          </div>
          <span>สร้างใบแจ้งซ่อมใหม่ (Manual)</span>
        </DialogTitle>
      </DialogHeader>

      <form @submit.prevent="handleCreateSubmit" class="space-y-4 text-xs text-slate-700">
        <div>
          <label for="maintenance-new-room" class="block font-bold text-slate-800 mb-1">เลือกห้องพัก <span class="text-rose-500">*</span></label>
          <Select id="maintenance-new-room" v-model="newForm.roomId" required class="font-bold">
            <option value="" disabled>-- เลือกห้องพัก --</option>
            <option v-for="room in roomStore.rooms" :key="room.id" :value="room.id">
              ห้อง {{ room.roomNumber }} {{ room.building?.name ? `(${room.building.name})` : '' }}
            </option>
          </Select>
        </div>

        <div>
          <label for="maintenance-new-title" class="block font-bold text-slate-800 mb-1">หัวข้อเรื่องแจ้งซ่อม <span class="text-rose-500">*</span></label>
          <Input
            id="maintenance-new-title"
            v-model="newForm.title"
            type="text"
            placeholder="e.g. เครื่องปรับอากาศมีเสียงดัง / หลอดไฟห้องน้ำเสีย"
            required
            class="font-semibold"
          />
        </div>

        <div>
          <label for="maintenance-new-description" class="block font-bold text-slate-800 mb-1">รายละเอียดเพิ่มเติม <span class="text-rose-500">*</span></label>
          <textarea
            id="maintenance-new-description"
            v-model="newForm.description"
            rows="3"
            placeholder="ระบุอาการชำรุด หรือตำแหน่งที่ต้องการให้ช่างเข้าตรวจสอบ..."
            required
            class="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:bg-white focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 focus:outline-hidden leading-relaxed"
          ></textarea>
        </div>

        <div>
          <label for="maintenance-new-image" class="block font-bold text-slate-800 mb-1">อัปโหลดรูปภาพประกอบ</label>
          <input
            id="maintenance-new-image"
            type="file"
            accept="image/*"
            @change="handleFileChange"
            class="block w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-3.5 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100 cursor-pointer"
          />
          <div v-if="newForm.imageUrl" class="mt-2">
            <img :src="resolveImageUrl(newForm.imageUrl)" alt="ตัวอย่างรูปประกอบที่อัปโหลด" class="w-20 h-20 rounded-xl object-cover border border-slate-200" />
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" @click="emit('update:open', false)">ยกเลิก</Button>
          <Button type="submit" :disabled="submitting || uploading">
            {{ submitting ? 'กำลังบันทึก...' : 'สร้างตั๋วแจ้งซ่อม' }}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { Wrench } from 'lucide-vue-next';
import { useRoomStore } from '@/stores/useRoomStore';
import uploadService from '@/services/uploadService';
import maintenanceService from '@/services/maintenanceService';
import { showSuccess, showError, showToast } from '@/utils/swal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { resolveImageUrl } from '@/utils/maintenanceTicket';

defineProps({
  open: { type: Boolean, default: false }
});

const emit = defineEmits(['update:open', 'created']);

const roomStore = useRoomStore();

const uploading = ref(false);
const submitting = ref(false);

const newForm = reactive({
  roomId: '',
  title: '',
  description: '',
  imageUrl: ''
});

const handleFileChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  uploading.value = true;
  try {
    const res = await uploadService.uploadFile(file);
    newForm.imageUrl = res.url;
    showToast('อัปโหลดรูปภาพสำเร็จ');
  } catch (error) {
    showError('อัปโหลดล้มเหลว', 'ไม่สามารถอัปโหลดรูปภาพได้');
  } finally {
    uploading.value = false;
  }
};

const handleCreateSubmit = async () => {
  submitting.value = true;
  try {
    await maintenanceService.createMaintenanceRequest({
      roomId: newForm.roomId,
      title: newForm.title,
      description: newForm.description,
      imageUrl: newForm.imageUrl
    });
    showSuccess('สำเร็จ', 'สร้างใบแจ้งซ่อมเรียบร้อยแล้ว');
    emit('update:open', false);
    newForm.roomId = '';
    newForm.title = '';
    newForm.description = '';
    newForm.imageUrl = '';
    emit('created');
  } catch (error) {
    showError('เกิดข้อผิดพลาด', 'ไม่สามารถสร้างใบแจ้งซ่อมได้');
  } finally {
    submitting.value = false;
  }
};
</script>
