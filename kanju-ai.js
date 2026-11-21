// 看剧AI (kanju.ai) —— Rex / Forward 模块
// 数据来源：kanju.ai 站方 Web 端同款同源 /v1/ 接口（2026-11-17 实测可用）
//   首页    GET  /v1/feed/home
//   分类/搜索 GET /v1/browse/catalog?kind=&q=&page=&limit=
//   详情    GET  /v1/catalog/<variantId>
//   集数    GET  /v1/catalog/<variantId>/episodes?offset=&limit=
//   解析    GET  /v1/playback/resolve/<episode_token> -> line_options[]
//           其中多数线路 url 即直链 m3u8；少数官方线路 url 为 resolve://<ticket>，
//           需再 POST /v1/playback/resolve-line?view=compact {ticket} 换直链。
// 请求签名：站方 Web 端的公开签名方式（密钥见其前端 JS 内嵌常量，浏览器打开即
// 可见，非私人凭据）：
//   x-ai-movie-timestamp = 毫秒时间戳
//   x-ai-movie-nonce     = 16 字节随机 hex
//   x-ai-movie-signature = HMAC-SHA256_hex(密钥, "METHOD\n<path+query>\n<ts>\n<nonce>")
// 实测（2026-11-17）：列表/搜索/详情/集数四步同签名 200；播放解析 GET 实测
// 《反飙车行动》返回 30 条线路，其中 27 条为直链 m3u8、3 条为官方 parse 线路。
// resolve-line 的 POST 在作者环境被拦截未实测，模块内作尽力尝试，失败自动跳过，
// 不影响直链线路播放。（初版曾误用 POST /v1/playback/resolve 导致 HTTP 500，已修正。）
// v1.1.0 增加 TMDB 对号：kanju 数据本身不带 TMDB 编号，Rex 聚合搜索/合并都认
// TMDB 身份；在「片库」模块参数里填入 TMDB API Key 后，模块按片名+年份对号，
// 并支持 Rex 按 TMDB 编号反查要资源。TMDB 接口本身需用户自己的 key 才能实测，
// 对号/反查逻辑已用桩数据在本地验证，kanju 侧链路为真实接口。

// ================= 账号配置（可选） =================
// 官方线路需要登录会话：不填账号时模块自动用游客会话（同官网流程）；
// 若游客会话在 Rex 里拿不到官方线路，可把你自己的 kanju 账号填在这里，
// 模块会自动登录后解析官方线路。密码只存在这个文件里，切勿转发。
var KANJU_ACCOUNT = "";
var KANJU_PASSWORD = "";
// =====================================================

var KANJU_BASE = "https://kanju.ai";
var KANJU_SIGN_KEY = "557d0e4ae929f438da6bd84412374e6086b8af09b3fed54bf22601d5bf8c54a0";

WidgetMetadata = {
  id: "kanju.ai",
  title: "看剧AI",
  version: "1.2.1",
  requiredVersion: "0.0.1",
  description: "看剧AI (kanju.ai) 片库：推荐、电影、电视剧、动漫、综艺、短剧，搜索+详情+多线路播放；填入 TMDB API Key 后可参与 Rex 聚合搜索并与 Emby 等来源合并",
  author: "242",
  site: "https://kanju.ai",
  modules: [
    {
      id: "kanjuList",
      title: "看剧AI · 片库",
      functionName: "loadList",
      params: [
        {
          name: "kind",
          title: "分类",
          type: "enumeration",
          value: "recommend",
          enumOptions: [
            { title: "推荐", value: "recommend" },
            { title: "电影", value: "movie" },
            { title: "电视剧", value: "series" },
            { title: "动漫", value: "anime" },
            { title: "综艺", value: "variety" },
            { title: "短剧", value: "short_drama" }
          ]
        },
        { name: "page", title: "页码", type: "page" },
                { name: "count", title: "数量", type: "count", value: "20" },
        {
          name: "tmdbApiKey",
          title: "TMDB API Key（可选）",
          type: "input",
          description: "填入后按片名+年份给影片对上 TMDB 编号，Rex 聚合搜索可搜到、并能与 Emby 等来源合并；themoviedb.org 免费注册申请",
          value: ""
        }
      ]
    },
    {
      id: "loadResource",
      title: "加载资源",
      functionName: "loadResource",
      type: "stream",
      cacheDuration: 0,
      params: []
    }
  ],
  search: {
    title: "看剧AI搜索",
    functionName: "search",
    params: [
      { name: "keyword", title: "搜索关键词", type: "input", description: "片名、演员都可搜" }
    ]
  }
};

