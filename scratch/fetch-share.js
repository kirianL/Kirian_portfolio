async function test() {
  try {
    const res = await fetch('https://cloud.umami.is/share/IKILGPgXIuMcSBcX');
    const html = await res.text();
    console.log("HTML length:", html.length);
    
    // Search for next data or script tags
    const nextDataMatch = html.match(/<script[^>]*__NEXT_DATA__[^>]*>([\s\S]*?)<\/script>/);
    if (nextDataMatch) {
      console.log("Found NEXT_DATA!");
      console.log(nextDataMatch[1].substring(0, 1000));
    } else {
      // Find any json/script blocks
      const jsonMatches = html.match(/<script[^>]*type="application\/json"[^>]*>([\s\S]*?)<\/script>/g);
      if (jsonMatches) {
        console.log("Found JSON scripts:", jsonMatches.length);
        jsonMatches.forEach((m, idx) => console.log(`Script ${idx}:`, m.substring(0, 300)));
      } else {
        console.log("No standard JSON scripts found, printing some script tags:");
        const scripts = html.match(/<script[^>]*>([\s\S]*?)<\/script>/g);
        if (scripts) {
          scripts.slice(0, 10).forEach((s, idx) => console.log(`Script ${idx}:`, s.substring(0, 150)));
        }
      }
    }
  } catch (e) {
    console.error(e);
  }
}
test();
