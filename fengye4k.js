/**
 * 枫叶4K影院（rex / ForwardWidget）
 * 源站：https://reborn2000.com
 * 对应 TVBox Python：枫叶4k影院.py
 *
 * 接口：
 *   列表/搜索：/index.php/ajax/data?mid=1&tid=&page=&limit=&wd=
 *   详情：/detail/{id}.html（解析剧集 /play/{playId}-{sid}-{nid}.html）
 *   播放：/play/...html 内 player_aaaa.url → m3u8
 */

WidgetMetadata = {
  id: "cn.fengye4k.reborn",
  title: "枫叶4K影院",
  version: "1.1.0",
  requiredVersion: "0.0.1",
  description: "reborn2000.com · 电影/剧集/综艺/动漫 · 直链 m3u8",
  author: "Forward",
  site: "https://reborn2000.com",
  detailCacheDuration: 300,
  globalParams: [],
  modules: [
    {
      id: "loadList",
      title: "分类",
      functionName: "loadList",
      cacheDuration: 600,
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
var HOST = "https://reborn2000.com";
var UA =
  "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36";
var PAGE_SIZE = 20;
var NS = "fy|";

// ==================== 工具 ====================
function text(v) {
  return v == null ? "" : String(v).trim();
}

function asList(v) {
  return Array.isArray(v) ? v : [];
}

function absolute(url) {
  if (!url) return "";
  url = String(url).trim();
  if (/^https?:\/\//i.test(url)) return url;
  if (url.indexOf("//") === 0) return "https:" + url;
  if (url.charAt(0) === "/") return HOST + url;
  return HOST + "/" + url;
}

function cleanPic(pic) {
  if (!pic) return "";
  pic = String(pic)
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .trim();
  return absolute(pic);
}

function stripHtml(s) {
  if (!s) return "";
  return String(s)
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .trim();
}

function htmlHeaders() {
  // 不要 Accept: application/json —— 站点会把整页 HTML 包成 JSON 字符串返回
  return {
    "User-Agent": UA,
    Accept: "text/html,application/xhtml+xml,*/*",
    "Accept-Language": "zh-CN,zh;q=0.9",
    Referer: HOST + "/",
  };
}

async function fetchText(url) {
  try {
    var res = await Widget.http.get(url, { headers: htmlHeaders() });
    var body = res && res.data !== undefined ? res.data : res;
    if (body == null) return "";
    if (typeof body === "object") {
      // 偶发已解析对象
      try {
        return JSON.stringify(body);
      } catch (e) {
        return "";
      }
    }
    var t = String(body);
    // 站点可能返回一个 JSON 字符串字面量包裹的 HTML
    if (t.charAt(0) === '"') {
      try {
        var unwrapped = JSON.parse(t);
        if (typeof unwrapped === "string") t = unwrapped;
      } catch (e2) {}
    }
    return t;
  } catch (e) {
    console.error("[fengye4k] fetchText 失败", url, e && e.message);
    return "";
  }
}

async function fetchJson(url) {
  var t = await fetchText(url);
  if (!t) return {};
  try {
    var j = JSON.parse(t);
    return j && typeof j === "object" ? j : {};
  } catch (e) {
    return {};
  }
}

function mapItem(item) {
  if (!item || typeof item !== "object") return null;
  var vid = text(item.vod_id || item.id);
  if (!vid) return null;
  var t = item.type || {};
  return {
    id: NS + vid,
    type: "url",
    title: text(item.vod_name || item.name),
    coverUrl: cleanPic(item.vod_pic || item.pic || ""),
    posterPath: cleanPic(item.vod_pic || item.pic || ""),
    description: stripHtml(item.vod_content || ""),
    releaseDate: text(item.vod_year || ""),
    mediaType: "tv",
    link: NS + vid,
    genreTitle: text(item.vod_remarks || t.type_name || ""),
  };
}

// ==================== 列表 / 搜索 ====================
async function loadList(params) {
  try {
    var page = Number(params.page || 1) || 1;
    var tid = text(params.tid || "1") || "1";
    var url =
      HOST +
      "/index.php/ajax/data?mid=1&tid=" +
      encodeURIComponent(tid) +
      "&page=" +
      page +
      "&limit=" +
      PAGE_SIZE;
    var data = await fetchJson(url);
    return asList(data.list).map(mapItem).filter(Boolean);
  } catch (error) {
    console.error("[fengye4k] loadList 失败:", error.message || error);
    throw error;
  }
}

async function search(params) {
  try {
    var key = text(params.keyword || "");
    var page = Number(params.page || 1) || 1;
    if (!key) return [];
    var url =
      HOST +
      "/index.php/ajax/data?mid=1&wd=" +
      encodeURIComponent(key) +
      "&page=" +
      page +
      "&limit=" +
      PAGE_SIZE;
    var data = await fetchJson(url);
    return asList(data.list).map(mapItem).filter(Boolean);
  } catch (error) {
    console.error("[fengye4k] search 失败:", error.message || error);
    throw error;
  }
}

// ==================== 详情 ====================
function extractTitle(html) {
  var m = html.match(/<h3[^>]*class="[^"]*slide-info-title[^"]*"[^>]*>([^<]+)<\/h3>/i);
  if (m) return stripHtml(m[1]);
  m = html.match(/<title>([^<]+)<\/title>/i);
  if (m) return stripHtml(m[1]).split("_")[0].trim();
  return "";
}

function extractPic(html) {
  var m = html.match(/<img[^>]+class="[^"]*lazy[^"]*"[^>]+src="([^"]+)"/i);
  if (!m) m = html.match(/<img[^>]+src="([^"]+)"/i);
  return m ? cleanPic(m[1]) : "";
}

function parseMeta(html) {
  var meta = {};
  var m;
  m = html.match(/连载\s*[:：]\s*([^<\n]+)/);
  if (m) meta.remarks = stripHtml(m[1]);
  m = html.match(/类型\s*[:：]\s*([^<\n]+)/);
  if (m) meta.type = stripHtml(m[1]);
  m = html.match(/演员\s*[:：]\s*([^<\n]+)/);
  if (m) meta.actor = stripHtml(m[1]);
  m = html.match(/导演\s*[:：]\s*([^<\n]+)/);
  if (m) meta.director = stripHtml(m[1]);
  m = html.match(/简介\s*[:：]\s*<[^>]*>([^<]+)/);
  if (m) meta.content = stripHtml(m[1]);
  else {
    m = html.match(/简介\s*[:：]\s*([^<\n]+)/);
    if (m) meta.content = stripHtml(m[1]);
  }
  m = html.match(/(\d{4})-\d{2}-\d{2}/);
  if (m) meta.year = m[1];
  m = html.match(/地区\s*[:：]\s*([^<\n]+)/);
  if (m) meta.area = stripHtml(m[1]);
  return meta;
}

/**
 * 解析详情页剧集。
 * 返回按「集」合并后的结构：每集可有多条线路（sid），线路放在播放资源里选，不拆成多集。
 * [{ name, sources: [{ playId, sid, nid, lineName }] }, ...]
 */
function parseEpisodesGrouped(html) {
  // /play/{playId}-{sid}-{nid}.html  —— sid=线路，nid=集序号
  var byNid = {};
  var re = /<a[^>]+href="\/play\/(\d+)-(\d+)-(\d+)\.html"[^>]*>([^<]*)<\/a>/gi;
  var m;
  while ((m = re.exec(html))) {
    var playId = m[1];
    var sid = m[2];
    var nid = m[3];
    var name = stripHtml(m[4]) || "第" + nid + "集";
    if (!byNid[nid]) {
      byNid[nid] = { name: name, nid: nid, sources: [] };
    }
    // 用该 nid 下出现的第一个非空名字作为集名
    if (name && (!byNid[nid].name || byNid[nid].name.indexOf("第") === 0)) {
      byNid[nid].name = name;
    }
    byNid[nid].sources.push({
      playId: playId,
      sid: sid,
      nid: nid,
      lineName: "线路" + sid,
    });
  }

  var nids = Object.keys(byNid).sort(function (a, b) {
    return Number(a) - Number(b);
  });
  var out = [];
  for (var i = 0; i < nids.length; i++) {
    var ep = byNid[nids[i]];
    // 线路按 sid 排序
    ep.sources.sort(function (a, b) {
      return Number(a.sid) - Number(b.sid);
    });
    out.push(ep);
  }
  return out;
}

async function loadDetail(link) {
  try {
    var raw = String(link || "");
    if (raw.indexOf(NS) === 0) raw = raw.slice(NS.length);
    if (!raw || raw.indexOf("fyep|") === 0 || raw.indexOf("fyplay|") === 0) {
      return null;
    }

    var detailUrl = HOST + "/detail/" + encodeURIComponent(raw) + ".html";
    var html = await fetchText(detailUrl);
    if (!html) return null;

    var title = extractTitle(html) || raw;
    var pic = extractPic(html);
    var meta = parseMeta(html);
    var grouped = parseEpisodesGrouped(html);

    var detailId = NS + raw;
    var episodeItems = [];

    for (var i = 0; i < grouped.length; i++) {
      var ep = grouped[i];
      // 分集令牌：只代表「第几集」，线路在 loadResource 里展开
      var token = "fyep|" + raw + "|" + ep.nid;
      try {
        Widget.storage.set(
          "fy:ep:" + token,
          JSON.stringify({
            name: ep.name,
            nid: ep.nid,
            sources: ep.sources,
          })
        );
      } catch (e) {}
      episodeItems.push({
        id: token,
        type: "url",
        title: ep.name || "第" + ep.nid + "集",
        mediaType: "tv",
        episode: Number(ep.nid) || i + 1,
        link: token,
      });
    }

    try {
      Widget.storage.set("fy:eps:" + detailId, JSON.stringify(grouped));
      if (episodeItems[0]) {
        Widget.storage.set("fy:first:" + detailId, episodeItems[0].link);
      }
    } catch (e2) {}

    return {
      id: detailId,
      type: "url",
      title: title,
      coverUrl: pic,
      posterPath: pic,
      description: meta.content || "",
      releaseDate: meta.year || "",
      mediaType: "tv",
      link: detailId,
      genreTitle: meta.remarks || meta.type || "",
      episodeItems: episodeItems,
    };
  } catch (error) {
    console.error("[fengye4k] loadDetail 失败:", error.message || error);
    return null;
  }
}

// ==================== 播放 ====================
function extractPlayerUrl(playHtml) {
  if (!playHtml) return "";
  var m = playHtml.match(/player_aaaa\s*=\s*(\{[\s\S]*?\})\s*;?\s*<\/script>/i);
  if (m) {
    try {
      var cfg = JSON.parse(m[1]);
      var u = text(cfg.url || "");
      if (u) return absolute(u);
    } catch (e) {}
  }
  m = playHtml.match(/(https?:\/\/[^\s"'<>]+\.m3u8[^\s"'<>]*)/i);
  if (m) return absolute(m[1]);
  return "";
}

function resourceOf(url, name) {
  return {
    name: name || "线路",
    description: /\.m3u8/i.test(url) ? "m3u8" : "直链",
    url: url,
    customHeaders: {
      "User-Agent": UA,
      Referer: HOST + "/",
    },
    headers: {
      "User-Agent": UA,
      Referer: HOST + "/",
    },
    playerType: "app",
  };
}

async function fetchSourceUrl(playId, sid, nid) {
  var playUrl = HOST + "/play/" + playId + "-" + sid + "-" + nid + ".html";
  var html = await fetchText(playUrl);
  return extractPlayerUrl(html);
}

/**
 * 一集 → 多条播放资源（每条线路一个）
 * 显示在客户端「播放资源」里可选，不再拆成多集。
 */
async function resolveEpisodeSources(token) {
  var sources = [];
  try {
    var cached = Widget.storage.get("fy:ep:" + token);
    if (cached) {
      var obj = typeof cached === "string" ? JSON.parse(cached) : cached;
      sources = (obj && obj.sources) || [];
    }
  } catch (e) {}

  // 无缓存：fyep|{vodId}|{nid}
  if (!sources.length) {
    var parts = String(token).split("|");
    if (parts.length >= 3 && parts[0] === "fyep") {
      var vodId = parts[1];
      var nid = parts[2];
      try {
        var all = Widget.storage.get("fy:eps:" + NS + vodId);
        if (all) {
          var list = typeof all === "string" ? JSON.parse(all) : all;
          for (var i = 0; i < (list || []).length; i++) {
            if (String(list[i].nid) === String(nid)) {
              sources = list[i].sources || [];
              break;
            }
          }
        }
      } catch (e2) {}
    }
  }

  if (!sources.length) return [];

  var resources = [];
  // 并行拉各线路（最多 6 条，避免过慢）
  var limit = Math.min(sources.length, 6);
  var tasks = [];
  for (var s = 0; s < limit; s++) {
    (function (src) {
      tasks.push(
        fetchSourceUrl(src.playId, src.sid, src.nid).then(function (url) {
          return { src: src, url: url };
        })
      );
    })(sources[s]);
  }

  var results = [];
  try {
    results = await Promise.all(tasks);
  } catch (e3) {
    // Promise.all 失败则逐个试
    results = [];
    for (var t = 0; t < limit; t++) {
      try {
        var u = await fetchSourceUrl(
          sources[t].playId,
          sources[t].sid,
          sources[t].nid
        );
        results.push({ src: sources[t], url: u });
      } catch (e4) {}
    }
  }

  for (var r = 0; r < results.length; r++) {
    if (results[r] && results[r].url) {
      var lineName =
        (results[r].src && results[r].src.lineName) || "线路" + (r + 1);
      resources.push(resourceOf(results[r].url, lineName));
    }
  }
  return resources;
}

async function loadResource(params) {
  try {
    params = params || {};
    var candidates = [];
    if (params.link) candidates.push(String(params.link));
    if (params.id) candidates.push(String(params.id));
    if (params.videoUrl) candidates.push(String(params.videoUrl));

    // 1) 分集令牌 fyep|... → 返回该集下全部线路
    for (var i = 0; i < candidates.length; i++) {
      var c = candidates[i];
      if (c.indexOf("fyep|") === 0) {
        var r = await resolveEpisodeSources(c);
        if (r && r.length) return r;
      }
    }

    // 2) 详情 id：fy|vid → 第一集的全部线路
    for (var j = 0; j < candidates.length; j++) {
      var id = candidates[j];
      if (id.indexOf(NS) !== 0) continue;
      var first = "";
      try {
        first = Widget.storage.get("fy:first:" + id) || "";
      } catch (e) {}
      if (first) {
        var r2 = await resolveEpisodeSources(first);
        if (r2 && r2.length) return r2;
      }
      try {
        var detail = await loadDetail(id);
        if (detail && detail.episodeItems && detail.episodeItems[0]) {
          var r3 = await resolveEpisodeSources(detail.episodeItems[0].link);
          if (r3 && r3.length) return r3;
        }
      } catch (e2) {}
    }

    console.error(
      "[fengye4k] loadResource 无可用源",
      JSON.stringify({ link: params.link, id: params.id })
    );
    return [];
  } catch (error) {
    console.error("[fengye4k] loadResource 失败:", error.message || error);
    return [];
  }
}