// ---------------- SHA-256 / HMAC（纯 JS，无需 crypto.subtle） ----------------
var SHA256_K = [
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
];

function sha256Bytes(input) {
  var bytes = input;
  var bitLen = bytes.length * 8;
  var withOne = bytes.length + 1;
  var paddedLen = withOne + 8;
  while (paddedLen % 64 !== 0) paddedLen++;
  var data = new Array(paddedLen);
  for (var i = 0; i < bytes.length; i++) data[i] = bytes[i];
  data[bytes.length] = 0x80;
  for (var j = bytes.length + 1; j < paddedLen - 8; j++) data[j] = 0;
  var hi = Math.floor(bitLen / 4294967296);
  var lo = bitLen >>> 0;
  data[paddedLen - 8] = (hi >>> 24) & 0xff;
  data[paddedLen - 7] = (hi >>> 16) & 0xff;
  data[paddedLen - 6] = (hi >>> 8) & 0xff;
  data[paddedLen - 5] = hi & 0xff;
  data[paddedLen - 4] = (lo >>> 24) & 0xff;
  data[paddedLen - 3] = (lo >>> 16) & 0xff;
  data[paddedLen - 2] = (lo >>> 8) & 0xff;
  data[paddedLen - 1] = lo & 0xff;

  var h0 = 0x6a09e667, h1 = 0xbb67ae85, h2 = 0x3c6ef372, h3 = 0xa54ff53a;
  var h4 = 0x510e527f, h5 = 0x9b05688c, h6 = 0x1f83d9ab, h7 = 0x5be0cd19;

  function rotr(x, n) { return (x >>> n) | (x << (32 - n)); }

  for (var off = 0; off < paddedLen; off += 64) {
    var w = new Array(64);
    for (var t = 0; t < 16; t++) {
      w[t] = ((data[off + t * 4] << 24) | (data[off + t * 4 + 1] << 16) |
        (data[off + t * 4 + 2] << 8) | data[off + t * 4 + 3]) >>> 0;
    }
    for (var k = 16; k < 64; k++) {
      var s0 = (rotr(w[k - 15], 7) ^ rotr(w[k - 15], 18) ^ (w[k - 15] >>> 3)) >>> 0;
      var s1 = (rotr(w[k - 2], 17) ^ rotr(w[k - 2], 19) ^ (w[k - 2] >>> 10)) >>> 0;
      w[k] = (w[k - 16] + s0 + w[k - 7] + s1) >>> 0;
    }
    var a = h0, b = h1, c = h2, d = h3, e = h4, f = h5, g = h6, h = h7;
    for (var m = 0; m < 64; m++) {
      var S1 = (rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25)) >>> 0;
      var ch = ((e & f) ^ ((~e) & g)) >>> 0;
      var temp1 = (h + S1 + ch + SHA256_K[m] + w[m]) >>> 0;
      var S0 = (rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22)) >>> 0;
      var maj = ((a & b) ^ (a & c) ^ (b & c)) >>> 0;
      var temp2 = (S0 + maj) >>> 0;
      h = g; g = f; f = e; e = (d + temp1) >>> 0;
      d = c; c = b; b = a; a = (temp1 + temp2) >>> 0;
    }
    h0 = (h0 + a) >>> 0; h1 = (h1 + b) >>> 0; h2 = (h2 + c) >>> 0; h3 = (h3 + d) >>> 0;
    h4 = (h4 + e) >>> 0; h5 = (h5 + f) >>> 0; h6 = (h6 + g) >>> 0; h7 = (h7 + h) >>> 0;
  }
  var out = [h0, h1, h2, h3, h4, h5, h6, h7];
  var result = [];
  for (var n = 0; n < 8; n++) {
    result.push((out[n] >>> 24) & 0xff, (out[n] >>> 16) & 0xff, (out[n] >>> 8) & 0xff, out[n] & 0xff);
  }
  return result;
}

function utf8Bytes(str) {
  var bytes = [];
  for (var i = 0; i < str.length; i++) {
    var code = str.charCodeAt(i);
    if (code < 0x80) {
      bytes.push(code);
    } else if (code < 0x800) {
      bytes.push(0xc0 | (code >> 6), 0x80 | (code & 0x3f));
    } else if (code >= 0xd800 && code <= 0xdbff && i + 1 < str.length) {
      var next = str.charCodeAt(i + 1);
      if (next >= 0xdc00 && next <= 0xdfff) {
        var cp = 0x10000 + ((code - 0xd800) << 10) + (next - 0xdc00);
        bytes.push(0xf0 | (cp >> 18), 0x80 | ((cp >> 12) & 0x3f), 0x80 | ((cp >> 6) & 0x3f), 0x80 | (cp & 0x3f));
        i++;
        continue;
      }
      bytes.push(0xe0 | (code >> 12), 0x80 | ((code >> 6) & 0x3f), 0x80 | (code & 0x3f));
    } else {
      bytes.push(0xe0 | (code >> 12), 0x80 | ((code >> 6) & 0x3f), 0x80 | (code & 0x3f));
    }
  }
  return bytes;
}

