WidgetMetadata = {
  id: "forward.tvbyunbo4k",
  title: "TVB云播4K",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  description: "TVB云播4K影视资源（支持首页推荐、多维分类筛选、搜索、多线路及vodParse解析）",
  author: "Forward",
  site: "https://github.com/InchStudio/ForwardWidgets",
  detailCacheDuration: 60,
  globalParams: [
    {
      name: "host",
      title: "接口域名",
      type: "input",
      value: "http://app.tuxianimg.com",
    },
    {
      name: "datakey",
      title: "数据密钥(16位)",
      type: "input",
      value: "MickwrKuMickwrKu",
    },
  ],
  modules: [
    {
      id: "loadHot",
      title: "首页精选",
      functionName: "loadHot",
      cacheDuration: 1800,
      params: [],
    },
    {
      id: "loadCategory",
      title: "分类片库",
      functionName: "loadCategory",
      cacheDuration: 1800,
      params: [
        {
          name: "typeId",
          title: "频道",
          type: "enumeration",
          value: "1",
          enumOptions: [
            { title: "电影", value: "1" },
            { title: "电视剧", value: "2" },
            { title: "综艺", value: "3" },
            { title: "动漫", value: "4" },
          ],
        },
        {
          name: "sort",
          title: "排序",
          type: "enumeration",
          value: "最新",
          enumOptions: [
            { title: "最新", value: "最新" },
            { title: "最热", value: "最热" },
            { title: "最赞", value: "最赞" },
          ],
        },
        {
          name: "area",
          title: "地区",
          type: "input",
          value: "全部",
          placeholders: [
            { title: "全部", value: "全部" },
            { title: "大陆", value: "大陆" },
            { title: "香港", value: "香港" },
            { title: "台湾", value: "台湾" },
            { title: "美国", value: "美国" },
            { title: "韩国", value: "韩国" },
            { title: "日本", value: "日本" },
          ],
        },
        {
          name: "vodClass",
          title: "类型",
          type: "input",
          value: "全部",
          placeholders: [
            { title: "全部", value: "全部" },
            { title: "动作", value: "动作" },
            { title: "喜剧", value: "喜剧" },
            { title: "爱情", value: "爱情" },
            { title: "科幻", value: "科幻" },
            { title: "悬疑", value: "悬疑" },
          ],
        },
        {
          name: "lang",
          title: "语言",
          type: "input",
          value: "全部",
          placeholders: [
            { title: "全部", value: "全部" },
            { title: "国语", value: "国语" },
            { title: "粤语", value: "粤语" },
            { title: "英语", value: "英语" },
          ],
        },
        {
          name: "year",
          title: "年份",
          type: "input",
          value: "全部",
          placeholders: [
            { title: "全部", value: "全部" },
            { title: "2026", value: "2026" },
            { title: "2025", value: "2025" },
            { title: "2024", value: "2024" },
          ],
        },
        {
          name: "page",
          title: "页码",
          type: "page",
        },
      ],
    },
    {
      id: "loadResource",
      title: "加载播放线路",
      functionName: "loadResource",
      type: "stream",
      cacheDuration: 0,
      params: [],
    },
  ],
  search: {
    title: "搜索",
    functionName: "search",
    params: [
      { name: "keyword", title: "关键词", type: "input" },
      { name: "page", title: "页码", type: "page" },
    ],
  },
};

const YUNBO_CFG = {
  defaultHost: "http://app.tuxianimg.com",
  defaultKey: "MickwrKuMickwrKu",
  apiPrefix: "/api/vod",
};

const YUNBO_NS = "tvbyunbo:";

const PLAY_LINE_ORDER = [
  "4K",
  "至臻",
  "臻影",
  "鲸宝",
  "爱壹帆",
  "玫瑰",
  "咖啡4K",
  "2K",
  "蓝光",
  "1080",
  "超清",
  "HD",
  "高清",
  "VIP",
  "精品",
  "极速",
  "标清",
  "流畅",
];

// ==================== Pure JS AES-128-CBC + Base64 + UTF-8 ====================

const B64_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

