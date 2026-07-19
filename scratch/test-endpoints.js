async function test() {
  const token = 'IKILGPgXIuMcSBcX';
  const url = `https://api.umami.is/api/share/${token}`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        websiteId: '427114d6-abc8-410e-adb2-98cc7571b5d3'
      })
    });
    console.log(`URL: ${url}`);
    console.log(`Status: ${res.status}`);
    const data = await res.json();
    console.log(`Data:`, data);
  } catch (e) {
    console.error(`Error: ${e.message}`);
  }
}
test();
