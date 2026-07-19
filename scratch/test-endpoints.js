async function test() {
  try {
    const res = await fetch('https://cloud.umami.is/analytics/us/api/share/IKILGPgXIuMcSBcX');
    const data = await res.json();
    const token = data.token;
    const shareId = data.shareId;
    const websiteId = data.websiteId;
    
    const startAt = new Date('2024-01-01').getTime();
    const endAt = Date.now();

    const urls = [
      // 1. share stats using shareId
      `https://cloud.umami.is/analytics/us/api/share/${shareId}/stats?startAt=${startAt}&endAt=${endAt}`,
      // 2. websites stats with Authorization header
      `https://cloud.umami.is/analytics/us/api/websites/${websiteId}/stats?startAt=${startAt}&endAt=${endAt}`,
      // 3. maybe it expects x-umami-share-token: token or shareId?
      `https://cloud.umami.is/analytics/us/api/websites/${websiteId}/stats?startAt=${startAt}&endAt=${endAt}`
    ];

    const statsRes1 = await fetch(urls[0], {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log(`URL: ${urls[0]}`);
    console.log(`Status: ${statsRes1.status}`);
    console.log(`Content: ${await statsRes1.text()}\n`);

    const statsRes2 = await fetch(urls[1], {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log(`URL: ${urls[1]}`);
    console.log(`Status: ${statsRes2.status}`);
    console.log(`Content: ${await statsRes2.text()}\n`);

  } catch (e) {
    console.error(e);
  }
}
test();
