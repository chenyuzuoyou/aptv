/**
 * 金牌 / 老王电影（rex / ForwardWidget）
 * 对应 TVBox：金牌.py（Aidianying）
 * 站点：https://www.lwdys.com
 * 签名：sign = SHA1(MD5("...&key=cb808529...&t={ms}"))
 */

WidgetMetadata = {
  id: "cn.lwdys.jinpai",
  title: "金牌影院",
  version: "1.0.2",
  requiredVersion: "0.0.1",
  description: "lwdys.com · 电影/剧集/综艺/动漫 · 签名 API 直链",
  author: "Forward",
  site: "https://www.lwdys.com",
  detailCacheDuration: 180,
  globalParams: [],
  modules: [
    {
      id: "loadList",
      title: "分类",
      functionName: "loadList",
      cacheDuration: 300,
      params: [
        { name: "page", title: "页码", type: "page" },
        {
          name: "tid",
          title: "分类",
          type: "enumeration",
          value: "1",
          enumOptions: [
            { title: "电影", value: "1" },
            { title: "电视剧", value: "2" },
            { title: "综艺", value: "3" },
            { title: "动漫", value: "4" },
          ],
        },
      ],
    },
    {
      id: "loadResource",
      title: "加载资源",
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

// ==================== 常量 ====================
var HOST = "https://www.lwdys.com";
var API_KEY = "cb808529bae6b6be45ecfab29a4889bc";
var UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";
var NS = "jp|";

// ==================== MD5 ====================
function md5(str) {
  function cmn(q, a, b, x, s, t) {
    a = add32(add32(a, q), add32(x, t));
    return add32((a << s) | (a >>> (32 - s)), b);
  }
  function ff(a, b, c, d, x, s, t) {
    return cmn((b & c) | (~b & d), a, b, x, s, t);
  }
  function gg(a, b, c, d, x, s, t) {
    return cmn((b & d) | (c & ~d), a, b, x, s, t);
  }
  function hh(a, b, c, d, x, s, t) {
    return cmn(b ^ c ^ d, a, b, x, s, t);
  }
  function ii(a, b, c, d, x, s, t) {
    return cmn(c ^ (b | ~d), a, b, x, s, t);
  }
  function md5cycle(x, k) {
    var a = x[0],
      b = x[1],
      c = x[2],
      d = x[3];
    a = ff(a, b, c, d, k[0], 7, -680876936);
    d = ff(d, a, b, c, k[1], 12, -389564586);
    c = ff(c, d, a, b, k[2], 17, 606105819);
    b = ff(b, c, d, a, k[3], 22, -1044525330);
    a = ff(a, b, c, d, k[4], 7, -176418897);
    d = ff(d, a, b, c, k[5], 12, 1200080426);
    c = ff(c, d, a, b, k[6], 17, -1473231341);
    b = ff(b, c, d, a, k[7], 22, -45705983);
    a = ff(a, b, c, d, k[8], 7, 1770035416);
    d = ff(d, a, b, c, k[9], 12, -1958414417);
    c = ff(c, d, a, b, k[10], 17, -42063);
    b = ff(b, c, d, a, k[11], 22, -1990404162);
    a = ff(a, b, c, d, k[12], 7, 1804603682);
    d = ff(d, a, b, c, k[13], 12, -40341101);
    c = ff(c, d, a, b, k[14], 17, -1502002290);
    b = ff(b, c, d, a, k[15], 22, 1236535329);
    a = gg(a, b, c, d, k[1], 5, -165796510);
    d = gg(d, a, b, c, k[6], 9, -1069501632);
    c = gg(c, d, a, b, k[11], 14, 643717713);
    b = gg(b, c, d, a, k[0], 20, -373897302);
    a = gg(a, b, c, d, k[5], 5, -701558691);
    d = gg(d, a, b, c, k[10], 9, 38016083);
    c = gg(c, d, a, b, k[15], 14, -660478335);
    b = gg(b, c, d, a, k[4], 20, -405537848);
    a = gg(a, b, c, d, k[9], 5, 568446438);
    d = gg(d, a, b, c, k[14], 9, -1019803690);
    c = gg(c, d, a, b, k[3], 14, -187363961);
    b = gg(b, c, d, a, k[8], 20, 1163531501);
    a = gg(a, b, c, d, k[13], 5, -1444681467);
    d = gg(d, a, b, c, k[2], 9, -51403784);
    c = gg(c, d, a, b, k[7], 14, 1735328473);
    b = gg(b, c, d, a, k[12], 20, -1926607734);
    a = hh(a, b, c, d, k[5], 4, -378558);
    d = hh(d, a, b, c, k[8], 11, -2022574463);
    c = hh(c, d, a, b, k[11], 16, 1839030562);
    b = hh(b, c, d, a, k[14], 23, -35309556);
    a = hh(a, b, c, d, k[1], 4, -1530992060);
    d = hh(d, a, b, c, k[4], 11, 1272893353);
    c = hh(c, d, a, b, k[7], 16, -155497632);
    b = hh(b, c, d, a, k[10], 23, -1094730640);
    a = hh(a, b, c, d, k[13], 4, 681279174);
    d = hh(d, a, b, c, k[0], 11, -358537222);
    c = hh(c, d, a, b, k[3], 16, -722521979);
    b = hh(b, c, d, a, k[6], 23, 76029189);
    a = hh(a, b, c, d, k[9], 4, -640364487);
    d = hh(d, a, b, c, k[12], 11, -421815835);
    c = hh(c, d, a, b, k[15], 16, 530742520);
    b = hh(b, c, d, a, k[2], 23, -995338651);
    a = ii(a, b, c, d, k[0], 6, -198630844);
    d = ii(d, a, b, c, k[7], 10, 1126891415);
    c = ii(c, d, a, b, k[14], 15, -1416354905);
    b = ii(b, c, d, a, k[5], 21, -57434055);
    a = ii(a, b, c, d, k[12], 6, 1700485571);
    d = ii(d, a, b, c, k[3], 10, -1894986606);
    c = ii(c, d, a, b, k[10], 15, -1051523);
    b = ii(b, c, d, a, k[1], 21, -2054922799);
    a = ii(a, b, c, d, k[8], 6, 1873313359);
    d = ii(d, a, b, c, k[15], 10, -30611744);
    c = ii(c, d, a, b, k[6], 15, -1560198380);
    b = ii(b, c, d, a, k[13], 21, 1309151649);
    a = ii(a, b, c, d, k[4], 6, -145523070);
    d = ii(d, a, b, c, k[11], 10, -1120210379);
    c = ii(c, d, a, b, k[2], 15, 718787259);
    b = ii(b, c, d, a, k[9], 21, -343485551);
    x[0] = add32(a, x[0]);
    x[1] = add32(b, x[1]);
    x[2] = add32(c, x[2]);
    x[3] = add32(d, x[3]);
  }
  function md5blk(s) {
    var md5blks = [];
    for (var i = 0; i < 64; i += 4) {
      md5blks[i >> 2] =
        s.charCodeAt(i) +
        (s.charCodeAt(i + 1) << 8) +
        (s.charCodeAt(i + 2) << 16) +
        (s.charCodeAt(i + 3) << 24);
    }
    return md5blks;
  }
  function md51(s) {
    var n = s.length;
    var state = [1732584193, -271733879, -1732584194, 271733878];
    var i;
    for (i = 64; i <= n; i += 64) md5cycle(state, md5blk(s.substring(i - 64, i)));
    s = s.substring(i - 64);
    var tail = new Array(16).fill(0);
    for (i = 0; i < s.length; i++) tail[i >> 2] |= s.charCodeAt(i) << (i % 4 << 3);
    tail[i >> 2] |= 0x80 << (i % 4 << 3);
    if (i > 55) {
      md5cycle(state, tail);
      for (i = 0; i < 16; i++) tail[i] = 0;
    }
    tail[14] = n * 8;
    md5cycle(state, tail);
    return state;
  }
  function rhex(n) {
    var s = "",
      j;
    for (j = 0; j < 4; j++) s += ("0" + ((n >> (j * 8)) & 0xff).toString(16)).slice(-2);
    return s;
  }
  function add32(a, b) {
    return (a + b) & 0xffffffff;
  }
  var out = md51(unescape(encodeURIComponent(str)));
  return rhex(out[0]) + rhex(out[1]) + rhex(out[2]) + rhex(out[3]);
}

// ==================== SHA1 ====================
function sha1(msg) {
  function rotl(n, s) {
    return (n << s) | (n >>> (32 - s));
  }
  function tohex(i) {
    var h = "";
    for (var j = 7; j >= 0; j--) h += ((i >>> (j * 4)) & 0xf).toString(16);
    return h;
  }
  var H0 = 0x67452301,
    H1 = 0xefcdab89,
    H2 = 0x98badcfe,
    H3 = 0x10325476,
    H4 = 0xc3d2e1f0;
  var words = [];
  var i;
  msg = unescape(encodeURIComponent(msg));
  for (i = 0; i < msg.length; i++) words[i >> 2] |= msg.charCodeAt(i) << (24 - (i % 4) * 8);
  var l = msg.length * 8;
  words[l >> 5] |= 0x80 << (24 - (l % 32));
  words[(((l + 64) >> 9) << 4) + 15] = l;
  for (var bi = 0; bi < words.length; bi += 16) {
    var w = words.slice(bi, bi + 16);
    for (i = 16; i < 80; i++) w[i] = rotl(w[i - 3] ^ w[i - 8] ^ w[i - 14] ^ w[i - 16], 1);
    var a = H0,
      b = H1,
      c = H2,
      d = H3,
      e = H4;
    for (i = 0; i < 80; i++) {
      var f,
        k;
      if (i < 20) {
        f = (b & c) | (~b & d);
        k = 0x5a827999;
      } else if (i < 40) {
        f = b ^ c ^ d;
        k = 0x6ed9eba1;
      } else if (i < 60) {
        f = (b & c) | (b & d) | (c & d);
        k = 0x8f1bbcdc;
      } else {
        f = b ^ c ^ d;
        k = 0xca62c1d6;
      }
      var temp = (rotl(a, 5) + f + e + k + (w[i] | 0)) | 0;
      e = d;
      d = c;
      c = rotl(b, 30);
      b = a;
      a = temp;
    }
    H0 = (H0 + a) | 0;
    H1 = (H1 + b) | 0;
    H2 = (H2 + c) | 0;
    H3 = (H3 + d) | 0;
    H4 = (H4 + e) | 0;
  }
  return tohex(H0) + tohex(H1) + tohex(H2) + tohex(H3) + tohex(H4);
}

function makeSign(payload) {
  // payload 已含 key 与 t，例如 "id=1&key=...&t=123"
  var m = md5(payload);
  return sha1(m);
}

function nowT() {
  return String(Date.now());
}

function text(v) {
  return v == null ? "" : String(v).trim();
}

function signedHeaders(payload) {
  var t = nowT();
  var full = payload + (payload ? "&" : "") + "key=" + API_KEY + "&t=" + t;
  // 若 payload 已含 key/t 则直接用
  if (payload.indexOf("key=") >= 0 && payload.indexOf("&t=") >= 0) {
    full = payload;
    var tm = payload.match(/[?&]t=(\d+)/);
    if (tm) t = tm[1];
    else {
      var tm2 = payload.match(/(?:^|&)t=(\d+)/);
      if (tm2) t = tm2[1];
    }
  }
  var sign = makeSign(full);
  return {
    "User-Agent": UA,
    Referer: HOST + "/",
    t: t,
    sign: sign,
    Accept: "application/json,text/plain,*/*",
  };
}

async function apiGet(path, signPayload) {
  var url = HOST + path;
  var h = signedHeaders(signPayload);
  try {
    var res = await Widget.http.get(url, { headers: h });
    var data = res && res.data !== undefined ? res.data : res;
    if (typeof data === "string") {
      try {
        data = JSON.parse(data);
      } catch (e) {
        return null;
      }
    }
    return data;
  } catch (e) {
    console.error("[jinpai] apiGet 失败", path, e && e.message);
    return null;
  }
}

function mapVod(i) {
  if (!i) return null;
  var vid = text(i.vodId || i.vod_id || i.id);
  if (!vid) return null;
  var remarks =
    Number(i.typeId1) === 1
      ? text(i.vodVersion || i.vod_remarks || "")
      : text(i.vodRemarks || i.vod_remarks || i.vodVersion || "");
  return {
    id: NS + vid,
    type: "url",
    title: text(i.vodName || i.vod_name),
    coverUrl: text(i.vodPic || i.vod_pic),
    posterPath: text(i.vodPic || i.vod_pic),
    mediaType: "tv",
    link: NS + vid,
    genreTitle: remarks,
  };
}

/**
 * 从分类页 HTML 提取列表。
 * 站点把 JSON 双转义嵌进页面；简介里再含引号时整体 JSON.parse 会炸，
 * 因此按字段正则抽取（电影/剧/综/漫均适用）。
 */
function parseListFromHtml(html) {
  if (!html) return [];
  html = String(html);
  // 只取 list 段，缩小匹配范围
  var idx = html.indexOf('\\"list\\":');
  if (idx < 0) idx = html.indexOf('"list":');
  var chunk = idx >= 0 ? html.slice(idx, idx + 400000) : html;

  var items = [];
  var seen = {};
  // 以 vodId 为锚点，向后取一段内的名称/封面/备注
  var re = /\\"vodId\\":(\d+)/g;
  var m;
  while ((m = re.exec(chunk))) {
    var vid = m[1];
    if (seen[vid]) continue;
    seen[vid] = 1;
    var slice = chunk.slice(m.index, m.index + 2500);

    function field(name) {
      // 字符串值：\\"name\\":\\"....\\"
      var key = '\\"' + name + '\\":\\"';
      var i = slice.indexOf(key);
      if (i < 0) {
        var key2 = '\\"' + name + '\\":';
        var j = slice.indexOf(key2);
        if (j < 0) return "";
        var rest = slice.slice(j + key2.length);
        var mm2 = rest.match(/^(-?\d+|null)/);
        return mm2 ? mm2[1] : "";
      }
      i += key.length;
      var out = "";
      while (i < slice.length) {
        if (slice.charAt(i) === "\\" && slice.charAt(i + 1) === '"') {
          var nxt = slice.charAt(i + 2);
          if (nxt === "," || nxt === "}" || nxt === "]") break;
        }
        out += slice.charAt(i);
        i++;
      }
      return out
        .replace(/\\n/g, "\n")
        .replace(/\\\//g, "/")
        .replace(/\\"/g, '"')
        .replace(/\\\\/g, "\\");
    }

    var typeId1 = field("typeId1");
    var name = field("vodName");
    var pic = field("vodPic");
    var remarks = field("vodRemarks");
    var version = field("vodVersion");
    if (!name) continue;
    items.push(
      mapVod({
        vodId: vid,
        vodName: name,
        vodPic: pic,
        vodRemarks: remarks,
        vodVersion: version,
        typeId1: typeId1 === "null" ? 0 : Number(typeId1) || 0,
      })
    );
  }
  return items.filter(Boolean);
}

// ==================== 列表 ====================
async function loadList(params) {
  try {
    var page = Number(params.page || 1) || 1;
    var tid = text(params.tid || "1") || "1";
    var pageUrl = HOST + "/vod/show/id/" + tid + "/page/" + page;
    var res = await Widget.http.get(pageUrl, {
      headers: { "User-Agent": UA, Referer: HOST + "/" },
    });
    var html = res && res.data !== undefined ? res.data : res;
    html = typeof html === "string" ? html : JSON.stringify(html || "");
    return parseListFromHtml(html);
  } catch (error) {
    console.error("[jinpai] loadList 失败:", error.message || error);
    throw error;
  }
}

// ==================== 搜索 ====================
async function search(params) {
  try {
    var key = text(params.keyword || "");
    var page = Number(params.page || 1) || 1;
    if (!key) return [];
    var t = nowT();
    var payload =
      "keyword=" +
      key +
      "&pageNum=" +
      page +
      "&pageSize=12&key=" +
      API_KEY +
      "&t=" +
      t;
    var path =
      "/api/mw-movie/anonymous/video/searchByWord?keyword=" +
      encodeURIComponent(key) +
      "&pageNum=" +
      page +
      "&pageSize=12";
    var data = await apiGet(path, payload);
    var list =
      (data && data.data && data.data.result && data.data.result.list) || [];
    return list.map(mapVod).filter(Boolean);
  } catch (error) {
    console.error("[jinpai] search 失败:", error.message || error);
    throw error;
  }
}

// ==================== 详情 ====================
async function loadDetail(link) {
  try {
    var id = String(link || "");
    if (id.indexOf(NS) === 0) id = id.slice(NS.length);
    if (!id || id.indexOf("jpplay|") === 0) return null;

    var t = nowT();
    var payload = "id=" + id + "&key=" + API_KEY + "&t=" + t;
    var path = "/api/mw-movie/anonymous/video/detail?id=" + encodeURIComponent(id);
    var data = await apiGet(path, payload);
    var d = data && data.data;
    if (!d) return null;

    var episodeItems = [];
    var playList = d.episodeList || [];
    for (var i = 0; i < playList.length; i++) {
      var ep = playList[i];
      var nid = String(ep.nid);
      var token = "jpplay|" + id + "|" + nid;
      try {
        Widget.storage.set("jp:" + token, JSON.stringify({ id: id, nid: nid }));
      } catch (e) {}
      episodeItems.push({
        id: token,
        type: "url",
        title: text(ep.name) || "第" + (i + 1) + "集",
        mediaType: "tv",
        episode: i + 1,
        link: token,
      });
    }

    var detailId = NS + id;
    try {
      if (episodeItems[0]) {
        Widget.storage.set("jp:first:" + detailId, episodeItems[0].link);
      }
    } catch (e2) {}

    return {
      id: detailId,
      type: "url",
      title: text(d.vodName),
      coverUrl: text(d.vodPic),
      posterPath: text(d.vodPic),
      description: text(d.vodContent),
      releaseDate: text(d.vodYear),
      mediaType: "tv",
      link: detailId,
      genreTitle: text(d.vodRemarks || d.typeName),
      episodeItems: episodeItems,
    };
  } catch (error) {
    console.error("[jinpai] loadDetail 失败:", error.message || error);
    return null;
  }
}

// ==================== 播放 ====================
function resourceOf(url) {
  return {
    name: "金牌",
    description: /\.m3u8/i.test(url) ? "m3u8" : "直链",
    url: url,
    customHeaders: { "User-Agent": UA },
    headers: { "User-Agent": UA },
    playerType: "app",
  };
}

async function resolvePlay(id, nid) {
  var t = nowT();
  var payload = "id=" + id + "&nid=" + nid + "&key=" + API_KEY + "&t=" + t;
  var path =
    "/api/mw-movie/anonymous/v2/video/episode/url?id=" +
    encodeURIComponent(id) +
    "&nid=" +
    encodeURIComponent(nid);
  var data = await apiGet(path, payload);
  try {
    var url = data.data.list[0].url;
    if (url) return [resourceOf(url)];
  } catch (e) {}
  return [];
}

async function loadResource(params) {
  try {
    params = params || {};
    var candidates = [];
    if (params.link) candidates.push(String(params.link));
    if (params.id) candidates.push(String(params.id));
    if (params.videoUrl) candidates.push(String(params.videoUrl));

    // jpplay|id|nid
    for (var i = 0; i < candidates.length; i++) {
      var c = candidates[i];
      if (c.indexOf("jpplay|") === 0) {
        var parts = c.split("|");
        var vid = parts[1];
        var nid = parts[2];
        try {
          var cached = Widget.storage.get("jp:" + c);
          if (cached) {
            var o = typeof cached === "string" ? JSON.parse(cached) : cached;
            vid = o.id || vid;
            nid = o.nid || nid;
          }
        } catch (e) {}
        if (vid && nid) {
          var r = await resolvePlay(vid, nid);
          if (r.length) return r;
        }
      }
    }

    // 详情 id → 第一集
    for (var j = 0; j < candidates.length; j++) {
      var id = candidates[j];
      if (id.indexOf(NS) !== 0) continue;
      var first = "";
      try {
        first = Widget.storage.get("jp:first:" + id) || "";
      } catch (e2) {}
      if (first) {
        var r2 = await loadResource({ link: first });
        if (r2 && r2.length) return r2;
      }
      try {
        var detail = await loadDetail(id);
        if (detail && detail.episodeItems && detail.episodeItems[0]) {
          var r3 = await loadResource({ link: detail.episodeItems[0].link });
          if (r3 && r3.length) return r3;
        }
      } catch (e3) {}
    }

    console.error(
      "[jinpai] loadResource 无可用源",
      JSON.stringify({ link: params.link, id: params.id })
    );
    return [];
  } catch (error) {
    console.error("[jinpai] loadResource 失败:", error.message || error);
    return [];
  }
}