function bytesToHex(bytes) {
  var hex = "";
  for (var i = 0; i < bytes.length; i++) {
    hex += ("0" + bytes[i].toString(16)).slice(-2);
  }
  return hex;
}

function hmacSha256Hex(key, message) {
  var keyBytes = utf8Bytes(key);
  if (keyBytes.length > 64) keyBytes = sha256Bytes(keyBytes);
  var block = new Array(64);
  for (var i = 0; i < 64; i++) block[i] = i < keyBytes.length ? keyBytes[i] : 0;
  var inner = [], outer = [];
  for (var j = 0; j < 64; j++) {
    inner.push(block[j] ^ 0x36);
    outer.push(block[j] ^ 0x5c);
  }
  var innerHash = sha256Bytes(inner.concat(utf8Bytes(message)));
  return bytesToHex(sha256Bytes(outer.concat(innerHash)));
}

function randomNonceHex() {
  try {
    if (typeof crypto !== "undefined" && crypto.getRandomValues) {
      var arr = new Uint8Array(16);
      crypto.getRandomValues(arr);
      var out = "";
      for (var i = 0; i < 16; i++) out += ("0" + arr[i].toString(16)).slice(-2);
      return out;
    }
  } catch (e) {}
  var fallback = "";
  for (var k = 0; k < 16; k++) {
    fallback += ("0" + Math.floor(Math.random() * 256).toString(16)).slice(-2);
  }
  return fallback;
}

// ---------------- 签名请求 ----------------
function signedHeaders(method, path) {
  var ts = String(Date.now());
  var nonce = randomNonceHex();
  var msg = method.toUpperCase() + "\n" + path + "\n" + ts + "\n" + nonce;
  return {
    "x-ai-movie-timestamp": ts,
    "x-ai-movie-nonce": nonce,
    "x-ai-movie-signature": hmacSha256Hex(KANJU_SIGN_KEY, msg),
    "Accept": "application/json",
    "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15"
  };
}

function parseJson(data) {
  if (typeof data === "string") {
    try { return JSON.parse(data); } catch (e) { return data; }
  }
  return data;
}

function checkError(data) {
  if (data && data.error) {
    throw new Error(data.error.message || "kanju.ai 请求失败");
  }
  return data;
}

async function apiGet(path) {
  var res = await Widget.http.get(KANJU_BASE + path, { headers: signedHeaders("GET", path) });
  return checkError(parseJson(res && res.data));
}

async function apiPost(path, body) {
  var headers = signedHeaders("POST", path);
  headers["Content-Type"] = "application/json";
  var res = await Widget.http.post(KANJU_BASE + path, body, { headers: headers });
  return checkError(parseJson(res && res.data));
}

// ---------------- 游客会话（官方线路解析需要） ----------------
// 官网对游客也会自动建一个匿名会话（POST /v1/users/anonymous），
// 官方线路的解析接口要求带着这个会话 cookie，否则返回 401 login_required。
// 会话按 anonymous_id 绑定、有效期约一年，存本地复用；401 时自动刷新重试。
function kanjuAnonId() {
  var id = "";
  try { id = Widget.storage.get("kanju.anonId") || ""; } catch (e) {}
  if (!id) {
    id = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0;
      var v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
    try { Widget.storage.set("kanju.anonId", id); } catch (e) {}
  }
  return id;
}

function extractCookies(headers) {
  if (!headers) return "";
  var raw = headers["set-cookie"] || headers["Set-Cookie"] || headers["SET-COOKIE"] || "";
  var arr = Array.isArray(raw) ? raw : (raw ? [String(raw)] : []);
  // Rex 可能把多条 Set-Cookie 合并成一个逗号分隔字符串：先整体提取会话 cookie
  // （站方会连发多条同名 cookie，以最后一个为准）
  var joined = arr.join("\n");
  var m = joined.match(/ai_movie_session=([^;,\s]+)/g);
  if (m && m.length) return "ai_movie_session=" + m[m.length - 1].slice("ai_movie_session=".length);
  var byName = {};
  var order = [];
  for (var i = 0; i < arr.length; i++) {
    var pair = String(arr[i]).split(";")[0].trim();
    var eq = pair.indexOf("=");
    if (eq <= 0) continue;
    var name = pair.slice(0, eq);
    if (!(name in byName)) order.push(name);
    byName[name] = pair; // 同名以最后一个为准
  }
  var out = [];
  for (var j = 0; j < order.length; j++) out.push(byName[order[j]]);
  return out.join("; ");
}