function bytesToBase64(bytes) {
  let out = "";
  const len = bytes.length;
  for (let i = 0; i < len; i += 3) {
    const b1 = bytes[i];
    const b2 = i + 1 < len ? bytes[i + 1] : 0;
    const b3 = i + 2 < len ? bytes[i + 2] : 0;
    out += B64_CHARS[b1 >> 2];
    out += B64_CHARS[((b1 & 3) << 4) | (b2 >> 4)];
    out += i + 1 < len ? B64_CHARS[((b2 & 15) << 2) | (b3 >> 6)] : "=";
    out += i + 2 < len ? B64_CHARS[b3 & 63] : "=";
  }
  return out;
}

function base64ToBytes(b64) {
  const clean = String(b64 || "").replace(/[^A-Za-z0-9+/=]/g, "");
  const len = clean.length;
  const out = [];
  for (let i = 0; i < len; i += 4) {
    const c1 = B64_CHARS.indexOf(clean[i]);
    const c2 = B64_CHARS.indexOf(clean[i + 1]);
    const c3 = clean[i + 2] === "=" ? -1 : B64_CHARS.indexOf(clean[i + 2]);
    const c4 = clean[i + 3] === "=" ? -1 : B64_CHARS.indexOf(clean[i + 3]);
    out.push((c1 << 2) | (c2 >> 4));
    if (c3 !== -1) out.push(((c2 & 15) << 4) | (c3 >> 2));
    if (c4 !== -1) out.push(((c3 & 3) << 6) | c4);
  }
  return new Uint8Array(out);
}

function strToUtf8Bytes(str) {
  const s = String(str || "");
  const out = [];
  for (let i = 0; i < s.length; i++) {
    let code = s.charCodeAt(i);
    if (code < 0x80) {
      out.push(code);
    } else if (code < 0x800) {
      out.push(0xc0 | (code >> 6), 0x80 | (code & 0x3f));
    } else if (code >= 0xd800 && code <= 0xdbff && i + 1 < s.length) {
      const next = s.charCodeAt(++i);
      const cp = 0x10000 + (((code & 0x3ff) << 10) | (next & 0x3ff));
      out.push(
        0xf0 | (cp >> 18),
        0x80 | ((cp >> 12) & 0x3f),
        0x80 | ((cp >> 6) & 0x3f),
        0x80 | (cp & 0x3f)
      );
    } else {
      out.push(0xe0 | (code >> 12), 0x80 | ((code >> 6) & 0x3f), 0x80 | (code & 0x3f));
    }
  }
  return new Uint8Array(out);
}

function utf8BytesToStr(bytes) {
  let out = "";
  let i = 0;
  while (i < bytes.length) {
    const b1 = bytes[i++];
    if (b1 < 0x80) {
      out += String.fromCharCode(b1);
    } else if ((b1 & 0xe0) === 0xc0 && i < bytes.length) {
      const b2 = bytes[i++];
      out += String.fromCharCode(((b1 & 0x1f) << 6) | (b2 & 0x3f));
    } else if ((b1 & 0xf0) === 0xe0 && i + 1 < bytes.length) {
      const b2 = bytes[i++];
      const b3 = bytes[i++];
      out += String.fromCharCode(((b1 & 0x0f) << 12) | ((b2 & 0x3f) << 6) | (b3 & 0x3f));
    } else if ((b1 & 0xf8) === 0xf0 && i + 2 < bytes.length) {
      const b2 = bytes[i++];
      const b3 = bytes[i++];
      const b4 = bytes[i++];
      const cp = (((b1 & 0x07) << 18) | ((b2 & 0x3f) << 12) | ((b3 & 0x3f) << 6) | (b4 & 0x3f)) - 0x10000;
      out += String.fromCharCode(0xd800 + (cp >> 10), 0xdc00 + (cp & 0x3ff));
    }
  }
  return out;
}

