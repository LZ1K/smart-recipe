"use client"

import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

interface Preference {
  id: string
  type: "TASTE" | "FAVORITE" | "AVOIDANCE" | "ALLERGY"
  value: string
}

interface PreferenceTagsProps {
  preferences: Preference[]
  onRemove?: (id: string) => void
  readonly?: boolean
}

const typeConfig: Record<string, { label: string; className: string }> = {
  TASTE: { label: "口味", className: "bg-orange-100 text-orange-700 border-orange-200" },
  FAVORITE: { label: "喜爱", className: "bg-green-50 text-green-700 border-green-200" },
  AVOIDANCE: { label: "忌口", className: "bg-red-50 text-red-600 border-red-200" },
  ALLERGY: { label: "过敏", className: "bg-amber-50 text-amber-700 border-amber-200" },
}

export function PreferenceTags({ preferences, onRemove, readonly }: PreferenceTagsProps) {
  if (preferences.length === 0) {
    return <span className="text-sm text-[#8B7355]">暂无偏好记录</span>
  }

  return (
    <div className="flex flex-wrap gap-2">
      {preferences.map((pref) => {
        const config = typeConfig[pref.type] ?? { label: "其他", className: "bg-gray-50 text-gray-600 border-gray-200" }
        return (
          <Badge key={`${pref.type}-${pref.value}`} variant="outline" className={`${config.className} gap-1`}>
            <span className="text-[10px] opacity-60">{config.label}</span>
            {pref.value}
            {!readonly && onRemove && pref.id && (
              <button
                onClick={() => onRemove(pref.id!)}
                className="ml-0.5 hover:opacity-70"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </Badge>
        )
      })}
    </div>
  )
}
