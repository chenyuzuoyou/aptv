var WidgetMetadata = {
  id: "pk.pianku",
  title: "片库",
  version: "1.0.0",
  requiredVersion: "0.0.6",
  description: "片库 4K（pianku）片单、搜索、详情，以及备用线路 m3u8 直链",
  globalParams: [
    { name: "base", title: "站点地址", type: "input", value: "https://4k03.pianku.online" }
  ],
  modules: [
    {
      id: "latest", title: "最近更新", functionName: "loadLatest",
      params: [{ name: "page", title: "页码", type: "page" }]
    },
    {
      id: "movie", title: "电影", functionName: "loadMovie",
      params: [
        { name: "page", title: "页码", type: "page" },
        { name: "genre", title: "类型", type: "enumeration", value: "20", enumOptions: [
          { title: "全部", value: "20" }, { title: "动作片", value: "21" }, { title: "喜剧片", value: "22" },
          { title: "爱情片", value: "23" }, { title: "科幻片", value: "24" }, { title: "恐怖片", value: "25" },
          { title: "剧情片", value: "26" }, { title: "战争片", value: "27" }, { title: "惊悚片", value: "28" },
          { title: "犯罪片", value: "29" }, { title: "冒险片", value: "30" }
        ] }
      ]
    },
    {
      id: "tv", title: "剧集", functionName: "loadTv",
      params: [
        { name: "page", title: "页码", type: "page" },
        { name: "region", title: "地区", type: "enumeration", value: "37", enumOptions: [
          { title: "全部", value: "37" }, { title: "国产剧", value: "38" }, { title: "港台剧", value: "39" },
          { title: "欧美剧", value: "40" }, { title: "日韩剧", value: "41" }, { title: "其他剧", value: "42" }
        ] }
      ]
    },
    {
      id: "anime", title: "动漫", functionName: "loadAnime",
      params: [{ name: "page", title: "页码", type: "page" }]
    },
    {
      id: "variety", title: "综艺", functionName: "loadVariety",
      params: [{ name: "page", title: "页码", type: "page" }]
    },
    {
      id: "loadResource", title: "播放线路", type: "stream", functionName: "loadResource", params: []
    }
  ],
  search: {
    id: "search", title: "搜索", functionName: "search", params: []
  }
};

var DEFAULT_BASE = "https://4k03.pianku.online";
var UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

async function httpGet(url, opts) {
  var last;
  for (var i = 0; i < 3; i++) {
    try {
      return await Widget.http.get(url, opts);
    } catch (e) {
      last = e;
      if (/^HTTP \d/.test(String((e && e.message) || ""))) throw e;
    }
  }
  throw last;
}

function siteBase(params) {
  var b = String((params && params.base) || DEFAULT_BASE).trim();
  if (!/^https?:\/\//.test(b)) b = "https://" + b;
  return b.replace(/\/+$/, "");
}

function absUrl(base, path) {
  if (!path) return "";
  if (/^https?:\/\//.test(path)) return path.replace(/^http:\/\//, "https://");
  return base + (path.charAt(0) === "/" ? path : "/" + path);
}

function yearOf(v) {
  var s = String(v || "").trim();
  return /^\d{4}$/.test(s) ? s : "";
}

function mapItem(v) {
  var year = yearOf(v.vod_year);
  var kind = (v.type && v.type.type_name) || (v.type_1 && v.type_1.type_name) || "";
  var sub = [];
  if (kind) sub.push(kind);
  if (year) sub.push(year);
  if (v.vod_remarks) sub.push(String(v.vod_remarks));
  var item = {
    id: "pk:" + v.vod_id,
    type: "url",
    title: String(v.vod_name || v.vod_sub || ""),
    subtitle: sub.join(" · "),
    posterPath: absUrl("", v.vod_pic || v.vod_pic_thumb || ""),
    description: String(v.vod_blurb || v.vod_content || "").replace(/<[^>]+>/g, "").trim(),
    releaseDate: year ? year + "-01-01" : "",
    genreTitle: String(v.vod_class || "")
  };
  var slide = absUrl("", v.vod_pic_slide || v.vod_pic || "");
  if (slide) item.backdropPath = slide;
  var score = Number(v.vod_score);
  if (score > 0) item.rating = score;
  return item;
}

async function fetchList(base, tid, page) {
  var params = { mid: "1", limit: "10", page: String(Number(page) || 1) };
  if (tid) params.tid = String(tid);
  var r = await httpGet(base + "/index.php/ajax/data", {
    params: params,
    headers: { "User-Agent": UA, Referer: base + "/" }
  });
  var body = r.data;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch (e) { throw new Error("片库返回的不是 JSON"); }
  }
  var list = (body && body.list) || [];
  if (!Array.isArray(list) || !list.length) return [];
  return list.map(mapItem);
}

async function loadLatest(params) {
  return await fetchList(siteBase(params), "", params.page);
}

async function loadMovie(params) {
  return await fetchList(siteBase(params), params.genre || "20", params.page);
}

async function loadTv(params) {
  return await fetchList(siteBase(params), params.region || "37", params.page);
}

async function loadAnime(params) {
  return await fetchList(siteBase(params), "43", params.page);
}

async function loadVariety(params) {
  return await fetchList(siteBase(params), "45", params.page);
}

async function search(params) {
  var base = siteBase(params);
  var keyword = String(params.keyword || "").trim();
  if (!keyword) return [];
  var r = await httpGet(base + "/index.php/ajax/suggest", {
    params: { mid: "1", wd: keyword },
    headers: { "User-Agent": UA, Referer: base + "/" }
  });
  var body = r.data;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch (e) { return []; }
  }
  var list = (body && body.list) || [];
  if (!Array.isArray(list) || !list.length) return [];
  return list.map(function (v) {
    return {
      id: "pk:" + v.id,
      type: "url",
      title: String(v.name || ""),
      subtitle: "片库",
      posterPath: absUrl("", v.pic || "")
    };
  });
}