const AES_SBOX = new Uint8Array([
  0x63,0x7c,0x77,0x7b,0xf2,0x6b,0x6f,0xc5,0x30,0x01,0x67,0x2b,0xfe,0xd7,0xab,0x76,
  0xca,0x82,0xc9,0x7d,0xfa,0x59,0x47,0xf0,0xad,0xd4,0xa2,0xaf,0x9c,0xa4,0x72,0xc0,
  0xb7,0xfd,0x93,0x26,0x36,0x3f,0xf7,0xcc,0x34,0xa5,0xe5,0xf1,0x71,0xd8,0x31,0x15,
  0x04,0xc7,0x23,0xc3,0x18,0x96,0x05,0x9a,0x07,0x12,0x80,0xe2,0xeb,0x27,0xb2,0x75,
  0x09,0x83,0x2c,0x1a,0x1b,0x6e,0x5a,0xa0,0x52,0x3b,0xd6,0xb3,0x29,0xe3,0x2f,0x84,
  0x53,0xd1,0x00,0xed,0x20,0xfc,0xb1,0x5b,0x6a,0xcb,0xbe,0x39,0x4a,0x4c,0x58,0xcf,
  0xd0,0xef,0xaa,0xfb,0x43,0x4d,0x33,0x85,0x45,0xf9,0x02,0x7f,0x50,0x3c,0x9f,0xa8,
  0x51,0xa3,0x40,0x8f,0x92,0x9d,0x38,0xf5,0xbc,0xb6,0xda,0x21,0x10,0xff,0xf3,0xd2,
  0xcd,0x0c,0x13,0xec,0x5f,0x97,0x44,0x17,0xc4,0xa7,0x7e,0x3d,0x64,0x5d,0x19,0x73,
  0x60,0x81,0x4f,0xdc,0x22,0x2a,0x90,0x88,0x46,0xee,0xb8,0x14,0xde,0x5e,0x0b,0xdb,
  0xe0,0x32,0x3a,0x0a,0x49,0x06,0x24,0x5c,0xc2,0xd3,0xac,0x62,0x91,0x95,0xe4,0x79,
  0xe7,0xc8,0x37,0x6d,0x8d,0xd5,0x4e,0xa9,0x6c,0x56,0xf4,0xea,0x65,0x7a,0xae,0x08,
  0xba,0x78,0x25,0x2e,0x1c,0xa6,0xb4,0xc6,0xe8,0xdd,0x74,0x1f,0x4b,0xbd,0x8b,0x8a,
  0x70,0x3e,0xb5,0x66,0x48,0x03,0xf6,0x0e,0x61,0x35,0x57,0xb9,0x86,0xc1,0x1d,0x9e,
  0xe1,0xf8,0x98,0x11,0x69,0xd9,0x8e,0x94,0x9b,0x1e,0x87,0xe9,0xce,0x55,0x28,0xdf,
  0x8c,0xa1,0x89,0x0d,0xbf,0xe6,0x42,0x68,0x41,0x99,0x2d,0x0f,0xb0,0x54,0xbb,0x16
]);

const AES_INV_SBOX = new Uint8Array(256);
for (let i = 0; i < 256; i++) AES_INV_SBOX[AES_SBOX[i]] = i;

const AES_RCON = [0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36];

function aesKeyExpansion128(keyBytes) {
  const w = new Uint8Array(176);
  w.set(keyBytes);
  const temp = new Uint8Array(4);
  for (let i = 4; i < 44; i++) {
    temp[0] = w[4 * (i - 1)];
    temp[1] = w[4 * (i - 1) + 1];
    temp[2] = w[4 * (i - 1) + 2];
    temp[3] = w[4 * (i - 1) + 3];
    if (i % 4 === 0) {
      const t = temp[0];
      temp[0] = AES_SBOX[temp[1]] ^ AES_RCON[i / 4 - 1];
      temp[1] = AES_SBOX[temp[2]];
      temp[2] = AES_SBOX[temp[3]];
      temp[3] = AES_SBOX[t];
    }
    w[4 * i] = w[4 * (i - 4)] ^ temp[0];
    w[4 * i + 1] = w[4 * (i - 4) + 1] ^ temp[1];
    w[4 * i + 2] = w[4 * (i - 4) + 2] ^ temp[2];
    w[4 * i + 3] = w[4 * (i - 4) + 3] ^ temp[3];
  }
  return w;
}

