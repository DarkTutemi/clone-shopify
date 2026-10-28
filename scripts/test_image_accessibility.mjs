import fs from 'fs';

async function testImages() {
  const testUrls = [
    // The current shopify CDN URLs:
    { name: 'Shopify Eye Mask 1', url: 'https://cdn.shopify.com/s/files/1/0826/2483/9865/files/Sc34c469c6944416db67152e6dd6e2e744_jpg_220x220q75_jpg.avif?v=1793197124' },
    { name: 'Shopify Face Mask 1', url: 'https://cdn.shopify.com/s/files/1/0826/2483/9865/files/S83e211de0c344c90a968827469788b850_jpg_220x220q75_jpg.avif?v=1793197212' },
    
    // The source AliExpress media URLs (full resolution):
    { name: 'Ali High-Res Eye Mask 1', url: 'https://ae-pic-a1.aliexpress-media.com/kf/Sc34c469c6944416db67152e6dd6e2e744.jpg' },
    { name: 'Ali High-Res Face Mask 1', url: 'https://ae-pic-a1.aliexpress-media.com/kf/S83e211de0c344c90a968827469788b850.jpg' }
  ];

  for (const item of testUrls) {
    try {
      const res = await fetch(item.url, { method: 'HEAD' });
      console.log(`[${res.status}] ${item.name}: content-type=${res.headers.get('content-type')}, length=${res.headers.get('content-length')}`);
    } catch (e) {
      console.error(`[FAIL] ${item.name}:`, e.message);
    }
  }
}

testImages().catch(console.error);
