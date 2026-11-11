import { describe, it, expect } from 'vitest';
import router from './index';

describe('router: path ผิดใต้ /liff', () => {
  it('/liff/liff ต้อง redirect ไป /liff ไม่ใช่ catch-all ที่ไปหน้า CMS', () => {
    const matched = router.resolve('/liff/liff').matched;
    expect(matched).toHaveLength(1);
    expect(matched[0].redirect).toBe('/liff');
  });

  it('route จริงใต้ /liff ไม่ถูก catch-all ทับ', () => {
    expect(router.resolve('/liff/pin-login').name).toBe('LiffPinLogin');
  });
});