function gmul(a, b) {
  let p = 0;
  for (let i = 0; i < 8; i++) {
    if (b & 1) p ^= a;
    const hi = a & 0x80;
    a = (a << 1) & 0xff;
    if (hi) a ^= 0x1b;
    b >>= 1;
  }
  return p;
}

function aesEncryptBlock(block, w) {
  const s = new Uint8Array(block);
  for (let i = 0; i < 16; i++) s[i] ^= w[i];
  for (let round = 1; round <= 10; round++) {
    for (let i = 0; i < 16; i++) s[i] = AES_SBOX[s[i]];
    let t = s[1]; s[1] = s[5]; s[5] = s[9]; s[9] = s[13]; s[13] = t;
    t = s[2]; s[2] = s[10]; s[10] = t; t = s[6]; s[6] = s[14]; s[14] = t;
    t = s[15]; s[15] = s[11]; s[11] = s[7]; s[7] = s[3]; s[3] = t;
    if (round < 10) {
      for (let c = 0; c < 4; c++) {
        const i = c * 4;
        const a0 = s[i], a1 = s[i + 1], a2 = s[i + 2], a3 = s[i + 3];
        s[i] = gmul(a0, 2) ^ gmul(a1, 3) ^ a2 ^ a3;
        s[i + 1] = a0 ^ gmul(a1, 2) ^ gmul(a2, 3) ^ a3;
        s[i + 2] = a0 ^ a1 ^ gmul(a2, 2) ^ gmul(a3, 3);
        s[i + 3] = gmul(a0, 3) ^ a1 ^ a2 ^ gmul(a3, 2);
      }
    }
    const off = round * 16;
    for (let i = 0; i < 16; i++) s[i] ^= w[off + i];
  }
  return s;
}

function aesDecryptBlock(block, w) {
  const s = new Uint8Array(block);
  for (let i = 0; i < 16; i++) s[i] ^= w[160 + i];
  for (let round = 9; round >= 0; round--) {
    let t = s[13]; s[13] = s[9]; s[9] = s[5]; s[5] = s[1]; s[1] = t;
    t = s[2]; s[2] = s[10]; s[10] = t; t = s[6]; s[6] = s[14]; s[14] = t;
    t = s[3]; s[3] = s[7]; s[7] = s[11]; s[11] = s[15]; s[15] = t;
    for (let i = 0; i < 16; i++) s[i] = AES_INV_SBOX[s[i]];
    const off = round * 16;
    for (let i = 0; i < 16; i++) s[i] ^= w[off + i];
    if (round > 0) {
      for (let c = 0; c < 4; c++) {
        const i = c * 4;
        const a0 = s[i], a1 = s[i + 1], a2 = s[i + 2], a3 = s[i + 3];
        s[i] = gmul(a0, 0x0e) ^ gmul(a1, 0x0b) ^ gmul(a2, 0x0d) ^ gmul(a3, 0x09);
        s[i + 1] = gmul(a0, 0x09) ^ gmul(a1, 0x0e) ^ gmul(a2, 0x0b) ^ gmul(a3, 0x0d);
        s[i + 2] = gmul(a0, 0x0d) ^ gmul(a1, 0x09) ^ gmul(a2, 0x0e) ^ gmul(a3, 0x0b);
        s[i + 3] = gmul(a0, 0x0b) ^ gmul(a1, 0x0d) ^ gmul(a2, 0x09) ^ gmul(a3, 0x0e);
      }
    }
  }
  return s;
}

function norm16Bytes(str) {
  const raw = strToUtf8Bytes(str || "");
  const out = new Uint8Array(16);
  out.set(raw.subarray(0, 16));
  return out;
}

function pkcs7Pad(bytes) {
  const padLen = 16 - (bytes.length % 16);
  const out = new Uint8Array(bytes.length + padLen);
  out.set(bytes);
  out.fill(padLen, bytes.length);
  return out;
}

function pkcs7Unpad(bytes) {
  if (!bytes.length) return bytes;
  const padLen = bytes[bytes.length - 1];
  if (padLen < 1 || padLen > 16 || padLen > bytes.length) return bytes;
  return bytes.subarray(0, bytes.length - padLen);
}

