import { defineStore } from 'pinia';
import api from '@/utils/api';

export const useBuildingStore = defineStore('building', {
  state: () => ({
    buildings: [],
    // ใช้ค่าจาก localStorage เฉพาะที่เป็น UUID จริง — ค่าขยะ (เช่น ข้อความภาษาไทย) ทำให้ GET /rooms?buildingId=... พังด้วย P2023
    activeBuildingId: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(localStorage.getItem('activeBuildingId') || '')
      ? localStorage.getItem('activeBuildingId')
      : '',
    isLoading: false,
    error: null
  }),

  getters: {
    activeBuilding: (state) => {
      if (!state.activeBuildingId) return null;
      return state.buildings.find((b) => b.id === state.activeBuildingId) || null;
    }
  },

  actions: {
    async fetchBuildings() {
      this.isLoading = true;
      this.error = null;
      try {
        const res = await api.get('/api/v1/buildings');
        this.buildings = res.data.data || [];

        // If activeBuildingId is set but invalid, reset to empty (All Buildings)
        if (this.buildings.length > 0 && this.activeBuildingId) {
          const exists = this.buildings.some((b) => b.id === this.activeBuildingId);
          if (!exists) {
            this.setActiveBuildingId('');
          }
        }
      } catch (err) {
        this.error = err.response?.data?.message || 'ไม่สามารถดึงข้อมูลตึกได้';
      } finally {
        this.isLoading = false;
      }
    },

    setActiveBuildingId(id) {
      this.activeBuildingId = id || '';
      if (id) {
        localStorage.setItem('activeBuildingId', id);
      } else {
        localStorage.removeItem('activeBuildingId');
      }
    },

    async createBuilding(payload) {
      this.isLoading = true;
      try {
        const res = await api.post('/api/v1/buildings', payload);
        await this.fetchBuildings();
        return res.data;
      } catch (err) {
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    async updateBuildingSetting(buildingId, payload) {
      this.isLoading = true;
      try {
        const res = await api.put(`/api/v1/buildings/${buildingId}/settings`, payload);
        await this.fetchBuildings();
        return res.data;
      } catch (err) {
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    async deleteBuilding(buildingId) {
      this.isLoading = true;
      try {
        const res = await api.delete(`/api/v1/buildings/${buildingId}`);
        if (this.activeBuildingId === buildingId) {
          this.setActiveBuildingId('');
        }
        await this.fetchBuildings();
        return res.data;
      } catch (err) {
        throw err;
      } finally {
        this.isLoading = false;
      }
    }
  }
});
