import { z } from "zod"

export const RegisterSchema = z.object({
  name: z.string().min(1, "请输入昵称").max(20, "昵称最多20个字符"),
  email: z.string().email("请输入有效的邮箱地址"),
  password: z.string().min(6, "密码至少6个字符").max(100),
})

export const LoginSchema = z.object({
  email: z.string().email("请输入有效的邮箱地址"),
  password: z.string().min(1, "请输入密码"),
})

export const ChatMessageSchema = z.object({
  conversationId: z.string().optional(),
  message: z.string().min(1, "消息不能为空").max(2000, "消息最多2000字"),
})

export const PreferenceSchema = z.object({
  type: z.enum(["TASTE", "FAVORITE", "AVOIDANCE", "ALLERGY"]),
  value: z.string().min(1).max(50),
})

export const RecipeModificationSchema = z.object({
  recipeId: z.string(),
  changes: z.record(z.string(), z.unknown()),
})

export type RegisterInput = z.infer<typeof RegisterSchema>
export type LoginInput = z.infer<typeof LoginSchema>
export type ChatMessageInput = z.infer<typeof ChatMessageSchema>