function yunboEncrypt(plainText, keyStr) {
  const kb = norm16Bytes(keyStr);
  const w = aesKeyExpansion128(kb);
  const data = pkcs7Pad(strToUtf8Bytes(plainText));
  const out = new Uint8Array(data.length);
  let prev = kb;
  for (let i = 0; i < data.length; i += 16) {
    const block = new Uint8Array(16);
    for (let j = 0; j < 16; j++) block[j] = data[i + j] ^ prev[j];
    const enc = aesEncryptBlock(block, w);
    out.set(enc, i);
    prev = enc;
  }
  return bytesToBase64(out);
}

function yunboDecrypt(b64Text, keyStr) {
  const kb = norm16Bytes(keyStr);
  const w = aesKeyExpansion128(kb);
  const raw = base64ToBytes(b64Text);
  const out = new Uint8Array(raw.length);
  let prev = kb;
  for (let i = 0; i < raw.length; i += 16) {
    const cipherBlock = raw.subarray(i, i + 16);
    const dec = aesDecryptBlock(cipherBlock, w);
    for (let j = 0; j < 16; j++) out[i + j] = dec[j] ^ prev[j];
    prev = cipherBlock;
  }
  return utf8BytesToStr(pkcs7Unpad(out));
}

// ==================== Line Sorting & Formatting Helpers ====================

function cleanLineName(name) {
  if (!name) return "";
  let clean = String(name).replace(/[【\[\(（].*?[】\]）)]/g, "");
  clean = clean.replace(/\(\d+\)$/, "");
  clean = clean.replace(/\s*(?:HD|VIP|备用|推荐|极速|高清|标清|蓝光|超清|试看|抢先|预告|新版|旧版)\s*$/i, "");
  return clean.replace(/\s+/g, " ").trim();
}

function lineRank(name) {
  const clean = cleanLineName(name);
  const low = clean.toLowerCase();
  for (let i = 0; i < PLAY_LINE_ORDER.length; i++) {
    const kl = PLAY_LINE_ORDER[i].toLowerCase();
    if (low && (low === kl || low.startsWith(kl) || low.includes(kl))) return i;
  }
  const rl = String(name || "").toLowerCase();
  if (rl && rl !== low) {
    for (let i = 0; i < PLAY_LINE_ORDER.length; i++) {
      const kl = PLAY_LINE_ORDER[i].toLowerCase();
      if (rl === kl || rl.startsWith(kl) || rl.includes(kl)) return i;
    }
  }
  if (!clean) return 9999;
  const up = clean.toUpperCase();
  if (["至臻", "臻影", "鲸宝", "爱壹帆"].some((x) => clean.includes(x))) return 100;
  if (up.includes("4K") || clean.includes("2160")) return 200;
  if (up.includes("2K") || clean.includes("1440")) return 240;
  if (clean.includes("蓝光")) return 250;
  if (["1080", "超清", "UHD"].some((x) => clean.includes(x))) return 350;
  if (["HD", "VIP"].some((x) => up.includes(x)) || ["高清", "精品", "极速", "金牌"].some((x) => clean.includes(x))) return 400;
  if (clean.includes("☆")) return 500;
  if (clean.includes("自营")) return 600;
  if (["标清", "流畅", "普清"].some((x) => clean.includes(x))) return 700;
  return 4000;
}

function getHost(params = {}) {
  return String(params.host || YUNBO_CFG.defaultHost).trim().replace(/\/+$/, "");
}

function getKey(params = {}) {
  return String(params.datakey || YUNBO_CFG.defaultKey).trim();
}