function parseLink(link) {
  var m = /^pk\|(\d+)\|(https?:\/\/[^|]+)$/.exec(String(link || ""));
  if (!m) throw new Error("无法识别片库详情链接：" + link);
  return { id: m[1], base: m[2].replace(/\/+$/, "") };
}

function metaText($, label) {
  var found = "";
  $(".detail-meta span").each(function (i, el) {
    var t = $(el).text().trim();
    if (!found && t.indexOf(label) === 0) found = t.slice(label.length).replace(/^[:：]\s*/, "").trim();
  });
  return found;
}

async function readDetail(base, id) {
  var pageUrl = base + "/voddetail/" + id + ".html";
  var r = await httpGet(pageUrl, { headers: { "User-Agent": UA, Referer: base + "/" } });
  var $ = Widget.html.load(r.data);
  var $title = $(".detail-title").clone();
  $title.find(".detail-remarks").remove();
  var title = $title.text().trim();
  if (!title) throw new Error("片库详情页解析失败（" + id + "）");
  var remarks = $(".detail-remarks").first().text().trim();
  var area = metaText($, "地区");
  var year = metaText($, "年份");
  var lang = metaText($, "语言");
  var director = metaText($, "导演");
  var actors = metaText($, "主演");
  var genres = [];
  $(".detail-meta span a").each(function (i, el) {
    var href = String($(el).attr("href") || "");
    var m = /\/vodtype\/(\d+)\.html/.exec(href);
    if (m) genres.push({ id: m[1], title: $(el).text().trim() });
  });
  var desc = $(".detail-desc").text().replace(/^\s*剧情简介\s*/, "").trim();
  var poster = absUrl(base, $(".detail-poster img").attr("src") || "");
  var dateMatch = /(\d{4})年(\d{1,2})月(\d{1,2})日/.exec(remarks);
  var releaseDate = "";
  if (dateMatch) {
    releaseDate = dateMatch[1] + "-" + ("0" + dateMatch[2]).slice(-2) + "-" + ("0" + dateMatch[3]).slice(-2);
  } else if (year) {
    releaseDate = year + "-01-01";
  }

  var sourceNames = {};
  $(".source-tab-item").each(function (i, el) {
    sourceNames[String($(el).attr("data-target") || "")] = $(el).text().trim();
  });
  var sources = [];
  $(".source-pane").each(function (i, pane) {
    var paneId = String($(pane).attr("id") || "");
    var sid = /playlist-(\d+)/.exec(paneId);
    if (!sid) return;
    var eps = [];
    $(pane).find("a").each(function (j, a) {
      var href = String($(a).attr("href") || "");
      var m = /\/vodplay\/(\d+)-(\d+)-(\d+)\.html/.exec(href);
      if (!m) return;
      eps.push({
        nid: Number(m[3]),
        label: String($(a).attr("title") || $(a).text() || "").trim()
      });
    });
    if (!eps.length) return;
    eps.sort(function (x, y) { return x.nid - y.nid; });
    sources.push({ sid: sid[1], name: sourceNames[paneId] || ("线路 " + sid[1]), eps: eps });
  });

  return {
    base: base, id: id, pageUrl: pageUrl, title: title, remarks: remarks,
    area: area, year: year, lang: lang, director: director, actors: actors,
    genres: genres, desc: desc, poster: poster, releaseDate: releaseDate, sources: sources
  };
}

