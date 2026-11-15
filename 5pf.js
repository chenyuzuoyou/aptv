/**
 * 五平台聚合（腾讯视频 / 爱奇艺 / 优酷 / 芒果TV / 哔哩哔哩）
 * 由 TVBox Python 爬虫改写为 ForwardWidget / rex 模块
 *
 * 播放策略：
 *  - 哔哩哔哩：优先官方 playurl 直链，失败再走第三方解析
 *  - 腾讯 / 爱奇艺 / 优酷 / 芒果：先第三方解析拿直链，失败回退原播放页
 *  - 解析结果带短时缓存，避免重复请求
 */

WidgetMetadata = {
  id: "cn.fiveplatforms.aggregate",
  title: "五平台聚合",
  version: "1.0.6",
  requiredVersion: "0.0.1",
  description: "腾讯视频 / 爱奇艺 / 优酷 / 芒果TV / 哔哩哔哩 聚合列表、搜索与解析播放",
  author: "Forward",
  site: "https://github.com/InchStudio/ForwardWidgets",
  detailCacheDuration: 120,
  globalParams: [
    {
      name: "parse_api",
      title: "第三方解析接口",
      type: "input",
      value: "https://api.oxapi.cn/api/?key=cmVibpN3ufa3Q5Tpcd&url=",
      placeholders: [
        { title: "默认 oxapi", value: "https://api.oxapi.cn/api/?key=cmVibpN3ufa3Q5Tpcd&url=" },
      ],
    },
    {
      name: "bili_cookie",
      title: "B站 Cookie（可选，用于更高清）",
      type: "input",
      value: "",
      placeholders: [
        {
          title: "示例",
          value: "SESSDATA=xxx; bili_jct=xxx; DedeUserID=xxx",
        },
      ],
    },
  ],
  modules: [
    // ---------- 腾讯 ----------
    {
      id: "tx_movie",
      title: "腾讯·电影",
      functionName: "loadList",
      cacheDuration: 1800,
      params: [
        { name: "page", title: "页码", type: "page" },
        { name: "platform", title: "平台", type: "constant", value: "tx" },
        { name: "category", title: "分类", type: "constant", value: "movie" },
      ],
    },
    {
      id: "tx_tv",
      title: "腾讯·电视剧",
      functionName: "loadList",
      cacheDuration: 1800,
      params: [
        { name: "page", title: "页码", type: "page" },
        { name: "platform", title: "平台", type: "constant", value: "tx" },
        { name: "category", title: "分类", type: "constant", value: "tv" },
      ],
    },
    {
      id: "tx_variety",
      title: "腾讯·综艺",
      functionName: "loadList",
      cacheDuration: 1800,
      params: [
        { name: "page", title: "页码", type: "page" },
        { name: "platform", title: "平台", type: "constant", value: "tx" },
        { name: "category", title: "分类", type: "constant", value: "variety" },
      ],
    },
    {
      id: "tx_cartoon",
      title: "腾讯·动漫",
      functionName: "loadList",
      cacheDuration: 1800,
      params: [
        { name: "page", title: "页码", type: "page" },
        { name: "platform", title: "平台", type: "constant", value: "tx" },
        { name: "category", title: "分类", type: "constant", value: "cartoon" },
      ],
    },
    {
      id: "tx_doco",
      title: "腾讯·纪录片",
      functionName: "loadList",
      cacheDuration: 1800,
      params: [
        { name: "page", title: "页码", type: "page" },
        { name: "platform", title: "平台", type: "constant", value: "tx" },
        { name: "category", title: "分类", type: "constant", value: "doco" },
      ],
    },
    {
      id: "tx_mini",
      title: "腾讯·短剧",
      functionName: "loadList",
      cacheDuration: 1800,
      params: [
        { name: "page", title: "页码", type: "page" },
        { name: "platform", title: "平台", type: "constant", value: "tx" },
        { name: "category", title: "分类", type: "constant", value: "mini_series" },
      ],
    },
    // ---------- 爱奇艺 ----------
    {
      id: "iq_movie",
      title: "爱奇艺·电影",
      functionName: "loadList",
      cacheDuration: 1800,
      params: [
        { name: "page", title: "页码", type: "page" },
        { name: "platform", title: "平台", type: "constant", value: "iq" },
        { name: "category", title: "分类", type: "constant", value: "1" },
      ],
    },
    {
      id: "iq_tv",
      title: "爱奇艺·电视剧",
      functionName: "loadList",
      cacheDuration: 1800,
      params: [
        { name: "page", title: "页码", type: "page" },
        { name: "platform", title: "平台", type: "constant", value: "iq" },
        { name: "category", title: "分类", type: "constant", value: "2" },
      ],
    },
    {
      id: "iq_variety",
      title: "爱奇艺·综艺",
      functionName: "loadList",
      cacheDuration: 1800,
      params: [
        { name: "page", title: "页码", type: "page" },
        { name: "platform", title: "平台", type: "constant", value: "iq" },
        { name: "category", title: "分类", type: "constant", value: "6" },
      ],
    },
    {
      id: "iq_anime",
      title: "爱奇艺·动漫",
      functionName: "loadList",
      cacheDuration: 1800,
      params: [
        { name: "page", title: "页码", type: "page" },
        { name: "platform", title: "平台", type: "constant", value: "iq" },
        { name: "category", title: "分类", type: "constant", value: "4" },
      ],
    },
    {
      id: "iq_doc",
      title: "爱奇艺·纪录片",
      functionName: "loadList",
      cacheDuration: 1800,
      params: [
        { name: "page", title: "页码", type: "page" },
        { name: "platform", title: "平台", type: "constant", value: "iq" },
        { name: "category", title: "分类", type: "constant", value: "3" },
      ],
    },
    {
      id: "iq_net",
      title: "爱奇艺·网络电影",
      functionName: "loadList",
      cacheDuration: 1800,
      params: [
        { name: "page", title: "页码", type: "page" },
        { name: "platform", title: "平台", type: "constant", value: "iq" },
        { name: "category", title: "分类", type: "constant", value: "16" },
      ],
    },
    // ---------- 优酷 ----------
    {
      id: "yk_tv",
      title: "优酷·电视剧",
      functionName: "loadList",
      cacheDuration: 1800,
      params: [
        { name: "page", title: "页码", type: "page" },
        { name: "platform", title: "平台", type: "constant", value: "yk" },
        { name: "category", title: "分类", type: "constant", value: "电视剧" },
      ],
    },
    {
      id: "yk_movie",
      title: "优酷·电影",
      functionName: "loadList",
      cacheDuration: 1800,
      params: [
        { name: "page", title: "页码", type: "page" },
        { name: "platform", title: "平台", type: "constant", value: "yk" },
        { name: "category", title: "分类", type: "constant", value: "电影" },
      ],
    },
    {
      id: "yk_variety",
      title: "优酷·综艺",
      functionName: "loadList",
      cacheDuration: 1800,
      params: [
        { name: "page", title: "页码", type: "page" },
        { name: "platform", title: "平台", type: "constant", value: "yk" },
        { name: "category", title: "分类", type: "constant", value: "综艺" },
      ],
    },
    {
      id: "yk_anime",
      title: "优酷·动漫",
      functionName: "loadList",
      cacheDuration: 1800,
      params: [
        { name: "page", title: "页码", type: "page" },
        { name: "platform", title: "平台", type: "constant", value: "yk" },
        { name: "category", title: "分类", type: "constant", value: "动漫" },
      ],
    },
    {
      id: "yk_doc",
      title: "优酷·纪录片",
      functionName: "loadList",
      cacheDuration: 1800,
      params: [
        { name: "page", title: "页码", type: "page" },
        { name: "platform", title: "平台", type: "constant", value: "yk" },
        { name: "category", title: "分类", type: "constant", value: "纪录片" },
      ],
    },
    // ---------- 芒果 ----------
    {
      id: "mg_tv",
      title: "芒果·电视剧",
      functionName: "loadList",
      cacheDuration: 1800,
      params: [
        { name: "page", title: "页码", type: "page" },
        { name: "platform", title: "平台", type: "constant", value: "mg" },
        { name: "category", title: "分类", type: "constant", value: "2" },
      ],
    },
    {
      id: "mg_movie",
      title: "芒果·电影",
      functionName: "loadList",
      cacheDuration: 1800,
      params: [
        { name: "page", title: "页码", type: "page" },
        { name: "platform", title: "平台", type: "constant", value: "mg" },
        { name: "category", title: "分类", type: "constant", value: "3" },
      ],
    },
    {
      id: "mg_variety",
      title: "芒果·综艺",
      functionName: "loadList",
      cacheDuration: 1800,
      params: [
        { name: "page", title: "页码", type: "page" },
        { name: "platform", title: "平台", type: "constant", value: "mg" },
        { name: "category", title: "分类", type: "constant", value: "1" },
      ],
    },
    {
      id: "mg_anime",
      title: "芒果·动漫",
      functionName: "loadList",
      cacheDuration: 1800,
      params: [
        { name: "page", title: "页码", type: "page" },
        { name: "platform", title: "平台", type: "constant", value: "mg" },
        { name: "category", title: "分类", type: "constant", value: "50" },
      ],
    },
    {
      id: "mg_doc",
      title: "芒果·纪录片",
      functionName: "loadList",
      cacheDuration: 1800,
      params: [
        { name: "page", title: "页码", type: "page" },
        { name: "platform", title: "平台", type: "constant", value: "mg" },
        { name: "category", title: "分类", type: "constant", value: "51" },
      ],
    },
    // ---------- B站 ----------
    {
      id: "bl_bangumi",
      title: "B站·番剧",
      functionName: "loadList",
      cacheDuration: 1800,
      params: [
        { name: "page", title: "页码", type: "page" },
        { name: "platform", title: "平台", type: "constant", value: "bl" },
        { name: "category", title: "分类", type: "constant", value: "1" },
      ],
    },
    {
      id: "bl_guochuang",
      title: "B站·国创",
      functionName: "loadList",
      cacheDuration: 1800,
      params: [
        { name: "page", title: "页码", type: "page" },
        { name: "platform", title: "平台", type: "constant", value: "bl" },
        { name: "category", title: "分类", type: "constant", value: "4" },
      ],
    },
    {
      id: "bl_movie",
      title: "B站·电影",
      functionName: "loadList",
      cacheDuration: 1800,
      params: [
        { name: "page", title: "页码", type: "page" },
        { name: "platform", title: "平台", type: "constant", value: "bl" },
        { name: "category", title: "分类", type: "constant", value: "2" },
      ],
    },
    {
      id: "bl_tv",
      title: "B站·电视剧",
      functionName: "loadList",
      cacheDuration: 1800,
      params: [
        { name: "page", title: "页码", type: "page" },
        { name: "platform", title: "平台", type: "constant", value: "bl" },
        { name: "category", title: "分类", type: "constant", value: "5" },
      ],
    },
    {
      id: "bl_doc",
      title: "B站·纪录片",
      functionName: "loadList",
      cacheDuration: 1800,
      params: [
        { name: "page", title: "页码", type: "page" },
        { name: "platform", title: "平台", type: "constant", value: "bl" },
        { name: "category", title: "分类", type: "constant", value: "3" },
      ],
    },
    {
      id: "bl_variety",
      title: "B站·综艺",
      functionName: "loadList",
      cacheDuration: 1800,
      params: [
        { name: "page", title: "页码", type: "page" },
        { name: "platform", title: "平台", type: "constant", value: "bl" },
        { name: "category", title: "分类", type: "constant", value: "7" },
      ],
    },
    // 播放资源
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
var UA_PC =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";
var UA_MB =
  "Mozilla/5.0 (Linux; Android 12; Pixel 6 Build/SQ3A.220705.004; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/106.0.5249.126 Mobile Safari/537.36";

var HDR_REF = {
  tx: "https://v.qq.com/",
  iq: "https://www.iqiyi.com/",
  yk: "https://www.youku.com/",
  mg: "https://www.mgtv.com/",
  bl: "https://www.bilibili.com/",
};

var TX_CHANNEL = {
  movie: "100173",
  tv: "100113",
  mini_series: "120188",
  variety: "100109",
  cartoon: "100119",
  child: "100150",
  doco: "100105",
};

var BL_CATE = {
  "1": "番剧",
  "4": "国创",
  "2": "电影",
  "5": "电视剧",
  "3": "纪录片",
  "7": "综艺",
};

var PARSE_TTL = 900;
var PARSE_CACHE_MAX = 200;
var _parseCache = {};

// ==================== 工具 ====================
function cleanText(s) {
  if (!s) return "";
  return String(s).replace(/<\/?em[^>]*>/gi, "").trim();
}

function ensureHttp(url) {
  if (!url) return "";
  if (url.indexOf("//") === 0) return "https:" + url;
  return url;
}

function guessFormat(url) {
  var u = (url || "").toLowerCase();
  if (u.indexOf(".m3u8") >= 0) return "m3u8";
  if (u.indexOf(".mp4") >= 0) return "mp4";
  if (u.indexOf(".flv") >= 0) return "flv";
  return "";
}

function mkItem(opts) {
  var item = {
    id: opts.id,
    type: "url",
    title: opts.title || "",
    coverUrl: opts.cover || "",
    posterPath: opts.cover || "",
    description: opts.description || "",
    mediaType: opts.mediaType || "tv",
    link: opts.link || opts.id,
  };
  if (opts.remarks) item.genreTitle = opts.remarks;
  if (opts.year) item.releaseDate = String(opts.year);
  if (opts.rating != null) item.rating = opts.rating;
  // 电影也走分集/loadResource 路径，避免客户端 movie 单片逻辑拿不到源
  if (item.mediaType === "movie") item.mediaType = "tv";
  return item;
}

function getParseApi(params) {
  var api =
    (params && params.parse_api) ||
    "https://api.oxapi.cn/api/?key=cmVibpN3ufa3Q5Tpcd&url=";
  return String(api);
}

function cacheGet(key) {
  var it = _parseCache[key];
  if (it && it[0] > Date.now() / 1000) return it[1];
  if (it) delete _parseCache[key];
  return null;
}

function cacheSet(key, val, ttl) {
  var keys = Object.keys(_parseCache);
  if (keys.length >= PARSE_CACHE_MAX) {
    var now = Date.now() / 1000;
    var next = {};
    for (var i = 0; i < keys.length; i++) {
      var k = keys[i];
      if (_parseCache[k][0] > now) next[k] = _parseCache[k];
    }
    _parseCache = next;
    keys = Object.keys(_parseCache);
    if (keys.length >= PARSE_CACHE_MAX) {
      keys.sort(function (a, b) {
        return _parseCache[a][0] - _parseCache[b][0];
      });
      for (var j = 0; j < Math.min(50, keys.length); j++) {
        delete _parseCache[keys[j]];
      }
    }
  }
  _parseCache[key] = [Date.now() / 1000 + ttl, val];
}

function extractDirectUrl(txt) {
  if (!txt) return { url: "", fmt: "" };

  // 已是对象（Widget.http 可能已解析 JSON）
  if (typeof txt === "object" && txt !== null) {
    try {
      txt = JSON.stringify(txt);
    } catch (e) {
      txt = String(txt);
    }
  }
  txt = String(txt).trim();
  if (!txt) return { url: "", fmt: "" };

  // JSONP
  if (/^\w+\(/.test(txt)) {
    var m = txt.match(/\((\{[\s\S]*\}|\[[\s\S]*\])\)\s*;?\s*$/);
    if (m) txt = m[1];
  }

  var j = null;
  try {
    var idx = txt.indexOf("{");
    if (idx >= 0) j = JSON.parse(txt.slice(idx).replace(/;\s*$/, ""));
  } catch (e) {
    j = null;
  }
  if (!j) {
    try {
      j = JSON.parse(txt);
    } catch (e2) {
      j = null;
    }
  }

  if (j && typeof j === "object") {
    var paths = [
      ["url"],
      ["data"],
      ["data", "url"],
      ["data", "playUrl"],
      ["data", "play_url"],
      ["data", "video"],
      ["data", "videoUrl"],
      ["data", "src"],
      ["play_url"],
      ["playUrl"],
      ["videoUrl"],
      ["video"],
      ["src"],
      ["result"],
      ["result", "url"],
      ["result", "playUrl"],
      ["result", "data"],
      ["result", "data", "url"],
    ];
    for (var p = 0; p < paths.length; p++) {
      var cur = j;
      var ok = true;
      for (var q = 0; q < paths[p].length; q++) {
        if (cur && typeof cur === "object" && paths[p][q] in cur) {
          cur = cur[paths[p][q]];
        } else {
          ok = false;
          break;
        }
      }
      if (ok && typeof cur === "string" && /^https?:\/\//i.test(cur)) {
        return { url: cur, fmt: guessFormat(cur) };
      }
    }
    // 深度搜第一个 m3u8/mp4/http 媒体链
    try {
      var blob = JSON.stringify(j);
      var mMedia = blob.match(/https?:\\\/\\\/[^"\\]+?\.(?:m3u8|mp4|flv)[^"\\]*/i);
      if (mMedia) {
        var u = mMedia[0].replace(/\\\//g, "/").replace(/\\u0026/g, "&");
        return { url: u, fmt: guessFormat(u) };
      }
      var mHttp = blob.match(/https?:\\\/\\\/[^"\\]{20,}/i);
      if (mHttp) {
        var u2 = mHttp[0].replace(/\\\//g, "/").replace(/\\u0026/g, "&");
        if (/\.(m3u8|mp4|flv)(\?|$)/i.test(u2) || /\/(m3u8|mp4|flv)\b/i.test(u2)) {
          return { url: u2, fmt: guessFormat(u2) };
        }
      }
    } catch (e3) {}
  }

  if (/^https?:\/\/\S+$/i.test(txt)) {
    return { url: txt, fmt: guessFormat(txt) };
  }

  var m2 = txt.match(/https?:\/\/[^\s"'<>]+?\.(?:m3u8|mp4|flv)(?:\?[^\s"'<>]*)?/i);
  if (m2) return { url: m2[0], fmt: guessFormat(m2[0]) };
  return { url: "", fmt: "" };
}

async function parseVideo(pageUrl, params) {
  if (!pageUrl || String(pageUrl).indexOf("http") !== 0) return { url: "", fmt: "" };
  pageUrl = String(pageUrl);
  var key = "parse|" + pageUrl;
  var cached = cacheGet(key);
  if (cached && cached.url) return cached;

  var apiBase = getParseApi(params);
  var api = apiBase + encodeURIComponent(pageUrl);
  var out = { url: "", fmt: "" };
  try {
    var res = await Widget.http.get(api, {
      headers: {
        "User-Agent": UA_PC,
        Accept: "application/json,text/plain,*/*",
        Referer: "https://v.qq.com/",
      },
    });
    // 兼容 data 已是对象 / 字符串 / 嵌套
    var raw = res && res.data !== undefined ? res.data : res;
    if (raw && typeof raw === "object") {
      out = extractDirectUrl(raw);
      if (!out.url) out = extractDirectUrl(JSON.stringify(raw));
    } else {
      out = extractDirectUrl(raw);
    }
  } catch (e) {
    console.error("[five-platforms] parseVideo 请求失败", e && e.message ? e.message : e);
    out = { url: "", fmt: "" };
  }
  if (out.url) cacheSet(key, out, PARSE_TTL);
  return out;
}

function ownedLink(raw) {
  // 本站命名空间：five|<platform>|<id>  或  five|play|<...>
  if (!raw) return null;
  var s = String(raw);
  if (s.indexOf("five|") === 0) return s;
  // 兼容直接传入的平台 id（仅在本模块上下文）
  if (/^(tx|iq|yk|mg|bl)\|/.test(s)) return "five|" + s;
  return null;
}

/** 详情生成后缓存分集播放令牌，避免点「播放」时二次拉详情失败 */
function savePlayLinks(detailId, episodeItems) {
  try {
    if (!detailId || !episodeItems || !episodeItems.length) return;
    var links = [];
    for (var i = 0; i < episodeItems.length; i++) {
      var ep = episodeItems[i];
      if (ep && ep.link) {
        links.push(String(ep.link));
        // 若 link 对应 storage 有 page，则把第一集页记到详情
        if (i === 0) {
          var pu = readPageUrl(ep.link);
          if (pu) saveDetailPage(detailId, pu);
        }
      }
    }
    if (!links.length) return;
    Widget.storage.set("playlinks:" + detailId, JSON.stringify(links));
  } catch (e) {}
}

function loadPlayLinks(detailId) {
  try {
    var raw = Widget.storage.get("playlinks:" + detailId);
    if (!raw) return [];
    var arr = typeof raw === "string" ? JSON.parse(raw) : raw;
    return Array.isArray(arr) ? arr : [];
  } catch (e) {
    return [];
  }
}

/** 给分集补上 episode 序号，方便客户端按集匹配 */

/** 各平台电影/剧集的默认可打开播放页（详情无分集时兜底） */
function defaultPageUrl(pf, id) {
  id = String(id || "");
  if (!id) return "";
  if (pf === "tx") return "https://v.qq.com/x/cover/" + id + ".html";
  if (pf === "iq") {
    // albumId 常见为数字；优先专辑页
    if (/^\d+$/.test(id)) return "https://www.iqiyi.com/a_" + id + ".html";
    return "https://www.iqiyi.com/v_" + id + ".html";
  }
  if (pf === "yk") return "https://v.youku.com/v_show/id_" + id + ".html";
  if (pf === "mg") return "https://www.mgtv.com/b/" + id + ".html";
  if (pf === "bl") return "https://www.bilibili.com/bangumi/play/ss" + id;
  return "";
}

function savePageUrl(token, pageUrl) {
  try {
    if (token && pageUrl) Widget.storage.set("purl:" + token, String(pageUrl));
  } catch (e) {}
}

function readPageUrl(token) {
  try {
    return Widget.storage.get("purl:" + token) || "";
  } catch (e) {
    return "";
  }
}

function saveDetailPage(detailId, pageUrl) {
  try {
    if (detailId && pageUrl) Widget.storage.set("page:" + detailId, String(pageUrl));
  } catch (e) {}
}

function readDetailPage(detailId) {
  try {
    return Widget.storage.get("page:" + detailId) || "";
  } catch (e) {
    return "";
  }
}

function makePlayEpisode(pf, pageUrl, title, mediaType) {
  pageUrl = String(pageUrl || "");
  // 短令牌，避免超长 encode URL 被客户端截断；真实地址放 storage
  var short =
    "five|play|" +
    pf +
    "|" +
    String(Math.abs(hashCode(pageUrl)) % 1e9) +
    "|" +
    String(pageUrl.length);
  savePageUrl(short, pageUrl);
  // 同时存一份用完整 encode 的兼容令牌
  var longToken = "five|play|" + pf + "|" + encodeURIComponent(pageUrl);
  savePageUrl(longToken, pageUrl);
  return {
    id: short,
    type: "url",
    title: title || "正片",
    mediaType: mediaType || "movie",
    episode: 1,
    link: short,
  };
}

function hashCode(str) {
  var h = 0;
  str = String(str || "");
  for (var i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return h;
}

function withEpisodeIndex(episodeItems) {
  if (!episodeItems || !episodeItems.length) return episodeItems || [];
  for (var i = 0; i < episodeItems.length; i++) {
    var ep = episodeItems[i];
    if (!ep) continue;
    if (ep.episode == null) ep.episode = i + 1;
    // 兼容旧的 encode 令牌：把 decode 后的播放页写入 storage
    if (ep.link && String(ep.link).indexOf("five|play|") === 0) {
      var parts = String(ep.link).split("|");
      if (parts.length >= 4 && parts[2] !== "bl") {
        var maybe = "";
        try {
          maybe = decodeURIComponent(parts[3]);
        } catch (e) {
          maybe = parts[3];
        }
        if (maybe && maybe.indexOf("http") === 0) {
          savePageUrl(ep.link, maybe);
        }
      }
    }
  }
  return episodeItems;
}


// ==================== 腾讯 ====================
async function txCate(ch, pg) {
  var chid = TX_CHANNEL[ch] || "100173";
  var body = JSON.stringify({
    page_params: {
      page_type: "operation",
      page_id: "channel_list",
      channel_id: chid,
      filter_params: "sort=75",
    },
  });
  var res = await Widget.http.post(
    "https://pbaccess.video.qq.com/trpc.multi_vector_layout.mvl_controller.MVLPageHTTPService/getMVLPage?&vversion_platform=2",
    body,
    {
      headers: {
        "Content-Type": "application/json",
        Origin: "https://v.qq.com",
        Referer: "https://v.qq.com/",
        "User-Agent": UA_PC,
      },
    }
  );
  var j = res.data || {};
  if (j.ret != null && j.ret !== 0) return [];
  var cards =
    (((j.data || {}).modules || {}).normal || {}).cards || [];
  var out = [];
  for (var i = 0; i < cards.length; i++) {
    var cl = ((cards[i].children_list || {}).poster_card) || {};
    var sub = cl.cards || [];
    for (var k = 0; k < sub.length; k++) {
      var p = sub[k].params || {};
      var cid = p.cid || "";
      var title = cleanText(p.title);
      if (!cid || !title) continue;
      var img = ensureHttp(p.new_pic_hz || p.new_pic_vt || "");
      if (img && img.slice(-1) === "/") img += "0";
      out.push(
        mkItem({
          id: "five|tx|" + cid,
          title: title,
          cover: img,
          remarks: p.episode_updated || p.marklabel_0_prime_text || "",
          mediaType: ch === "movie" || ch === "doco" ? "movie" : "tv",
          link: "five|tx|" + cid,
        })
      );
    }
  }
  return out;
}

async function txSearch(key, pg) {
  var body = JSON.stringify({
    version: "25042201",
    clientType: 1,
    filterValue: "",
    uuid: "B1E50847-D25F-4C4B-BBA0-36F0093487F6",
    retry: 0,
    query: key,
    pagenum: (pg || 1) - 1,
    isPrefetch: true,
    pagesize: 30,
    queryFrom: 0,
    searchDatakey: "",
    transInfo: "",
    isneedQc: true,
    preQid: "",
    adClientInfo: "",
    extraInfo: {
      isNewMarkLabel: "1",
      multi_terminal_pc: "1",
      themeType: "1",
      sugRelatedIds: "{}",
      appVersion: "",
    },
  });
  var res = await Widget.http.post(
    "https://pbaccess.video.qq.com/trpc.videosearch.mobile_search.MultiTerminalSearch/MbSearch?vplatform=2",
    body,
    {
      headers: {
        "Content-Type": "application/json",
        Origin: "https://v.qq.com",
        Referer: "https://v.qq.com/",
        "User-Agent": UA_PC,
      },
    }
  );
  var j = res.data || {};
  var items = (((j.data || {}).normalList || {}).itemList) || [];
  var bad = [
    "预告", "花絮", "片花", "特辑", "幕后", "采访", "制作", "MV", "主题曲",
    "插曲", "彩蛋", "精彩", "集锦", "盘点", "回顾", "解说", "评测",
  ];
  var out = [];
  var seen = {};
  for (var i = 0; i < items.length; i++) {
    var it = items[i];
    var vi = it.videoInfo || {};
    var title = cleanText(vi.title);
    if (!title || !vi) continue;
    var skip = false;
    for (var b = 0; b < bad.length; b++) {
      if (title.indexOf(bad[b]) >= 0) {
        skip = true;
        break;
      }
    }
    if (skip) continue;
    var cid = ((it.doc || {}).id) || "";
    if (!cid || seen[cid]) continue;
    seen[cid] = true;
    var img = ensureHttp(vi.imgUrl || "");
    out.push(
      mkItem({
        id: "five|tx|" + cid,
        title: title,
        cover: img,
        remarks: vi.secondLine || "",
        year: vi.year || "",
        mediaType: "tv",
        link: "five|tx|" + cid,
      })
    );
  }
  return out;
}

async function txDetail(cid) {
  var res = await Widget.http.get(
    "https://node.video.qq.com/x/api/float_vinfo2?cid=" + cid,
    { headers: { Referer: "https://v.qq.com/", "User-Agent": UA_PC } }
  );
  var j = res.data || {};
  var c = j.c || {};
  var title = cleanText(c.title) || cid;
  var pic = ensureHttp(c.pic || "");
  var nam = Array.isArray(c.nam) ? c.nam.filter(Boolean).join(",") : "";
  var typ = Array.isArray(c.type) ? c.type.filter(Boolean).join(",") : "";
  var vids = c.video_ids || [];
  var episodeItems = [];

  if (vids.length) {
    for (var i = 0; i < vids.length; i += 30) {
      var batch = vids.slice(i, i + 30);
      var u =
        "https://union.video.qq.com/fcgi-bin/data?otype=json&tid=1804&appid=20001238" +
        "&appkey=6c03bbe9658448a4&union_platform=1&idlist=" +
        batch.join(",");
      var res2 = await Widget.http.get(u, {
        headers: { Referer: "https://v.qq.com/", "User-Agent": UA_PC },
      });
      var j2 = res2.data || {};
      // 可能是 JSONP
      if (typeof j2 === "string") {
        try {
          var m = j2.match(/\{[\s\S]*\}/);
          if (m) j2 = JSON.parse(m[0]);
        } catch (e) {
          j2 = {};
        }
      }
      var results = j2.results || [];
      for (var r = 0; r < results.length; r++) {
        var f = (results[r].fields) || {};
        var vid = f.vid;
        if (!vid) continue;
        var epTitle =
          cleanText(f.title) ||
          "第" + (f.video_checkup_time || "") + "集";
        var playUrl =
          "https://v.qq.com/x/cover/" + cid + "/" + vid + ".html";
        episodeItems.push({
          id: "five|play|tx|" + encodeURIComponent(playUrl),
          type: "url",
          title: epTitle,
          mediaType: "tv",
          link: "five|play|tx|" + encodeURIComponent(playUrl),
        });
      }
    }
  }
  if (!episodeItems.length && vids.length) {
    for (var v = 0; v < vids.length; v++) {
      var pu = "https://v.qq.com/x/cover/" + cid + "/" + vids[v] + ".html";
      episodeItems.push({
        id: "five|play|tx|" + encodeURIComponent(pu),
        type: "url",
        title: "正片",
        mediaType: "movie",
        link: "five|play|tx|" + encodeURIComponent(pu),
      });
    }
  }

  if (!episodeItems.length) {
    var _page = defaultPageUrl("tx", cid);
    if (_page) episodeItems.push(makePlayEpisode("tx", _page, "正片"));
  }
  episodeItems = withEpisodeIndex(episodeItems);
  savePlayLinks("five|tx|" + cid, episodeItems);
  return {
    id: "five|tx|" + cid,
    type: "url",
    title: title,
    coverUrl: pic,
    posterPath: pic,
    description: c.description || "",
    releaseDate: c.year || "",
    mediaType: episodeItems.length > 1 ? "tv" : "movie",
    link: "five|tx|" + cid,
    genreTitle: typ || "腾讯视频",
    peoples: nam
      ? nam.split(",").map(function (n, idx) {
          return { id: "tx-actor-" + idx, title: n, role: "主演" };
        })
      : [],
    episodeItems: episodeItems,
  };
}

// ==================== 爱奇艺 ====================
async function iqCate(cid, pg) {
  var u;
  if (String(cid) === "16") {
    u =
      "https://pcw-api.iqiyi.com/search/recommend/list?channel_id=1&data_type=1" +
      "&page_id=" +
      (pg || 1) +
      "&ret_num=48&three_category_id=27401";
  } else if (String(cid) === "5") {
    u =
      "https://pcw-api.iqiyi.com/search/recommend/list?channel_id=5&data_type=2" +
      "&page_id=" +
      (pg || 1) +
      "&ret_num=48";
  } else {
    u =
      "https://pcw-api.iqiyi.com/search/recommend/list?channel_id=" +
      cid +
      "&data_type=1&page_id=" +
      (pg || 1) +
      "&ret_num=48";
  }
  var res = await Widget.http.get(u, {
    headers: { Referer: "https://www.iqiyi.com/", "User-Agent": UA_PC },
  });
  var j = res.data || {};
  var lst = ((j.data || {}).list) || [];
  var out = [];
  for (var i = 0; i < lst.length; i++) {
    var it = lst[i];
    var aid = it.albumId;
    if (!aid) continue;
    var rem = "";
    if (it.channelId === 2 || it.channelId === 4) {
      rem =
        it.latestOrder && it.videoCount && String(it.latestOrder) === String(it.videoCount)
          ? it.latestOrder + "集全"
          : "更新至 " + (it.latestOrder || "") + "集";
    } else if (it.period) rem = it.period;
    else if (it.focus) rem = it.focus;
    if (it.score) rem = it.score + "分\t" + rem;
    out.push(
      mkItem({
        id: "five|iq|" + aid,
        title: cleanText(it.name),
        cover: it.imageUrl || "",
        remarks: rem,
        year: (it.period || "").slice(0, 4),
        description: it.description || "",
        mediaType: String(cid) === "1" || String(cid) === "16" ? "movie" : "tv",
        link: "five|iq|" + aid,
      })
    );
  }
  return out;
}

async function iqSearch(key, pg) {
  var u =
    "https://search.video.iqiyi.com/o?if=html5&key=" +
    encodeURIComponent(key) +
    "&pageNum=" +
    (pg || 1) +
    "&pos=1&pageSize=24&site=iqiyi";
  var res = await Widget.http.get(u, {
    headers: { Referer: "https://www.iqiyi.com/", "User-Agent": UA_PC },
  });
  var j = res.data || {};
  var docs = ((j.data || {}).docinfos) || [];
  var out = [];
  for (var i = 0; i < docs.length; i++) {
    var a = docs[i].albumDocInfo;
    if (!a || !a.albumId) continue;
    var img = ensureHttp(a.albumVImage || a.albumHImage || "");
    var ch = (a.channel || "").split(",")[0];
    out.push(
      mkItem({
        id: "five|iq|" + a.albumId,
        title: cleanText(a.albumTitle),
        cover: img,
        remarks: ch,
        mediaType: "tv",
        link: "five|iq|" + a.albumId,
      })
    );
  }
  return out;
}

async function iqDetail(aid) {
  var u =
    "https://pcw-api.iqiyi.com/video/video/videoinfowithuser/" +
    aid +
    "?agent_type=1&authcookie=&subkey=" +
    aid +
    "&subscribe=1";
  var res = await Widget.http.get(u, {
    headers: { Referer: "https://www.iqiyi.com/", "User-Agent": UA_PC },
  });
  var d = (res.data || {}).data || {};
  if (!d) return null;
  var cats = Array.isArray(d.categories) ? d.categories : [];
  var ppl = d.people && typeof d.people === "object" ? d.people : {};
  var mc = Array.isArray(ppl.main_charactor) ? ppl.main_charactor : [];
  var actors = mc
    .map(function (x) {
      return x && x.name ? x.name : "";
    })
    .filter(Boolean)
    .join(",");
  var img = ensureHttp(d.imageUrl || "");
  var rem = "";
  if (d.latestOrder) {
    rem =
      "更新至 第" +
      d.latestOrder +
      "集(期)/共" +
      (d.videoCount || "") +
      "集(期)";
  } else if (d.period) rem = d.period;
  if (d.score) rem = "评分：" + d.score + " " + rem;

  var episodeItems = [];
  if ((d.channelId === 1 || d.channelId === 5) && d.playUrl) {
    episodeItems.push({
      id: "five|play|iq|" + encodeURIComponent(d.playUrl),
      type: "url",
      title: "正片",
      mediaType: "movie",
      link: "five|play|iq|" + encodeURIComponent(d.playUrl),
    });
  } else {
    var page = 1;
    while (page <= 20) {
      var u2 =
        "https://pcw-api.iqiyi.com/albums/album/avlistinfo?aid=" +
        aid +
        "&size=200&page=" +
        page;
      var res2 = await Widget.http.get(u2, {
        headers: { Referer: "https://www.iqiyi.com/", "User-Agent": UA_PC },
      });
      var d2 = (res2.data || {}).data || {};
      var el = d2.epsodelist || [];
      for (var e = 0; e < el.length; e++) {
        var pu = el[e].playUrl || "";
        if (!pu) continue;
        var et =
          cleanText(el[e].name) ||
          "第" + (el[e].order || "") + "集";
        episodeItems.push({
          id: "five|play|iq|" + encodeURIComponent(pu),
          type: "url",
          title: et,
          mediaType: "tv",
          link: "five|play|iq|" + encodeURIComponent(pu),
        });
      }
      var total = d2.total || 0;
      if (el.length < 200 || page * 200 >= total) break;
      page++;
    }
  }

  if (!episodeItems.length) {
    var _page = defaultPageUrl("iq", aid);
    if (_page) episodeItems.push(makePlayEpisode("iq", _page, "正片"));
  }
  episodeItems = withEpisodeIndex(episodeItems);
  savePlayLinks("five|iq|" + aid, episodeItems);
  return {
    id: "five|iq|" + aid,
    type: "url",
    title: cleanText(d.name),
    coverUrl: img,
    posterPath: img,
    description: d.description || "",
    releaseDate: (d.period || "").slice(0, 4),
    mediaType: episodeItems.length > 1 ? "tv" : "movie",
    link: "five|iq|" + aid,
    genreTitle:
      cats
        .map(function (c) {
          return c && c.name ? c.name : "";
        })
        .filter(Boolean)
        .join(",") || "爱奇艺",
    peoples: actors
      ? actors.split(",").map(function (n, idx) {
          return { id: "iq-actor-" + idx, title: n, role: "主演" };
        })
      : [],
    episodeItems: episodeItems,
  };
}

// ==================== 优酷 ====================
async function ykCate(name, pg) {
  var params = encodeURIComponent(JSON.stringify({ type: name }));
  var u =
    "https://www.youku.com/category/data?optionRefresh=1&pageNo=" +
    (pg || 1) +
    "&params=" +
    params;
  var res = await Widget.http.get(u, {
    headers: {
      Referer: "https://www.youku.com/",
      Accept: "application/json",
      "User-Agent": UA_PC,
    },
  });
  var j = res.data || {};
  var fd = ((j.data || {}).filterData) || {};
  var lst = fd.listData || [];
  var out = [];
  for (var i = 0; i < lst.length; i++) {
    var it = lst[i];
    var link = it.videoLink || "";
    var m = link.match(/id_([\w=]+)\.html/);
    var vid = m ? m[1] : "";
    if (!vid) continue;
    out.push(
      mkItem({
        id: "five|yk|" + vid,
        title: cleanText(it.title),
        cover: it.img || "",
        remarks: it.subTitle || "",
        description: it.summary || "",
        mediaType: name === "电影" || name === "纪录片" ? "movie" : "tv",
        link: "five|yk|" + vid,
      })
    );
  }
  return out;
}

async function ykSearch(key, pg) {
  var u =
    "https://search.youku.com/api/search?pg=" +
    (pg || 1) +
    "&keyword=" +
    encodeURIComponent(key);
  var res = await Widget.http.get(u, {
    headers: { Referer: "https://www.youku.com/", "User-Agent": UA_PC },
  });
  var j = res.data || {};
  var out = [];
  var list = j.pageComponentList || [];
  for (var i = 0; i < list.length; i++) {
    var cd = list[i].commonData;
    if (!cd) continue;
    var sid = cd.showId;
    if (!sid) continue;
    var td = cd.titleDTO || {};
    var pd = cd.posterDTO || {};
    var feature = cd.feature || "";
    var parts = feature
      .split("·")
      .map(function (x) {
        return x.trim();
      })
      .filter(Boolean);
    var year = parts[0] && /^\d+$/.test(parts[0]) ? parts[0] : "";
    out.push(
      mkItem({
        id: "five|yk|" + sid,
        title: cleanText(td.displayName),
        cover: pd.vThumbUrl || "",
        remarks: feature,
        year: year,
        mediaType: "tv",
        link: "five|yk|" + sid,
      })
    );
  }
  return out;
}

async function ykDetail(sid) {
  var u =
    "https://search.youku.com/api/search?appScene=show_episode&showIds=" + sid;
  var res = await Widget.http.get(u, {
    headers: { Referer: "https://www.youku.com/", "User-Agent": UA_PC },
  });
  var j = res.data || {};
  var sl = j.serisesList || j.seriesList || [];
  var src = j.sourceName || "优酷";
  var episodeItems = [];
  var title = sid;
  for (var i = 0; i < sl.length; i++) {
    var it = sl[i];
    var vid = it.videoId;
    if (!vid) continue;
    var et =
      cleanText(it.title) || it.displayName || "第" + (i + 1) + "集";
    if (i === 0) {
      title = (cleanText(it.title) || "").replace(/\d+/g, "") || src;
    }
    var playUrl = "https://v.youku.com/v_show/id_" + vid + ".html";
    episodeItems.push({
      id: "five|play|yk|" + encodeURIComponent(playUrl),
      type: "url",
      title: et,
      mediaType: "tv",
      link: "five|play|yk|" + encodeURIComponent(playUrl),
    });
  }
  if (!episodeItems.length) {
    var _page = defaultPageUrl("yk", sid);
    if (_page) episodeItems.push(makePlayEpisode("yk", _page, "正片"));
  }
  episodeItems = withEpisodeIndex(episodeItems);
  savePlayLinks("five|yk|" + sid, episodeItems);
  return {
    id: "five|yk|" + sid,
    type: "url",
    title: title,
    coverUrl: "",
    posterPath: "",
    mediaType: episodeItems.length > 1 ? "tv" : "movie",
    link: "five|yk|" + sid,
    genreTitle: src,
    episodeItems: episodeItems,
  };
}

// ==================== 芒果TV ====================
async function mgCate(ch, pg) {
  var u =
    "https://pianku.api.mgtv.com/rider/list/pcweb/v3?platform=pcweb&channelId=" +
    ch +
    "&pn=" +
    (pg || 1) +
    "&pc=30&hudong=1&_support=10000000&kind=a1&area=a1";
  var res = await Widget.http.get(u, {
    headers: { Referer: "https://www.mgtv.com/", "User-Agent": UA_PC },
  });
  var j = res.data || {};
  var hd = ((j.data || {}).hitDocs) || [];
  var out = [];
  for (var i = 0; i < hd.length; i++) {
    var it = hd[i];
    var vid = it.playPartId;
    if (!vid) continue;
    var rem = it.updateInfo || "";
    var rc = it.rightCorner;
    if (rc && typeof rc === "object" && rc.text) {
      rem = (rc.text + " " + rem).trim();
    }
    out.push(
      mkItem({
        id: "five|mg|" + vid,
        title: cleanText(it.title),
        cover: it.img || "",
        remarks: rem,
        year: it.year || "",
        description: it.story || "",
        mediaType: String(ch) === "3" ? "movie" : "tv",
        link: "five|mg|" + vid,
      })
    );
  }
  return out;
}

async function mgSearch(key, pg) {
  var urls = [
    "https://mobileso.bz.mgtv.com/msite/search/v2?q=" +
      encodeURIComponent(key) +
      "&pn=" +
      (pg || 1) +
      "&pc=10",
    "https://mobileso.bz.mgtv.com/pc/search/v1?q=" +
      encodeURIComponent(key) +
      "&pn=" +
      (pg || 1) +
      "&pc=10",
  ];
  var d = {};
  for (var i = 0; i < urls.length; i++) {
    var res = await Widget.http.get(urls[i], {
      headers: { Referer: "https://www.mgtv.com/", "User-Agent": UA_MB },
    });
    d = (res.data || {}).data || {};
    if (d.contents || d.listItems) break;
  }
  var raws = [];
  var contents = d.contents || [];
  for (var c = 0; c < contents.length; c++) {
    if (contents[c].type === "media" && Array.isArray(contents[c].data)) {
      raws = raws.concat(contents[c].data);
    }
  }
  if (!raws.length) raws = d.listItems || [];
  var out = [];
  for (var r = 0; r < raws.length; r++) {
    var it = raws[r];
    if (!it || typeof it !== "object") continue;
    var vid = it.playPartId || it.videoId || it.video_id;
    var title = cleanText(it.title);
    if (!vid || !title) continue;
    var rem = "";
    var rc = it.rightCorner;
    if (rc && typeof rc === "object") rem = rc.text || "";
    if (it.updateInfo) rem = (rem + " " + it.updateInfo).trim();
    out.push(
      mkItem({
        id: "five|mg|" + vid,
        title: title,
        cover: it.img || it.imgUrlH || "",
        remarks: rem,
        year: it.year || "",
        description: it.story || "",
        mediaType: "tv",
        link: "five|mg|" + vid,
      })
    );
  }
  return out;
}

async function mgDetail(vid) {
  var u =
    "https://pcweb.api.mgtv.com/episode/list?page=1&size=50&video_id=" +
    vid;
  var res = await Widget.http.get(u, {
    headers: { Referer: "https://www.mgtv.com/", "User-Agent": UA_PC },
  });
  var d = (res.data || {}).data || {};
  var info = d.info && typeof d.info === "object" ? d.info : {};
  var lst = d.list || [];
  var series = d.series || [];
  var title =
    cleanText(info.title) || cleanText(info.videoName) || String(vid);
  var episodeItems = [];
  for (var i = 0; i < lst.length; i++) {
    var e = lst[i];
    var url = e.url || "";
    if (!url) continue;
    if (url.indexOf("http") !== 0) url = "https://www.mgtv.com" + url;
    var t = e.t4 || e.t1 || "正片";
    episodeItems.push({
      id: "five|play|mg|" + encodeURIComponent(url),
      type: "url",
      title: t,
      mediaType: "tv",
      link: "five|play|mg|" + encodeURIComponent(url),
    });
  }
  if (!episodeItems.length && series.length) {
    var url0 = series[0].url || "";
    if (url0) {
      if (url0.indexOf("http") !== 0) url0 = "https://www.mgtv.com" + url0;
      episodeItems.push({
        id: "five|play|mg|" + encodeURIComponent(url0),
        type: "url",
        title: "正片",
        mediaType: "movie",
        link: "five|play|mg|" + encodeURIComponent(url0),
      });
    }
  }
  if (!episodeItems.length) {
    var _page = defaultPageUrl("mg", vid);
    if (_page) episodeItems.push(makePlayEpisode("mg", _page, "正片"));
  }
  episodeItems = withEpisodeIndex(episodeItems);
  savePlayLinks("five|mg|" + vid, episodeItems);
  return {
    id: "five|mg|" + vid,
    type: "url",
    title: title,
    coverUrl: info.img || "",
    posterPath: info.img || "",
    description: info.story || "",
    releaseDate: info.year || "",
    mediaType: episodeItems.length > 1 ? "tv" : "movie",
    link: "five|mg|" + vid,
    genreTitle: "芒果TV",
    episodeItems: episodeItems,
  };
}

// ==================== 哔哩哔哩 ====================
var WBI_TAB = [
  46, 47, 18, 2, 53, 8, 23, 32, 15, 50, 10, 31, 58, 3, 45, 35, 27, 43, 5, 49, 33, 9,
  42, 19, 29, 28, 14, 39, 12, 38, 41, 13, 37, 48, 7, 16, 24, 55, 40, 61, 26, 17, 0, 1,
  60, 51, 30, 4, 22, 25, 54, 21, 56, 59, 6, 63, 57, 62, 11, 36, 20, 34, 44, 52,
];

async function blMixin() {
  var res = await Widget.http.get("https://api.bilibili.com/x/web-interface/nav", {
    headers: { Referer: "https://www.bilibili.com/", "User-Agent": UA_PC },
  });
  var j = res.data || {};
  var wi = ((j.data || {}).wbi_img) || {};
  var imgKey = ((wi.img_url || "").split("/").pop() || "").split(".")[0];
  var subKey = ((wi.sub_url || "").split("/").pop() || "").split(".")[0];
  var orig = imgKey + subKey;
  if (orig.length < 32) return "";
  var out = "";
  for (var i = 0; i < 32; i++) out += orig[WBI_TAB[i]];
  return out;
}

function md5(str) {
  // 简易 MD5（仅用于 B 站 w_rid；若环境无 crypto 则回退空）
  // 多数 Widget 运行时支持，这里用 Widget 侧不保证，做最小实现
  // 为兼容，若无法计算则返回空字符串，搜索会失败
  try {
    if (typeof Widget !== "undefined" && Widget.crypto && Widget.crypto.md5) {
      return Widget.crypto.md5(str);
    }
  } catch (e) {}
  // 极简 fallback：不计算，返回空，调用方处理
  return "";
}

async function blSearch(key, pg) {
  var mixin = await blMixin();
  if (!mixin) return [];
  var params = {
    keyword: key,
    page: pg || 1,
    page_size: 20,
    platform: "pc",
    wts: Math.floor(Date.now() / 1000),
  };
  var keys = Object.keys(params).sort();
  var q = keys
    .map(function (k) {
      return (
        k +
        "=" +
        encodeURIComponent(
          String(params[k])
            .replace(/!/g, "")
            .replace(/'/g, "")
            .replace(/\(/g, "")
            .replace(/\)/g, "")
        )
      );
    })
    .join("&");
  // 注意：真实 MD5 依赖运行时；若无则跳过 w_rid（部分接口可能仍可用）
  var w_rid = "";
  try {
    // 尝试用简单哈希替代（仅作占位，正式环境建议注入真实 md5）
    var raw = q + mixin;
    // 若宿主提供，可替换
    if (typeof require === "function") {
      try {
        var crypto = require("crypto");
        w_rid = crypto.createHash("md5").update(raw).digest("hex");
      } catch (e) {}
    }
  } catch (e) {}
  var u =
    "https://api.bilibili.com/x/web-interface/wbi/search/all/v2?" +
    q +
    (w_rid ? "&w_rid=" + w_rid : "");
  var res = await Widget.http.get(u, {
    headers: { Referer: "https://www.bilibili.com/", "User-Agent": UA_PC },
  });
  var j = res.data || {};
  if (j.code !== 0) return [];
  var out = [];
  var cats = ((j.data || {}).result) || [];
  for (var c = 0; c < cats.length; c++) {
    if (cats[c].result_type !== "media_bangumi" && cats[c].result_type !== "media_ft")
      continue;
    var data = cats[c].data || [];
    for (var v = 0; v < data.length; v++) {
      var item = data[v];
      var sid = item.season_id;
      var title = cleanText(item.title);
      if (!sid || !title || title.indexOf("预告") >= 0) continue;
      out.push(
        mkItem({
          id: "five|bl|" + sid,
          title: title,
          cover: item.cover || "",
          remarks: cleanText(item.index_show || ""),
          mediaType: "tv",
          link: "five|bl|" + sid,
        })
      );
    }
  }
  return out;
}

async function blCate(stype, pg) {
  var u =
    "https://api.bilibili.com/pgc/season/rank/web/list?season_type=" +
    stype +
    "&pagesize=20&page=" +
    (pg || 1) +
    "&day=3";
  var res = await Widget.http.get(u, {
    headers: { Referer: "https://www.bilibili.com/", "User-Agent": UA_PC },
  });
  var j = res.data || {};
  var lst =
    ((j.result || {}).list) || ((j.data || {}).list) || [];
  var out = [];
  for (var i = 0; i < lst.length; i++) {
    var v = lst[i];
    var sid = v.season_id;
    var title = cleanText(v.title);
    if (!sid || !title || title.indexOf("预告") >= 0) continue;
    var ne = v.new_ep || {};
    var rem = ne.index_show || v.index_show || "";
    if (v.rating) rem = v.rating + "分 " + rem;
    out.push(
      mkItem({
        id: "five|bl|" + sid,
        title: title,
        cover: v.cover || "",
        remarks: rem,
        mediaType: String(stype) === "2" ? "movie" : "tv",
        link: "five|bl|" + sid,
      })
    );
  }
  return out;
}

async function blDetail(sid) {
  var u = "https://api.bilibili.com/pgc/view/web/season?season_id=" + sid;
  var res = await Widget.http.get(u, {
    headers: { Referer: "https://www.bilibili.com/", "User-Agent": UA_PC },
  });
  var r = (res.data || {}).result || {};
  if (!r) return null;
  var pub = r.publish || {};
  var ne = r.new_ep || {};
  var areas = r.areas || [];
  var rating = r.rating || {};
  var stat = r.stat || {};
  var episodeItems = [];
  var eps = r.episodes || [];
  for (var i = 0; i < eps.length; i++) {
    var ep = eps[i];
    var t = cleanText(ep.title) || "";
    var badge = ep.badge || "";
    if (t.indexOf("预告") >= 0 || badge.indexOf("预告") >= 0) continue;
    var name = (t + " " + cleanText(ep.long_title || "")).trim();
    var epId = ep.ep_id;
    var cid = ep.cid;
    var link = ep.link || "";
    if (epId && cid) {
      episodeItems.push({
        id: "five|play|bl|" + epId + "|" + cid + "|" + encodeURIComponent(link || ""),
        type: "url",
        title: name,
        mediaType: "tv",
        link: "five|play|bl|" + epId + "|" + cid + "|" + encodeURIComponent(link || ""),
      });
    } else if (link) {
      episodeItems.push({
        id: "five|play|blpage|" + encodeURIComponent(link),
        type: "url",
        title: name,
        mediaType: "tv",
        link: "five|play|blpage|" + encodeURIComponent(link),
      });
    }
  }
  if (!episodeItems.length) {
    var _page = defaultPageUrl("bl", sid);
    if (_page) episodeItems.push(makePlayEpisode("bl", _page, "正片"));
  }
  episodeItems = withEpisodeIndex(episodeItems);
  savePlayLinks("five|bl|" + sid, episodeItems);
  return {
    id: "five|bl|" + sid,
    type: "url",
    title: cleanText(r.title),
    coverUrl: r.cover || "",
    posterPath: r.cover || "",
    description: r.evaluate || "",
    releaseDate: (pub.pub_time || "").slice(0, 4),
    mediaType: episodeItems.length > 1 ? "tv" : "movie",
    link: "five|bl|" + sid,
    genreTitle: r.share_sub_title || "哔哩哔哩",
    rating: rating.score || undefined,
    episodeItems: episodeItems,
  };
}

var BL_QN_NAME = {
  16: "360P",
  32: "480P",
  64: "720P",
  74: "720P60",
  80: "1080P",
  112: "1080P+",
  116: "1080P60",
  120: "4K",
  125: "HDR",
  126: "杜比视界",
  127: "8K",
};

function blQnLabel(qn, width, height) {
  var name = BL_QN_NAME[qn] || (qn ? "qn" + qn : "");
  if (width && height) {
    return (name ? name + " " : "") + width + "x" + height;
  }
  return name || "视频";
}

/**
 * 拉取 B 站多清晰度。
 * 返回 [{ url, qn, name, width, height }]，按清晰度从高到低。
 * 未登录通常最高约 480P/720P；填入 bili_cookie（含 SESSDATA）可到 1080P/4K。
 */
async function blPlayStreams(epId, cid, params) {
  var cookie = (params && params.bili_cookie) || "";
  var headers = {
    Referer: "https://www.bilibili.com/",
    "User-Agent": UA_PC,
  };
  if (cookie) headers.Cookie = String(cookie);

  // qn=127 + fourk=1 + 较高 fnval：尽量要到全部清晰度（实际仍受账号权限限制）
  var u =
    "https://api.bilibili.com/pgc/player/web/playurl?ep_id=" +
    epId +
    "&cid=" +
    cid +
    "&fnval=4048&qn=127&fnver=0&fourk=1&session=&device=pc&platform=web&otype=json";
  var res = await Widget.http.get(u, { headers: headers });
  var body = res.data || {};
  var result = body.result || body.data || {};
  var out = [];
  var seen = {};

  // flv/mp4 合流（durl）
  if (Array.isArray(result.durl) && result.durl.length) {
    var qn = result.quality || result.qn || 0;
    var url0 = result.durl[0].url || "";
    if (url0 && !seen[url0]) {
      seen[url0] = true;
      out.push({
        url: url0,
        qn: qn,
        name: blQnLabel(qn),
        width: 0,
        height: 0,
      });
    }
  }

  // DASH：按 id/带宽从高到低取视频轨
  var dash = result.dash || {};
  var videos = Array.isArray(dash.video) ? dash.video.slice() : [];
  videos.sort(function (a, b) {
    var qa = Number(a.id || a.bandwidth || 0);
    var qb = Number(b.id || b.bandwidth || 0);
    return qb - qa;
  });
  for (var i = 0; i < videos.length; i++) {
    var v = videos[i];
    var vu = v.baseUrl || v.base_url || v.backupUrl || (v.backup_url && v.backup_url[0]) || "";
    if (!vu || seen[vu]) continue;
    seen[vu] = true;
    var vqn = Number(v.id || 0);
    out.push({
      url: vu,
      qn: vqn,
      name: blQnLabel(vqn, v.width, v.height),
      width: v.width || 0,
      height: v.height || 0,
    });
  }

  return out;
}

// 兼容旧调用：只返回最高清一条
async function blPlay(epId, cid, params) {
  var list = await blPlayStreams(epId, cid, params);
  return list.length ? list[0].url : "";
}

// ==================== 入口 ====================
async function loadList(params) {
  try {
    var page = Number(params.page || 1);
    var platform = String(params.platform || "");
    var category = String(params.category || "");
    var items = [];
    if (platform === "tx") items = await txCate(category, page);
    else if (platform === "iq") items = await iqCate(category, page);
    else if (platform === "yk") items = await ykCate(category, page);
    else if (platform === "mg") items = await mgCate(category, page);
    else if (platform === "bl") items = await blCate(category, page);
    return items;
  } catch (error) {
    console.error("[five-platforms] loadList 失败:", error.message || error);
    throw error;
  }
}

async function search(params) {
  try {
    var key = String(params.keyword || "").trim();
    var page = Number(params.page || 1);
    if (!key) return [];
    var results = [];
    var tasks = [
      txSearch(key, page),
      iqSearch(key, page),
      ykSearch(key, page),
      mgSearch(key, page),
      blSearch(key, page),
    ];
    var settled = await Promise.all(
      tasks.map(function (p) {
        return p.catch(function () {
          return [];
        });
      })
    );
    for (var i = 0; i < settled.length; i++) {
      if (Array.isArray(settled[i])) results = results.concat(settled[i]);
    }
    return results;
  } catch (error) {
    console.error("[five-platforms] search 失败:", error.message || error);
    throw error;
  }
}

/**
 * 详情收尾：保证至少 1 个「正片」分集，并预解析直链写入缓存。
 * 电影与单集内容统一按可选集处理（mediaType=tv），对齐剧集可播路径。
 */
async function finalizeDetail(detail, pf, rawId, params) {
  if (!detail) return null;
  var detailId = "five|" + pf + "|" + rawId;
  detail.id = detailId;
  detail.type = "url";
  detail.link = detailId;

  var episodeItems = Array.isArray(detail.episodeItems) ? detail.episodeItems : [];
  episodeItems = withEpisodeIndex(episodeItems);

  if (!episodeItems.length) {
    var page0 = defaultPageUrl(pf, rawId);
    if (page0) episodeItems = [makePlayEpisode(pf, page0, "正片", "tv")];
  }

  detail.mediaType = "tv";
  for (var i = 0; i < episodeItems.length; i++) {
    if (episodeItems[i]) episodeItems[i].mediaType = "tv";
  }
  detail.episodeItems = episodeItems;
  savePlayLinks(detailId, episodeItems);

  var firstPage = readDetailPage(detailId) || "";
  if (!firstPage && episodeItems[0] && episodeItems[0].link) {
    firstPage = readPageUrl(episodeItems[0].link) || "";
  }
  if (!firstPage) firstPage = defaultPageUrl(pf, rawId);
  if (firstPage) {
    saveDetailPage(detailId, firstPage);
    try {
      await resolvePageToResources(firstPage, params || {});
    } catch (e) {}
  }
  return detail;
}

async function loadDetail(link) {
  try {
    var owned = ownedLink(link);
    if (!owned) return null;
    var parts = owned.split("|");
    if (parts.length < 3) return null;
    if (parts[1] === "play") return null;
    var pf = parts[1];
    var id = parts.slice(2).join("|");
    var detail = null;
    if (pf === "tx") detail = await txDetail(id);
    else if (pf === "iq") detail = await iqDetail(id);
    else if (pf === "yk") detail = await ykDetail(id);
    else if (pf === "mg") detail = await mgDetail(id);
    else if (pf === "bl") detail = await blDetail(id);
    if (!detail) return null;
    return await finalizeDetail(detail, pf, id, {});
  } catch (error) {
    console.error("[five-platforms] loadDetail 失败:", error.message || error);
    return null;
  }
}

function detectPlatformByUrl(url) {
  var u = String(url || "");
  if (u.indexOf("v.qq.com") >= 0) return "tx";
  if (u.indexOf("iqiyi.com") >= 0) return "iq";
  if (u.indexOf("youku.com") >= 0) return "yk";
  if (u.indexOf("mgtv.com") >= 0) return "mg";
  if (u.indexOf("bilibili.com") >= 0) return "bl";
  return "";
}

function isPlatformPageUrl(url) {
  return !!detectPlatformByUrl(url);
}

function resourceFromDirect(url, name, desc, ref, playerType) {
  return {
    name: name || "直链",
    description: desc || "",
    url: url,
    customHeaders: {
      "User-Agent": UA_PC,
      Referer: ref || "https://www.qq.com/",
    },
    headers: {
      "User-Agent": UA_PC,
      Referer: ref || "https://www.qq.com/",
    },
    playerType: playerType || "app",
  };
}

async function resolvePageToResources(pageUrl, params) {
  if (!pageUrl || String(pageUrl).indexOf("http") !== 0) return [];
  pageUrl = String(pageUrl);
  var platform = detectPlatformByUrl(pageUrl);
  var ref = HDR_REF[platform] || "https://www.qq.com/";

  // 同一播放页短时间内返回同一条直链，避免客户端报「资源已变化」
  var sk = "streamPage:" + pageUrl;
  try {
    var cached = Widget.storage.get(sk);
    if (cached) {
      var obj = typeof cached === "string" ? JSON.parse(cached) : cached;
      if (obj && obj.url && obj.t && Date.now() - obj.t < PARSE_TTL * 1000) {
        return [
          resourceFromDirect(obj.url, "解析直链", (obj.fmt || "m3u8") + " | 缓存", ref, "app"),
        ];
      }
    }
  } catch (e) {}

  var parsed = await parseVideo(pageUrl, params);
  if (parsed.url) {
    try {
      Widget.storage.set(
        sk,
        JSON.stringify({ url: parsed.url, fmt: parsed.fmt || "", t: Date.now() })
      );
    } catch (e2) {}
    return [
      resourceFromDirect(
        parsed.url,
        "解析直链",
        (parsed.fmt || "直链") + " | " + (platform || "web"),
        ref,
        "app"
      ),
    ];
  }
  return [];
}

async function resolvePlayToken(token, params) {
  // token 形态：
  // five|play|tx|<encodedPageUrl>
  // five|play|iq|<encodedPageUrl>
  // five|play|yk|<encodedPageUrl>
  // five|play|mg|<encodedPageUrl>
  // five|play|blpage|<encodedPageUrl>
  // five|play|bl|<epId>|<cid>|<encodedPageUrl?>
  var parts = String(token).split("|");
  if (parts.length < 3) return [];
  if (parts[0] === "five" && parts[1] === "play") {
    var platform = parts[2];

    // B站官方：返回多清晰度线路（高→低）
    if (platform === "bl" && parts.length >= 5) {
      var epId = parts[3];
      var cid = parts[4];
      var pageLink = parts[5] ? decodeURIComponent(parts[5]) : "";
      var headersRef = HDR_REF.bl;
      var streams = [];
      try {
        streams = await blPlayStreams(epId, cid, params);
      } catch (e) {
        streams = [];
      }
      if (streams && streams.length) {
        var resources = [];
        // 最多给出 6 条，避免列表过长
        var limit = Math.min(streams.length, 6);
        for (var si = 0; si < limit; si++) {
          var s = streams[si];
          resources.push(
            resourceFromDirect(
              s.url,
              "B站 " + (s.name || "直链"),
              "官方 playurl | qn=" + (s.qn || ""),
              headersRef,
              "app"
            )
          );
        }
        return resources;
      }
      if (pageLink) return await resolvePageToResources(pageLink, params);
      return [];
    }

    // 优先 storage 中的真实播放页，避免 encode 截断
    var pageUrl = readPageUrl(String(token)) || "";
    if (!pageUrl && parts[3]) {
      try {
        pageUrl = decodeURIComponent(parts[3]);
      } catch (e) {
        pageUrl = parts[3];
      }
    }
    if (!pageUrl || pageUrl.indexOf("http") !== 0) return [];
    return await resolvePageToResources(pageUrl, params);
  }
  return [];
}

async function resolveDetailFirstEpisode(owned, params) {
  // 用户从详情页直接点播放（未点具体分集）时，params.link 可能是 five|tx|cid
  // 电影尤其容易走这条路径；电视剧点某一集时一般会带 five|play|...
  var parts = String(owned).split("|");
  if (parts.length < 3 || parts[1] === "play") return [];
  var pf = parts[1];
  var id = parts.slice(2).join("|");
  var detailId = "five|" + pf + "|" + id;

  // 1) 优先用详情阶段缓存的播放令牌（避免二次请求失败导致「资源已变化」）
  var cachedLinks = loadPlayLinks(detailId);
  var playToken = "";
  if (cachedLinks.length) {
    var epNo = params && params.episode != null ? Number(params.episode) : NaN;
    if (!isNaN(epNo) && epNo > 0 && epNo - 1 < cachedLinks.length) {
      playToken = cachedLinks[epNo - 1];
    } else {
      playToken = cachedLinks[0];
    }
  }

  // 2) 缓存没有再拉详情
  if (!playToken) {
    var detail = null;
    try {
      if (pf === "tx") detail = await txDetail(id);
      else if (pf === "iq") detail = await iqDetail(id);
      else if (pf === "yk") detail = await ykDetail(id);
      else if (pf === "mg") detail = await mgDetail(id);
      else if (pf === "bl") detail = await blDetail(id);
    } catch (e) {
      detail = null;
    }
    if (detail && Array.isArray(detail.episodeItems) && detail.episodeItems.length) {
      savePlayLinks(detailId, detail.episodeItems);
      var epNo2 = params && params.episode != null ? Number(params.episode) : NaN;
      var target = detail.episodeItems[0];
      if (!isNaN(epNo2) && epNo2 > 0 && epNo2 - 1 < detail.episodeItems.length) {
        target = detail.episodeItems[epNo2 - 1];
      }
      if (target && target.link) playToken = target.link;
    }
  }

  // 3) 电影主按钮：不依赖分集令牌，直接拿播放页去解析（对齐 TVBox playerContent）
  var page =
    readDetailPage(detailId) ||
    (playToken ? readPageUrl(playToken) : "") ||
    defaultPageUrl(pf, id);

  if (playToken) {
    var fromToken = await resolvePlayToken(playToken, params);
    if (fromToken && fromToken.length) return fromToken;
  }

  if (page && page.indexOf("http") === 0) {
    var r = await resolvePageToResources(page, params);
    if (r && r.length) return r;
  }

  console.error("[five-platforms] 电影/详情解析失败", detailId, page || "");
  return [];
}

async function loadResource(params) {
  try {
    params = params || {};
    var candidates = [];
    if (params.link) candidates.push(String(params.link));
    if (params.id) candidates.push(String(params.id));
    if (params.videoUrl) candidates.push(String(params.videoUrl));
    if (params.url) candidates.push(String(params.url));

    // 0) 电影点「播放」：详情 id → 预缓存播放页/默认页 → 解析直链
    for (var ci = 0; ci < candidates.length; ci++) {
      var owned0 = ownedLink(candidates[ci]);
      if (!owned0 || owned0.indexOf("five|play|") === 0) continue;
      var page0 = readDetailPage(owned0) || "";
      if (!page0) {
        var p0 = owned0.split("|");
        if (p0.length >= 3) page0 = defaultPageUrl(p0[1], p0.slice(2).join("|"));
      }
      if (page0) {
        var pre = await resolvePageToResources(page0, params);
        if (pre && pre.length) return pre;
      }
    }

    // 1) 显式 five|play|... 令牌
    for (var i = 0; i < candidates.length; i++) {
      var c = candidates[i];
      if (c.indexOf("five|play|") === 0) {
        var r1 = await resolvePlayToken(c, params);
        if (r1 && r1.length) return r1;
      }
    }

    // 2) 详情 id：five|tx|cid 等 → 取对应分集再解析
    for (var j = 0; j < candidates.length; j++) {
      var owned = ownedLink(candidates[j]);
      if (owned && owned.indexOf("five|play|") !== 0) {
        var r2 = await resolveDetailFirstEpisode(owned, params);
        if (r2 && r2.length) return r2;
      }
    }

    // 3) 直接是平台播放页 URL（兼容客户端把 videoUrl/link 传成网页地址）
    for (var k = 0; k < candidates.length; k++) {
      var u = candidates[k];
      if (isPlatformPageUrl(u)) {
        var r3 = await resolvePageToResources(u, params);
        if (r3 && r3.length) return r3;
      }
    }

    console.error(
      "[five-platforms] loadResource 无可用源",
      JSON.stringify({
        link: params.link,
        id: params.id,
        videoUrl: params.videoUrl,
        episode: params.episode,
      })
    );
    return [];
  } catch (error) {
    console.error("[five-platforms] loadResource 失败:", error.message || error);
    return [];
  }
}

