/* A minimal, dependency-free ZIP writer (STORE method, UTF-8 filenames).
   Uses Uint8Array and CRC-32 so exported bundles work without external CDNs. */
window.PresetZip = (() => {
  "use strict";
  const encoder = new TextEncoder();
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    table[n] = c >>> 0;
  }
  const crc = bytes => {
    let c = 0xffffffff;
    for (const b of bytes) c = table[(c ^ b) & 0xff] ^ (c >>> 8);
    return (c ^ 0xffffffff) >>> 0;
  };
  const u16 = (view, at, n) => view.setUint16(at, n, true);
  const u32 = (view, at, n) => view.setUint32(at, n >>> 0, true);
  async function pack(entries) {
    const locals = [], centrals = [];
    let offset = 0;
    const now = new Date(), year = Math.max(1980, now.getFullYear());
    const dosDate = ((year - 1980) << 9) | ((now.getMonth() + 1) << 5) | now.getDate();
    const dosTime = (now.getHours() << 11) | (now.getMinutes() << 5) | Math.floor(now.getSeconds() / 2);
    for (const entry of entries) {
      const name = String(entry.name).replaceAll("\\", "/").replace(/^\/*/, "");
      if (!name || name.startsWith("../") || name.includes("/../") || name.endsWith("/")) continue;
      const filename = encoder.encode(name);
      let bytes;
      if (entry.data instanceof Uint8Array) bytes = entry.data;
      else if (entry.data instanceof Blob) bytes = new Uint8Array(await entry.data.arrayBuffer());
      else bytes = encoder.encode(String(entry.data ?? ""));
      if (bytes.byteLength > 0xffffffff) throw new Error("File too large for ZIP32");
      const checksum = crc(bytes);
      const local = new Uint8Array(30 + filename.length + bytes.length);
      const lv = new DataView(local.buffer);
      u32(lv, 0, 0x04034b50); u16(lv, 4, 20); u16(lv, 6, 0x0800); u16(lv, 8, 0);
      u16(lv, 10, dosTime); u16(lv, 12, dosDate); u32(lv, 14, checksum);
      u32(lv, 18, bytes.length); u32(lv, 22, bytes.length); u16(lv, 26, filename.length); u16(lv, 28, 0);
      local.set(filename, 30); local.set(bytes, 30 + filename.length);
      const central = new Uint8Array(46 + filename.length);
      const cv = new DataView(central.buffer);
      u32(cv, 0, 0x02014b50); u16(cv, 4, 20); u16(cv, 6, 20);
      u16(cv, 8, 0x0800); u16(cv, 10, 0); u16(cv, 12, dosTime); u16(cv, 14, dosDate);
      u32(cv, 16, checksum); u32(cv, 20, bytes.length); u32(cv, 24, bytes.length);
      u16(cv, 28, filename.length); u16(cv, 30, 0); u16(cv, 32, 0);
      u16(cv, 34, 0); u16(cv, 36, 0); u32(cv, 38, 0); u32(cv, 42, offset);
      central.set(filename, 46);
      locals.push(local); centrals.push(central);
      offset += local.length;
    }
    const centralSize = centrals.reduce((sum, buf) => sum + buf.length, 0);
    const end = new Uint8Array(22);
    const ev = new DataView(end.buffer);
    u32(ev, 0, 0x06054b50); u16(ev, 4, 0); u16(ev, 6, 0);
    u16(ev, 8, centrals.length); u16(ev, 10, centrals.length);
    u32(ev, 12, centralSize); u32(ev, 16, offset); u16(ev, 20, 0);
    return new Blob([...locals, ...centrals, end], {type:"application/zip"});
  }
  return {pack};
})();