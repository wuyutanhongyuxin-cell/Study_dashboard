<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.x-06B6D4?style=for-the-badge&logo=tailwindcss" />
  <img src="https://img.shields.io/badge/Claude_AI-Sonnet-D97706?style=for-the-badge&logo=anthropic" />
  <img src="https://img.shields.io/badge/SQLite-Drizzle_ORM-003B57?style=for-the-badge&logo=sqlite" />
</p>

<h1 align="center">🎓 Desheng 考研学習プラットフォーム</h1>

<p align="center">
  <strong>上海交通大学 集積回路学院 085400 電子情報 大学院入試のためのフルスタック学習管理システム</strong>
</p>

<p align="center">
  <em>「千里の道も一歩から」—— 毎日の積み重ねが、合格への道を開く。</em>
</p>

---

## 📖 目次

- [概要](#-概要)
- [機能一覧](#-機能一覧)
- [技術スタック](#-技術スタック)
- [プロジェクト構成](#-プロジェクト構成)
- [セットアップ](#-セットアップ)
- [使い方ガイド](#-使い方ガイド)
- [API リファレンス](#-api-リファレンス)
- [スクリーンショット](#-スクリーンショット)
- [開発ロードマップ](#-開発ロードマップ)
- [ライセンス](#-ライセンス)

---

## 🌸 概要

**Desheng 考研学習プラットフォーム**は、大学院入試（考研）の受験生のために設計されたオールインワン学習管理システムです。

上海交通大学の日本語学科から集積回路学院への跨专业受験という挑戦に向けて、以下の機能を統合しています：

| 機能 | 説明 |
|------|------|
| 📊 **学習ダッシュボード** | カウントダウン・進捗リング・ヒートマップ・タイマー |
| 🤖 **AI チューター** | Claude AI による即座のストリーミング応答と LaTeX 数式対応 |
| 🧠 **Multi-Agent 分析** | アナリスト・ストラテジスト・コーチの三位一体 AI 分析 |
| 📰 **デイリーブリーフ** | AI が毎朝生成する学習概要レポート |
| 🔍 **情報アグリゲーション** | 受験関連情報の自動収集と分類 |
| 🌳 **知識ツリー** | 科目ごとの知識ポイント可視化と習熟度管理 |

### 受験科目

```
┌─────────────────────────────────────────────┐
│  101 思想政治理論     │  201 英語一           │
│  301 数学一           │  874 電子情報総合     │
└─────────────────────────────────────────────┘
```

---

## ✨ 機能一覧

### 1. 📊 学習ダッシュボード (`/dashboard`)

試験日（2026年12月26日）までのカウントダウンを中心に、学習状況を一目で把握できるダッシュボードです。

```
┌──────────────┬──────────────┬──────────────┐
│  📅 カウント  │  ⏱️ タイマー  │  📋 今日概要  │
│   ダウン      │              │              │
│   297 日      │   01:23:45   │  4.5h 学習   │
├──────────────┴──────────────┴──────────────┤
│  🎯 科目別進捗リング（政治・英語・数学・874） │
├─────────────────────┬─────────────────────┤
│  📈 週間トレンド     │  🎯 目標ウィジェット │
├─────────────────────┴─────────────────────┤
│  🟩🟩🟩🟩⬜🟩🟩 365日ヒートマップ（GitHub風）  │
└───────────────────────────────────────────┘
```

**主要機能：**
- **試験カウントダウン** — 残り日数をリアルタイム表示
- **学習タイマー** — 科目を選択して開始/停止、自動的にDBへ記録
- **科目別進捗リング** — Recharts による美しいドーナツチャート
- **365日ヒートマップ** — GitHub Contribution 風の年間学習記録
- **週間トレンド** — 過去7日間の科目別学習時間の推移
- **目標管理** — 日次/週次/月次の学習目標設定と進捗追跡

### 2. 🤖 AI チューター (`/chat`)

Claude AI を活用したインテリジェントな学習支援チャットです。

```
┌─────────┬────────────────────────────────┐
│ 会話一覧 │  🤖 AI チューター               │
│         │                                │
│ □ 微分学 │  👤 ∫x²dx の不定積分を教えて     │
│ □ 線形代 │                                │
│ □ 回路基 │  🤖 もちろんです！               │
│         │     ∫x²dx = x³/3 + C           │
│ [+新規]  │     ここで C は積分定数です...   │
│         │                                │
│         │  [メッセージを入力...]  [送信]    │
└─────────┴────────────────────────────────┘
```

**主要機能：**
- **SSE ストリーミング** — リアルタイムで応答がタイプされるように表示
- **LaTeX 数式レンダリング** — KaTeX による美しい数式表示
- **会話履歴** — SQLite に永続化、いつでも過去の会話を参照
- **マークダウン対応** — コードブロック、テーブル、リストなどを美しくレンダリング

### 3. 🧠 Multi-Agent 分析システム (`/agents`)

3つの専門 AI エージェントが連携して学習を分析・最適化します。

```
         ┌──────────────┐
         │ Orchestrator │
         │   (編排器)    │
         └──────┬───────┘
                │
        ┌───────┴───────┐
        ▼               │
 ┌──────────┐           │
 │ Analyst  │           │
 │ (分析師) │           │
 └────┬─────┘           │
      │          ┌──────┴──────┐
      ├─────────►│ Strategist  │
      │          │  (策略師)   │
      │          └─────────────┘
      │          ┌─────────────┐
      └─────────►│   Coach     │
                 │  (教練)     │
                 └─────────────┘
```

| エージェント | 役割 |
|-------------|------|
| 🔍 **Analyst** | 過去7日間のデータを分析、学習パターン・弱点を特定 |
| 📋 **Strategist** | 分析結果に基づき明日・今週の学習計画を策定 |
| 💪 **Coach** | パーソナライズされた励ましとアドバイスを生成 |

### 4. 📰 デイリーブリーフ (`/briefs`)

3つの Agent レポートを統合し、毎朝の学習概要を自動生成します。

**主要機能：**
- **AI 生成レポート** — Agent 分析を統合したマークダウン形式の日報
- **メトリクスバナー** — 週間学習時間・連続日数・科目バランスを一目で確認
- **カレンダーナビゲーション** — 日付を選択して過去のブリーフを閲覧

### 5. 🔍 情報アグリゲーション (`/intel`)

受験に関する最新情報を自動収集・分類します。

| カテゴリ | 色 | 内容 |
|---------|-----|------|
| 📜 政策 | 🟣 紫 | 上海交通大学の募集要項・政策変更 |
| 📝 経験 | 🔵 青 | 先輩の受験体験談・合格体験記 |
| 📚 資源 | 🟢 緑 | おすすめ教材・オンライン講座 |
| 📰 ニュース | 🟠 橙 | 考研関連の最新ニュース |

### 6. 🌳 知識ツリー (`/knowledge`)

試験範囲の全知識ポイントをツリー構造で可視化し、習熟度を管理します。

```
📐 数学一
├── 高等数学
│   ├── 極限と連続 .................. 🟢 掌握済み
│   ├── 一変数微分学 ................ 🔵 学習中
│   ├── 一変数積分学 ................ 🟡 復習中
│   ├── 多変数微積分学 .............. ⚪ 未開始
│   ├── 無限級数 .................... ⚪ 未開始
│   └── 常微分方程式 ................ ⚪ 未開始
├── 線形代数
│   ├── 行列式 ...................... 🟢 掌握済み
│   ├── 行列 ........................ 🔵 学習中
│   └── ...
└── 確率論と数理統計
    └── ...

🔌 874 電子情報総合
├── デジタル回路
├── アナログ回路
└── 信号とシステム
```

**ステータス管理：**
- ⚪ `未開始` — まだ手をつけていない
- 🔵 `学習中` — 現在学習中
- 🟡 `復習中` — 復習フェーズ
- 🟢 `掌握済み` — 習得完了

---

## 🛠 技術スタック

### フロントエンド

| 技術 | バージョン | 用途 |
|------|-----------|------|
| **Next.js** | 14.x (App Router) | フレームワーク |
| **TypeScript** | 5.x | 型安全 |
| **Tailwind CSS** | 3.x | スタイリング |
| **shadcn/ui** | latest | UI コンポーネントライブラリ |
| **Recharts** | 3.x | チャート・グラフ |
| **Zustand** | 5.x | 状態管理 |
| **KaTeX** | 0.16.x | 数式レンダリング |
| **Lucide React** | latest | アイコン |
| **next-themes** | 0.4.x | ダーク/ライトモード |

### バックエンド

| 技術 | 用途 |
|------|------|
| **SQLite** + **better-sqlite3** | ローカルデータベース |
| **Drizzle ORM** | タイプセーフなORM |
| **Anthropic SDK** | Claude AI API 統合 |
| **node-cron** | 定期実行タスク |

### データベーススキーマ（9テーブル）

```
study_sessions     学習セッション（タイマー記録）
daily_progress     日次進捗（科目別学習時間）
chat_conversations チャット会話
chat_messages      チャットメッセージ
agent_reports      Agent 分析レポート
morning_briefs     朝のブリーフ
intel_items        情報アグリゲーション項目
knowledge_nodes    知識ツリーノード
goals              学習目標
```

---

## 📁 プロジェクト構成

```
study_dashboard/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── layout.tsx                # ルートレイアウト（テーマ・サイドバー）
│   │   ├── page.tsx                  # / → /dashboard リダイレクト
│   │   ├── dashboard/page.tsx        # 📊 学習ダッシュボード
│   │   ├── chat/page.tsx             # 🤖 AI チューター
│   │   ├── agents/page.tsx           # 🧠 Agent レポート
│   │   ├── briefs/page.tsx           # 📰 デイリーブリーフ
│   │   ├── intel/page.tsx            # 🔍 情報アグリゲーション
│   │   ├── knowledge/page.tsx        # 🌳 知識ツリー
│   │   └── api/                      # API ルート
│   │       ├── sessions/route.ts     #   学習セッション CRUD
│   │       ├── progress/route.ts     #   日次進捗クエリ
│   │       ├── goals/route.ts        #   目標管理
│   │       ├── chat/                 #   チャット API（SSE ストリーミング）
│   │       ├── agents/               #   Agent 実行・レポート取得
│   │       ├── briefs/               #   ブリーフ生成・取得
│   │       ├── intel/                #   情報クロール・取得
│   │       └── knowledge/            #   知識ノード CRUD
│   │
│   ├── components/
│   │   ├── ui/                       # shadcn/ui コンポーネント (16個)
│   │   ├── layout/                   # サイドバー・ヘッダー
│   │   ├── providers/                # テーマプロバイダー
│   │   ├── dashboard/                # ダッシュボードウィジェット (7個)
│   │   ├── chat/                     # チャットコンポーネント (4個)
│   │   ├── agents/                   # Agent レポートカード
│   │   ├── briefs/                   # ブリーフ表示・カレンダー (3個)
│   │   ├── intel/                    # 情報カード・フィルター (3個)
│   │   └── knowledge/                # ツリービュー・ノード詳細 (3個)
│   │
│   ├── hooks/
│   │   └── use-chat-stream.ts        # SSE ストリーミング Hook
│   │
│   ├── lib/
│   │   ├── db/
│   │   │   ├── schema.ts             # Drizzle ORM スキーマ定義
│   │   │   └── index.ts              # DB 接続・テーブル自動作成
│   │   ├── agents/                   # Multi-Agent システム
│   │   │   ├── analyst.ts            #   データ分析 Agent
│   │   │   ├── strategist.ts         #   戦略立案 Agent
│   │   │   ├── coach.ts              #   コーチ Agent
│   │   │   └── orchestrator.ts       #   Agent 編排
│   │   ├── briefs/generator.ts       # ブリーフ生成器
│   │   ├── intel/                    # 情報収集システム
│   │   │   ├── types.ts              #   型定義
│   │   │   ├── mock-client.ts        #   Mock データクライアント
│   │   │   └── crawler.ts            #   クローラーサービス
│   │   ├── knowledge/                # 知識ツリーデータ
│   │   │   ├── math-tree.ts          #   数学一 知識構造
│   │   │   ├── major-tree.ts         #   874 知識構造
│   │   │   └── seed.ts               #   初期データ投入
│   │   ├── constants.ts              # 定数定義
│   │   ├── store.ts                  # Zustand ストア
│   │   └── utils.ts                  # ユーティリティ
│   │
│   └── instrumentation.ts            # node-cron 定時タスク
│
├── data/                             # SQLite データベース（自動生成）
├── drizzle.config.ts                 # Drizzle Kit 設定
├── next.config.mjs                   # Next.js 設定
├── tailwind.config.ts                # Tailwind CSS 設定
├── components.json                   # shadcn/ui 設定
└── package.json
```

**合計: 79 TypeScript ソースファイル**

---

## 🚀 セットアップ

### 前提条件

- **Node.js** >= 18.x
- **pnpm** >= 8.x（推奨）または npm
- **Anthropic API キー**（AI 機能に必要）

### インストール手順

```bash
# 1. リポジトリをクローン
git clone https://github.com/wuyutanhongyuxin-cell/Study_dashboard.git
cd Study_dashboard

# 2. 依存パッケージをインストール
pnpm install

# 3. 環境変数を設定
cp .env.local.example .env.local
```

`.env.local` を編集して API キーを設定：

```env
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

```bash
# 4. 開発サーバーを起動
pnpm dev
```

ブラウザで **http://localhost:3000** を開くと、自動的にダッシュボードにリダイレクトされます。

### ビルド

```bash
# プロダクションビルド
pnpm build

# プロダクションサーバー起動
pnpm start
```

---

## 📝 使い方ガイド

### 基本的なワークフロー

```
🌅 朝                    📚 日中                   🌙 夜
┌─────────────┐    ┌──────────────┐    ┌──────────────────┐
│ デイリーブリーフ │    │ 学習タイマーで  │    │ Agent が自動分析  │
│ を確認する     │ →  │ 勉強を記録する  │ →  │ 明日の計画を生成  │
└─────────────┘    └──────────────┘    └──────────────────┘
```

#### Step 1: 学習を記録する

1. ダッシュボードの **学習タイマー** で科目を選択
2. 「開始」ボタンを押して学習開始
3. 学習終了後「停止」ボタンを押すと自動的に記録される

#### Step 2: AI に質問する

1. **AI チューター** ページを開く
2. 数学の問題や専門科目の質問を入力
3. LaTeX 数式付きの詳細な解説がストリーミングで表示される

#### Step 3: 知識の習熟度を管理する

1. **知識ツリー** ページを開く
2. 初回アクセス時は「初始化知識ツリー」ボタンを押す
3. 各ノードのステータスバッジをクリックして習熟度を更新

#### Step 4: Agent 分析を実行する

1. **Agent レポート** ページを開く
2. 「運行 Agent」ボタンを押すと3つの Agent が連携分析
3. または毎晩 22:30 に自動実行される

### 自動スケジュール

| 時刻 | タスク |
|------|--------|
| 07:00 | 📡 情報クロール（受験関連ニュース収集） |
| 07:30 | 📰 デイリーブリーフ生成 |
| 22:30 | 🧠 Agent 分析実行（学習データ分析） |

---

## 📡 API リファレンス

### 学習セッション

```
GET  /api/sessions              # セッション一覧取得
GET  /api/sessions?date=YYYY-MM-DD  # 日付で絞り込み
POST /api/sessions              # セッション作成
     Body: { subject, startTime, endTime, duration }
```

### 学習進捗

```
GET  /api/progress              # 全体の科目別合計
GET  /api/progress?date=today   # 今日の進捗
GET  /api/progress?range=week   # 過去7日間
GET  /api/progress?range=year   # 過去365日間
```

### AI チャット

```
POST /api/chat                  # メッセージ送信（SSE ストリーミング応答）
     Body: { conversationId?, message }
GET  /api/chat/conversations    # 会話一覧
POST /api/chat/conversations    # 新規会話作成
```

### Agent システム

```
POST /api/agents/run            # Agent 分析実行
GET  /api/agents/reports        # レポート一覧
GET  /api/agents/reports?date=YYYY-MM-DD  # 日付で絞り込み
```

### デイリーブリーフ

```
GET  /api/briefs                # ブリーフ一覧
POST /api/briefs                # ブリーフ生成 Body: { date }
GET  /api/briefs/:date          # 特定日のブリーフ
```

### 情報アグリゲーション

```
GET  /api/intel                 # 情報一覧
GET  /api/intel?category=policy # カテゴリ絞り込み
POST /api/intel/crawl           # クロール実行
```

### 知識ツリー

```
GET   /api/knowledge            # ノード一覧
GET   /api/knowledge?subject=math  # 科目で絞り込み
POST  /api/knowledge            # 知識ツリー初期化（シード）
PATCH /api/knowledge/:id        # ノードステータス更新
      Body: { status }
```

---

## 🖼 スクリーンショット

> 📸 `pnpm dev` を実行して http://localhost:3000 にアクセスすると、実際の画面を確認できます。

### ダークモード（デフォルト）

アプリケーションはデフォルトでダークモードで起動します。ヘッダー右上の 🌙/☀️ ボタンでライトモードに切り替えできます。

### レスポンシブデザイン

モバイル端末ではサイドバーが自動的にシートメニューに変換され、快適に操作できます。

---

## 🗺 開発ロードマップ

- [x] Phase 1: プロジェクトスキャフォールド（DB / Schema / Layout）
- [x] Phase 2: 学習ダッシュボード（カウントダウン / 進捗リング / ヒートマップ / タイマー）
- [x] Phase 3: AI チューター（SSE ストリーミング / LaTeX / 会話永続化）
- [x] Phase 4: Multi-Agent システム（Analyst / Strategist / Coach）
- [x] Phase 5: デイリーブリーフ（レポート統合 / カレンダーナビ）
- [x] Phase 6: 情報アグリゲーション（Mock クローラー / 分類フィルター）
- [x] Phase 7: 知識ツリー（再帰的折りたたみ / ステータス管理）
- [x] Phase 8: 仕上げ（ダークモード / レスポンシブ / 定時タスク）
- [ ] Phase 9: OpenClaw Gateway 統合（WebSocket ベースのリアルクローリング）
- [ ] Phase 10: データエクスポート・統計レポート PDF 生成
- [ ] Phase 11: ポモドーロタイマー・フォーカスモード
- [ ] Phase 12: スパンドリピーティション（間隔反復）システム

---

## 🔧 技術的な注意点

### better-sqlite3 について
- `next.config.mjs` で webpack externals に追加が必要
- Node.js のネイティブモジュールのため、ビルド環境に C++ コンパイラが必要な場合あり

### SSE ストリーミング
- API ルートに `export const runtime = 'nodejs'` を明示的に設定（Edge Runtime 非対応）
- `ReadableStream` + `TextEncoder` でチャンクを送信

### データベース
- `data/` ディレクトリは初回起動時に自動作成
- SQLite WAL モードで並行読み取りに最適化

---

## 📄 ライセンス

MIT License

---

<p align="center">
  <strong>頑張れ、Desheng！🌟 合格への道は、ここから始まる。</strong>
</p>

<p align="center">
  <sub>Built with 💜 by Claude AI + Human Intelligence</sub>
</p>
