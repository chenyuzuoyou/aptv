// 腾讯视频4K Rex 模块 v1.0.6（电影详情模型验证版）
// 转换自 TVBox/FongMi Python 站源《腾讯视频 4K》(tencent_video)，原件见 user/files/4K.py（未改动）。
// 数据面：pbaccess MVLPage 分类（7 频道＋站方 filter_card 全量筛选）/ MbSearch 搜索 / float_vinfo2＋union 详情分集。
// 播放：起播时通过第三方解析 jx4k.fuyingapi.top 获取腾讯 CDN 直链；清晰度与可用性取决于接口返回。
// 跨模块匹配（v1.0.2 新增，照看剧AI rex-kanju 同款标准）：宿主递 TMDB 身份（tmdbId/imdbId 字段或 tv.123/movie.123 链）
//   或纯标题上下文时，以 TMDB 元数据（片名+年份+类型）回站内检索核验，唯一命中才认领本模块的线挂到对方详情下；
//   歧义/无命中返回空、绝不猜。腾讯搜索卡不带年份，年份核验取 float_vinfo2 的 c.year（±1 容差，与 kanju 卡片年份同口径）。
// v1.0.3：保留分集身份，取消详情预解析与假定30分钟直链缓存，补齐解析错误和日志详情。
// v1.0.4：固定单条线路名称，清晰度放入描述；记录资源前后是否变化，便于实机排查。
// v1.0.5：单正片电影不挂第1集；保留多段电影/电视剧选集，补充详情身份日志。
// v1.0.6：资源卡标题显示本次解析返回的完整清晰度，与同次播放地址对应。
WidgetMetadata = {
  id: "forward.tx4k",
  title: "腾讯视频4K",
  version: "1.0.6",
  requiredVersion: "0.0.1",
  description: "腾讯视频：电影/电视剧/短剧/综艺/动漫/少儿/纪录片 7 频道＋站方筛选＋搜索，播放取直链（最高 4K HEVC）",
  author: "Merlin",
  site: "https://v.qq.com",
  detailCacheDuration: 60,
  modules: [
    {
      id: "loadHome",
      title: "推荐",
      functionName: "loadHome",
      type: "video",
      cacheDuration: 60,
      params: [
        { name: "channel", title: "频道", type: "constant", value: "home" },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "loadTxMovie",
      title: "电影",
      functionName: "loadTxMovie",
      type: "video",
      cacheDuration: 60,
      params: [
        { name: "channel", title: "频道", type: "constant", value: "100173" },
        { name: "ctype", title: "频道键", type: "constant", value: "movie" },
        { name: "sort", title: "排序", type: "enumeration", value: "75", enumOptions: [{ title: "最热", value: "75" }, { title: "最新", value: "83" }, { title: "高分好评", value: "81" }] },
        { name: "itype", title: "类型", type: "enumeration", value: "-1", enumOptions: [{ title: "类型", value: "-1" }, { title: "动作", value: "4" }, { title: "喜剧", value: "3" }, { title: "爱情", value: "5" }, { title: "科幻", value: "12" }, { title: "犯罪", value: "6" }, { title: "冒险", value: "7" }, { title: "恐怖", value: "11" }, { title: "动画", value: "15" }, { title: "战争", value: "8" }, { title: "悬疑", value: "10" }, { title: "灾难", value: "25" }, { title: "青春", value: "26" }] },
        { name: "ipay", title: "免费/VIP", type: "enumeration", value: "-1", enumOptions: [{ title: "资费", value: "-1" }, { title: "免费", value: "1" }, { title: "会员", value: "8" }, { title: "付费", value: "4" }, { title: "限免", value: "3300" }] },
        { name: "iarea", title: "地区", type: "enumeration", value: "-1", enumOptions: [{ title: "地区", value: "-1" }, { title: "内地", value: "100024" }, { title: "中国香港", value: "100025" }, { title: "中国台湾", value: "100026" }, { title: "美国", value: "100029" }, { title: "日本", value: "100027" }, { title: "韩国", value: "100028" }, { title: "泰国", value: "100031" }, { title: "印度", value: "100030" }, { title: "英国", value: "15" }, { title: "法国", value: "16" }, { title: "德国", value: "17" }, { title: "加拿大", value: "18" }, { title: "西班牙", value: "19" }, { title: "意大利", value: "20" }, { title: "澳大利亚", value: "21" }, { title: "其他", value: "100033" }] },
        { name: "iyear", title: "年份", type: "enumeration", value: "-1", enumOptions: [{ title: "年份", value: "-1" }, { title: "即将上线", value: "999" }, { title: "2026", value: "2026" }, { title: "2025", value: "2025" }, { title: "2024", value: "2024" }, { title: "2023", value: "2023" }, { title: "2022", value: "2022" }, { title: "2021", value: "2021" }, { title: "2020", value: "2020" }, { title: "2019", value: "20" }, { title: "2018", value: "2018" }, { title: "2017", value: "1" }, { title: "2016", value: "2" }, { title: "2015", value: "3" }, { title: "2014", value: "4" }, { title: "2013-2011", value: "5" }, { title: "2010-2006", value: "6" }, { title: "2005-2000", value: "7" }, { title: "90年代", value: "8" }, { title: "80年代", value: "9" }, { title: "其他", value: "10" }] },
        { name: "producer", title: "出品方", type: "enumeration", value: "-1", enumOptions: [{ title: "出品", value: "-1" }, { title: "腾讯出品", value: "1" }, { title: "索尼", value: "2" }, { title: "派拉蒙", value: "3" }, { title: "迪士尼", value: "4" }, { title: "环球", value: "5" }, { title: "华谊", value: "6" }, { title: "华纳", value: "7" }, { title: "光线", value: "8" }, { title: "BBC", value: "10" }, { title: "20世纪影业", value: "11" }, { title: "开心麻花", value: "12" }] },
        { name: "characteristic", title: "院线/网络", type: "enumeration", value: "-1", enumOptions: [{ title: "其他", value: "-1" }, { title: "院线电影", value: "1" }, { title: "网络电影", value: "2" }, { title: "独播", value: "5" }, { title: "原声", value: "8" }, { title: "粤语", value: "9" }, { title: "获奖佳片", value: "6" }] },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "loadTxTv",
      title: "电视剧",
      functionName: "loadTxTv",
      type: "video",
      cacheDuration: 60,
      params: [
        { name: "channel", title: "频道", type: "constant", value: "100113" },
        { name: "ctype", title: "频道键", type: "constant", value: "tv" },
        { name: "sort", title: "排序", type: "enumeration", value: "75", enumOptions: [{ title: "最热", value: "75" }, { title: "最新上架", value: "79" }, { title: "高分好评", value: "85" }] },
        { name: "itype", title: "类型", type: "enumeration", value: "-1", enumOptions: [{ title: "类型", value: "-1" }, { title: "爱情", value: "1" }, { title: "都市", value: "2" }, { title: "青春", value: "3" }, { title: "奇幻", value: "4" }, { title: "武侠", value: "5" }, { title: "古装", value: "6" }, { title: "科幻", value: "7" }, { title: "猎奇", value: "8" }, { title: "竞技", value: "9" }, { title: "传奇", value: "10" }, { title: "逆袭", value: "19" }, { title: "军旅", value: "11" }, { title: "家庭", value: "12" }, { title: "喜剧", value: "13" }, { title: "悬疑", value: "14" }, { title: "权谋", value: "15" }, { title: "革命", value: "16" }, { title: "现实", value: "17" }, { title: "刑侦", value: "18" }, { title: "民国", value: "20" }, { title: "IP改编", value: "21" }] },
        { name: "ipay", title: "资费", type: "enumeration", value: "-1", enumOptions: [{ title: "资费", value: "-1" }, { title: "免费", value: "1" }, { title: "限免", value: "2" }, { title: "会员", value: "3" }] },
        { name: "iarea", title: "地区", type: "enumeration", value: "-1", enumOptions: [{ title: "地区", value: "-1" }, { title: "内地", value: "0" }, { title: "中国香港", value: "14" }, { title: "中国台湾", value: "4" }, { title: "美国", value: "8" }, { title: "泰国", value: "9" }, { title: "英国", value: "1" }, { title: "韩国", value: "5" }, { title: "日本", value: "10" }, { title: "其他", value: "9999" }] },
        { name: "iyear", title: "年份", type: "enumeration", value: "-1", enumOptions: [{ title: "年份", value: "-1" }, { title: "即将上线", value: "1" }, { title: "2026", value: "2026" }, { title: "2025", value: "2025" }, { title: "2024", value: "2" }, { title: "2023", value: "3" }, { title: "2022", value: "4" }, { title: "2021", value: "5" }, { title: "2020-2016", value: "6" }, { title: "2015-2011", value: "7" }, { title: "2010-2000", value: "8" }, { title: "更早", value: "9" }] },
        { name: "theater", title: "剧场", type: "enumeration", value: "-1", enumOptions: [{ title: "剧场", value: "-1" }, { title: "X剧场", value: "1" }, { title: "板凳单元", value: "2" }, { title: "萤火单元", value: "3" }, { title: "十分剧场", value: "4" }] },
        { name: "award", title: "获奖", type: "enumeration", value: "-1", enumOptions: [{ title: "奖项", value: "-1" }, { title: "白玉兰奖", value: "1" }, { title: "飞天奖", value: "2" }, { title: "金鹰奖", value: "3" }] },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "loadTxMini",
      title: "短剧",
      functionName: "loadTxMini",
      type: "video",
      cacheDuration: 60,
      params: [
        { name: "channel", title: "频道", type: "constant", value: "120188" },
        { name: "ctype", title: "频道键", type: "constant", value: "mini_series" },
        { name: "sort", title: "排序", type: "enumeration", value: "75", enumOptions: [{ title: "最热", value: "75" }, { title: "最新上架", value: "76" }, { title: "限免中", value: "90" }] },
        { name: "prefer", title: "偏好", type: "enumeration", value: "-1", enumOptions: [{ title: "偏好", value: "-1" }, { title: "男频", value: "2" }, { title: "女频", value: "1" }] },
        { name: "story", title: "故事背景", type: "enumeration", value: "-1", enumOptions: [{ title: "故事背景", value: "-1" }, { title: "古装爱情", value: "1" }, { title: "都市爱情", value: "2" }, { title: "都市奇幻", value: "3" }, { title: "古装权谋", value: "5" }, { title: "年代", value: "6" }, { title: "青春", value: "8" }, { title: "职场", value: "10" }, { title: "民国", value: "11" }, { title: "末日", value: "12" }, { title: "乡村", value: "15" }, { title: "悬疑推理", value: "18" }, { title: "玄幻", value: "19" }, { title: "喜剧", value: "21" }] },
        { name: "identity", title: "身份人设", type: "enumeration", value: "-1", enumOptions: [{ title: "身份人设", value: "-1" }, { title: "总裁", value: "1" }, { title: "大女主", value: "2" }, { title: "战神", value: "3" }, { title: "萌娃", value: "4" }, { title: "神医", value: "5" }, { title: "落难千金", value: "6" }, { title: "赘婿", value: "7" }, { title: "神豪", value: "8" }, { title: "大男主", value: "9" }, { title: "女帝", value: "10" }, { title: "皇后王妃", value: "11" }, { title: "青梅竹马", value: "13" }, { title: "欢喜冤家", value: "16" }, { title: "大叔", value: "24" }, { title: "小人物", value: "28" }, { title: "团宠", value: "29" }] },
        { name: "attraction", title: "主要看点", type: "enumeration", value: "-1", enumOptions: [{ title: "主要看点", value: "-1" }, { title: "穿越", value: "3" }, { title: "重生", value: "4" }, { title: "逆袭", value: "5" }, { title: "家庭伦理", value: "6" }, { title: "虐心", value: "7" }, { title: "曲折爱情", value: "8" }, { title: "破镜重圆", value: "9" }, { title: "马甲", value: "10" }, { title: "异能", value: "11" }, { title: "甜宠爱情", value: "12" }, { title: "奇幻爱情", value: "13" }, { title: "闪婚", value: "15" }, { title: "系统流", value: "16" }, { title: "传承觉醒", value: "19" }, { title: "亲情", value: "20" }, { title: "宅门风云", value: "21" }, { title: "家族恩怨", value: "22" }, { title: "身份之谜", value: "23" }, { title: "追妻", value: "25" }, { title: "虐渣复仇", value: "29" }, { title: "权力争夺", value: "47" }, { title: "恐怖", value: "49" }, { title: "娱乐圈", value: "88" }, { title: "脑洞", value: "89" }] },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "loadTxVariety",
      title: "综艺",
      functionName: "loadTxVariety",
      type: "video",
      cacheDuration: 60,
      params: [
        { name: "channel", title: "频道", type: "constant", value: "100109" },
        { name: "ctype", title: "频道键", type: "constant", value: "variety" },
        { name: "sort", title: "排序", type: "enumeration", value: "75", enumOptions: [{ title: "最热", value: "75" }, { title: "最近更新", value: "23" }, { title: "高分好评", value: "85" }] },
        { name: "itype", title: "类型", type: "enumeration", value: "-1", enumOptions: [{ title: "类型", value: "-1" }, { title: "游戏", value: "10" }, { title: "脱口秀", value: "2" }, { title: "音乐舞台", value: "11" }, { title: "情感", value: "12" }, { title: "生活", value: "22" }, { title: "职场", value: "20" }, { title: "喜剧", value: "14" }, { title: "美食", value: "19" }, { title: "潮流运动", value: "21" }, { title: "竞技", value: "24" }, { title: "影视", value: "16" }, { title: "电竞", value: "15" }, { title: "推理", value: "25" }, { title: "访谈", value: "3" }, { title: "亲子", value: "17" }, { title: "文化", value: "26" }, { title: "互动", value: "23" }, { title: "晚会", value: "6" }, { title: "资讯", value: "7" }] },
        { name: "ipay", title: "资费", type: "enumeration", value: "-1", enumOptions: [{ title: "资费", value: "-1" }, { title: "免费", value: "1" }, { title: "会员", value: "6" }] },
        { name: "exclusive", title: "自制/独播", type: "enumeration", value: "-1", enumOptions: [{ title: "出品", value: "-1" }, { title: "腾讯自制", value: "1" }, { title: "独播", value: "2" }] },
        { name: "iarea", title: "地区", type: "enumeration", value: "-1", enumOptions: [{ title: "地区", value: "-1" }, { title: "国内", value: "1" }, { title: "海外", value: "2" }] },
        { name: "iyear", title: "年份", type: "enumeration", value: "-1", enumOptions: [{ title: "年份", value: "-1" }, { title: "2026", value: "2026" }, { title: "2025", value: "2025" }, { title: "2024", value: "2024" }, { title: "2023", value: "2023" }, { title: "2022", value: "2022" }, { title: "2021", value: "2021" }, { title: "2020", value: "50" }, { title: "2019", value: "7" }, { title: "2018", value: "1" }, { title: "2017", value: "2" }, { title: "2016", value: "3" }, { title: "2015", value: "4" }, { title: "2014", value: "5" }, { title: "2013", value: "6" }, { title: "2012", value: "2012" }, { title: "2011", value: "2011" }, { title: "2010", value: "2010" }, { title: "更早", value: "99" }] },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "loadTxCartoon",
      title: "动漫",
      functionName: "loadTxCartoon",
      type: "video",
      cacheDuration: 60,
      params: [
        { name: "channel", title: "频道", type: "constant", value: "100119" },
        { name: "ctype", title: "频道键", type: "constant", value: "cartoon" },
        { name: "sort", title: "排序", type: "enumeration", value: "75", enumOptions: [{ title: "最热", value: "75" }, { title: "最近更新", value: "23" }, { title: "高分好评", value: "85" }] },
        { name: "iarea", title: "地区", type: "enumeration", value: "-1", enumOptions: [{ title: "地区", value: "-1" }, { title: "内地", value: "1" }, { title: "日本", value: "2" }, { title: "欧美", value: "3" }, { title: "其他", value: "4" }] },
        { name: "ipay", title: "免费/VIP", type: "enumeration", value: "-1", enumOptions: [{ title: "资费", value: "-1" }, { title: "免费", value: "867" }, { title: "会员", value: "6" }, { title: "限免", value: "3300" }] },
        { name: "itype", title: "类型", type: "enumeration", value: "-1", enumOptions: [{ title: "类型", value: "-1" }, { title: "玄幻", value: "9" }, { title: "科幻", value: "4" }, { title: "奇幻", value: "21" }, { title: "武侠", value: "13" }, { title: "仙侠", value: "23" }, { title: "都市", value: "24" }, { title: "恋爱", value: "7" }, { title: "搞笑", value: "1" }, { title: "冒险", value: "2" }, { title: "悬疑", value: "17" }, { title: "竞技", value: "20" }, { title: "日常", value: "15" }, { title: "真人", value: "18" }, { title: "治愈", value: "25" }, { title: "游戏", value: "26" }, { title: "异能", value: "27" }, { title: "历史", value: "19" }, { title: "古风", value: "28" }, { title: "智斗", value: "29" }, { title: "恐怖", value: "30" }, { title: "美食", value: "31" }, { title: "音乐", value: "32" }, { title: "其他", value: "12" }] },
        { name: "iyear", title: "年份", type: "enumeration", value: "-1", enumOptions: [{ title: "年份", value: "-1" }, { title: "2026", value: "2026" }, { title: "2025", value: "2025" }, { title: "2024", value: "2024" }, { title: "2023", value: "2023" }, { title: "2022", value: "2022" }, { title: "2021", value: "2021" }, { title: "2020", value: "50" }, { title: "2019", value: "11" }, { title: "2018", value: "2018" }, { title: "2017", value: "2017" }, { title: "2016", value: "1" }, { title: "2015", value: "2" }, { title: "2014", value: "3" }, { title: "2013", value: "4" }, { title: "2012", value: "5" }, { title: "2011", value: "6" }, { title: "00年代", value: "7" }, { title: "90年代", value: "8" }, { title: "80年代", value: "9" }, { title: "更早", value: "10" }] },
        { name: "anime_status", title: "连载/完结", type: "enumeration", value: "-1", enumOptions: [{ title: "状态", value: "-1" }, { title: "即将上线", value: "46" }, { title: "更新中", value: "44" }, { title: "已完结", value: "45" }] },
        { name: "item", title: "3D/2D", type: "enumeration", value: "1", enumOptions: [{ title: "画风", value: "1" }, { title: "3D动画", value: "2" }, { title: "2D动画", value: "3" }, { title: "特摄", value: "4" }, { title: "其他", value: "5" }] },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "loadTxChild",
      title: "少儿",
      functionName: "loadTxChild",
      type: "video",
      cacheDuration: 60,
      params: [
        { name: "channel", title: "频道", type: "constant", value: "100150" },
        { name: "ctype", title: "频道键", type: "constant", value: "child" },
        { name: "sort", title: "排序", type: "enumeration", value: "75", enumOptions: [{ title: "最热", value: "75" }, { title: "最新", value: "76" }] },
        { name: "iyear", title: "年龄", type: "enumeration", value: "-1", enumOptions: [{ title: "年龄", value: "-1" }, { title: "0-3岁", value: "1" }, { title: "4-6岁", value: "2" }, { title: "7-9岁", value: "3" }, { title: "10岁以上", value: "4" }, { title: "全年龄", value: "7" }] },
        { name: "all", title: "全部", type: "enumeration", value: "-1", enumOptions: [{ title: "全部", value: "-1" }, { title: "叫早·哄睡", value: "1" }, { title: "入园", value: "9" }, { title: "幼小衔接", value: "18" }, { title: "出行工具", value: "16" }, { title: "恐龙", value: "6" }, { title: "玩具节目", value: "10" }, { title: "安全", value: "12" }, { title: "行为习惯", value: "14" }, { title: "情商教育", value: "17" }, { title: "儿歌·童谣", value: "2" }, { title: "绘本·故事", value: "3" }, { title: "颜色", value: "4" }, { title: "汽车", value: "5" }, { title: "百科", value: "13" }, { title: "早教", value: "7" }, { title: "德智体", value: "19" }, { title: "动画", value: "20" }, { title: "真人剧", value: "21" }, { title: "童年记忆", value: "22" }, { title: "科普", value: "23" }, { title: "英语", value: "15" }, { title: "创意玩耍", value: "8" }, { title: "国学", value: "11" }, { title: "搞笑", value: "25" }, { title: "优质佳作", value: "26" }, { title: "学科内容", value: "24" }] },
        { name: "ipay", title: "免费/VIP", type: "enumeration", value: "-1", enumOptions: [{ title: "资费", value: "-1" }, { title: "免费", value: "1" }, { title: "会员", value: "2" }] },
        { name: "itype", title: "类型", type: "enumeration", value: "-1", enumOptions: [{ title: "类型", value: "-1" }, { title: "磨耳朵", value: "22" }, { title: "涨知识", value: "23" }, { title: "冒险", value: "10" }, { title: "儿歌", value: "1" }, { title: "交通工具", value: "11" }, { title: "益智早教", value: "2" }, { title: "玩具", value: "4" }, { title: "魔幻·科幻", value: "12" }, { title: "动物", value: "13" }, { title: "真人·特摄", value: "14" }, { title: "家长甄选", value: "17" }, { title: "动画电影", value: "20" }] },
        { name: "gender", title: "性别", type: "enumeration", value: "-1", enumOptions: [{ title: "性别", value: "-1" }, { title: "女孩", value: "1" }, { title: "男孩", value: "2" }] },
        { name: "language", title: "语言", type: "enumeration", value: "-1", enumOptions: [{ title: "语言", value: "-1" }, { title: "普通话版", value: "3" }, { title: "英文版", value: "1" }] },
        { name: "child_ip", title: "动画明星", type: "enumeration", value: "-1", enumOptions: [{ title: "动画明星", value: "-1" }, { title: "小猪佩奇", value: "1" }, { title: "汪汪队", value: "2" }, { title: "猪猪侠", value: "3" }, { title: "喜羊羊", value: "4" }, { title: "乐迪", value: "5" }, { title: "米小圈", value: "6" }, { title: "米奇", value: "14" }, { title: "舒克贝塔", value: "7" }, { title: "猫和老鼠", value: "8" }, { title: "海绵宝宝", value: "9" }, { title: "芭比", value: "10" }, { title: "叶罗丽", value: "11" }, { title: "开心超人", value: "12" }, { title: "小马宝莉", value: "13" }] },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "loadTxDoco",
      title: "纪录片",
      functionName: "loadTxDoco",
      type: "video",
      cacheDuration: 60,
      params: [
        { name: "channel", title: "频道", type: "constant", value: "100105" },
        { name: "ctype", title: "频道键", type: "constant", value: "doco" },
        { name: "sort", title: "排序", type: "enumeration", value: "75", enumOptions: [{ title: "最热", value: "75" }, { title: "最新", value: "74" }, { title: "高分好评", value: "85" }] },
        { name: "itrailer", title: "出品机构", type: "enumeration", value: "-1", enumOptions: [{ title: "出品", value: "-1" }, { title: "腾讯出品", value: "15" }, { title: "央视", value: "8" }, { title: "BBC", value: "1" }, { title: "国家地理", value: "4" }, { title: "探索频道", value: "3174" }, { title: "HBO", value: "3175" }, { title: "NHK", value: "2" }, { title: "ITV", value: "3530" }, { title: "历史频道", value: "7" }] },
        { name: "itype", title: "分类", type: "enumeration", value: "-1", enumOptions: [{ title: "类型", value: "-1" }, { title: "自然", value: "4" }, { title: "美食", value: "10" }, { title: "社会", value: "3" }, { title: "人文", value: "6" }, { title: "历史", value: "1" }, { title: "军事", value: "2" }, { title: "科技", value: "8" }, { title: "财经", value: "14" }, { title: "探险", value: "15" }, { title: "罪案", value: "7" }, { title: "竞技", value: "12" }, { title: "旅游", value: "11" }] },
        { name: "iregion", title: "地区", type: "enumeration", value: "0", enumOptions: [{ title: "地区", value: "0" }, { title: "国内", value: "1" }, { title: "国外", value: "2" }] },
        { name: "pay", title: "资费", type: "enumeration", value: "-1", enumOptions: [{ title: "资费", value: "-1" }, { title: "免费", value: "1" }, { title: "会员", value: "2" }, { title: "限免", value: "3" }] },
        { name: "iyear", title: "年份", type: "enumeration", value: "-1", enumOptions: [{ title: "年份", value: "-1" }, { title: "2026", value: "2026" }, { title: "2025", value: "2025" }, { title: "2024", value: "1" }, { title: "2023", value: "2" }, { title: "2022", value: "3" }, { title: "2021", value: "4" }, { title: "2020", value: "5" }, { title: "2019-2015", value: "6" }, { title: "2014-2010", value: "7" }, { title: "2009-2005", value: "8" }, { title: "更早", value: "9" }] },
        { name: "page", title: "页码", type: "page" }
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
    title: "搜索",
    functionName: "search",
    params: [
      { name: "keyword", title: "关键词", type: "input" },
      { name: "page", title: "页码", type: "page" }
    ]
  }
};

var PC_UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36";
var MVL = "https://pbaccess.video.qq.com/trpc.multi_vector_layout.mvl_controller.MVLPageHTTPService/getMVLPage?&vversion_platform=2";
var SEARCH_API = "https://pbaccess.video.qq.com/trpc.videosearch.mobile_search.MultiTerminalSearch/MbSearch?vplatform=2";
var VINFO = "https://node.video.qq.com/x/api/float_vinfo2?cid=";
var UNION = "https://union.video.qq.com/fcgi-bin/data?otype=json&tid=1804&appid=20001238&appkey=6c03bbe9658448a4&union_platform=1&idlist=";
var JX4K = "https://jx4k.fuyingapi.top/api/?key=f9ecd007748997c6a81a83c425e9448a&url=";
var COVER = "https://v.qq.com/x/cover/";
var PAGE_SIZE = 21;
var MAX_VIDS = 300;
var TRAILER_KEYS = ["预告", "花絮", "片花", "特辑", "幕后", "采访", "制作", "MV", "主题曲"];
var CHANNELS = [
  { tid: "movie", name: "电影", channel: "100173" },
  { tid: "tv", name: "电视剧", channel: "100113" },
  { tid: "mini_series", name: "短剧", channel: "120188" },
  { tid: "variety", name: "综艺", channel: "100109" },
  { tid: "cartoon", name: "动漫", channel: "100119" },
  { tid: "child", name: "少儿", channel: "100150" },
  { tid: "doco", name: "纪录片", channel: "100105" }
];
var CHANNEL_BY_ID = {};
CHANNELS.forEach(function (c) { CHANNEL_BY_ID[c.channel] = c; CHANNEL_BY_ID[c.tid] = c; });
var TX_FDEF = {"movie":[["sort","75"],["itype","-1"],["ipay","-1"],["iarea","-1"],["iyear","-1"],["producer","-1"],["characteristic","-1"]],"tv":[["sort","75"],["itype","-1"],["ipay","-1"],["iarea","-1"],["iyear","-1"],["theater","-1"],["award","-1"]],"mini_series":[["sort","75"],["prefer","-1"],["story","-1"],["identity","-1"],["attraction","-1"]],"variety":[["sort","75"],["itype","-1"],["ipay","-1"],["exclusive","-1"],["iarea","-1"],["iyear","-1"]],"cartoon":[["sort","75"],["iarea","-1"],["ipay","-1"],["itype","-1"],["iyear","-1"],["anime_status","-1"],["item","1"]],"child":[["sort","75"],["iyear","-1"],["all","-1"],["ipay","-1"],["itype","-1"],["gender","-1"],["language","-1"],["child_ip","-1"]],"doco":[["sort","75"],["itrailer","-1"],["itype","-1"],["iregion","0"],["pay","-1"],["iyear","-1"]]};

// ---------- 基础工具 ----------
function _clean(s) {
  s = String(s == null ? "" : s);
  s = s.replace(/<[^>]*>/g, "");
  s = s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
       .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, " ");
  return s.replace(/\s+/g, " ").trim();
}
function _safe(s) { return _clean(s).replace(/\$/g, " ").replace(/#/g, " ").trim(); }
function _fixPic(pic) {
  var s = String(pic == null ? "" : pic).trim();
  if (!s) return "";
  if (s.indexOf("//") === 0) s = "https:" + s;
  if (s.indexOf("http://") === 0) s = "https://" + s.slice(7);
  if (s.charAt(s.length - 1) === "/") s += "0";
  return s;
}
function _storeGet(k) {
  try {
    if (typeof Widget !== "undefined" && Widget.storage) {
      if (typeof Widget.storage.getItem === "function") return Promise.resolve(Widget.storage.getItem(k));
      if (typeof Widget.storage.get === "function") return Promise.resolve(Widget.storage.get(k));
    }
  } catch (e) {}
  return Promise.resolve(null);
}
function _storeSet(k, v) {
  try {
    if (typeof Widget !== "undefined" && Widget.storage) {
      if (typeof Widget.storage.setItem === "function") { Widget.storage.setItem(k, v); return Promise.resolve(); }
      if (typeof Widget.storage.set === "function") return Promise.resolve(Widget.storage.set(k, v));
    }
  } catch (e) {}
  return Promise.resolve();
}
async function _log(msg) {
  try {
    var raw = await _storeGet("txlog");
    var arr = [];
    try { arr = raw ? JSON.parse(raw) : []; } catch (e) { arr = []; }
    if (!Array.isArray(arr)) arr = [];
    arr.push(new Date().toISOString().slice(5, 16).replace("T", " ") + " " + String(msg));
    while (arr.length > 50) arr.shift();
    await _storeSet("txlog", JSON.stringify(arr));
  } catch (e) {}
}
function _headers(extra) {
  var h = {
    "User-Agent": PC_UA,
    "Accept": "application/json, text/plain, */*",
    "Accept-Language": "zh-CN,zh;q=0.9",
    "Origin": "https://v.qq.com",
    "Referer": "https://v.qq.com/"
  };
  if (extra) { for (var k in extra) h[k] = extra[k]; }
  return h;
}
function _status(res) { return res ? (res.status != null ? res.status : res.statusCode) : 0; }
function _asJson(data) {
  if (data == null) return null;
  if (typeof data === "object") return data;
  try { return JSON.parse(String(data)); } catch (e) { return null; }
}
async function _postJson(url, obj) {
  try {
    var res = await Widget.http.post(url, JSON.stringify(obj), { headers: _headers({ "Content-Type": "application/json" }) });
    if (_status(res) && _status(res) >= 400) return null;
    return _asJson(res && res.data);
  } catch (e) { return null; }
}
async function _getJson(url, headers) {
  try {
    var res = await Widget.http.get(url, { headers: headers || _headers() });
    if (_status(res) && _status(res) >= 400) return null;
    return _asJson(res && res.data);
  } catch (e) { return null; }
}
async function _getText(url, headers) {
  try {
    var res = await Widget.http.get(url, { headers: headers || _headers() });
    if (_status(res) && _status(res) >= 400) return null;
    var d = res && res.data;
    if (d == null) return null;
    return typeof d === "string" ? d : JSON.stringify(d);
  } catch (e) { return null; }
}

// ---------- 分类 ----------
function _ctx(page) {
  var off = (page - 1) * PAGE_SIZE;
  return {
    page_index: String(page), _ctrl_page_index: String(page),
    _ds_cli_6970df954e7a9803_poster_offset: String(off),
    _ds_cli_6970df954e7a9803_poster_size: String(PAGE_SIZE),
    _ctrl_showed_module_num: "1", _merger_mod_cnt: "1",
    sdk_page_ctx: '{"page_offset":1,"page_size":5,"used_module_num":1}',
    video_un_page_index: "1"
  };
}
function _cards(j) {
  var out = [];
  try {
    var cards = (((j || {}).data || {}).modules || {}).normal.cards || [];
    for (var i = 0; i < cards.length; i++) {
      var cl = cards[i].children_list || {};
      for (var key in cl) {
        if (key === "filter_card" || key === "nav_card") continue;
        var lst = (cl[key] || {}).cards;
        if (!Array.isArray(lst)) continue;
        for (var n = 0; n < lst.length; n++) {
          var p = (lst[n] || {}).params || {};
          var title = _safe(p.title || p.sub_title || "");
          var picV = p.new_pic_vt || "", picH = p.new_pic_hz || p.image_url || "";
          if (!title && p.poster) {
            try { var po = JSON.parse(p.poster); title = _safe(po.title); picH = picH || po.image_url || ""; } catch (e) {}
          }
          var cid = String(p.cid || "").trim();
          if (!cid || !title) continue;
          out.push({
            cid: cid, title: title, picV: _fixPic(picV), picH: _fixPic(picH || picV),
            remarks: _safe(p.timelong || p.episode_updated || p.marklabel_0_prime_text || ""),
            year: String(p.year || "")
          });
        }
      }
    }
  } catch (e) {}
  return out;
}
async function _pinMeta(cards) {
  for (var i = 0; i < cards.length; i++) {
    var c = cards[i];
    try { await _storeSet("txmeta:" + c.cid, JSON.stringify({ title: c.title, vt: c.picV, hz: c.picH, year: c.year, remarks: c.remarks })); } catch (e) {}
  }
}
function _toItem(c, mediaType) {
  var desc = [c.year, c.remarks].filter(function (x) { return !!x; }).join(" · ");
  return {
    id: "tx:d:" + c.cid, type: "url", mediaType: mediaType, title: c.title,
    posterPath: c.picV || c.picH, backdropPath: c.picH || c.picV, coverUrl: c.picH || c.picV,
    description: desc, link: "tx:d:" + c.cid
  };
}
function _filterParams(ctype, params) {
  var defs = TX_FDEF[ctype] || [];
  var parts = [];
  defs.forEach(function (d) {
    var v = params[d[0]];
    if (v == null || v === "") v = d[1];
    v = String(v).trim();
    if (v && v !== "-1") parts.push(d[0] + "=" + encodeURIComponent(v));
  });
  if (!parts.some(function (p) { return p.indexOf("sort=") === 0; })) parts.unshift("sort=75");
  return parts.join("&");
}
async function _fetchChannel(channelId, ctype, params, page) {
  var body = {
    page_params: { page_type: "operation", page_id: "channel_list", channel_id: channelId, filter_params: _filterParams(ctype, params) },
    page_context: _ctx(page)
  };
  var j = await _postJson(MVL, body);
  if (!j) { await _log("MVL fail ch=" + channelId + " p=" + page); return []; }
  return _cards(j);
}
async function loadList(params) {
  params = params || {};
  try {
    var channel = String(params.channel || "home");
    var page = Math.max(1, parseInt(params.page, 10) || 1);
    if (channel === "home") {
      if (page > 1) return [];
      var lists = await Promise.all(CHANNELS.slice(0, 3).map(function (c) {
        return _fetchChannel(c.channel, c.tid, { sort: "75" }, 1);
      }));
      var seen = {}, out = [];
      lists.forEach(function (cards, idx) {
        var mt = CHANNELS[idx].tid === "movie" ? "movie" : "tv";
        cards.forEach(function (c) { if (!seen[c.cid]) { seen[c.cid] = 1; out.push(_toItem(c, mt)); } });
      });
      var all = [];
      lists.forEach(function (x) { all = all.concat(x); });
      await _pinMeta(all);
      return out;
    }
    var meta = CHANNEL_BY_ID[channel];
    if (!meta) return [];
    var cards = await _fetchChannel(channel, meta.tid, params, page);
    await _pinMeta(cards);
    var mt = meta.tid === "movie" ? "movie" : "tv";
    return cards.map(function (c) { return _toItem(c, mt); });
  } catch (e) {
    console.error("[tx4k loadList]", e && e.message || e);
    return [];
  }
}

// ---------- 搜索 ----------
function _score(name, wd) {
  var s = 1;
  if (name === wd) s = 6;
  else if (name.indexOf(wd) === 0) s = 5;
  else if (name.indexOf(wd) >= 0) s = name.length <= 12 ? 4 : 2;
  var bad = ["预告", "花絮", "解说", "盘点", "混剪", "彩蛋", "速看", "剪辑", "反应"];
  for (var i = 0; i < bad.length; i++) { if (name.indexOf(bad[i]) >= 0) { s -= 3; break; } }
  if (name.length > 30) s -= 1;
  return s;
}
// MbSearch 原始候选（未排序/未截断）：search 与跨模块匹配共用；失败回 null
async function _mbSearch(wd, page) {
  var body = {
    version: "25042201", clientType: 1, filterValue: "",
    uuid: "B1E50847-D25F-4C4B-BBA0-36F0093487F6", retry: 0,
    query: wd, pagenum: page - 1, isPrefetch: true, pagesize: 30,
    queryFrom: 0, searchDatakey: "", transInfo: "",
    isneedQc: true, preQid: "", adClientInfo: "",
    extraInfo: { isNewMarkLabel: "1", multi_terminal_pc: "1", themeType: "1", sugRelatedIds: "{}", appVersion: "" }
  };
  var j = await _postJson(SEARCH_API, body);
  if (!j) return null;
  var out = [], seen = {};
  function push(lst) {
    (lst || []).forEach(function (it) {
      var doc = (it || {}).doc || {};
      var info = (it || {}).videoInfo || {};
      var vid = String(doc.id || "");
      var name = _safe(info.title);
      if (!vid || !name || seen[vid]) return;
      var sites = info.playSites || [];
      if (sites.length && !sites.some(function (s) { return String(s.enName || "").toLowerCase() === "qq"; })) return;
      seen[vid] = 1;
      var isMv = String(info.typeName || "").indexOf("电影") >= 0;
      out.push({ cid: vid, title: name, picV: "", picH: _fixPic(info.imgUrl), remarks: _safe(info.secondLine), year: "", mt: isMv ? "movie" : "tv", _s: _score(name, wd) });
    });
  }
  push(((j.data || {}).normalList || {}).itemList);
  (((j.data || {}).areaBoxList) || []).forEach(function (box) { push(box.itemList); });
  return out;
}
async function search(params) {
  params = params || {};
  try {
    var wd = String(params.keyword || "").trim();
    if (!wd) return [];
    if (wd.toLowerCase() === "log") {
      var raw = await _storeGet("txlog");
      var arr = [];
      try { arr = raw ? JSON.parse(raw) : []; } catch (e) { arr = []; }
      return [{
        id: "tx:log", type: "url", mediaType: "tv", title: "诊断日志（腾讯视频4K）",
        description: (arr.length ? arr.join("\n") : "暂无日志").slice(-3800),
        link: "tx:log"
      }];
    }
    var page = Math.max(1, parseInt(params.page, 10) || 1);
    var out = await _mbSearch(wd, page);
    if (!out) { await _log("search fail wd=" + wd); return []; }
    out.sort(function (a, b) { return b._s - a._s; });
    var good = out.filter(function (x) { return x._s > 0; });
    var res = (good.length ? good : out).slice(0, 30);
    await _pinMeta(res);
    return res.map(function (c) { return _toItem(c, c.mt || "tv"); });
  } catch (e) {
    console.error("[tx4k search]", e && e.message || e);
    return [];
  }
}

// ---------- 详情 ----------
function _parseLink(link) {
  var s = String(link == null ? "" : link).trim();
  var m = s.match(/^tx:d:([0-9A-Za-z_-]+)$/);
  if (m) return { cid: m[1], vid: "" };
  m = s.match(/^tx:p:([0-9A-Za-z_-]+):([0-9A-Za-z_-]+)$/);
  if (m) return { cid: m[1], vid: m[2] };
  return null;
}
function _unwrap(arg) {
  if (arg == null) return { link: "", episode: 0, mt: "", typ: "", season: 0, tmdbId: "", imdbId: "", title: "" };
  if (typeof arg === "string") return { link: arg, episode: 0, mt: "", typ: "", season: 0, tmdbId: "", imdbId: "", title: "" };
  if (typeof arg === "object") {
    return {
      link: arg.link != null ? String(arg.link) : (arg.id != null ? String(arg.id) : ""),
      episode: parseInt(arg.episode, 10) || 0,
      mt: String(arg.mediaType || arg.media_type || ""), typ: String(arg.type || ""),
      season: parseInt(arg.season, 10) || 0,
      tmdbId: String(arg.tmdbId || arg.tmdb_id || ""), imdbId: String(arg.imdbId || arg.imdb_id || ""),
      title: String(arg.title || arg.seriesName || "")
    };
  }
  return { link: "", episode: 0, mt: "", typ: "", season: 0, tmdbId: "", imdbId: "", title: "" };
}

// ---------- 跨模块匹配（照看剧AI rex-kanju 同款：唯一命中才认领，绝不猜） ----------
function _tnorm(x) { return String(x || "").replace(/[\s・:：!！?？,，。.、'"'‘’“”()（）\[\]【】\-—_]/g, "").toLowerCase(); }
/* 宿主递来的 TMDB 身份：独立字段 tmdbId 是主通道，其次 imdbId、tv.123/movie.123/tmdb: 链形态 */
function _parseTmdbRef(un) {
  if (!un) return null;
  if (/^\d+$/.test(String(un.tmdbId || ""))) return { mt: (un.mt === "tv" || un.mt === "movie") ? un.mt : "", id: String(un.tmdbId) };
  var s = String(un.link || "").trim();
  var m = s.match(/^(?:tmdb:)?(tv|movie)\.(\d+)$/);
  if (m) return { mt: m[1], id: m[2] };
  m = s.match(/^tmdb:(\d+)$/);
  if (m) return { mt: (un.mt === "tv" || un.mt === "movie") ? un.mt : "", id: m[1] };
  if (/^\d+$/.test(s) && un.typ === "tmdb") return { mt: (un.mt === "tv" || un.mt === "movie") ? un.mt : "", id: s };
  if (/^tt\d+$/.test(String(un.imdbId || ""))) return { imdb: String(un.imdbId) };
  return null;
}
async function _matchCache(key) {
  var cached = await _storeGet(key);
  if (cached) { try { var cj = JSON.parse(cached); if (cj && cj.t && Date.now() - cj.t < (cj.v ? 7 : 1) * 86400 * 1000) return cj.v || ""; } catch (e) {} }
  return null;
}
async function _matchSave(key, v) { try { await _storeSet(key, JSON.stringify({ t: Date.now(), v: v })); } catch (e) {} }
// float_vinfo2 头（仅 c 元数据：title/year），年份核验与季号守卫用；失败回 null
async function _vinfoHead(cid) {
  var j = await _getJson(VINFO + encodeURIComponent(cid), _headers({ Referer: "https://v.qq.com/" }));
  if (!j || !j.c) return null;
  return j.c;
}
/* TMDB 身份 → 腾讯 cid：片名规范化全等＋类型一致＋年份（vinfo 实测，±1 容差）核验，唯一命中才认领；
   多命中时仅当「年份全等者恰一人」才收窄（与 kanju 同口径）；核验取不到年份的候选不认领（宁缺勿错） */
async function _txMatchTmdb(ref) {
  var cacheId = ref.imdb ? ("imdb." + ref.imdb) : ((ref.mt || "x") + "." + ref.id);
  var key = "txtmatch:" + cacheId;
  var hit = await _matchCache(key);
  if (hit !== null) return hit;
  var cid = "";
  try {
    if (typeof Widget !== "undefined" && Widget.tmdb && Widget.tmdb.get) {
      var tid = ref.id || "", tmt = ref.mt || "";
      if (ref.imdb) {
        var fd = await Widget.tmdb.get("find/" + ref.imdb, { params: { external_source: "imdb_id", language: "zh-CN" } });
        var tv0 = fd && fd.tv_results && fd.tv_results[0];
        var mv0 = fd && fd.movie_results && fd.movie_results[0];
        if (tv0 && tv0.id) { tid = String(tv0.id); tmt = "tv"; }
        else if (mv0 && mv0.id) { tid = String(mv0.id); tmt = "movie"; }
      }
      var mts = tmt ? [tmt] : ["tv", "movie"];
      for (var mi = 0; mi < mts.length && !cid; mi++) {
        var info = await Widget.tmdb.get(mts[mi] + "/" + tid, { params: { language: "zh-CN" } });
        var title = (info && (info.title || info.name)) || "";
        if (!title) continue;
        var yStr = (info && (info.release_date || info.first_air_date)) || "";
        var year = yStr ? (parseInt(yStr.slice(0, 4), 10) || 0) : 0;
        var nt = _tnorm(title);
        var raw = await _mbSearch(title, 1);
        if (!raw) continue;
        var cands = raw.filter(function (c) {
          if (_tnorm(c.title) !== nt) return false;
          if (mts[mi] === "movie" ? c.mt !== "movie" : c.mt === "movie") return false;
          return true;
        });
        var verified = [];
        for (var ci = 0; ci < cands.length && ci < 4; ci++) {
          var head = await _vinfoHead(cands[ci].cid);
          if (!head) continue;
          if (_tnorm(_safe(head.title || "")) !== nt) continue;
          var cy = parseInt(head.year, 10) || 0;
          if (year && cy && Math.abs(cy - year) > 1) continue;
          verified.push({ cid: cands[ci].cid, year: cy });
        }
        if (verified.length === 1) cid = verified[0].cid;
        else if (verified.length > 1 && year) {
          var exact = verified.filter(function (v) { return v.year === year; });
          if (exact.length === 1) cid = exact[0].cid;
        }
      }
    }
  } catch (e) { cid = ""; }
  await _matchSave(key, cid);
  return cid;
}
/* 纯标题上下文兜底（如豆瓣条目）：站内规范化片名全等且唯一命中才认领（kanju 同口径） */
async function _txMatchByTitle(title, preferTv) {
  var nt = _tnorm(title);
  if (!nt) return "";
  var key = "txtmatch:title." + nt;
  var hit = await _matchCache(key);
  if (hit !== null) return hit;
  var cid = "";
  try {
    var raw = await _mbSearch(title, 1);
    if (raw) {
      var cands = raw.filter(function (c) { return _tnorm(c.title) === nt; });
      if (preferTv) { var tvs = cands.filter(function (c) { return c.mt !== "movie"; }); if (tvs.length) cands = tvs; }
      if (cands.length === 1) cid = cands[0].cid;
    }
  } catch (e) { cid = ""; }
  await _matchSave(key, cid);
  return cid;
}
var _CN_NUM = { 一: 1, 二: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9 };
function _seasonOfTitle(title) {
  var s = String(title || "");
  var m = s.match(/第\s*([0-9]+|[一二三四五六七八九十]+)\s*[季部]/);
  if (m) {
    var t = m[1];
    if (/^\d+$/.test(t)) return parseInt(t, 10) || 0;
    if (t === "十") return 10;
    if (t.charAt(0) === "十" && t.length === 2) return 10 + (_CN_NUM[t.charAt(1)] || 0);
    if (t.length === 2 && t.charAt(1) === "十") return (_CN_NUM[t.charAt(0)] || 0) * 10;
    return _CN_NUM[t] || 0;
  }
  m = s.match(/[\s·:：]([0-9]+)$/);
  if (m) return parseInt(m[1], 10) || 0;
  return 1;
}
/* 认领入口：先 TMDB 身份、后标题兜底；上下文带季号（>1）时，认领到的封面必须同季，
   否则不挂（腾讯按季拆封面、TMDB 片名不分季，这一道守卫防第二季挂到第一季封面下） */
async function _txClaimCid(un) {
  var cid = "";
  var ref = _parseTmdbRef(un);
  if (ref) cid = await _txMatchTmdb(ref);
  if (!cid && un.title) cid = await _txMatchByTitle(un.title, (un.season || 0) > 0 || (un.episode || 0) > 0);
  if (!cid) return "";
  var want = un.season || 0;
  if (want > 1) {
    var head = await _vinfoHead(cid);
    if (!head) return "";
    if (_seasonOfTitle(_safe(head.title || "")) !== want) return "";
  }
  return cid;
}
async function _fetchEpisodes(cid) {
  var j = await _getJson(VINFO + encodeURIComponent(cid), _headers({ Referer: "https://v.qq.com/" }));
  if (!j || !j.c) return null;
  var c = j.c;
  var vids = (c.video_ids || []).map(function (v) { return String(v); }).filter(Boolean).slice(0, MAX_VIDS);
  var fields = {};
  for (var i = 0; i < vids.length; i += 30) {
    var txt = await _getText(UNION + vids.slice(i, i + 30).join(","));
    if (!txt) continue;
    var a = txt.indexOf("{"), b = txt.lastIndexOf("}");
    if (a < 0 || b <= a) continue;
    var o = null;
    try { o = JSON.parse(txt.slice(a, b + 1)); } catch (e) { o = null; }
    if (!o) continue;
    (o.results || []).forEach(function (item) {
      var f = (item || {}).fields || {};
      if (f.vid) fields[String(f.vid)] = f;
    });
  }
  var main = [], groups = { "预告": [], "花絮片花": [], "特辑": [] };
  var flatNam = [];
  (j.nam || []).forEach(function (x) {
    if (Array.isArray(x)) { x.forEach(function (y) { if (y) flatNam.push(y); }); }
    else if (x) flatNam.push(x);
  });
  var typeName = "";
  if (Array.isArray(j.typ) && j.typ.length) {
    var sub = Array.isArray(j.typ[1]) ? j.typ[1] : [];
    typeName = [String(j.typ[0] || "")].concat(sub.map(String)).filter(Boolean).join(",");
  }
  vids.forEach(function (vid, idx) {
    var f = fields[vid] || {};
    var cat = Array.isArray(f.category_map) ? f.category_map : [];
    var catText = cat.length > 1 ? String(cat[1] || "") : "";
    var ep = {
      vid: vid,
      title: _safe(f.title) || (vids.length > 1 ? "第" + (idx + 1) + "集" : "正片"),
      catText: catText,
      chanText: cat.length > 5 ? String(cat[5] || "") : ""
    };
    var isTrailer = catText && TRAILER_KEYS.some(function (k) { return catText.indexOf(k) >= 0; });
    if (isTrailer) {
      if (catText.indexOf("预告") >= 0) groups["预告"].push(ep);
      else if (catText.indexOf("花絮") >= 0 || catText.indexOf("片花") >= 0) groups["花絮片花"].push(ep);
      else groups["特辑"].push(ep);
    } else main.push(ep);
  });
  return { c: c, typeName: typeName, actors: flatNam.map(function (x) { return _clean(x); }).filter(Boolean).join(","), main: main, groups: groups };
}
async function loadDetail(arg) {
  try {
    var u = _unwrap(arg);
    if (u.link === "tx:log") return (await search({ keyword: "log" }))[0];
    var own = _parseLink(u.link);
    var cid = own ? own.cid : "";
    if (!cid) {
      cid = await _txClaimCid(u);
      if (!cid) return null;
      await _log("match detail → cid=" + cid);
    }
    var data = await _fetchEpisodes(cid);
    if (!data) { await _log("detail fail cid=" + cid); return null; }
    var c = data.c;
    var meta = null;
    try { var rawM = await _storeGet("txmeta:" + cid); meta = rawM ? JSON.parse(rawM) : null; } catch (e) { meta = null; }
    var isMovie = data.main.some(function (e) { return e.chanText === "电影"; }) ||
      (data.main.length === 0 && String(data.typeName).indexOf("电影") >= 0);
    var mediaType = isMovie ? "movie" : "tv";
    var standaloneMovie = isMovie && data.main.length === 1;
    var episodeItems = [];
    data.main.forEach(function (e, i) {
      episodeItems.push({
        id: "tx:p:" + cid + ":" + e.vid, type: "url", mediaType: mediaType,
        title: e.title, link: "tx:p:" + cid + ":" + e.vid, episode: i + 1
      });
    });
    ["预告", "花絮片花", "特辑"].forEach(function (g) {
      data.groups[g].forEach(function (e) {
        episodeItems.push({
          id: "tx:p:" + cid + ":" + e.vid, type: "url", mediaType: mediaType,
          title: e.title, link: "tx:p:" + cid + ":" + e.vid
        });
      });
    });
    if (own && own.vid) {
      var selected = episodeItems.filter(function (e) { return e.link === u.link; })[0];
      if (selected && standaloneMovie) delete selected.episode;
      await _log("detail cid=" + cid + " linkKind=p mt=" + mediaType + " main=" + data.main.length +
        " found=" + (selected ? "1" : "0") + " episode=" + (selected && selected.episode || 0));
      return selected || null;
    }
    var coverH = _fixPic(c.pic) || (meta && meta.hz) || "";
    var detail = {
      id: "tx:d:" + cid, type: "url", mediaType: mediaType,
      title: _safe(c.title || c.full_title || (meta && meta.title) || cid),
      posterPath: (meta && meta.vt) || coverH, backdropPath: coverH, coverUrl: coverH,
      description: _clean(c.description || ""),
      genreTitle: data.typeName,
      link: "tx:d:" + cid
    };
    if (!standaloneMovie) detail.episodeItems = episodeItems;
    await _log("detail cid=" + cid + " linkKind=d mt=" + mediaType + " main=" + data.main.length +
      " episodes=" + (detail.episodeItems ? detail.episodeItems.length : 0));
    if (data.actors) detail.description = (detail.description ? detail.description + "\n" : "") + "主演：" + data.actors;
    return detail;
  } catch (e) {
    console.error("[tx4k loadDetail]", e && e.message || e);
    return null;
  }
}

// ---------- 播放 ----------
async function _resolve(cid, vid) {
  var page = COVER + cid + "/" + vid + ".html";
  var res;
  try {
    res = await Widget.http.get(JX4K + encodeURIComponent(page), {
      headers: { "User-Agent": "okhttp/3.14.9", "Content-Type": "application/x-www-form-urlencoded" }
    });
  } catch (e) {
    // 桥接错误可能包含带 key 的完整 URL，不写入日志。
    throw new Error("解析服务网络请求失败，请检查网络或稍后重试");
  }
  if (_status(res) >= 400) throw new Error("解析服务 HTTP " + _status(res));
  var j = _asJson(res && res.data);
  if (!j) throw new Error("解析服务未返回有效 JSON");
  if (String(j.code) !== "200") {
    var msg = _clean(j.msg || j.message || "无错误说明")
      .replace(/https?:\/\/\S+/gi, "[URL]").replace(/key\s*[=:]\s*[^\s&]+/gi, "key=[隐藏]").slice(0, 180);
    throw new Error("解析服务返回 " + String(j.code) + "：" + msg);
  }
  var url = String(j.url || "").trim();
  if (!/^https?:\/\/[^\s/]+(?:\/|$)/i.test(url)) throw new Error("解析服务未返回有效播放地址");
  return { url: url, quality: String(j.quality || "") };
}
async function loadResource(arg) {
  try {
    var u = _unwrap(arg);
    if (u.link === "tx:log") return [];
    var own = _parseLink(u.link);
    await _log("resource start at=" + Date.now() + " owned=" + (own ? "1" : "0") +
      " linkKind=" + (own ? (own.vid ? "p" : "d") : "other") +
      " type=" + (/^(movie|tv|tmdb|url)$/.test(u.typ) ? u.typ : "other") +
      " tmdb=" + (u.tmdbId ? "1" : "0") + " ep=" + (u.episode || 0));
    var cid = own ? own.cid : "", vid = own ? own.vid : "";
    if (!cid) {
      cid = await _txClaimCid(u);
      if (!cid) { await _log("resource unmatched"); return []; }
      await _log("match resource → cid=" + cid + " ep=" + (u.episode || 0));
    }
    if (!vid) {
      var data = await _fetchEpisodes(cid);
      if (!data || !data.main.length) return [];
      if (u.episode > 0) {
        if (u.episode > data.main.length) {
          await _log("episode oob cid=" + cid + " ep=" + u.episode + " max=" + data.main.length);
          return [];
        }
        vid = data.main[u.episode - 1].vid;
      } else {
        vid = data.main[0].vid;
      }
    }
    var pin = await _resolve(cid, vid);
    if (!pin) return [];
    var diagnosticKey = "txdiag:" + cid + ":" + vid;
    var previous = _asJson(await _storeGet(diagnosticKey));
    await _log("resource at=" + Date.now() + " cid=" + cid + " vid=" + vid +
      " route=" + (own ? "own" : "matched") + " ep=" + (u.episode || 0) +
      " urlChanged=" + (previous ? (previous.url === pin.url ? "0" : "1") : "new") +
      " qualityChanged=" + (previous ? (previous.quality === pin.quality ? "0" : "1") : "new"));
    await _storeSet(diagnosticKey, JSON.stringify({ url: pin.url, quality: pin.quality }));
    return [{
      name: pin.quality || "腾讯视频4K",
      description: "腾讯直链" + (pin.quality ? " | " + pin.quality : ""),
      url: pin.url,
      customHeaders: { "User-Agent": PC_UA },
      headers: { "User-Agent": PC_UA }
    }];
  } catch (e) {
    console.error("[tx4k loadResource]", e && e.message || e);
    await _log("play fail: " + (e && e.message || e));
    throw e;
  }
}

// ---------- 入口包装（独立函数名，频道由包装注入；元数据 constant 同值兜底） ----------
async function loadHome(params) { params = params || {}; params.channel = "home"; return loadList(params); }
async function loadTxMovie(params) { params = params || {}; params.channel = "100173"; params.ctype = "movie"; return loadList(params); }
async function loadTxTv(params) { params = params || {}; params.channel = "100113"; params.ctype = "tv"; return loadList(params); }
async function loadTxMini(params) { params = params || {}; params.channel = "120188"; params.ctype = "mini_series"; return loadList(params); }
async function loadTxVariety(params) { params = params || {}; params.channel = "100109"; params.ctype = "variety"; return loadList(params); }
async function loadTxCartoon(params) { params = params || {}; params.channel = "100119"; params.ctype = "cartoon"; return loadList(params); }
async function loadTxChild(params) { params = params || {}; params.channel = "100150"; params.ctype = "child"; return loadList(params); }
async function loadTxDoco(params) { params = params || {}; params.channel = "100105"; params.ctype = "doco"; return loadList(params); }