function fixImageUrl(host, pic) {
  if (!pic) return "";
  const p = String(pic).trim();
  if (/^https?:\/\//i.test(p)) return p;
  if (p.startsWith("/")) return host + p;
  return host + "/" + p;
}

function encodeFormBody(obj) {
  if (!obj) return "";
  if (typeof obj === "string") return obj;
  return Object.keys(obj)
    .filter((k) => obj[k] !== undefined && obj[k] !== null)
    .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(String(obj[k]))}`)
    .join("&");
}

async function postVodApi(endpoint, dataObj, params = {}, signed = true) {
  const host = getHost(params);
  const key = getKey(params);
  const url = `${host}${YUNBO_CFG.apiPrefix}/${endpoint}`;
  const headers = {
    "User-Agent": "okhttp/4.9.3",
    "App-Os-Type": "android",
    "App-Version-Code": "585",
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
  };
  if (signed && key) {
    const ts = String(Math.floor(Date.now() / 1000));
    headers["app-api-verify-time"] = ts;
    headers["app-api-verify-sign"] = yunboEncrypt(ts, key);
  }
  const body = encodeFormBody(dataObj);
  const res = await Widget.http.post(url, body, { headers });
  const json = typeof res.data === "string" ? JSON.parse(res.data) : res.data;
  if (!json || typeof json !== "object" || json.code !== 0) {
    return null;
  }
  if (!json.data) return json;
  const decrypted = yunboDecrypt(json.data, key);
  return JSON.parse(decrypted);
}

function mapVodItem(host, v, customRemarks = "") {
  const vid = String(v.vod_id || "");
  const link = `${YUNBO_NS}vod:${vid}`;
  const pic = fixImageUrl(host, v.vod_pic || "");
  const remarks = customRemarks || v.vod_remarks || "";
  return {
    id: link,
    type: "url",
    mediaType: "tv",
    title: v.vod_name || "未命名影片",
    coverUrl: pic,
    posterPath: pic,
    releaseDate: v.vod_year ? String(v.vod_year) : "",
    description: remarks,
    link,
  };
}

// ==================== ForwardWidget Handlers ====================

async function loadHot(params = {}) {
  try {
    const host = getHost(params);
    const data = await postVodApi("init", {}, params, false);
    if (!data) return [];

    const items = [];
    const seen = new Set();
    const add = (v) => {
      const vid = String((v && v.vod_id) || "");
      if (!vid || seen.has(vid)) return;
      seen.add(vid);
      items.push(mapVodItem(host, v));
    };

    for (const item of data.banner_list || []) add(item);
    for (const item of data.recommend_list || []) add(item);
    for (const t of data.type_list || []) {
      for (const item of t.recommend_list || []) add(item);
    }
    return items;
  } catch (error) {
    console.error("[tvbyunbo4k][loadHot] 失败:", error.message || error);
    throw error;
  }
}

async function loadCategory(params = {}) {
  try {
    const host = getHost(params);
    const body = {
      area: params.area || "全部",
      year: params.year || "全部",
      type_id: String(params.typeId || "1"),
      page: String(params.page || 1),
      sort: params.sort || "最新",
      lang: params.lang || "全部",
      class: params.vodClass || "全部",
    };
    const data = await postVodApi("typeFilterVodList", body, params, true);
    if (!data) return [];

    return (data.recommend_list || []).map((item) => mapVodItem(host, item));
  } catch (error) {
    console.error("[tvbyunbo4k][loadCategory] 失败:", error.message || error);
    throw error;
  }
}

async function search(params = {}) {
  try {
    const keyword = String(params.keyword || "").trim();
    if (!keyword) return [];
    const host = getHost(params);
    const payload = {
      keywords: keyword,
      type_id: "0",
      page: String(params.page || 1),
    };
    const data = await postVodApi("searchList", payload, params, true);
    if (!data) return [];

    return (data.search_list || []).map((i) => {
      const remarks = `${i.vod_year || ""} ${i.vod_class || ""}`.trim();
      return mapVodItem(host, i, remarks);
    });
  } catch (error) {
    console.error("[tvbyunbo4k][search] 失败:", error.message || error);
    throw error;
  }
}

async function loadDetail(link) {
  try {
    const rawLink = String(link || "").trim();
    const match = rawLink.match(/^tvbyunbo:vod:(\d+)$/);
    if (!match) return null;

    const did = match[1];
    const host = getHost({});
    const data = await postVodApi("vodDetail", { vod_id: did }, {}, true);
    if (!data) return null;

    const vod = data.vod || {};
    const pic = fixImageUrl(host, vod.vod_pic || "");
    const playerInfoMap = {};
    for (const p of data.player_source_list || []) {
      playerInfoMap[p.player_code] = p;
    }

    const rawLines = [];
    const nameCount = {};

    for (const itt of data.vod_play_url_list || []) {
      const playerCode = itt.player_code || "";
      const pinfo = playerInfoMap[playerCode] || {};
      let playerName = pinfo.player_name || playerCode || "默认线路";

      if (["防走丢", "群", "防失群", "官网"].some((kw) => playerName.includes(kw))) {
        playerName = `线路${Object.keys(nameCount).length + 1}`;
      }
      const cnt = (nameCount[playerName] || 0) + 1;
      nameCount[playerName] = cnt;
      if (cnt > 1) playerName = `${playerName}${cnt}`;

      const episodes = [];
      const urls = itt.urls || [];
      for (let idx = 0; idx < urls.length; idx++) {
        const it = urls[idx];
        const rawUrl = it.url || "";
        const parseApi =
          (it.parse_api_url || "").replace(rawUrl, "") || pinfo.parse_api || "";

        const playData = {
          url: rawUrl,
          parse_api: parseApi,
          token: it.token || "",
          vod_id: did,
          player_source_id: pinfo.id || "",
          episode_index: it.episode_index !== undefined && it.episode_index !== null ? it.episode_index : idx,
          parse_type: String(pinfo.player_parse_type || "1"),
          user_agent: pinfo.user_agent || "",
          headers: pinfo.headers || {},
        };

        const encodedPayload = bytesToBase64(strToUtf8Bytes(JSON.stringify(playData)));
        const isDirect =
          !parseApi && /\.(m3u8|mp4|avi|mkv|flv|ts)(?:\?.*)?$/i.test(rawUrl);

        episodes.push({
          title: it.name || `第${idx + 1}集`,
          link: `${YUNBO_NS}play:${encodedPayload}`,
          directUrl: isDirect ? rawUrl : "",
        });
      }

      if (episodes.length > 0) {
        rawLines.push({ name: playerName, episodes });
      }
    }

    rawLines.sort((a, b) => lineRank(a.name) - lineRank(b.name));

    const episodeItems = [];
    rawLines.forEach((line, lineIdx) => {
      line.episodes.forEach((ep, epIdx) => {
        const epTitle = rawLines.length > 1 ? `[${line.name}] ${ep.title}` : ep.title;
        episodeItems.push({
          id: `${YUNBO_NS}ep:${did}:${lineIdx}:${epIdx}`,
          type: "url",
          mediaType: "tv",
          title: epTitle,
          coverUrl: pic,
          posterPath: pic,
          episode: epIdx + 1,
          link: ep.link,
          videoUrl: ep.directUrl || undefined,
        });
      });
    });

    const peoples = [];
    const directorStr = String(vod.vod_director || "").replace(/导演/g, "");
    const actorStr = String(vod.vod_actor || "").replace(/演员/g, "");
    directorStr
      .split(/[,，/、]/)
      .map((s) => s.trim())
      .filter(Boolean)
      .forEach((name, idx) => {
        peoples.push({ id: `dir_${idx}_${name}`, title: name, role: "导演" });
      });
    actorStr
      .split(/[,，/、]/)
      .map((s) => s.trim())
      .filter(Boolean)
      .forEach((name, idx) => {
        peoples.push({ id: `act_${idx}_${name}`, title: name, role: "演员" });
      });

    const yearStr = vod.vod_year ? `${vod.vod_year}年` : "";
    const metaDesc = [vod.vod_area, yearStr, vod.vod_remarks, vod.vod_content]
      .filter(Boolean)
      .join("\n");

    return {
      id: rawLink,
      type: "url",
      mediaType: "tv",
      title: vod.vod_name || "未命名影片",
      coverUrl: pic,
      posterPath: pic,
      backdropPath: pic,
      releaseDate: yearStr,
      description: metaDesc,
      peoples,
      episodeItems,
      link: rawLink,
      videoUrl: episodeItems.length > 0 ? episodeItems[0].videoUrl : undefined,
    };
  } catch (error) {
    console.error("[tvbyunbo4k][loadDetail] 失败:", error.message || error);
    throw error;
  }
}

async function loadResource(params = {}) {
  try {
    const raw = String(params.link != null ? params.link : params.id || "").trim();
    if (!raw.startsWith(`${YUNBO_NS}play:`)) {
      return [];
    }

    const tokenB64 = raw.slice(`${YUNBO_NS}play:`.length);
    const playData = JSON.parse(utf8BytesToStr(base64ToBytes(tokenB64)));

    const headers = {
      "User-Agent": playData.user_agent || "okhttp/4.9.3",
    };
    const pdHeaders = playData.headers || {};
    if (pdHeaders && typeof pdHeaders === "object") {
      for (const [k, v] of Object.entries(pdHeaders)) {
        if (!v) continue;
        if (k.toLowerCase() === "user-agent" && !playData.user_agent) {
          headers["User-Agent"] = v;
        } else if (k.toLowerCase() === "referer" && !headers.Referer) {
          headers.Referer = v;
        } else {
          headers[k] = v;
        }
      }
    }

    const url = playData.url || "";
    const parseApi = playData.parse_api || "";
    const token = playData.token || "";
    const parseType = playData.parse_type || "1";
    const vodId = playData.vod_id || "";
    const playerSourceId = playData.player_source_id || "";
    const episodeIndex = playData.episode_index || 0;
    const key = getKey(params);

    // 1) 外置 HTTP JSON 解析接口
    if (parseApi && parseApi.includes("url=") && /^https?:\/\//i.test(parseApi)) {
      try {
        const res = await Widget.http.get(parseApi + encodeURIComponent(url), {
          headers: { "User-Agent": "Mozilla/5.0" },
        });
        const resp = typeof res.data === "string" ? JSON.parse(res.data) : res.data;
        const play =
          (resp && resp.url) || (resp && resp.data && resp.data.url) || "";
        if (play) {
          return [{ name: "云播解析线路", url: play, customHeaders: headers, playerType: "app" }];
        }
      } catch (e) {
        console.warn("[tvbyunbo4k] 外置解析失败:", e.message || e);
      }
    }

    // 2) 自带解析器 vodParse (带 parse_api + encrypted url)
    if (parseApi && url) {
      const body = `parse_api=${encodeURIComponent(parseApi)}&url=${encodeURIComponent(
        yunboEncrypt(url, key)
      )}&player_parse_type=${encodeURIComponent(parseType)}&token=${encodeURIComponent(token)}&scene=0`;
      const resp = await postVodApi("vodParse", body, params, true);
      if (resp) {
        let play = resp.url || "";
        if (!play && resp.json) {
          try {
            play = JSON.parse(resp.json).url || "";
          } catch (_) {}
        }
        if (play) {
          return [{ name: "云播4K解析", url: play, customHeaders: headers, playerType: "app" }];
        }
      }
      return [];
    }

    // 3) url 为空时使用 vodParse 换取播放地址
    if (vodId && !url) {
      const body = `vod_id=${encodeURIComponent(vodId)}&player_source_id=${encodeURIComponent(
        playerSourceId
      )}&episode_index=${encodeURIComponent(episodeIndex)}&scene=0`;
      const resp = await postVodApi("vodParse", body, params, true);
      if (!resp) return [];
      const trial = resp.trial;
      if (trial && !trial.current_episode_allowed) {
        console.warn("[tvbyunbo4k] 试看限制，当前集不可播放");
        return [];
      }
      const play = resp.play_url || resp.url || "";
      if (play) {
        return [{ name: "云播4K线路", url: play, customHeaders: headers, playerType: "app" }];
      }
      return [];
    }

    // 4) 直链
    if (url) {
      return [{ name: "云播直链", url, customHeaders: headers, playerType: "app" }];
    }

    return [];
  } catch (error) {
    console.error("[tvbyunbo4k][loadResource] 失败:", error.message || error);
    return [];
  }
}