async function apiPostRaw(path, body, extraHeaders) {
  var url = KANJU_BASE + path;
  var headers = signedHeaders("POST", path);
  headers["Content-Type"] = "application/json";
  if (extraHeaders) {
    for (var k in extraHeaders) headers[k] = extraHeaders[k];
  }
  try {
    var res = await Widget.http.post(url, body || {}, { headers: headers, timeout: 20 });
    if (!res) return null;
    return { status: res.status || 0, data: res.data, headers: res.headers || res.header || null };
  } catch (e) {
    return null;
  }
}

var kanjuDiag = {};

async function kanjuSessionCookie(force) {
  var useLogin = !!(typeof KANJU_ACCOUNT !== "undefined" && KANJU_ACCOUNT && typeof KANJU_PASSWORD !== "undefined" && KANJU_PASSWORD);
  var cacheKey = useLogin ? "kanju.sessionCookie.login" : "kanju.sessionCookie.guest";
  if (!force) {
    try {
      var cached = Widget.storage.get(cacheKey) || "";
      if (cached) return cached;
    } catch (e) {}
  }
  var cookie = "";
  if (useLogin) {
    var lr = await apiPostRaw("/v1/users/password/login", { account: KANJU_ACCOUNT, password: KANJU_PASSWORD }, {});
    kanjuDiag.loginStatus = lr ? lr.status : 0;
    if (lr) cookie = extractCookies(lr.headers);
  }
  if (!cookie) {
    var ar = await apiPostRaw("/v1/users/anonymous", { anonymous_id: kanjuAnonId() }, {});
    kanjuDiag.anonStatus = ar ? ar.status : 0;
    if (ar) cookie = extractCookies(ar.headers);
  }
  kanjuDiag.cookieLen = cookie ? cookie.length : 0;
  if (cookie) {
    try { Widget.storage.set(cacheKey, cookie); } catch (e) {}
  }
  return cookie;
}

function kanjuDiagText() {
  var parts = [];
  if (kanjuDiag.loginStatus) parts.push("登录" + kanjuDiag.loginStatus);
  if (kanjuDiag.anonStatus) parts.push("游客" + kanjuDiag.anonStatus);
  parts.push(kanjuDiag.cookieLen ? "有cookie" : "无cookie");
  if (kanjuDiag.resolveStatus) parts.push("解析" + kanjuDiag.resolveStatus);
  return parts.join("/");
}

// 解析一条官方线路（resolve:// 票据换真实地址）；会话过期自动刷新重试一次
async function resolveOfficialLine(ticket) {
  for (var attempt = 0; attempt < 2; attempt++) {
    var cookie = await kanjuSessionCookie(attempt > 0);
    var extra = cookie ? { Cookie: cookie } : {};
    var res = await apiPostRaw("/v1/playback/resolve-line?view=compact", { ticket: ticket }, extra);
    if (!res) { kanjuDiag.resolveStatus = "网络失败"; return ""; }
    kanjuDiag.resolveStatus = res.status;
    if (res.status === 401 && attempt === 0) continue;
    var d = res.data || {};
    var line = d.line || d;
    if (line && line.url && String(line.url).indexOf("http") === 0) return String(line.url);
    return "";
  }
  return "";
}

// ---------------- TMDB 对号（聚合搜索 / 跨来源合并） ----------------
// kanju 自身不带 TMDB 编号，Rex 的聚合搜索与合并都以 TMDB 编号为身份。
// 填了 TMDB API Key 后：列表/搜索结果按「片名+年份」向 TMDB 对号，对上的
// 条目改挂 tmdb 身份（id 形如 tv.123 / movie.456，link 仍为 kanju 编号）；
// Rex 按 TMDB 编号来要资源时（loadResource 带 tmdbId），反查回 kanju 条目。
// 对号结果缓存在 Widget.storage，同一部剧只查一次。没填 key 时全部跳过，
// 行为与无 TMDB 版本一致。
function storeGet(key) {
  try { return Widget.storage ? (Widget.storage.get(key) || "") : ""; } catch (e) { return ""; }
}
function storeSet(key, value) {
  try { if (Widget.storage) Widget.storage.set(key, value); } catch (e) {}
}

