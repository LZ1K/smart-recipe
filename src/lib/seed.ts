import { prisma } from "./prisma"

const categories = [
  { name: "家常菜", slug: "home-cooking", order: 1 },
  { name: "荤菜", slug: "meat", order: 2 },
  { name: "素菜", slug: "vegetarian", order: 3 },
  { name: "汤羹", slug: "soup", order: 4 },
  { name: "主食", slug: "staple", order: 5 },
]

const recipes = [
  // ====== 家常菜 (6) ======
  {
    name: "麻婆豆腐", slug: "mapo-tofu", categorySlug: "home-cooking",
    description: "四川经典家常名菜，麻辣鲜香，豆腐嫩滑，肉末酥香，堪称下饭利器。",
    cookingTime: 25, difficulty: "简单", servings: 2,
    ingredients: [
      { name: "嫩豆腐", amount: "1块", substitute: "老豆腐" },
      { name: "猪肉末", amount: "100g", substitute: "牛肉末" },
      { name: "豆瓣酱", amount: "1大勺" },
      { name: "花椒粉", amount: "1小勺" },
      { name: "生抽", amount: "1大勺" },
      { name: "淀粉", amount: "适量" },
      { name: "葱姜蒜", amount: "适量" },
    ],
    steps: [
      { order: 1, text: "豆腐切2cm方块，入加了盐的沸水焯2分钟，捞出沥干", tip: "焯水去豆腥，豆腐不易碎" },
      { order: 2, text: "热锅凉油，下肉末炒至变色出油，加入豆瓣酱炒出红油", tip: "小火慢炒出红油" },
      { order: 3, text: "加入葱姜蒜末炒香，倒入适量清水，加生抽调味" },
      { order: 4, text: "轻轻放入豆腐块，中小火煮5分钟入味", tip: "不要大力翻动，用推的方式" },
      { order: 5, text: "水淀粉勾芡，撒花椒粉和葱花出锅", tip: "勾芡分两次，芡汁更均匀" },
    ],
    nutrition: { calories: 320, protein: 22, fat: 24, carbs: 12 },
    tags: ["辣", "快手菜", "下饭"], pairings: ["米饭", "青菜豆腐汤"],
    commonMistakes: ["豆腐不焯水有豆腥味", "大火猛炒导致豆腐碎裂", "花椒粉放太早香味挥发"],
  },
  {
    name: "回锅肉", slug: "twice-cooked-pork", categorySlug: "home-cooking",
    description: "川菜之首，肥而不腻，酱香浓郁，蒜苗配五花肉，经典中的经典。",
    cookingTime: 35, difficulty: "中等", servings: 3,
    ingredients: [
      { name: "五花肉", amount: "300g" },
      { name: "蒜苗", amount: "200g", substitute: "青蒜" },
      { name: "豆瓣酱", amount: "1.5大勺" },
      { name: "甜面酱", amount: "1小勺" },
      { name: "姜片", amount: "3片" },
      { name: "料酒", amount: "1大勺" },
      { name: "豆豉", amount: "1小勺" },
    ],
    steps: [
      { order: 1, text: "五花肉整块冷水下锅，加姜片料酒，煮至筷子能插入（约20分钟）", tip: "煮到八分熟即可，切薄片" },
      { order: 2, text: "肉捞出放凉，切成约3mm的薄片，蒜苗斜刀切段" },
      { order: 3, text: "热锅不放油，下肉片中火煸炒至出油卷曲（灯盏窝）", tip: "煸出油是回锅肉不腻的关键" },
      { order: 4, text: "将肉推到一边，下豆瓣酱炒出红油，再加甜面酱和豆豉" },
      { order: 5, text: "放入蒜苗白先炒断生，再放蒜苗叶翻炒均匀出锅" },
    ],
    nutrition: { calories: 480, protein: 18, fat: 42, carbs: 8 },
    tags: ["辣", "经典", "硬菜"], pairings: ["米饭", "泡菜"],
    commonMistakes: ["肉切太厚嚼不动", "煮肉时间太短肉太硬", "不放油但火太大豆瓣酱糊了"],
  },
  {
    name: "宫保鸡丁", slug: "kung-pao-chicken", categorySlug: "home-cooking",
    description: "糊辣荔枝味，鸡肉滑嫩，花生酥脆，甜酸微辣，老少皆宜的国民菜。",
    cookingTime: 20, difficulty: "简单", servings: 2,
    ingredients: [
      { name: "鸡胸肉", amount: "300g", substitute: "鸡腿肉" },
      { name: "花生米", amount: "50g" },
      { name: "干辣椒", amount: "6-8个" },
      { name: "花椒", amount: "1小勺" },
      { name: "黄瓜", amount: "半根" },
      { name: "胡萝卜", amount: "半根" },
      { name: "醋", amount: "2大勺" },
      { name: "糖", amount: "1.5大勺" },
      { name: "生抽", amount: "1大勺" },
    ],
    steps: [
      { order: 1, text: "鸡胸肉切1.5cm丁，加料酒、盐、淀粉腌制15分钟", tip: "腌制的鸡肉更嫩" },
      { order: 2, text: "花生米小火炒至金黄盛出；黄瓜胡萝卜切丁" },
      { order: 3, text: "调碗汁：醋、糖、生抽、淀粉、水 = 2:1.5:1:1:2", tip: "提前调好汁，炒菜不慌" },
      { order: 4, text: "热锅多油，滑炒鸡丁至变色盛出" },
      { order: 5, text: "留底油爆香花椒干辣椒，放蔬菜丁翻炒，加鸡丁和碗汁翻匀，最后加花生出锅" },
    ],
    nutrition: { calories: 350, protein: 30, fat: 18, carbs: 20 },
    tags: ["微辣", "酸甜", "快手"], pairings: ["米饭"],
    commonMistakes: ["鸡丁不腌制口感柴", "花生炒糊发苦", "汁太多成了炖菜"],
  },
  {
    name: "番茄炒蛋", slug: "tomato-egg", categorySlug: "home-cooking",
    description: "国民家常第一菜，酸甜适口，做法简单却极其讲究火候，家家都有自己的秘密。",
    cookingTime: 10, difficulty: "简单", servings: 2,
    ingredients: [
      { name: "番茄", amount: "2个" },
      { name: "鸡蛋", amount: "3个" },
      { name: "糖", amount: "1小勺" },
      { name: "盐", amount: "适量" },
      { name: "葱花", amount: "适量" },
    ],
    steps: [
      { order: 1, text: "番茄顶部划十字，开水烫1分钟后去皮，切小块" },
      { order: 2, text: "鸡蛋打散加少许盐和几滴水", tip: "加水让蛋更嫩" },
      { order: 3, text: "热锅多油，油热后倒入蛋液，用筷子快速划散，凝固即盛出", tip: "蛋不能炒老，七八分熟就出锅" },
      { order: 4, text: "余油炒番茄块，中小火炒软出汁，加糖和盐" },
      { order: 5, text: "番茄出汁后倒回鸡蛋翻炒均匀，撒葱花出锅" },
    ],
    nutrition: { calories: 200, protein: 14, fat: 12, carbs: 10 },
    tags: ["快手", "家常", "酸甜"], pairings: ["米饭", "面条"],
    commonMistakes: ["蛋炒太老像橡皮", "番茄没炒出汁就放蛋", "水多了变成蛋花汤"],
  },
  {
    name: "红烧肉", slug: "red-braised-pork", categorySlug: "home-cooking",
    description: "色泽红亮，肥而不腻，入口即化。苏轼说'黄州好猪肉，价贱如粪土'，说的就是它。",
    cookingTime: 90, difficulty: "中等", servings: 4,
    ingredients: [
      { name: "五花肉", amount: "500g" },
      { name: "冰糖", amount: "30g" },
      { name: "生抽", amount: "2大勺" },
      { name: "老抽", amount: "1大勺" },
      { name: "料酒", amount: "2大勺" },
      { name: "八角", amount: "2个" },
      { name: "桂皮", amount: "1小块" },
      { name: "香叶", amount: "2片" },
      { name: "姜片", amount: "4片" },
      { name: "葱段", amount: "适量" },
    ],
    steps: [
      { order: 1, text: "五花肉切3cm方块，冷水下锅加姜片料酒焯水，撇去浮沫捞出" },
      { order: 2, text: "锅中少许油，小火炒冰糖至枣红色冒泡", tip: "炒糖色火不能大，颜色变深立刻下肉" },
      { order: 3, text: "下肉块快速翻炒上色，加生抽老抽料酒炒匀" },
      { order: 4, text: "加入没过肉的开水，放八角桂皮香叶葱姜", tip: "一定要用开水，冷水会让肉收缩变硬" },
      { order: 5, text: "大火烧开转小火炖60分钟，收汁时开大火翻匀即可" },
    ],
    nutrition: { calories: 550, protein: 16, fat: 50, carbs: 15 },
    tags: ["硬菜", "宴客", "甜咸"], pairings: ["米饭", "清炒时蔬"],
    commonMistakes: ["炒糖色火大炒糊发苦", "加冷水导致肉质变硬", "水太少中途加水破坏口感"],
  },
  {
    name: "糖醋排骨", slug: "sweet-sour-ribs", categorySlug: "home-cooking",
    description: "酸甜可口，色泽油亮，冷吃热吃各有风味，是饭桌上最先被抢光的菜。",
    cookingTime: 40, difficulty: "中等", servings: 2,
    ingredients: [
      { name: "排骨", amount: "400g" },
      { name: "醋", amount: "3大勺" },
      { name: "糖", amount: "3大勺" },
      { name: "生抽", amount: "2大勺" },
      { name: "老抽", amount: "1小勺" },
      { name: "料酒", amount: "1大勺" },
      { name: "姜片", amount: "3片" },
    ],
    steps: [
      { order: 1, text: "排骨斩小段，冷水下锅加姜片料酒焯水，捞出洗净" },
      { order: 2, text: "热锅少许油，排骨煎至两面金黄" },
      { order: 3, text: "加入糖醋生抽老抽，翻炒均匀上色" },
      { order: 4, text: "加没过排骨的热水，大火烧开转小火炖30分钟" },
      { order: 5, text: "大火收汁，不停翻动使酱汁均匀裹在排骨上", tip: "收汁时容易糊，要一直翻炒" },
    ],
    nutrition: { calories: 420, protein: 24, fat: 30, carbs: 18 },
    tags: ["酸甜", "经典", "宴客"], pairings: ["米饭", "凉拌黄瓜"],
    commonMistakes: ["收汁时开小差糊了", "糖和醋比例不对", "焯水时间太短血水没去干净"],
  },

  // ====== 荤菜 (5) ======
  {
    name: "清蒸鲈鱼", slug: "steamed-bass", categorySlug: "meat",
    description: "蒸鱼之道，重在火候。八分钟刚刚好，鱼肉嫩滑如豆腐，鲜味十足。",
    cookingTime: 20, difficulty: "简单", servings: 2,
    ingredients: [
      { name: "鲈鱼", amount: "1条（约500g）" },
      { name: "葱", amount: "2根" },
      { name: "姜", amount: "1块" },
      { name: "蒸鱼豉油", amount: "2大勺" },
      { name: "料酒", amount: "1大勺" },
    ],
    steps: [
      { order: 1, text: "鲈鱼去鳞去内脏洗净，鱼身两面各划三刀" },
      { order: 2, text: "鱼身抹料酒，鱼腹塞姜片，鱼身铺姜丝葱段，腌制10分钟" },
      { order: 3, text: "蒸锅水烧开后放鱼，大火蒸8分钟（500g为例）", tip: "水开了再放鱼，严格计时" },
      { order: 4, text: "倒掉盘中蒸出的腥水，去掉蒸过的姜葱" },
      { order: 5, text: "重新铺新鲜葱丝，淋蒸鱼豉油，浇上滚烫热油激发香气" },
    ],
    nutrition: { calories: 180, protein: 32, fat: 5, carbs: 2 },
    tags: ["低脂", "高蛋白", "清淡"], pairings: ["蒜蓉油麦菜", "米饭"],
    commonMistakes: ["蒸太久鱼肉老了", "不换姜葱有腥味", "忘浇热油少了灵魂"],
  },
  {
    name: "红烧牛腩", slug: "braised-beef-brisket", categorySlug: "meat",
    description: "牛肉酥烂，汤汁浓郁，萝卜吸饱了肉汁后比肉还好吃。冬天来一碗，暖到心里。",
    cookingTime: 120, difficulty: "中等", servings: 4,
    ingredients: [
      { name: "牛腩", amount: "500g" },
      { name: "白萝卜", amount: "1根" },
      { name: "豆瓣酱", amount: "1大勺" },
      { name: "八角", amount: "2个" },
      { name: "桂皮", amount: "1小块" },
      { name: "香叶", amount: "2片" },
      { name: "生抽", amount: "2大勺" },
      { name: "老抽", amount: "1大勺" },
      { name: "料酒", amount: "2大勺" },
    ],
    steps: [
      { order: 1, text: "牛腩切3cm块，冷水浸泡30分钟去血水，冷水下锅焯水捞出" },
      { order: 2, text: "热锅少许油炒香豆瓣酱葱姜八角桂皮香叶" },
      { order: 3, text: "下牛腩翻炒，加料酒生抽老抽炒匀上色" },
      { order: 4, text: "加足量开水，大火烧开转小火炖90分钟", tip: "耐心是炖牛腩最好的调味料" },
      { order: 5, text: "萝卜滚刀切块，加入锅中再炖30分钟，大火收汁即可" },
    ],
    nutrition: { calories: 400, protein: 35, fat: 22, carbs: 15 },
    tags: ["冬季", "暖身", "硬菜"], pairings: ["米饭", "面条"],
    commonMistakes: ["时间太短牛肉嚼不动", "萝卜放太早炖烂了", "水不够中途加水"],
  },
  {
    name: "蒜蓉大虾", slug: "garlic-shrimp", categorySlug: "meat",
    description: "蒜香扑鼻，虾肉Q弹，做法简单但上桌极有面子，宴客首选海鲜。",
    cookingTime: 15, difficulty: "简单", servings: 2,
    ingredients: [
      { name: "大虾", amount: "300g" },
      { name: "大蒜", amount: "整头", substitute: "蒜蓉酱" },
      { name: "粉丝", amount: "1小把" },
      { name: "生抽", amount: "1大勺" },
      { name: "蚝油", amount: "1大勺" },
      { name: "葱花", amount: "适量" },
    ],
    steps: [
      { order: 1, text: "虾去虾线，开背；粉丝温水泡软；大蒜剁成蒜蓉" },
      { order: 2, text: "一半蒜蓉用油炸至金黄，与另一半生蒜混合，调成金银蒜" },
      { order: 3, text: "盘中粉丝垫底，铺上虾，浇上金银蒜、生抽、蚝油" },
      { order: 4, text: "水开后蒸6分钟，关火焖1分钟" },
      { order: 5, text: "取出撒葱花，浇热油激发香味" },
    ],
    nutrition: { calories: 250, protein: 28, fat: 10, carbs: 15 },
    tags: ["蒜香", "宴客", "快手"], pairings: ["白米饭", "清炒时蔬"],
    commonMistakes: ["蒸太久虾肉老韧", "粉丝没泡透口感差", "蒜蓉全用生的呛口"],
  },
  {
    name: "葱爆羊肉", slug: "scallion-lamb", categorySlug: "meat",
    description: "大葱配羊肉是天作之合，大火爆炒30秒即出锅，羊肉嫩滑，葱香四溢。",
    cookingTime: 15, difficulty: "简单", servings: 2,
    ingredients: [
      { name: "羊肉片", amount: "300g", substitute: "羊肉卷" },
      { name: "大葱", amount: "2根" },
      { name: "生抽", amount: "1大勺" },
      { name: "蚝油", amount: "1大勺" },
      { name: "料酒", amount: "1大勺" },
      { name: "孜然粉", amount: "1小勺" },
      { name: "姜丝", amount: "适量" },
    ],
    steps: [
      { order: 1, text: "羊肉切薄片，加料酒、生抽、少许淀粉腌制10分钟" },
      { order: 2, text: "大葱斜刀切段，姜切丝" },
      { order: 3, text: "大火热锅多油，油冒烟后下羊肉片快速滑炒至变色立即盛出", tip: "全程大火，30秒出锅" },
      { order: 4, text: "锅不洗加少许油，下姜丝大葱爆香" },
      { order: 5, text: "倒回羊肉，加蚝油孜然粉快速翻炒几下出锅" },
    ],
    nutrition: { calories: 350, protein: 26, fat: 25, carbs: 6 },
    tags: ["爆炒", "冬季", "快手"], pairings: ["米饭", "凉拌黄瓜"],
    commonMistakes: ["炒太久羊肉老了", "羊肉切太厚", "火不够大变成炖肉"],
  },
  {
    name: "可乐鸡翅", slug: "cola-chicken-wings", categorySlug: "meat",
    description: "新手必学第一道荤菜，可乐的焦糖给鸡翅裹上漂亮的酱色，甜咸适口。",
    cookingTime: 25, difficulty: "简单", servings: 2,
    ingredients: [
      { name: "鸡翅中", amount: "8个" },
      { name: "可乐", amount: "1罐（330ml）" },
      { name: "生抽", amount: "2大勺" },
      { name: "老抽", amount: "1小勺" },
      { name: "姜片", amount: "3片" },
      { name: "料酒", amount: "1大勺" },
    ],
    steps: [
      { order: 1, text: "鸡翅洗净，两面各划两刀便于入味" },
      { order: 2, text: "冷水下锅加姜片料酒焯水，捞出擦干水分" },
      { order: 3, text: "热锅少许油，鸡翅煎至两面金黄", tip: "煎到金黄再放可乐，颜色更好看" },
      { order: 4, text: "倒入可乐、生抽、老抽、姜片，大火烧开" },
      { order: 5, text: "转中小火炖15分钟，大火收汁至浓稠即可" },
    ],
    nutrition: { calories: 380, protein: 24, fat: 18, carbs: 32 },
    tags: ["新手", "宴客", "快手"], pairings: ["米饭", "青菜"],
    commonMistakes: ["没煎直接炖鸡皮不香", "火太大收汁糊了", "鸡翅不焯水有腥味"],
  },

  // ====== 素菜 (4) ======
  {
    name: "蒜蓉油麦菜", slug: "garlic-lettuce", categorySlug: "vegetarian",
    description: "大火快炒的绿叶菜，蒜香浓郁，脆嫩爽口，全程不超过3分钟。",
    cookingTime: 5, difficulty: "简单", servings: 2,
    ingredients: [
      { name: "油麦菜", amount: "300g" },
      { name: "大蒜", amount: "4瓣" },
      { name: "蚝油", amount: "1大勺" },
      { name: "盐", amount: "少许" },
    ],
    steps: [
      { order: 1, text: "油麦菜洗净切段，大蒜切末" },
      { order: 2, text: "热锅多油，下蒜末爆香至微黄" },
      { order: 3, text: "下油麦菜大火快速翻炒，变软即加蚝油和盐，再翻炒几下出锅" },
    ],
    nutrition: { calories: 60, protein: 3, fat: 4, carbs: 5 },
    tags: ["快手", "清淡", "素菜"], pairings: ["任意荤菜"],
    commonMistakes: ["炒太久变黄出水", "油太少菜不香", "盐放太多掩盖了清香"],
  },
  {
    name: "干煸四季豆", slug: "dry-fried-green-beans", categorySlug: "vegetarian",
    description: "四季豆表皮起皱，焦香四溢，麻辣鲜香，一盘能干三碗饭。",
    cookingTime: 20, difficulty: "中等", servings: 2,
    ingredients: [
      { name: "四季豆", amount: "300g" },
      { name: "猪肉末", amount: "50g", substitute: "不加做成纯素" },
      { name: "干辣椒", amount: "5个" },
      { name: "花椒", amount: "1小勺" },
      { name: "芽菜", amount: "1大勺" },
      { name: "生抽", amount: "1大勺" },
    ],
    steps: [
      { order: 1, text: "四季豆去筋，掰成5cm段，沥干水分（重要！）", tip: "有水会溅油，豆也煸不干" },
      { order: 2, text: "锅中比平时多放油，中火煸炒四季豆至表皮起皱变焦黄，盛出", tip: "一定要煸熟，生四季豆有毒" },
      { order: 3, text: "留底油炒散肉末，加干辣椒花椒芽菜炒香" },
      { order: 4, text: "倒回四季豆，加生抽翻炒均匀出锅" },
    ],
    nutrition: { calories: 180, protein: 8, fat: 12, carbs: 14 },
    tags: ["辣的", "下饭", "素菜"], pairings: ["米饭"],
    commonMistakes: ["四季豆没煸熟有安全隐患", "水没沥干溅油", "火太大外糊内生"],
  },
  {
    name: "醋溜土豆丝", slug: "vinegar-potato", categorySlug: "vegetarian",
    description: "酸辣脆爽的国民素菜，考验刀工和火候，做好了比肉还香。",
    cookingTime: 10, difficulty: "简单", servings: 2,
    ingredients: [
      { name: "土豆", amount: "2个" },
      { name: "干辣椒", amount: "3个" },
      { name: "花椒", amount: "少许" },
      { name: "白醋", amount: "2大勺" },
      { name: "盐", amount: "适量" },
      { name: "葱", amount: "1根" },
    ],
    steps: [
      { order: 1, text: "土豆去皮切细丝，冷水浸泡10分钟去除淀粉，沥干", tip: "泡水去淀粉，炒出来才脆" },
      { order: 2, text: "热锅多油，爆香花椒干辣椒葱段" },
      { order: 3, text: "下土豆丝大火快速翻炒，加盐和白醋", tip: "醋沿锅边淋入，激出香味" },
      { order: 4, text: "炒约2分钟至断生即可出锅，保持脆爽" },
    ],
    nutrition: { calories: 120, protein: 3, fat: 5, carbs: 20 },
    tags: ["酸辣", "快手", "素菜"], pairings: ["米饭", "馒头"],
    commonMistakes: ["不泡水淀粉重不脆", "炒太久变软不脆", "醋放太早挥发掉"],
  },
  {
    name: "蚝油生菜", slug: "oyster-lettuce", categorySlug: "vegetarian",
    description: "简单到不能再简单，却鲜到不能再鲜。开水烫过的生菜淋上蚝油汁，鲜嫩脆爽。",
    cookingTime: 5, difficulty: "简单", servings: 2,
    ingredients: [
      { name: "生菜", amount: "1颗" },
      { name: "蚝油", amount: "2大勺" },
      { name: "蒜末", amount: "适量" },
      { name: "生抽", amount: "1小勺" },
      { name: "糖", amount: "少许" },
    ],
    steps: [
      { order: 1, text: "生菜掰开洗净，烧一大锅水加少许盐和油" },
      { order: 2, text: "水开下生菜烫10秒立即捞出沥干装盘", tip: "烫久了不脆，水要加盐油保色保脆" },
      { order: 3, text: "小碗调汁：蚝油、生抽、糖、少许水搅匀" },
      { order: 4, text: "锅中少许油炒香蒜末，倒入料汁煮开，淋在生菜上" },
    ],
    nutrition: { calories: 50, protein: 2, fat: 3, carbs: 5 },
    tags: ["快手", "清淡", "素菜"], pairings: ["任意荤菜"],
    commonMistakes: ["烫久了不脆还发黑", "蚝油直接浇没加热不香", "水没加盐和油颜色发黄"],
  },

  // ====== 汤羹 (3) ======
  {
    name: "紫菜蛋花汤", slug: "seaweed-egg-soup", categorySlug: "soup",
    description: "经典快手汤，紫菜的鲜和蛋花的嫩，几分钟就搞定，饭桌上不能没有汤。",
    cookingTime: 5, difficulty: "简单", servings: 2,
    ingredients: [
      { name: "紫菜", amount: "1片" },
      { name: "鸡蛋", amount: "1个" },
      { name: "虾皮", amount: "1小把" },
      { name: "盐", amount: "适量" },
      { name: "香油", amount: "几滴" },
      { name: "葱花", amount: "适量" },
    ],
    steps: [
      { order: 1, text: "紫菜撕碎放入汤碗底，鸡蛋打散备用" },
      { order: 2, text: "锅中烧水，加虾皮和盐煮开" },
      { order: 3, text: "转小火，沿筷子慢慢淋入蛋液，静置5秒再轻轻搅动", tip: "小火+筷子引流，蛋花才薄而嫩" },
      { order: 4, text: "将沸汤冲入放了紫菜的碗中，滴香油撒葱花" },
    ],
    nutrition: { calories: 40, protein: 6, fat: 3, carbs: 2 },
    tags: ["快手", "清淡"], pairings: ["任意菜"],
    commonMistakes: ["蛋液倒太快成了蛋块", "紫菜直接煮变烂", "水太少汤太咸"],
  },
  {
    name: "酸辣汤", slug: "hot-sour-soup", categorySlug: "soup",
    description: "一碗下去浑身通透，酸辣开胃，料足汤浓，冬天暖身夏天开胃。",
    cookingTime: 15, difficulty: "简单", servings: 2,
    ingredients: [
      { name: "豆腐", amount: "半块" },
      { name: "木耳", amount: "适量（泡发）" },
      { name: "香菇", amount: "3朵" },
      { name: "鸡蛋", amount: "1个" },
      { name: "白胡椒粉", amount: "1大勺" },
      { name: "醋", amount: "3大勺" },
      { name: "生抽", amount: "1大勺" },
      { name: "淀粉", amount: "适量" },
    ],
    steps: [
      { order: 1, text: "豆腐切细丝，木耳香菇切丝，鸡蛋打散" },
      { order: 2, text: "锅中水烧开，下香菇木耳豆腐丝煮3分钟" },
      { order: 3, text: "加生抽盐调味，加白胡椒粉和醋", tip: "醋最后放，放太早酸味跑掉" },
      { order: 4, text: "水淀粉勾芡至微稠，淋入蛋液搅成蛋花，出锅前淋少许香油" },
    ],
    nutrition: { calories: 100, protein: 10, fat: 4, carbs: 8 },
    tags: ["酸辣", "开胃", "暖身"], pairings: ["煎饺", "包子"],
    commonMistakes: ["胡椒粉放少了不辣", "勾芡太稠像糊糊", "醋放太早没酸味"],
  },
  {
    name: "排骨莲藕汤", slug: "rib-lotus-soup", categorySlug: "soup",
    description: "湖北人的乡愁，莲藕粉糯拉丝，排骨酥烂，汤色奶白，一碗下肚满满幸福感。",
    cookingTime: 120, difficulty: "简单", servings: 4,
    ingredients: [
      { name: "排骨", amount: "300g" },
      { name: "莲藕", amount: "2节" },
      { name: "姜片", amount: "4片" },
      { name: "料酒", amount: "1大勺" },
      { name: "盐", amount: "适量" },
      { name: "枸杞", amount: "少许" },
    ],
    steps: [
      { order: 1, text: "排骨冷水下锅加姜片料酒焯水，莲藕去皮切滚刀块" },
      { order: 2, text: "焯好的排骨重新入锅，加足量水、姜片，大火烧开转小火炖60分钟" },
      { order: 3, text: "加入莲藕块继续炖40分钟至莲藕粉糯", tip: "莲藕不要切太薄，否则炖化了" },
      { order: 4, text: "出锅前加盐调味，撒枸杞，焖2分钟" },
    ],
    nutrition: { calories: 280, protein: 22, fat: 16, carbs: 18 },
    tags: ["暖身", "湖北", "冬季"], pairings: ["米饭", "炒青菜"],
    commonMistakes: ["莲藕炖太烂成泥了", "盐放太早肉不烂", "水中途干了一加水汤就淡了"],
  },

  // ====== 主食 (2) ======
  {
    name: "蛋炒饭", slug: "egg-fried-rice", categorySlug: "staple",
    description: "最简单的往往最见功夫。粒粒分明，蛋香米香交融，隔夜饭炒出来的才是王道。",
    cookingTime: 10, difficulty: "简单", servings: 1,
    ingredients: [
      { name: "隔夜米饭", amount: "1碗" },
      { name: "鸡蛋", amount: "2个" },
      { name: "葱", amount: "1根" },
      { name: "盐", amount: "适量" },
      { name: "食用油", amount: "适量" },
    ],
    steps: [
      { order: 1, text: "米饭提前打散，鸡蛋打散加少许盐，葱切葱花" },
      { order: 2, text: "热锅多油，油热冒烟后下蛋液，用筷子快速划散，凝固即盛出" },
      { order: 3, text: "锅中余油，下米饭大火快速翻炒，用铲子压散结块", tip: "米饭一定要用大火炒，锅气才足" },
      { order: 4, text: "炒到米粒在锅中跳动，加盐和炒好的蛋碎，翻炒均匀撒葱花出锅" },
    ],
    nutrition: { calories: 400, protein: 14, fat: 16, carbs: 50 },
    tags: ["快手", "主食", "新手"], pairings: ["紫菜蛋花汤", "泡菜"],
    commonMistakes: ["用刚煮好的饭炒成了糊", "火太小不够香", "蛋和饭分开吃不是一体"],
  },
  {
    name: "葱油拌面", slug: "scallion-oil-noodles", categorySlug: "staple",
    description: "上海经典小吃，一把小葱熬出的葱油是灵魂，拌上面条，简简单单却香到骨子里。",
    cookingTime: 20, difficulty: "简单", servings: 2,
    ingredients: [
      { name: "面条", amount: "200g" },
      { name: "小葱", amount: "1把（至少10根）" },
      { name: "生抽", amount: "2大勺" },
      { name: "老抽", amount: "1大勺" },
      { name: "白糖", amount: "1小勺" },
      { name: "食用油", amount: "100ml" },
    ],
    steps: [
      { order: 1, text: "小葱洗净沥干（水要擦干），切5cm段，葱白葱绿分开" },
      { order: 2, text: "冷锅冷油下葱白段，小火慢慢炸至微黄，加入葱绿继续炸", tip: "小火慢炸至少10分钟，耐心是葱油的关键" },
      { order: 3, text: "炸到葱变焦黄色，关火捞出葱渣（留少许装饰），油中加生抽老抽白糖搅匀" },
      { order: 4, text: "面条煮至筋道捞出，浇上葱油汁拌匀，撒上炸葱即可" },
    ],
    nutrition: { calories: 450, protein: 10, fat: 22, carbs: 55 },
    tags: ["上海", "快手", "主食"], pairings: ["紫菜蛋花汤"],
    commonMistakes: ["葱有水份溅油", "火大葱炸糊发苦", "面条煮太软拌不开"],
  },
]

