import { auth } from "@/lib/auth"
import { PreferenceTags } from "@/components/ui/preference-tags"
import { prisma } from "@/lib/prisma"

export default async function ProfilePage() {
  const session = await auth()

  const preferences = session?.user?.id
    ? await prisma.userPreference.findMany({
        where: { userId: session.user.id },
        orderBy: { type: "asc" },
      })
    : []

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="font-heading text-3xl text-[#5C3D2E] mb-6">个人中心</h1>

      {/* Profile info */}
      <section className="mb-8 p-6 rounded-xl bg-white border border-[#E8D5C4] card-paper">
        <h2 className="font-heading text-lg text-[#5C3D2E] mb-3">账号信息</h2>
        <div className="space-y-2 text-sm text-[#8B7355]">
          <p>昵称：{session?.user?.name || "未设置"}</p>
          <p>邮箱：{session?.user?.email}</p>
        </div>
      </section>

      {/* Preferences */}
      <section className="p-6 rounded-xl bg-white border border-[#E8D5C4] card-paper">
        <h2 className="font-heading text-lg text-[#5C3D2E] mb-3">我的偏好</h2>
        <p className="text-sm text-[#8B7355] mb-4">
          AI 从对话中自动学习的口味偏好，你也可以在偏好管理页面手动修改
        </p>
        {preferences.length > 0 ? (
          <PreferenceTags
            readonly
            preferences={preferences.map((p) => ({
              id: p.id,
              type: p.type as "TASTE" | "FAVORITE" | "AVOIDANCE" | "ALLERGY",
              value: p.value,
            }))}
          />
        ) : (
          <p className="text-sm text-[#8B7355]">
            还没有偏好记录。开始跟 AI 对话，它会自动记住你的口味！
          </p>
        )}
      </section>
    </div>
  )
}