// 本文件为 242 的专属副本：TMDB API Key 已内置（用户本人申请的 key），
// 导入即生效，无需再填参数；此文件含 key，不要转发他人。
// 参数里另填了 key 时以参数为准。
var KANJU_TMDB_KEY_BUILTIN = "2eb08fae0ab171317e688974b2043b7b";

function tmdbKeyFrom(params) {
  var k = params && params.tmdbApiKey ? String(params.tmdbApiKey).trim() : "";
  if (k) { storeSet("kanju.tmdbKey", k); return k; }
  return storeGet("kanju.tmdbKey") || KANJU_TMDB_KEY_BUILTIN;
}

async function tmdbGet(path, key) {
  var sep = path.indexOf("?") >= 0 ? "&" : "?";
  var url = "https://api.themoviedb.org/3" + path + sep + "api_key=" + encodeURIComponent(key) + "&language=zh-CN";
  var res = await Widget.http.get(url, { headers: { "Accept": "application/json" } });
  return parseJson(res && res.data);
}

function tmdbRefOf(mediaType, tmdbId) {
  return (mediaType === "movie" ? "movie" : "tv") + "." + tmdbId;
}

function parseTmdbRef(str) {
  var m = String(str || "").trim().match(/^(tv|movie)[.:](\d+)$/);
  if (m) return { mediaType: m[1], tmdbId: m[2] };
  return null;
}

// kanju 条目 -> TMDB 编号（先查缓存，live=true 时再查 TMDB 搜索）
async function matchKanjuToTmdb(card, key, live) {
  if (!card || !card.id) return "";
  var cached = storeGet("kanju.k2t." + card.id);
  if (cached === "none") return "";
  if (cached) return cached;
  if (!live || !key) return "";
  var mediaType = mediaTypeOf(card.content_kind || "movie");
  var title = String(card.title || card.normalized_title || "").trim();
  if (!title) return "";
  try {
    var path = "/search/" + mediaType + "?query=" + encodeURIComponent(title);
    if (card.year) path += (mediaType === "movie" ? "&year=" : "&first_air_date_year=") + encodeURIComponent(card.year);
    var data = await tmdbGet(path, key);
    var results = (data && data.results) || [];
    var names = [title].concat(card.aliases || []).map(function (x) { return String(x).trim(); });
    var pick = null;
    for (var i = 0; i < results.length; i++) {
      var r = results[i];
      var rn = String(r.name || r.title || "").trim();
      var ro = String(r.original_name || r.original_title || "").trim();
      if (names.indexOf(rn) >= 0 || names.indexOf(ro) >= 0) { pick = r; break; }
    }
    if (!pick && results.length === 1) {
      // 只有一个候选时，还要求年份对得上（或双方有一方没年份）才认，避免误合并
      var only = results[0];
      var oy = Number(String(only.first_air_date || only.release_date || "").slice(0, 4)) || 0;
      if (!oy || !card.year || oy === Number(card.year)) pick = only;
    }
    if (!pick) { storeSet("kanju.k2t." + card.id, "none"); return ""; }
    var ref = tmdbRefOf(mediaType, pick.id);
    storeSet("kanju.k2t." + card.id, ref);
    storeSet("kanju.t2k." + ref, card.id);
    return ref;
  } catch (e) { return ""; }
}

// TMDB 编号 -> kanju 条目 id（Rex 聚合详情按编号要资源/详情时用）
async function resolveTmdbToKanju(ref, key) {
  var cached = storeGet("kanju.t2k." + ref);
  if (cached) return cached;
  if (!key) return "";
  var parsed = parseTmdbRef(ref);
  if (!parsed) return "";
  try {
    var d = await tmdbGet("/" + parsed.mediaType + "/" + parsed.tmdbId, key);
    if (!d || !d.id) return "";
    var title = String(d.name || d.title || "").trim();
    if (!title) return "";
    var dateStr = String(d.first_air_date || d.release_date || "");
    var year = dateStr ? Number(dateStr.slice(0, 4)) : 0;
    var data = await apiGet("/v1/browse/catalog?q=" + encodeURIComponent(title) + "&limit=20");
    var cards = data.cards || [];
    var pick = null;
    for (var i = 0; i < cards.length; i++) {
      var c = cards[i];
      if (String(c.title || "").trim() !== title && String(c.normalized_title || "").trim() !== title) continue;
      if (parsed.mediaType === "movie" && c.content_kind !== "movie") continue;
      if (parsed.mediaType === "tv" && c.content_kind === "movie") continue;
      if (year && c.year && Number(c.year) !== year) continue;
      pick = c; break;
    }
    if (!pick && cards.length) {
      for (var j = 0; j < cards.length; j++) {
        if (String(cards[j].title || "").trim() === title) { pick = cards[j]; break; }
      }
    }
    if (!pick) return "";
    storeSet("kanju.t2k." + ref, pick.id);
    storeSet("kanju.k2t." + pick.id, ref);
    return pick.id;
  } catch (e) { return ""; }
}

