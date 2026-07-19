async function test() {
  const token = 'IKILGPgXIuMcSBcX';
  const url = `https://api.umami.is/api/share/${token}`;
  
  const payloads = [
    { id: '427114d6-abc8-410e-adb2-98cc7571b5d3' },
    { websiteId: '427114d6-abc8-410e-adb2-98cc7571b5d3' },
    { website: '427114d6-abc8-410e-adb2-98cc7571b5d3' },
    { website_id: '427114d6-abc8-410e-adb2-98cc7571b5d3' },
    { shareId: 'IKILGPgXIuMcSBcX' }
  ];

  for (const payload of payloads) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      console.log(`Payload: ${JSON.stringify(payload)}`);
      console.log(`Status: ${res.status}`);
      const text = await res.text();
      console.log(`Content: ${text}\n`);
    } catch (e) {
      console.error(`Error: ${e.message}`);
    }
  }
}
test();