async function loadDetail(link) {
  var info = parseLink(link);
  var d = await readDetail(info.base, info.id);
  var sub = [];
  if (d.year) sub.push(d.year);
  if (d.area) sub.push(d.area);
  if (d.remarks) sub.push(d.remarks);
  var item = {
    id: "pk:" + d.id,
    type: "url",
    link: link,
    title: d.title,
    subtitle: sub.join(" · "),
    description: d.desc,
    posterPath: d.poster,
    releaseDate: d.releaseDate,
    backdropPaths: d.poster ? [d.poster] : []
  };
  if (d.genres.length) item.genreItems = d.genres;
  var peoples = [];
  if (d.director) peoples.push({ id: "director:" + d.director, title: d.director, role: "导演" });
  if (d.actors) {
    d.actors.split(/[,，/]/).forEach(function (n, i) {
      var name = n.trim();
      if (name) peoples.push({ id: "actor:" + i + ":" + name, title: name, role: "演员" });
    });
  }
  if (peoples.length) item.peoples = peoples;
  return item;
}

function isDirect(url) {
  return /^https?:\/\//.test(url) && /\.(m3u8|mp4)(\?|$)/i.test(url);
}

async function playUrl(base, id, sid, nid) {
  var key = "u|" + id + "|" + sid + "|" + nid;
  try {
    var hit = Widget.storage.get(key);
    if (hit && hit.url && Date.now() - Number(hit.t || 0) < 21600000) return hit.url;
  } catch (e) {}
  var pageUrl = base + "/vodplay/" + id + "-" + sid + "-" + nid + ".html";
  var url = "";
  try {
    var r = await httpGet(pageUrl, { headers: { "User-Agent": UA, Referer: base + "/voddetail/" + id + ".html" } });
    var m = /player_aaaa\s*=\s*(\{[\s\S]*?\})\s*<\/script>/.exec(String(r.data));
    if (m) {
      var pd = JSON.parse(m[1]);
      url = String(pd.url || "");
      if (String(pd.encrypt) === "1" && typeof unescape === "function") {
        try { url = unescape(url); } catch (e2) {}
      }
      if (String(pd.encrypt) === "2") url = "";
      if (url && !/^https?:\/\//.test(url)) url = "";
    }
  } catch (e) {
    console.log("play page failed", pageUrl, String(e && e.message));
    url = "";
  }
  if (url) {
    try { Widget.storage.set(key, { url: url, t: Date.now() }); } catch (e3) {}
  }
  return url;
}

async function mapLimit(items, limit, fn) {
  var out = new Array(items.length);
  var cursor = 0;
  var workers = [];
  var n = Math.max(1, Math.min(limit, items.length));
  for (var w = 0; w < n; w++) {
    workers.push((async function () {
      while (true) {
        var i = cursor++;
        if (i >= items.length) return;
        out[i] = await fn(items[i], i);
      }
    })());
  }
  await Promise.all(workers);
  return out;
}

async function loadResource(params) {
  var base = siteBase(params);
  var id = "";
  if (params && params.link) {
    var m = /^pk\|(\d+)\|(https?:\/\/[^|]+)$/.exec(String(params.link));
    if (m) { id = m[1]; base = m[2].replace(/\/+$/, ""); }
  }
  if (!id && params && params.id) {
    var m2 = /^pk:(\d+)$/.exec(String(params.id));
    if (m2) id = m2[1];
  }
  if (!id) throw new Error("片库：缺少影片 id（" + (params && params.link) + "）");

  var d = await readDetail(base, id);
  if (!d.sources.length) throw new Error("片库：该影片没有可播放线路");

  var probed = await mapLimit(d.sources, 4, async function (s) {
    var url = await playUrl(base, id, s.sid, s.eps[0].nid);
    return { source: s, direct: isDirect(url) };
  });

  var direct = probed.filter(function (p) { return p.direct; });
  if (!direct.length) {
    throw new Error("片库：该片只有云解析/网盘线路（" + probed.map(function (p) { return p.source.name; }).join("、") + "），没有 m3u8 直链");
  }

  var streams = [];
  var budget = 80;
  for (var k = 0; k < direct.length && budget > 0; k++) {
    var src = direct[k].source;
    var eps = src.eps.slice(0, budget);
    budget -= eps.length;
    var urls = await mapLimit(eps, 8, async function (ep) {
      return await playUrl(base, id, src.sid, ep.nid);
    });
    for (var e = 0; e < eps.length; e++) {
      var u = urls[e];
      if (!u || !isDirect(u)) continue;
      var label = eps[e].label || ("第 " + eps[e].nid + " 集");
      var name = src.eps.length > 1 ? src.name + " " + label : src.name + (label && label !== src.name ? " " + label : "");
      streams.push({
        name: name,
        url: u,
        playerType: "system",
        customHeaders: { Referer: base + "/" }
      });
    }
  }
  if (!streams.length) throw new Error("片库：线路探测到了，但没取到可播放地址");
  console.log("片库线路", id, streams.length, direct.map(function (p) { return p.source.name; }).join("、"));
  return streams;
}