async function test() {
  const urls = [
    'https://cloud.umami.is/api/websites/427114d6-abc8-410e-adb2-98cc7571b5d3/active',
    'https://cloud.umami.is/api/websites/427114d6-abc8-410e-adb2-98cc7571b5d3/stats',
    'https://cloud.umami.is/api/share/427114d6-abc8-410e-adb2-98cc7571b5d3/stats'
  ];

  const results = [];
  for (const url of urls) {
    try {
      const res = await fetch(url);
      const text = await res.text();
      results.push(`URL: ${url}\nStatus: ${res.status}\nContent: ${text.substring(0, 200)}\n`);
    } catch (e) {
      results.push(`URL: ${url}\nError: ${e.message}\n`);
    }
  }
  console.log(results.join('\n---\n'));
}
test();
