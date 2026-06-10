# Smart Recipe — 智能菜谱助手

一个懂你口味的 AI 菜谱助手。记住你爱吃什么、忌口什么，用 DeepSeek 大模型为你推荐最对胃口的每一餐。

## 功能

- **智能对话**：像跟朋友聊天一样，告诉 AI 你想吃什么，它帮你推荐菜谱、指导烹饪
- **长期记忆**：AI 自动从对话中提取你的口味偏好和忌口，跨会话记住
- **菜谱库**：20 道经典中式菜谱，含食材清单、详细步骤、贴士、营养信息
- **食材关联**：不吃辣椒 ≠ 不吃青椒，AI 会主动追问，不武断下结论
- **收藏夹**：收藏喜欢的菜谱，随时查看
- **偏好管理**：个人中心查看和编辑 AI 学到的口味偏好
- **外部数据**：实时天气接入 + 当季食材价格，天气异常预警、价格波动提醒

## 技术栈

Next.js 16 · TypeScript · Prisma 7 · PostgreSQL · shadcn/ui v4 · Tailwind CSS · Auth.js v5 · DeepSeek API

## 快速开始

### 前置条件

- Node.js 18+
- PostgreSQL 数据库

### 安装

```bash
npm install
cp .env.example .env   # 编辑 .env 填入 DeepSeek API Key 和数据库连接
```

### 配置 .env

```
DEEPSEEK_API_KEY=sk-xxx
DATABASE_URL="postgresql://user:password@localhost:5432/smart_recipe"
AUTH_SECRET=your-secret
```

### 初始化数据库

```bash
npx prisma db push        # 创建表结构
npx prisma generate       # 生成 Prisma Client
npx tsx src/lib/seed.ts  # 导入 20 道预置菜谱
```

### 启动

```bash
npm run dev
```

访问 http://localhost:3000

## 项目结构

```
src/
├── app/
│   ├── (auth)/          # 登录/注册
│   ├── (main)/          # 主应用（需登录）
│   │   ├── recipes/     # 菜谱库 + 详情
│   │   ├── chat/        # AI 对话
│   │   ├── favorites/   # 收藏夹
│   │   └── profile/     # 个人中心
│   └── api/             # REST API
├── components/
│   ├── layout/          # Header, Sidebar
│   └── ui/              # 设计系统组件
├── lib/                 # 核心库
│   ├── prisma.ts        # 数据库客户端
│   ├── auth.ts          # Auth.js 配置
│   ├── deepseek.ts      # DeepSeek AI 客户端
│   ├── weather.ts       # 天气数据（四级降级获取）
│   ├── seasonal-data.ts # 当季食材价格与智能推荐
│   └── seed.ts          # 种子数据
└── proxy.ts             # 路由保护
```
