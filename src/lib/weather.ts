import "dotenv/config"
import { prisma } from "./prisma"

interface WeatherData {
  temperature: number
  humidity: number
  condition: string
  windSpeed: number
  city: string
  lat?: number
  lon?: number
}

interface GetWeatherOptions {
  city?: string
  lat?: number
  lon?: number
}

const WEATHER_RULES = {
  hot: 32,
  warm: 25,
  cold: 10,
  freezing: 0,
  humid: 70,
  storm: 20,
}

// 四级降级方案：API → 本地DB最新 → 季节推算 → 默认值
export async function getWeather(options: GetWeatherOptions = {}): Promise<WeatherData & { source: string }> {
  const { city: inputCity, lat, lon } = options
  const hasCoords = lat != null && lon != null

  // Level 1: 调用 wttr.in 免费 API（支持坐标）
  try {
    const data = await fetchFromWttr({ city: inputCity, lat, lon })
    if (data) {
      await prisma.weatherRecord.create({
        data: {
          city: data.city,
          lat: data.lat,
          lon: data.lon,
          temperature: data.temperature,
          humidity: data.humidity,
          condition: data.condition,
          windSpeed: data.windSpeed,
          source: "api",
        },
      })
      return { ...data, source: "api" }
    }
  } catch {}

  // Level 2: 读取最新本地缓存（24小时内，按坐标或城市匹配）
  try {
    const cacheWhere: any = {
      fetchedAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    }
    if (hasCoords) {
      cacheWhere.lat = lat
      cacheWhere.lon = lon
    } else {
      cacheWhere.city = inputCity || "北京"
    }

    const recent = await prisma.weatherRecord.findFirst({
      where: cacheWhere,
      orderBy: { fetchedAt: "desc" },
    })
    if (recent) {
      return {
        temperature: recent.temperature,
        humidity: recent.humidity,
        condition: recent.condition,
        windSpeed: recent.windSpeed,
        city: recent.city,
        lat: recent.lat ?? undefined,
        lon: recent.lon ?? undefined,
        source: "cache",
      }
    }
  } catch {}

  // Level 3: 季节推算
  const seasonal = estimateBySeason(inputCity || "北京")
  return { ...seasonal, source: "seasonal_estimate" }
}

async function fetchFromWttr(options: {
  city?: string
  lat?: number
  lon?: number
}): Promise<WeatherData | null> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 8000)

  try {
    // wttr.in 支持坐标格式: /lat,lon?format=j1
    const loc = options.lat != null && options.lon != null
      ? `${options.lat},${options.lon}`
      : encodeURIComponent(options.city || "北京")

    const res = await fetch(
      `https://wttr.in/${loc}?format=j1`,
      { signal: controller.signal }
    )
    if (!res.ok) return null

    const json = await res.json()
    const current = json.current_condition?.[0]
    if (!current) return null

    // 反向地理编码：取 region(省) + country，避免 areaName 返回偏僻音译名
    const area = json.nearest_area?.[0]
    const region = area?.region?.[0]?.value || ""
    const country = area?.country?.[0]?.value || ""
    const areaName = area?.areaName?.[0]?.value || ""
    // 优先用 region: "Guangdong, China"，region 为空则回退 areaName
    const city = region
      ? `${region}, ${country}`
      : areaName
        ? `${areaName}, ${country}`
        : (options.city || "未知")

    return {
      temperature: parseFloat(current.temp_C),
      humidity: parseInt(current.humidity),
      condition: mapCondition(current.weatherDesc?.[0]?.value || "未知"),
      windSpeed: parseFloat(current.windspeedKmph || "0"),
      city,
      lat: options.lat,
      lon: options.lon,
    }
  } catch {
    return null
  } finally {
    clearTimeout(timeout)
  }
}

function mapCondition(raw: string): string {
  const map: Record<string, string> = {
    "Clear": "晴",
    "Sunny": "晴",
    "Partly cloudy": "多云",
    "Cloudy": "阴",
    "Overcast": "阴",
    "Mist": "雾",
    "Fog": "雾",
    "Light rain": "小雨",
    "Moderate rain": "中雨",
    "Heavy rain": "大雨",
    "Light snow": "小雪",
    "Moderate snow": "中雪",
    "Thunderstorm": "雷暴",
    "Thundery": "雷阵雨",
    "Patchy": "局部",
    "Drizzle": "毛毛雨",
    "Showers": "阵雨",
    "Sleet": "雨夹雪",
    "Blizzard": "暴雪",
    "Hail": "冰雹",
  }
  for (const [en, zh] of Object.entries(map)) {
    if (raw.includes(en)) return zh
  }
  return raw
}

