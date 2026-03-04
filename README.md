<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=180&section=header&text=🌸%20考研学习平台&fontSize=42&fontColor=fff&animation=fadeIn&fontAlignY=32&desc=Study%20Dashboard%20·%20AI%20驱动的全栈学习管理系统&descSize=16&descAlignY=52" width="100%" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.x-06B6D4?style=flat-square&logo=tailwindcss" />
  <img src="https://img.shields.io/badge/Claude_AI-Sonnet-D97706?style=flat-square&logo=anthropic" />
  <img src="https://img.shields.io/badge/SQLite-Drizzle_ORM-003B57?style=flat-square&logo=sqlite" />
  <img src="https://img.shields.io/badge/shadcn%2Fui-Components-000?style=flat-square&logo=shadcnui" />
</p>

<p align="center">
  <em>「千里之行，始于足下」—— 每一天的坚持，都是通往理想的一步。</em>
</p>

<br/>

<p align="center">
  <img src="https://raw.githubusercontent.com/catppuccin/catppuccin/main/assets/palette/macchiato.png" width="600" />
</p>

---

## 📖 目录

- [✨ 项目简介](#-项目简介)
- [🎯 核心功能](#-核心功能)
- [🛠 技术栈](#-技术栈)
- [📁 项目结构](#-项目结构)
- [🚀 快速部署](#-快速部署)
- [📝 使用指南](#-使用指南)
- [📡 API 接口文档](#-api-接口文档)
- [🗺 开发路线图](#-开发路线图)
- [📄 License](#-license)

---

## ✨ 项目简介

> 一款面向考研备考者的 **全栈 AI 学习管理平台**，将学习进度追踪、AI 智能督学、Multi-Agent 数据分析、信息聚合等功能整合为一体。

<table>
<tr>
<td width="50%">

### 🌟 为什么选择这个平台？

- 📊 **可视化一切** — 热力图、进度环、趋势图，学习数据一目了然
- 🤖 **AI 实时辅导** — 流式输出 + LaTeX 公式，数学问题秒回
- 🧠 **三 Agent 协作** — 分析师 + 策略师 + 教练，自动规划学习
- 🌙 **暗色主题** — 深夜刷题也护眼
- 📱 **响应式设计** — 手机、平板、电脑通用

</td>
<td width="50%">

### 🎯 考试科目支持

```
╭─────────────────────────────────╮
│                                 │
│   📘 思想政治理论    📗 英语一   │
│   📙 数学一          📕 专业课   │
│                                 │
╰─────────────────────────────────╯
```

> 可自由修改 `src/lib/constants.ts` 中的科目配置，适配任意考研方向。

</td>
</tr>
</table>

---

## 🎯 核心功能

### 1. 📊 学习看板 `/dashboard`

考试倒计时 + 学习数据全景视图。

```
┌──────────────┬──────────────┬──────────────┐
│  📅 倒计时    │  ⏱️ 计时器    │  📋 今日概要  │
│   297 天     │   01:23:45   │  4.5h 学习   │
├──────────────┴──────────────┴──────────────┤
│  🎯 四科环形进度图（Recharts 动态渲染）      │
├─────────────────────┬─────────────────────┤
│  📈 周趋势柱状图     │  🎯 目标管理卡片     │
├─────────────────────┴─────────────────────┤
│  🟩🟩🟩⬜🟩🟩 365天 GitHub 风格学习热力图    │
└───────────────────────────────────────────┘
```

**亮点：**
- 学习计时器选择科目 → 开始 → 停止，自动记录到数据库
- 环形进度图展示各科累计学习比例
- 365 天 SVG 热力图，直观呈现学习连续性

---

### 2. 🤖 AI 督学聊天 `/chat`

基于 Claude API 的流式 AI 助手，支持 LaTeX 数学公式实时渲染。

```
┌──────────┬─────────────────────────────────┐
│ 📝 会话列表 │  🤖 AI 督学助手                  │
│           │                                 │
│ ○ 微积分   │  👤 请帮我解一下 ∫x²dx            │
│ ○ 线性代数 │                                 │
│ ○ 电路分析 │  🤖 当然可以！                    │
│           │     ∫x²dx = x³/3 + C            │
│ [+ 新对话] │     其中 C 为积分常数...          │
│           │                                 │
│           │  [输入消息...]           [发送]   │
└──────────┴─────────────────────────────────┘
```

**亮点：**
- SSE 流式输出，逐字显示回答
- `react-markdown` + `remark-math` + `rehype-katex` 渲染 LaTeX
- 对话自动持久化到 SQLite，历史随时回看

---

### 3. 🧠 Multi-Agent 分析 `/agents`

三个 AI Agent 协同工作，每晚自动分析学习数据。

```
            ┌──────────────┐
            │ Orchestrator │
            │   编排器      │
            └──────┬───────┘
                   │
           ┌───────┴───────┐
           ▼               │
    ┌──────────┐           │
    │ Analyst  │           │
    │  分析师   │           │
    └────┬─────┘           │
         │          ┌──────┴──────┐
         ├─────────►│ Strategist  │
         │          │   策略师     │
         │          └─────────────┘
         │          ┌─────────────┐
         └─────────►│   Coach     │
                    │   教练       │
                    └─────────────┘
```

| Agent | 职责 |
|-------|------|
| 🔍 **分析师** | 分析近 7 天学习数据，识别模式和薄弱环节 |
| 📋 **策略师** | 基于分析制定明日 & 本周计划 |
| 💪 **教练** | 生成个性化激励反馈 |

---

### 4. 📰 每日晨报 `/briefs`

综合三个 Agent 报告，AI 自动生成每日学习摘要。

- 📊 **指标横幅** — 周学习时长 / 连续天数 / 科目均衡度
- 📅 **日历导航** — 点击任意日期查看历史晨报
- 📝 **Markdown 渲染** — 支持公式、代码块、表格

---

### 5. 🔍 信息聚合 `/intel`

自动抓取考研相关信息并分类展示（当前为 Mock 数据，可接入真实爬虫）。

| 分类 | 颜色 | 内容示例 |
|------|------|---------|
| 📜 政策 | 🟣 紫色 | 招生简章、政策变更 |
| 📝 经验 | 🔵 蓝色 | 上岸经验贴、备考心得 |
| 📚 资源 | 🟢 绿色 | 教材推荐、网课资源 |
| 📰 新闻 | 🟠 橙色 | 考研最新动态 |

---

### 6. 🌳 知识树 `/knowledge`

考试大纲全知识点树状可视化 + 掌握度管理。

```
📐 数学一
├── 高等数学
│   ├── 极限与连续 ................ 🟢 已掌握
│   ├── 一元函数微分学 ............ 🔵 学习中
│   ├── 一元函数积分学 ............ 🟡 复习中
│   ├── 多元函数微积分 ............ ⚪ 未开始
│   └── ...
├── 线性代数
│   └── ...
└── 概率论与数理统计
    └── ...
```

**状态流转：** ⚪ 未开始 → 🔵 学习中 → 🟡 复习中 → 🟢 已掌握

点击节点状态徽章即可切换，刷新后状态保持。

---

## 🛠 技术栈

<table>
<tr><th colspan="2">🖥 前端</th></tr>
<tr><td><b>Next.js 14</b></td><td>App Router 全栈框架</td></tr>
<tr><td><b>TypeScript 5</b></td><td>类型安全</td></tr>
<tr><td><b>Tailwind CSS 3</b></td><td>原子化样式</td></tr>
<tr><td><b>shadcn/ui</b></td><td>16 个精选 UI 组件</td></tr>
<tr><td><b>Recharts 3</b></td><td>图表可视化</td></tr>
<tr><td><b>Zustand 5</b></td><td>轻量状态管理</td></tr>
<tr><td><b>KaTeX</b></td><td>LaTeX 数学公式渲染</td></tr>
<tr><td><b>next-themes</b></td><td>暗色/亮色主题切换</td></tr>
<tr><th colspan="2">⚙️ 后端</th></tr>
<tr><td><b>SQLite + better-sqlite3</b></td><td>零配置本地数据库</td></tr>
<tr><td><b>Drizzle ORM</b></td><td>类型安全的 SQL 查询</td></tr>
<tr><td><b>Anthropic SDK</b></td><td>Claude AI 集成</td></tr>
<tr><td><b>node-cron</b></td><td>定时任务调度</td></tr>
</table>

### 数据库（9 张表）

```
study_sessions      学习计时记录
daily_progress      每日各科学习时长
chat_conversations  AI 对话记录
chat_messages       聊天消息
agent_reports       Agent 分析报告
morning_briefs      每日晨报
intel_items         信息聚合条目
knowledge_nodes     知识树节点
goals               学习目标
```

---

## 📁 项目结构

```
study_dashboard/
├── src/
│   ├── app/                          # Next.js App Router 页面
│   │   ├── layout.tsx                # 根布局（主题 + 侧边栏）
│   │   ├── page.tsx                  # 首页 → 自动跳转 /dashboard
│   │   ├── dashboard/page.tsx        # 📊 学习看板
│   │   ├── chat/page.tsx             # 🤖 AI 督学
│   │   ├── agents/page.tsx           # 🧠 Agent 报告
│   │   ├── briefs/page.tsx           # 📰 每日晨报
│   │   ├── intel/page.tsx            # 🔍 信息聚合
│   │   ├── knowledge/page.tsx        # 🌳 知识树
│   │   └── api/                      # 后端 API 路由
│   │       ├── sessions/             # 学习计时 CRUD
│   │       ├── progress/             # 进度查询
│   │       ├── goals/                # 目标管理
│   │       ├── chat/                 # AI 对话 (SSE 流式)
│   │       ├── agents/               # Agent 执行 & 报告
│   │       ├── briefs/               # 晨报生成 & 查询
│   │       ├── intel/                # 信息抓取 & 查询
│   │       └── knowledge/            # 知识节点 CRUD
│   │
│   ├── components/
│   │   ├── ui/                       # shadcn/ui 基础组件 (16个)
│   │   ├── layout/                   # 侧边栏 + 顶部导航
│   │   ├── dashboard/                # 看板组件 (7个)
│   │   ├── chat/                     # 聊天组件 (4个)
│   │   ├── agents/                   # Agent 报告卡片
│   │   ├── briefs/                   # 晨报展示 (3个)
│   │   ├── intel/                    # 信息卡片 (3个)
│   │   └── knowledge/                # 知识树组件 (3个)
│   │
│   ├── hooks/use-chat-stream.ts      # SSE 流式传输 Hook
│   ├── instrumentation.ts            # node-cron 定时任务
│   │
│   └── lib/
│       ├── db/schema.ts              # Drizzle ORM 表定义
│       ├── db/index.ts               # 数据库连接 + 自动建表
│       ├── agents/                   # Multi-Agent 系统
│       ├── briefs/generator.ts       # 晨报生成器
│       ├── intel/                    # 信息采集 (Mock 客户端)
│       ├── knowledge/                # 知识树数据 + 种子
│       ├── constants.ts              # 常量定义
│       └── store.ts                  # Zustand 全局状态
│
├── data/                             # SQLite 数据库（自动生成）
├── drizzle.config.ts                 # Drizzle Kit 配置
├── next.config.mjs                   # Next.js 配置
└── package.json
```

> 共 **79 个 TypeScript 源文件**

---

## 🚀 快速部署

### 📋 环境要求

| 依赖 | 最低版本 | 说明 |
|------|---------|------|
| **Node.js** | >= 18.x | 推荐 LTS 版本，[下载地址](https://nodejs.org/) |
| **pnpm** | >= 8.x | 推荐的包管理器，`npm install -g pnpm` 安装 |
| **Git** | 任意 | 用于克隆仓库 |
| **C++ 编译工具** | — | better-sqlite3 原生编译需要（见下方说明） |

#### 关于 C++ 编译工具

`better-sqlite3` 是一个 Node.js 原生模块，安装时需要编译。不同系统的处理方式：

<details>
<summary><b>🪟 Windows</b></summary>

安装 [Visual Studio Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/)，或在 PowerShell 中执行：

```powershell
# 以管理员身份运行
npm install -g windows-build-tools
```

也可以在安装 Node.js 时勾选 "Automatically install the necessary tools"。

</details>

<details>
<summary><b>🍎 macOS</b></summary>

```bash
xcode-select --install
```

</details>

<details>
<summary><b>🐧 Linux (Ubuntu/Debian)</b></summary>

```bash
sudo apt-get update
sudo apt-get install -y build-essential python3
```

</details>

---

### 🔧 第一步：克隆项目

```bash
git clone https://github.com/wuyutanhongyuxin-cell/Study_dashboard.git
cd Study_dashboard
```

---

### 📦 第二步：安装依赖

```bash
# 如果还没有安装 pnpm
npm install -g pnpm

# 安装项目依赖
pnpm install
```

> 安装过程中 `better-sqlite3` 会自动编译原生模块，如果报错请检查上面的 C++ 编译工具是否安装。

如果 `better-sqlite3` 编译失败，可以尝试：

```bash
# 手动重新编译
pnpm rebuild better-sqlite3

# 或者使用 prebuild 二进制文件
cd node_modules/better-sqlite3
npx prebuild-install
cd ../..
```

---

### 🔑 第三步：配置环境变量

```bash
# 复制环境变量模板
cp .env.local.example .env.local
```

编辑 `.env.local` 文件，填入你的 Anthropic API Key：

```env
ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxxxxxxxxxx
```

> **如何获取 API Key？**
> 1. 访问 [console.anthropic.com](https://console.anthropic.com/)
> 2. 注册 / 登录账号
> 3. 进入 "API Keys" 页面
> 4. 点击 "Create Key" 生成新的密钥
> 5. 复制密钥粘贴到 `.env.local` 文件中
>
> **没有 API Key 也能用吗？**
> 可以！除了 AI 聊天、Agent 分析、晨报生成这三个 AI 功能外，其余功能（看板、计时器、知识树、热力图等）全部正常使用。

---

### ▶️ 第四步：启动开发服务器

```bash
pnpm dev
```

终端会输出类似以下内容：

```
  ▲ Next.js 14.2.x
  - Local:        http://localhost:3000
  - Experiments:  instrumentationHook

 ✓ Ready in 2.5s
```

打开浏览器访问 **http://localhost:3000** ，会自动跳转到学习看板页面。

---

### 🏗 第五步（可选）：生产环境构建

```bash
# 构建
pnpm build

# 启动生产服务器
pnpm start
```

生产构建会进行代码优化和预渲染，启动速度更快。

---

### 🐳 Docker 部署（可选）

如果你更喜欢用 Docker：

```dockerfile
# Dockerfile
FROM node:18-alpine AS base
RUN npm install -g pnpm

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

EXPOSE 3000
CMD ["pnpm", "start"]
```

```bash
# 构建并运行
docker build -t study-dashboard .
docker run -p 3000:3000 -e ANTHROPIC_API_KEY=sk-ant-xxx study-dashboard
```

---

### ❓ 常见问题

<details>
<summary><b>Q: 启动后页面白屏 / 500 错误？</b></summary>

检查 `data/` 目录是否有写入权限。SQLite 数据库会自动创建在 `data/study.db`，如果目录不可写会报错。

```bash
mkdir -p data
chmod 755 data
```

</details>

<details>
<summary><b>Q: better-sqlite3 安装报错 `node-gyp` 相关？</b></summary>

这是因为缺少 C++ 编译工具。请参考上方「关于 C++ 编译工具」部分安装对应系统的编译工具，然后重新安装：

```bash
pnpm install
```

</details>

<details>
<summary><b>Q: AI 聊天没有响应？</b></summary>

1. 确认 `.env.local` 中的 `ANTHROPIC_API_KEY` 填写正确
2. 确认 API Key 有足够的额度
3. 检查网络是否能访问 `api.anthropic.com`（国内可能需要代理）

</details>

<details>
<summary><b>Q: 如何修改考试科目？</b></summary>

编辑 `src/lib/constants.ts` 中的 `SUBJECTS` 数组即可：

```typescript
export const SUBJECTS = [
  { id: 'politics', name: '政治', fullName: '思想政治理论', code: '101', totalHours: 300 },
  { id: 'english', name: '英语一', fullName: '英语一', code: '201', totalHours: 250 },
  // 修改或添加你的科目...
];
```

</details>

<details>
<summary><b>Q: 如何修改考试日期？</b></summary>

编辑 `src/lib/constants.ts` 中的 `EXAM_DATE`：

```typescript
export const EXAM_DATE = new Date('2026-12-26');  // 改成你的考试日期
```

</details>

<details>
<summary><b>Q: 数据存在哪里？如何备份？</b></summary>

所有数据存储在项目根目录的 `data/study.db` 文件中（SQLite 数据库），直接复制这个文件即可完成备份。

```bash
cp data/study.db data/study.db.backup
```

</details>

---

## 📝 使用指南

### 每日工作流

```
🌅 早晨                  📚 白天                   🌙 晚上
┌─────────────┐    ┌──────────────┐    ┌──────────────────┐
│  查看晨报     │    │ 计时器记录学习 │    │  Agent 自动分析   │
│  规划今日     │ →  │ AI 辅导答疑   │ →  │  生成明日计划     │
└─────────────┘    └──────────────┘    └──────────────────┘
```

#### Step 1️⃣ — 用计时器记录学习

Dashboard → 选科目 → 点「开始」→ 学习 → 点「停止」→ 自动保存

#### Step 2️⃣ — 向 AI 提问

AI 督学 → 输入问题（支持数学公式）→ 流式返回解答

#### Step 3️⃣ — 管理知识掌握度

知识树 → 首次点「初始化」→ 点击状态徽章切换掌握状态

#### Step 4️⃣ — 运行 Agent 分析

Agent 报告 → 点「运行 Agent」→ 查看分析 / 策略 / 激励报告

### ⏰ 自动定时任务

| 时间 | 任务 |
|------|------|
| 07:00 | 📡 自动抓取考研相关信息 |
| 07:30 | 📰 生成每日晨报 |
| 22:30 | 🧠 运行 Agent 分析当日学习数据 |

---

## 📡 API 接口文档

### 学习计时

```http
GET  /api/sessions                    # 获取学习记录列表
GET  /api/sessions?date=2026-03-04    # 按日期筛选
POST /api/sessions                    # 创建学习记录
     Body: { "subject": "math", "startTime": "...", "endTime": "...", "duration": 90 }
```

### 学习进度

```http
GET  /api/progress                    # 各科累计学习时间
GET  /api/progress?date=today         # 今日进度
GET  /api/progress?range=week         # 最近 7 天
GET  /api/progress?range=year         # 最近 365 天（热力图用）
```

### AI 聊天

```http
POST /api/chat                        # 发送消息（返回 SSE 流）
     Body: { "conversationId": 1, "message": "请解释泰勒展开" }
GET  /api/chat/conversations          # 获取对话列表
POST /api/chat/conversations          # 新建对话
```

### Agent 系统

```http
POST /api/agents/run                  # 触发 Agent 分析
GET  /api/agents/reports              # 获取分析报告
GET  /api/agents/reports?date=2026-03-04
```

### 每日晨报

```http
GET  /api/briefs                      # 晨报列表
POST /api/briefs                      # 生成晨报 Body: { "date": "2026-03-04" }
GET  /api/briefs/2026-03-04           # 获取指定日期晨报
```

### 信息聚合

```http
GET  /api/intel                       # 全部信息
GET  /api/intel?category=policy       # 按分类筛选
POST /api/intel/crawl                 # 触发信息抓取
```

### 知识树

```http
GET   /api/knowledge                  # 获取全部节点
GET   /api/knowledge?subject=math     # 按科目筛选
POST  /api/knowledge                  # 初始化知识树（种子数据）
PATCH /api/knowledge/42               # 更新节点状态
      Body: { "status": "mastered" }
```

---

## 🗺 开发路线图

- [x] Phase 1 — 项目脚手架（数据库 / Schema / 布局系统）
- [x] Phase 2 — 学习看板（倒计时 / 进度环 / 热力图 / 计时器）
- [x] Phase 3 — AI 督学（SSE 流式 / LaTeX / 对话持久化）
- [x] Phase 4 — Multi-Agent（Analyst / Strategist / Coach）
- [x] Phase 5 — 每日晨报（报告综合 / 日历导航）
- [x] Phase 6 — 信息聚合（Mock 爬虫 / 分类筛选）
- [x] Phase 7 — 知识树（递归折叠 / 状态管理）
- [x] Phase 8 — 收尾打磨（暗色主题 / 响应式 / 定时任务）
- [ ] Phase 9 — 接入真实信息爬取（OpenClaw / WebSocket）
- [ ] Phase 10 — 数据导出 & PDF 统计报告
- [ ] Phase 11 — 番茄钟 & 专注模式
- [ ] Phase 12 — 间隔重复记忆系统

---

## 📄 License

MIT License

---

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=100&section=footer" width="100%" />
</p>

<p align="center">
  <sub>Built with 💜 using Claude AI + Next.js</sub>
</p>
