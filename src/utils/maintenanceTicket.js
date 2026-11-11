import { Wrench, MessageSquareWarning, HelpCircle } from 'lucide-vue-next';

export const getCategoryLabel = (category) => {
  const map = {
    REPAIR: 'แจ้งซ่อม',
    COMPLAINT: 'ข้อร้องเรียน',
    OTHER: 'เรื่องอื่นๆ'
  };
  return map[(category || '').toUpperCase()] || 'ทั่วไป';
};

export const getCategoryIcon = (category) => {
  const cat = (category || '').toUpperCase();
  if (cat === 'REPAIR') return Wrench;
  if (cat === 'COMPLAINT') return MessageSquareWarning;
  return HelpCircle;
};

// Badge variant mapping: REPAIR/pending-ish -> warning, COMPLAINT/urgent -> danger, rest -> neutral
export const getCategoryBadgeVariant = (category) => {
  const cat = (category || '').toUpperCase();
  if (cat === 'REPAIR') return 'warning';
  if (cat === 'COMPLAINT') return 'danger';
  return 'neutral';
};

export const getTenantDisplayName = (item) => {
  if (item.tenant) {
    const name = `${item.tenant.firstName || ''} ${item.tenant.lastName || ''}`.trim();
    if (name) return name;
    if (item.tenant.lineDisplayName) return item.tenant.lineDisplayName;
  }
  return 'ลูกบ้าน';
};

export const getTenantAvatarInitial = (item) => {
  const name = getTenantDisplayName(item);
  return name.charAt(0).toUpperCase() || 'U';
};

export const formatRelativeTime = (dateStr) => {
  if (!dateStr) return '';
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now - date;
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return 'เมื่อสักครู่';
  if (diffMinutes < 60) return `${diffMinutes} นาทีที่แล้ว`;
  if (diffHours < 24) return `${diffHours} ชม. ที่แล้ว`;
  if (diffDays === 1) return 'เมื่อวานนี้';
  if (diffDays < 7) return `${diffDays} วันที่แล้ว`;
  return date.toLocaleDateString('th-TH', { month: 'short', day: 'numeric' });
};

export const resolveImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
  const cleanBase = baseUrl.replace(/\/+$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${cleanBase}${cleanPath}`;
};