function estimateBySeason(city: string): WeatherData {
  const month = new Date().getMonth() + 1
  if (month >= 6 && month <= 8) return { temperature: 30, humidity: 65, condition: "晴", windSpeed: 8, city }
  if (month >= 3 && month <= 5) return { temperature: 18, humidity: 50, condition: "多云", windSpeed: 10, city }
  if (month >= 9 && month <= 11) return { temperature: 15, humidity: 45, condition: "晴", windSpeed: 8, city }
  return { temperature: 2, humidity: 40, condition: "晴", windSpeed: 12, city }
}

// ====== L2: 异常检测 ======

export interface WeatherAlert {
  type: "extreme_heat" | "extreme_cold" | "high_humidity" | "strong_wind"
  level: "warning" | "danger"
  message: string
  suggestion: string
}

export function detectWeatherAnomalies(w: WeatherData): WeatherAlert[] {
  const alerts: WeatherAlert[] = []

  if (w.temperature >= WEATHER_RULES.hot) {
    alerts.push({
      type: "extreme_heat",
      level: w.temperature >= 38 ? "danger" : "warning",
      message: `当前气温 ${w.temperature}°C，属于高温天气`,
      suggestion: w.temperature >= 38
        ? "建议多推荐凉拌菜、冷面、绿豆汤等消暑食谱，避免推荐火锅、红烧等热菜"
        : "可适当推荐清淡解暑的菜品，如凉拌黄瓜、冬瓜汤",
    })
  } else if (w.temperature <= WEATHER_RULES.cold) {
    alerts.push({
      type: "extreme_cold",
      level: w.temperature <= WEATHER_RULES.freezing ? "danger" : "warning",
      message: `当前气温 ${w.temperature}°C，属于低温天气`,
      suggestion: w.temperature <= WEATHER_RULES.freezing
        ? "强烈建议推荐火锅、炖菜、热汤等暖身食谱，避免凉拌、冷面等寒凉菜品"
        : "可多推荐热汤、炖菜等暖身菜品",
    })
  }

  if (w.humidity >= WEATHER_RULES.humid) {
    alerts.push({
      type: "high_humidity",
      level: "warning",
      message: `当前湿度 ${w.humidity}%，易导致食材受潮变质`,
      suggestion: "建议提醒用户注意干货密封保存、绿叶菜尽快食用",
    })
  }

  return alerts
}

// ====== L3: 数据驱动建议 ======

export interface RecipeAdjustment {
  rule: string
  reason: string
  boostedTags: string[]
  suppressedTags: string[]
}

export function generateWeatherAdjustments(w: WeatherData): RecipeAdjustment {
  if (w.temperature >= WEATHER_RULES.hot) {
    return {
      rule: "高温推荐",
      reason: `气温 ${w.temperature}°C，优先推荐清淡消暑菜品`,
      boostedTags: ["清淡", "凉拌", "快手", "低脂"],
      suppressedTags: ["暖身", "冬季", "辣的"],
    }
  }
  if (w.temperature <= WEATHER_RULES.cold) {
    return {
      rule: "低温推荐",
      reason: `气温 ${w.temperature}°C，优先推荐暖身滋补菜品`,
      boostedTags: ["暖身", "冬季", "炖煮", "下饭"],
      suppressedTags: ["凉拌", "清淡", "冷菜"],
    }
  }
  if (w.humidity >= WEATHER_RULES.humid) {
    return {
      rule: "高湿推荐",
      reason: `湿度 ${w.humidity}%，推荐祛湿暖胃菜品`,
      boostedTags: ["汤羹", "暖身", "微辣"],
      suppressedTags: [],
    }
  }
  return {
    rule: "默认推荐",
    reason: "天气适宜，正常推荐",
    boostedTags: [],
    suppressedTags: [],
  }
}

export { WEATHER_RULES }
