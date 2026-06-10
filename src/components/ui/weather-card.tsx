"use client"

import { useEffect, useState, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Cloud, Thermometer, Droplets, Wind, AlertTriangle, Lightbulb, MapPin } from "lucide-react"

interface WeatherData {
  temperature: number
  humidity: number
  condition: string
  windSpeed: number
  source: string
  city: string
}

interface WeatherAlert {
  type: string
  level: "warning" | "danger"
  message: string
  suggestion: string
}

interface WeatherAdjustment {
  rule: string
  reason: string
  boostedTags: string[]
  suppressedTags: string[]
}

// 上一次定位的坐标缓存（localStorage key）
const GEO_CACHE_KEY = "sr_geo"
const GEO_CACHE_MAX_AGE = 30 * 60 * 1000 // 30 分钟有效

interface GeoCache {
  lat: number
  lon: number
  ts: number
}

function loadGeoCache(): GeoCache | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(GEO_CACHE_KEY)
    if (!raw) return null
    const cache: GeoCache = JSON.parse(raw)
    if (Date.now() - cache.ts > GEO_CACHE_MAX_AGE) {
      localStorage.removeItem(GEO_CACHE_KEY)
      return null
    }
    return cache
  } catch {
    return null
  }
}

function saveGeoCache(lat: number, lon: number) {
  try {
    localStorage.setItem(GEO_CACHE_KEY, JSON.stringify({ lat, lon, ts: Date.now() }))
  } catch {}
}

function getBrowserPosition(): Promise<{ lat: number; lon: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("浏览器不支持定位"))
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      reject,
      { enableHighAccuracy: false, timeout: 5000, maximumAge: 5 * 60 * 1000 }
    )
  })
}

export function WeatherCard() {
  const [data, setData] = useState<{
    weather: WeatherData | null
    alerts: WeatherAlert[]
    adjustment: WeatherAdjustment | null
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [geoError, setGeoError] = useState(false)
  const fetchedRef = useRef(false)

  useEffect(() => {
    if (fetchedRef.current) return
    fetchedRef.current = true

    let cancelled = false

    async function fetchWeather() {
      // 1. 尝试 localStorage 缓存
      const cached = loadGeoCache()

      // 2. 尝试浏览器定位
      let lat: number | undefined = cached?.lat
      let lon: number | undefined = cached?.lon
      let usedGeo = false

      if (!cached) {
        try {
          const pos = await getBrowserPosition()
          lat = pos.lat
          lon = pos.lon
          saveGeoCache(lat, lon)
          usedGeo = true
        } catch {
          // 定位失败，用默认（不带坐标，后端兜底到北京）
          setGeoError(true)
        }
      }

      if (cancelled) return

      // 3. 调 API（带坐标或不带）
      const params = lat != null && lon != null
        ? `?lat=${lat}&lon=${lon}`
        : ""
      try {
        const res = await fetch(`/api/external-data/weather${params}`)
        const json = await res.json()
        if (!cancelled) {
          setData(json)
          if (usedGeo) setGeoError(false)
        }
      } catch {
        if (!cancelled) setGeoError(true)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchWeather()
    return () => { cancelled = true }
  }, [])

  if (loading) {
    return (
      <Card className="border-[#E8D5C4]">
        <CardContent className="p-3">
          <p className="text-xs text-[#8B7355]">定位中，加载天气...</p>
        </CardContent>
      </Card>
    )
  }

  if (!data?.weather) {
    return (
      <Card className="border-[#E8D5C4]">
        <CardContent className="p-3">
          <p className="text-xs text-[#8B7355]">天气数据暂不可用</p>
        </CardContent>
      </Card>
    )
  }

  const { weather, alerts, adjustment } = data

  return (
    <Card className="border-[#E8D5C4] card-paper">
      <CardContent className="p-3 space-y-3">
        {/* 城市 + 天气状况 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 min-w-0">
            <MapPin className="h-3.5 w-3.5 text-[#E07B3C] flex-shrink-0" />
            <span className="text-xs text-[#8B7355] truncate" title={weather.city}>
              {weather.city}
            </span>
            {geoError && (
              <span className="text-[10px] text-[#8B7355] opacity-50">（未授权定位，使用默认城市）</span>
            )}
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <Cloud className="h-4 w-4 text-[#E07B3C]" />
            <span className="text-sm font-medium text-[#5C3D2E]">{weather.condition}</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="space-y-0.5">
            <Thermometer className="h-3.5 w-3.5 mx-auto text-[#E07B3C]" />
            <div className="text-lg font-bold text-[#5C3D2E]">{weather.temperature}°</div>
            <div className="text-[10px] text-[#8B7355]">气温</div>
          </div>
          <div className="space-y-0.5">
            <Droplets className="h-3.5 w-3.5 mx-auto text-blue-400" />
            <div className="text-lg font-bold text-[#5C3D2E]">{weather.humidity}%</div>
            <div className="text-[10px] text-[#8B7355]">湿度</div>
          </div>
          <div className="space-y-0.5">
            <Wind className="h-3.5 w-3.5 mx-auto text-gray-400" />
            <div className="text-lg font-bold text-[#5C3D2E]">{weather.windSpeed}</div>
            <div className="text-[10px] text-[#8B7355]">风速</div>
          </div>
        </div>

        {/* 数据来源 */}
        <div className="text-center">
          <span className="text-[10px] text-[#8B7355]">
            {weather.source === "api" ? "实时数据" : weather.source === "cache" ? "24h 缓存" : "季节估算"}
          </span>
        </div>

        {/* 异常预警 */}
        {alerts.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-[#E8D5C4]">
            <div className="flex items-center gap-1 text-xs text-red-500 font-medium">
              <AlertTriangle className="h-3 w-3" />异常预警
            </div>
            {alerts.map((alert, i) => (
              <div key={i} className={`text-xs p-2 rounded ${
                alert.level === "danger" ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-700"
              }`}>
                <p className="font-medium">{alert.message}</p>
                <p className="mt-0.5 opacity-80">{alert.suggestion}</p>
              </div>
            ))}
          </div>
        )}

        {/* 推荐调整 */}
        {adjustment && adjustment.boostedTags.length > 0 && (
          <div className="space-y-1.5 pt-2 border-t border-[#E8D5C4]">
            <div className="flex items-center gap-1 text-xs text-[#E07B3C] font-medium">
              <Lightbulb className="h-3 w-3" />{adjustment.rule}
            </div>
            <p className="text-xs text-[#8B7355]">{adjustment.reason}</p>
            <div className="flex gap-1 flex-wrap">
              {adjustment.boostedTags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-[10px] bg-green-50 text-green-600 border-green-200">
                  ↑{tag}
                </Badge>
              ))}
              {adjustment.suppressedTags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-[10px] bg-red-50 text-red-400 border-green-200">
                  ↓{tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