async function main() {
  console.log("🌱 开始播种菜谱数据...\n")

  // 创建分类
  for (const cat of categories) {
    await prisma.recipeCategory.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, order: cat.order },
      create: { name: cat.name, slug: cat.slug, order: cat.order },
    })
    console.log(`  ✓ 分类: ${cat.name}`)
  }

  // 获取分类 ID 映射
  const categoryMap = new Map<string, string>()
  for (const cat of categories) {
    const record = await prisma.recipeCategory.findUnique({ where: { slug: cat.slug } })
    if (record) categoryMap.set(cat.slug, record.id)
  }

  // 创建菜谱
  for (const recipe of recipes) {
    const categoryId = categoryMap.get(recipe.categorySlug)
    if (!categoryId) {
      console.log(`  ✗ 跳过 ${recipe.name}: 找不到分类 ${recipe.categorySlug}`)
      continue
    }

    await prisma.recipe.upsert({
      where: { slug: recipe.slug },
      update: {
        name: recipe.name,
        categoryId,
        description: recipe.description,
        ingredients: recipe.ingredients,
        steps: recipe.steps,
        nutrition: recipe.nutrition,
        cookingTime: recipe.cookingTime,
        difficulty: recipe.difficulty,
        servings: recipe.servings,
        tags: recipe.tags,
        pairings: recipe.pairings,
        commonMistakes: recipe.commonMistakes,
      },
      create: {
        name: recipe.name,
        slug: recipe.slug,
        categoryId,
        description: recipe.description,
        ingredients: recipe.ingredients,
        steps: recipe.steps,
        nutrition: recipe.nutrition,
        cookingTime: recipe.cookingTime,
        difficulty: recipe.difficulty,
        servings: recipe.servings,
        tags: recipe.tags,
        pairings: recipe.pairings,
        commonMistakes: recipe.commonMistakes,
      },
    })
    console.log(`  ✓ 菜谱: ${recipe.name}`)
  }

  // 创建相似食材关联
  const ingredientLinks = [
    { name: "辣椒", aliases: ["干辣椒", "小米辣", "红辣椒"], related: ["青椒", "甜椒", "辣椒面", "辣椒油"] },
    { name: "香菜", aliases: ["芫荽"], related: ["香芹", "芹菜"] },
    { name: "猪肉", aliases: ["五花肉", "瘦肉", "猪肉末"], related: ["猪油", "肥肉", "排骨", "猪蹄"] },
    { name: "花生", aliases: ["花生米"], related: ["花生酱", "花生油"] },
    { name: "豆腐", aliases: ["嫩豆腐", "老豆腐", "北豆腐"], related: ["豆干", "豆腐皮", "豆泡"] },
    { name: "鸡蛋", aliases: ["蛋", "土鸡蛋"], related: ["鸭蛋", "鹌鹑蛋"] },
    { name: "大蒜", aliases: ["蒜", "蒜头"], related: ["蒜苗", "蒜薹", "独头蒜"] },
    { name: "土豆", aliases: ["马铃薯", "洋芋"], related: ["红薯", "山药"] },
  ]

  for (const item of ingredientLinks) {
    await prisma.ingredient.upsert({
      where: { name: item.name },
      update: { aliases: item.aliases, relatedIds: item.related },
      create: { name: item.name, aliases: item.aliases, relatedIds: item.related },
    })
    console.log(`  ✓ 食材关联: ${item.name} → [${item.related.join(", ")}]`)
  }

  console.log(`\n✅ 播种完成！共 ${categories.length} 个分类, ${recipes.length} 道菜谱, ${ingredientLinks.length} 个食材关联`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