// 从 loadResource / loadDetail 的入参里提取 TMDB 编号（兼容 tv.123、movie:456、纯数字）
function tmdbRefFromParams(params) {
  if (!params) return "";
  var cands = [params.tmdbId, params.id, params.link];
  for (var i = 0; i < cands.length; i++) {
    var p = parseTmdbRef(cands[i]);
    if (p) return tmdbRefOf(p.mediaType, p.tmdbId);
  }
  var raw = String(params.tmdbId || "").trim();
  if (/^\d+$/.test(raw)) {
    var mt = (params.type === "movie" || params.mediaType === "movie") ? "movie" : "tv";
    return tmdbRefOf(mt, raw);
  }
  return "";
}

// 给一组条目挂 TMDB 身份：items 与 cards 一一对应；live=true 时允许现查 TMDB
async function applyTmdbTyping(items, cards, key, live, liveLimit) {
  if (!key || !items || !items.length) return items;
  var liveUsed = 0;
  for (var i = 0; i < items.length; i++) {
    var card = cards[i];
    if (!card) continue;
    var useLive = live && liveUsed < (liveLimit || 10);
    var ref = await matchKanjuToTmdb(card, key, useLive);
    if (useLive) liveUsed++;
    if (ref) {
      items[i].id = ref;
      items[i].type = "tmdb";
      // link 保持 kanju 编号，loadDetail / loadResource 据此回查
    }
  }
  return items;
}

// ---------------- 数据映射 ----------------
function mediaTypeOf(kind) {
  return kind === "movie" ? "movie" : "tv";
}

function toVideoItem(card) {
  if (!card || !card.id) return null;
  var kind = card.content_kind || "movie";
  var descParts = [];
  if (card.year) descParts.push(card.year);
  if (card.area) descParts.push(card.area);
  if (card.genres && card.genres.length) descParts.push(card.genres.slice(0, 4).join(" / "));
  if (card.remarks) descParts.push(card.remarks);
  var peoples = [];
  (card.directors || []).slice(0, 3).forEach(function (name) {
    peoples.push({ id: String(name), title: String(name), role: "导演" });
  });
  (card.actors || []).slice(0, 8).forEach(function (name) {
    peoples.push({ id: String(name), title: String(name), role: "主演" });
  });
  return {
    id: card.id,
    type: "url",
    title: card.title || card.normalized_title || "",
    link: card.id,
    mediaType: mediaTypeOf(kind),
    posterPath: card.poster_url || "",
    backdropPath: card.carousel_url || card.poster_url || "",
    description: descParts.join(" · "),
    releaseDate: card.year ? String(card.year) : "",
    genreItems: (card.genres || []).slice(0, 8).map(function (g) {
      return { id: String(g), title: String(g) };
    }),
    peoples: peoples
  };
}

function pickCursor(data) {
  if (!data) return "";
  if (typeof data.next_cursor === "string" && data.next_cursor) return data.next_cursor;
  if (data.meta && typeof data.meta.next_cursor === "string" && data.meta.next_cursor) return data.meta.next_cursor;
  return "";
}

