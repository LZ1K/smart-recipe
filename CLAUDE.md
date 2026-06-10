# CLAUDE.md

## 协作规则

1. **详细询问再动手**：每一步操作前都先详细询问用户，直到确切理解用户需要什么之后，再开始动手。
2. **不擅自添加内容**：不添加用户没有明确要求的东西。修改文件前先告知用户要做什么，经同意后再执行。
3. **称呼**：每次回复时都要称呼用户为「宽哥」。

## 技术栈

| 层 | 选型 | 注意 |
|---|---|---|
| 框架 | Next.js 16 (App Router + Turbopack) | middleware.ts → proxy.ts，params 是 `Promise<>` 需 await |
| ORM | Prisma 7 | 必须传 `adapter` 才能构造 PrismaClient，用 `@prisma/adapter-pg` + Pool |
| UI | shadcn/ui v4 (`@base-ui/react`) | **没有 asChild 属性**，按钮套 Link 用 `buttonVariants({...}) + className` |
| 校验 | Zod v4 | `error.issues` 不是 `error.errors`；`z.record()` 需两个参数 |
| 认证 | Auth.js v5 (`next-auth@beta`) | JWT 策略，Credentials provider，bcryptjs 加密 |
| AI | DeepSeek API | 通过 `openai` SDK 调用，baseURL 指向 `https://api.deepseek.com/v1` |
| 数据库 | PostgreSQL (本地) | 无 pgvector，偏好用文本匹配 |

## 项目结构

```
src/
├── app/
│   ├── (auth)/login/, register/    # 认证页面
│   ├── (main)/                     # 需登录（proxy 保护）
│   │   ├── recipes/, recipes/[slug]/
│   │   ├── chat/, chat/[id]/
│   │   ├── favorites/, profile/
│   │   └── layout.tsx              # Sidebar + 认证检查
│   ├── api/
│   │   ├── auth/[...nextauth]/, register/
│   │   ├── chat/, conversations/, conversations/[id]/
│   │   ├── recipes/, recipes/[slug]/
│   │   ├── favorites/, preferences/, preferences/[id]/
│   │   ├── external-data/weather/, seasonal/  # 外部数据接入（天气+季节食材）
│   │   └── ...
│   └── layout.tsx                  # 根布局（字体 + Header + Toaster）
├── components/
│   ├── layout/header.tsx, sidebar.tsx
│   └── ui/ (15 shadcn 组件 + recipe-card + chat-panel + preference-tags + weather-card + seasonal-card)
├── lib/ (prisma.ts, auth.ts, deepseek.ts, validations.ts, weather.ts, seasonal-data.ts, seed.ts, seed-seasonal.ts)
├── proxy.ts                        # 路由保护（原 middleware.ts）
└── middleware.ts → 已删除
```

## 设计约定

- **暖色调**：主色 orange `#E07B3C`，背景 cream `#FEFAF6`，文字 brown `#3D2C1E` / `#5C3D2E` / `#8B7355`
- **字体**：Noto Sans SC（正文）+ ZCOOL KuaiLe（标题），无 Geist
- **卡片**：`.card-paper` CSS 类添加纸张质感 SVG 纹理
- **不要**蓝紫渐变、冷色调、AI 风格俗套

## 代码约定

- 按钮套 Link：`<Link className={buttonVariants({variant, size})}>` — 不用 `Button asChild`
- PrismaClient 单例在 `src/lib/prisma.ts`，其他文件直接 import
- SSE 聊天流式输出，`ReadableStream` + `TextEncoder`
- 路由保护在 `src/proxy.ts`（auth check → 重定向 /login）

## 命令速查

```bash
npm run dev                  # 启动开发服务器
npx prisma db push           # 同步 Schema 到数据库
npx prisma generate          # 重新生成 Prisma Client
npx tsx src/lib/seed.ts           # 导入 20 道菜谱 + 分类 + 食材关联
npx tsx src/lib/seed-seasonal.ts  # 导入当前月份当季食材价格
npx tsx src/lib/seed-price-alerts.ts  # 注入价格预警测试数据
npx tsc --noEmit                   # TypeScript 类型检查
```
