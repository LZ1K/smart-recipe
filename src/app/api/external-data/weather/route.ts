import { NextRequest, NextResponse } from "next/server"
import {
  getWeather,
  detectWeatherAnomalies,
  generateWeatherAdjustments,
} from "@/lib/weather"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const latStr = searchParams.get("lat")
    const lonStr = searchParams.get("lon")
    const lat = latStr ? parseFloat(latStr) : undefined
    const lon = lonStr ? parseFloat(lonStr) : undefined

    const weather = await getWeather(
      lat != null && lon != null && !isNaN(lat) && !isNaN(lon)
        ? { lat, lon }
        : undefined
    )
    const alerts = detectWeatherAnomalies(weather)
    const adjustment = generateWeatherAdjustments(weather)

    return NextResponse.json({
      weather,
      alerts,
      adjustment,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("外部数据获取失败:", error)
    return NextResponse.json(
      { error: "数据获取失败", weather: null, alerts: [], adjustment: null },
      { status: 500 }
    )
  }
}