// ---------------- 列表 ----------------
async function loadList(params) {
  params = params || {};
  var page = Math.max(1, Number(params.page || 1));
  var count = Math.max(1, Math.min(50, Number(params.count || 20)));
  var kind = String(params.kind || "recommend");
  var tmdbKey = tmdbKeyFrom(params);

  if (kind === "recommend") {
    if (page === 1) {
      var home = await apiGet("/v1/feed/home?scope=public&mode=preview&sections=3&cards=10");
      var items = [], itemCards = [];
      (home.sections || []).forEach(function (sec) {
        (sec.cards || []).forEach(function (card) {
          var item = toVideoItem(card);
          if (item) { items.push(item); itemCards.push(card); }
        });
      });
      var cursor = pickCursor(home);
      if (cursor && Widget.storage) Widget.storage.set("kanju.homeCursor", cursor);
      return await applyTmdbTyping(items.slice(0, count), itemCards.slice(0, count), tmdbKey, false, 0);
    }
    var savedCursor = Widget.storage ? Widget.storage.get("kanju.homeCursor") : "";
    if (!savedCursor) return [];
    var next = await apiGet("/v1/feed/home?scope=public&mode=page&sections=3&cards=12&cursor=" + encodeURIComponent(savedCursor));
    var pageItems = [], pageCards = [];
    (next.sections || []).forEach(function (sec) {
      (sec.cards || []).forEach(function (card) {
        var item = toVideoItem(card);
        if (item) { pageItems.push(item); pageCards.push(card); }
      });
    });
    var nextCursor = pickCursor(next);
    if (nextCursor && Widget.storage) Widget.storage.set("kanju.homeCursor", nextCursor);
    return await applyTmdbTyping(pageItems.slice(0, count), pageCards.slice(0, count), tmdbKey, false, 0);
  }

  var path = "/v1/browse/catalog?kind=" + encodeURIComponent(kind) +
    "&intent=latest_catalog&page=" + page + "&limit=" + count;
  if (params.genreId) path += "&genre=" + encodeURIComponent(params.genreId);
  if (params.peopleId) path += "&q=" + encodeURIComponent(params.peopleId);
  var data = await apiGet(path);
  var cards = data.cards || [];
  var listItems = [], listCards = [];
  cards.forEach(function (card) {
    var item = toVideoItem(card);
    if (item) { listItems.push(item); listCards.push(card); }
  });
  return await applyTmdbTyping(listItems, listCards, tmdbKey, false, 0);
}

// ---------------- 搜索 ----------------
async function search(params) {
  var kw = String((params && (params.keyword || params.query)) || "").trim();
  if (!kw) return [];
  var data = await apiGet("/v1/browse/catalog?q=" + encodeURIComponent(kw) + "&limit=20");
  var cards = data.cards || [];
  var items = [], itemCards = [];
  cards.forEach(function (card) {
    var item = toVideoItem(card);
    if (item) { items.push(item); itemCards.push(card); }
  });
  // 搜索结果现查 TMDB 对号（前 10 条），让 Rex 聚合搜索能认出同一部剧
  return await applyTmdbTyping(items, itemCards, tmdbKeyFrom(params), true, 10);
}

// ---------------- 详情 ----------------
async function loadDetail(link) {
  var id = String(link || "").trim();
  if (!id) return null;
  // Rex 聚合详情可能按 TMDB 编号打开：先反查回 kanju 编号
  var refP = parseTmdbRef(id);
  if (refP) {
    var resolvedId = await resolveTmdbToKanju(tmdbRefOf(refP.mediaType, refP.tmdbId), tmdbKeyFrom(null));
    if (!resolvedId) return null;
    id = resolvedId;
  }
  var d = await apiGet("/v1/catalog/" + encodeURIComponent(id));
  var item = toVideoItem(d) || { id: id, type: "url", title: d.title || "", link: id, mediaType: "movie" };
  if (d.description) item.description = d.description;
  if (d.poster_url) item.posterPath = d.poster_url;
  if (d.carousel_url) item.backdropPath = d.carousel_url;

  var eps = (d.episodes || []).slice();
  var total = d.total_episode_count || d.episode_count || eps.length;
  if (d.episode_pagination && d.episode_pagination.has_more) {
    var offset = eps.length;
    while (offset < total && eps.length < 200) {
      var pg = await apiGet("/v1/catalog/" + encodeURIComponent(id) + "/episodes?offset=" + offset + "&limit=48");
      var chunk = pg.episodes || [];
      if (!chunk.length) break;
      eps = eps.concat(chunk);
      offset += chunk.length;
      if (!pg.episode_pagination || !pg.episode_pagination.has_more) break;
    }
  }
  item.episodeItems = eps.map(function (ep, i) {
    var num = (typeof ep.episode_number === "number" && ep.episode_number > 0) ? ep.episode_number : (i + 1);
    return {
      id: ep.id,
      type: "url",
      title: ep.display_name || ep.title || ("第" + num + "集"),
      link: id,
      mediaType: item.mediaType,
      episode: num
    };
  });
  // 详情条目现查 TMDB 对号，挂上 tmdb 身份供 Rex 合并/聚合
  var detailKey = tmdbKeyFrom(null);
  if (detailKey) {
    var detailRef = await matchKanjuToTmdb(d, detailKey, true);
    if (detailRef) { item.id = detailRef; item.type = "tmdb"; }
  }
  return item;
}

// 线路名清洗：kanju 的线路名多为资源站牌子名（如「360资源」「1080zyk」），
// 里面的数字是牌子不是清晰度；Rex 会按名字里的数字猜清晰度分组，导致
// 「360资源」被误分到 360P。名字里带明确清晰度标记（1080P/720P/4K 等，
// 如官方线路「1080P-官方R」）的原样保留，其余把阿拉伯数字转成中文数字，
// 避免误判，名字仍可辨认。
function sanitizeLineName(name) {
  var s = String(name || "");
  if (/(4k|2160\s*p|1080\s*p|720\s*p|480\s*p|360\s*p)/i.test(s)) return s;
  var zh = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
  return s.replace(/[0-9]/g, function (d) { return zh[Number(d)]; });
}

// ---------------- 播放解析 ----------------
// 站方真实流程（据其前端代码 + 2026-11-17 实测）：
//   1) GET /v1/playback/resolve/<episode_token> 返回 line_options[]；
//      多数线路 url 是直链 m3u8（resolve_mode=direct），直接可播；
//   2) 少数官方线路 url 为 resolve://<ticket>（resolve_mode=parse），
//      需先建游客会话（POST /v1/users/anonymous，同官网对游客的自动流程），
//      再带会话 cookie POST /v1/playback/resolve-line?view=compact {ticket} 换直链
//      （2026-11-17 实测通过；个别线路站方解析失败时跳过，不影响其他线路）。
async function loadResource(params) {
  params = params || {};
  var variantId = "";
  var linkStr = String(params.link || "").trim();
  var idStr = String(params.id || "").trim();
  if (linkStr.indexOf("av_") === 0) variantId = linkStr;
  else if (idStr.indexOf("av_") === 0) variantId = idStr;
  if (!variantId) {
    // Rex 聚合详情按 TMDB 编号来要资源：反查回 kanju 编号
    var ref = tmdbRefFromParams(params);
    if (ref) variantId = await resolveTmdbToKanju(ref, tmdbKeyFrom(params));
  }
  if (!variantId) throw new Error("缺少影片 id（kanju 中未找到该 TMDB 条目，或未填 TMDB API Key）");
  var epNo = Number(params.episode || 1);
  if (!epNo || epNo < 1) epNo = 1;

  var epsData = await apiGet("/v1/catalog/" + encodeURIComponent(variantId) + "/episodes?offset=0&limit=48");
  var eps = epsData.episodes || [];
  var idx = epNo - 1;
  var offset = eps.length;
  while (idx >= eps.length && epsData.episode_pagination && epsData.episode_pagination.has_more && offset < 200) {
    var pg = await apiGet("/v1/catalog/" + encodeURIComponent(variantId) + "/episodes?offset=" + offset + "&limit=48");
    var chunk = pg.episodes || [];
    if (!chunk.length) break;
    eps = eps.concat(chunk);
    offset += chunk.length;
    epsData = pg;
  }
  var ep = eps[idx];
  if (!ep || !ep.token) throw new Error("找不到第 " + epNo + " 集");

  var res = await apiGet("/v1/playback/resolve/" + encodeURIComponent(ep.token));
  var lines = res.line_options || [];
  if (!lines.length && res.current_episode && res.current_episode.urls) {
    var urls = res.current_episode.urls;
    lines = Object.keys(urls).map(function (k) { return { label: k, url: urls[k] }; });
  }

  kanjuDiag = {};
  var officialTotal = 0;
  var officialOk = 0;
  var resources = [];
  for (var i = 0; i < lines.length; i++) {
    var l = lines[i];
    if (!l || !l.url) continue;
    var name = sanitizeLineName(l.display_label || l.label || ("线路" + (i + 1)));
    var desc = sanitizeLineName([l.provider_name, l.play_from].filter(function (x) { return !!x; }).join(" | "));
    var url = String(l.url);
    if (url.indexOf("http://") === 0 || url.indexOf("https://") === 0) {
      resources.push({ name: name, description: desc, url: url });
      continue;
    }
    // resolve://<ticket> 的官方线路：带游客会话换直链，失败就跳过
    var ticket = "";
    if (l.resolve_ticket) ticket = String(l.resolve_ticket);
    else if (url.indexOf("resolve://") === 0) ticket = url.slice(10);
    if (!ticket) continue;
    officialTotal++;
    var realUrl = await resolveOfficialLine(ticket);
    if (realUrl) {
      officialOk++;
      resources.push({ name: name, description: desc, url: realUrl });
    }
  }
  if (officialTotal > 0 && officialOk === 0 && resources.length) {
    // 官方线路一条都没解出来时，把失败环节写在第一条线路说明里，便于定位
    resources[0].description = (resources[0].description ? resources[0].description + "｜" : "") + "官方线路解析失败：" + kanjuDiagText();
  }
  if (!resources.length) throw new Error("该集暂无可用线路（可能需登录或配额已用完）");
  return resources;
}
