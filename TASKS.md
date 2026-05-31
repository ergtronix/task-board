# タスクボード — タスク一覧

> Single Source of Truth: このファイルがすべてのタスクの正式な管理ファイルです。
> UIからの操作はこのファイルに反映されます。
> ステータス変更ルールは `README.md` を参照すること。

---

## プロジェクト: タスクボードWebアプリ開発

**ERGからの要件:** ブラウザで動くかんばんUIダッシュボード。  
**データ源泉:** Obsidianのマークダウンファイル（Single Source of Truth）  
**技術スタック:** React + Vite + Express（ローカルサーバー）  
**スコープ外:** モバイル対応・認証・外部サービス連携

---

## #001 — アーキテクチャ設計・タスクデータフォーマット定義

```
作成日: 2026-05-27
作成者: TaskDispatcher
優先度: High
担当エージェント: TechLead
ステータス: Done（2026-05-27 ERG承認・案A採用）
元ファイル: E:\AIWork\Inbox\taskboard_app_idea.md
```

### 概要
ブラウザアプリがObsidianのMarkdownファイルを読み書きするためのバックエンド構成と、
タスクデータのMarkdownフォーマットを確定する。
#002〜#005はこのタスクの完了を待ってから着手すること。

### Blocked報告

```
## Blocked 報告
報告日時: 2026-05-27
報告エージェント: TechLead

### Blockした理由
ブラウザアプリはセキュリティ制約上、ローカルファイルシステムへの書き込みを
直接行えない。ObsidianのMarkdownファイルをSingle Source of Truthとするには、
ファイルI/Oを担うバックエンドが必要。以下の選択肢がある。

[案A] Expressローカルサーバー（推奨）
  ・既存task-boardのExpress構成を流用
  ・React(フロント) ⇔ Express(バックエンド) ⇔ Markdownファイル
  ・メリット: 既存構成を活かせる。保守しやすい
  ・デメリット: アプリ起動時に毎回サーバーも起動が必要

[案B] File System Access API（ブラウザ標準API）
  ・バックエンド不要。ブラウザから直接ファイルを読み書き
  ・メリット: シンプル構成
  ・デメリット: 初回起動時にERGがフォルダを手動で選択する操作が必要。
               ブラウザを閉じると再選択が必要になる場合がある

### ERGに求める判断・承認
上記AまたはBのどちらのアーキテクチャで進めるかをご決定ください。

### 判断しないと何が止まるか
#002〜#005（UI実装・ファイル同期）のすべてが着手できない。
```

### 完了条件
- [ ] バックエンドアーキテクチャ（案A or 案B）がERGに承認された
- [ ] タスクMarkdownファイルのフォーマット（フィールド・ファイル名規則）が確定した
- [ ] タスクファイルの保存先ディレクトリが確定した

---

## #002 — かんばんボードUI実装

```
作成日: 2026-05-27
作成者: TaskDispatcher
優先度: High
担当エージェント: Claude
ステータス: In Progress
元ファイル: E:\AIWork\Inbox\taskboard_app_idea.md
```

### 概要
4ステータス（New/Pending・In Progress・Blocked・Done）のかんばんボードをReactで実装する。
ステータス変更はボタンまたはドラッグ＆ドロップで操作できること。

### 完了条件
- [ ] 4列のかんばんボードが表示される
- [ ] ステータス変更操作でMarkdownファイルが更新される
- [ ] Blockedカラムが視覚的に目立つデザインになっている

---

## #003 — タスク作成・アサイン機能実装

```
作成日: 2026-05-27
作成者: TaskDispatcher
優先度: High
担当エージェント: Claude
ステータス: In Progress
元ファイル: E:\AIWork\Inbox\taskboard_app_idea.md
```

### 概要
新しいタスクを作成し、担当エージェント（ERG / Claude / TechLead等）をアサインする機能を実装する。
作成されたタスクはMarkdownファイルとして保存される。

### 完了条件
- [ ] タスク名・担当者・優先度を入力してタスクを作成できる
- [ ] 作成されたタスクがMarkdownファイルとして保存される
- [ ] 担当者の変更（再アサイン）ができる

---

## #004 — コメント機能実装

```
作成日: 2026-05-27
作成者: TaskDispatcher
優先度: High
担当エージェント: Claude
ステータス: In Progress
元ファイル: E:\AIWork\Inbox\taskboard_app_idea.md
```

### 概要
タスクにコメントを追記できる機能を実装する。
BlockedステータスのタスクにはBlocked報告フォーマットのコメントが必須。

### 完了条件
- [ ] タスクにコメントを追記できる
- [ ] コメントはMarkdownファイルに保存される
- [ ] Blockedにする際にBlocked報告フォーマットのテンプレートが自動表示される

---

## #005 — MarkdownファイルI/O機能実装

```
作成日: 2026-05-27
作成者: TaskDispatcher
優先度: High
担当エージェント: Claude
ステータス: In Progress
元ファイル: E:\AIWork\Inbox\taskboard_app_idea.md
```

### 概要
UIの操作をObsidianのMarkdownファイルに反映する読み書き機能を実装する。
AIエージェントがファイルを直接編集した場合も、UIに自動反映されること。

### 完了条件
- [ ] UIの操作がMarkdownファイルにリアルタイムで反映される
- [ ] Markdownファイルの変更がUIに自動反映される（ファイル監視）
- [ ] AIがファイルを直接編集した場合もUIに反映される

---

## #006 — 全体コードレビュー

```
作成日: 2026-05-27
作成者: TaskDispatcher
優先度: Medium
担当エージェント: CodeReviewer
ステータス: Pending（#002〜#005完了待ち）
元ファイル: E:\AIWork\Inbox\taskboard_app_idea.md
```

### 概要
#002〜#005の実装完了後、全体のコード品質・セキュリティ・エラーハンドリングをレビューする。
`diagnose.md` および `CodeReviewer.md` の手順に従ってレビューを実施すること。

### 完了条件
- [ ] CRITICALおよびMAJOR指摘がゼロになっている
- [ ] レビュー結果ドキュメントが作成されている
- [ ] MINORの指摘事項がERGに共有されている

---

## #007 — SSEエラー表示がクリアされない問題の修正

```
作成日: 2026-05-28
作成者: TaskDispatcher
優先度: Low
担当エージェント: Claude
ステータス: Pending
元ファイル: E:\AIWork\Inbox\minor_fixes.md
```

### 概要
SSE接続のエラーメッセージが、再接続成功後もクリアされずに残り続ける問題を修正する。
`App.jsx:44` 付近のエラーハンドリングで、エラー状態がリセットされていない。

### 完了条件
- [ ] SSE再接続が成功したタイミングでエラーメッセージが消える
- [ ] 手動で接続が回復した場合もエラー表示がクリアされる
- [ ] 正常時にエラーメッセージが表示されないことを確認済み

---

## #008 — モーダル内AssigneeフィールドのReact再描画漏れ修正

```
作成日: 2026-05-28
作成者: TaskDispatcher
優先度: Low
担当エージェント: Claude
ステータス: Pending
元ファイル: E:\AIWork\Inbox\minor_fixes.md
```

### 概要
タスク編集モーダルを開いた際、Assigneeフィールドが現在の担当者を正しく表示せず、
再描画が行われない問題を修正する。
`TaskModal.jsx:83` 付近でAssigneeの値がモーダル開時に初期化・更新されていない。

### 完了条件
- [ ] モーダルを開いたとき、既存のAssigneeが正しく表示される
- [ ] 別タスクのモーダルを連続で開いた際も正しい担当者が表示される
- [ ] 担当者変更後、モーダルを再度開いても変更後の値が表示される

---

## プロジェクト: 不動産管理Webアプリ開発（SAMURAI 第8章）

**ERGからの要件:** Supabase認証・DB・RLSを使った不動産管理アプリを自分で実装して学ぶ。  
**データ源泉:** Supabase PostgreSQL  
**技術スタック:** React + Vite + Supabase Auth + PostgreSQL + RLS + Vercel  
**担当方針:** ERGが主体的に実装。わからない点は Claude に相談、最終レビューも Claude が担当。

---

## #009 — 事前準備（プロジェクト作成・GitHub連携）

```
作成日: 2026-05-28
作成者: TaskDispatcher
優先度: High
担当エージェント: ERG
ステータス: Pending
元ファイル: E:\AIWork\Inbox\WebAppDev_003.md
```

### 概要
`realestate-app` フォルダ作成、Vite + React 初期化、CLAUDE.md 作成、GitHub 連携。

### 完了条件
- [ ] realestate-app プロジェクトを初期化した
- [ ] CLAUDE.md を作成した
- [ ] .env を .gitignore に追加した
- [ ] GitHub リポジトリを作成し初回 push 完了

---

## #010 — Supabase設定・認証実装（会員登録/ログイン/ログアウト）

```
作成日: 2026-05-28
作成者: TaskDispatcher
優先度: High
担当エージェント: ERG
ステータス: Pending（#009完了待ち）
元ファイル: E:\AIWork\Inbox\WebAppDev_003.md
```

### 概要
Supabase プロジェクト作成・設定、メール＋パスワード認証の実装、認証ガードの実装。

### 完了条件
- [ ] Supabase プロジェクトを作成した
- [ ] .env に VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY を設定した
- [ ] 会員登録・ログイン・ログアウトが成功する
- [ ] 未ログイン時にリダイレクトされる

---

## #011 — DB実装（propertiesテーブル・CRUD・RLS設定）

```
作成日: 2026-05-28
作成者: TaskDispatcher
優先度: High
担当エージェント: ERG
ステータス: Pending（#010完了待ち）
元ファイル: E:\AIWork\Inbox\WebAppDev_003.md
```

### 概要
properties テーブル作成、物件 CRUD 実装、RLS 有効化と Policy 設定。

### 完了条件
- [ ] properties テーブルを作成した
- [ ] RLS を有効化し Policy を設定した
- [ ] 物件の登録・一覧・編集・削除が成功する

---

## #012 — Vercelデプロイ・本番確認・最終レビュー

```
作成日: 2026-05-28
作成者: TaskDispatcher
優先度: Medium
担当エージェント: ERG
ステータス: Done（2026-05-31）
元ファイル: E:\AIWork\Inbox\WebAppDev_003.md
```

### 概要
Vercel へ本番デプロイ、本番動作確認、Claude によるコードレビュー。

### 完了条件
- [x] Vercel に GitHub 連携・環境変数設定・デプロイ完了
- [x] vercel.json を作成した
- [x] 本番環境で全機能が動作する
- [x] CLAUDE.md に本番 URL を追記した
- [x] Claude によるコードレビューを完了した
- [ ] Supabase のメール認証を ON に戻した（今後の課題）

---

## プロジェクト: GAS業務自動化（ERGスクール 第9章）

**ERGからの要件:** GASでGoogleスプレッドシート・Gmail連携の業務自動化ツールをゼロから作る。  
**技術スタック:** Google Apps Script + Spreadsheet + Gmail + Claude API + Slack  
**担当方針:** ERGが主体的に実装。わからない点は Claude に相談、レビューも Claude が担当。  
**見積時間:** 180分

---

## #013 — 事前準備（プロジェクトフォルダ作成・CLAUDE.md・GitHub連携）

```
作成日: 2026-05-31
作成者: TaskDispatcher
優先度: High
担当エージェント: ERG
ステータス: Pending
元ファイル: E:\AIWork\Inbox\BizAutoGAS_001.md
```

### 概要
GAS開発に向けたプロジェクトの3点セットを整える。
フォルダ作成 → CLAUDE.md作成 → GitHub連携。

### 完了条件
- [ ] `gas-scripts` フォルダを作成した
- [ ] CLAUDE.md を作成した
- [ ] GitHub リポジトリを作成し初回 push 完了

---

## #014 — スプレッドシート自動集計ダッシュボードの実装

```
作成日: 2026-05-31
作成者: TaskDispatcher
優先度: High
担当エージェント: ERG
ステータス: Pending（#013完了後着手）
元ファイル: E:\AIWork\Inbox\BizAutoGAS_001.md
```

### 概要
Googleスプレッドシートの売上データを自動集計し、月次サマリーと棒グラフを生成するダッシュボードをGASで作る。
毎朝9時に自動実行されるトリガーも設定する。

### 完了条件
- [ ] スプレッドシートを準備した（売上データ・月次サマリーの2シート）
- [ ] `summary_dashboard.gs` を生成した
- [ ] GASエディタに貼り付けて実行し、月次サマリーシートにデータが書き込まれた
- [ ] 棒グラフが生成された
- [ ] トリガー設定関数を実行し、毎朝9時の自動実行が登録された

---

## #015 — 問い合わせ自動分類・通知ツールの実装

```
作成日: 2026-05-31
作成者: TaskDispatcher
優先度: High
担当エージェント: ERG
ステータス: Pending（#014完了後着手）
元ファイル: E:\AIWork\Inbox\BizAutoGAS_001.md
```

### 概要
Gmailに届いた問い合わせメールをClaude APIで自動分類し、スプレッドシートに記録してSlackに通知するツールをGASで作る。
5分おきに自動実行されるトリガーも設定する。

### 完了条件
- [ ] スプレッドシートを準備した（メールログ・エラーログの2シート）
- [ ] Claude APIキーをスクリプトプロパティに登録した
- [ ] Slack Incoming Webhook URLをスクリプトプロパティに登録した
- [ ] `email_classifier.gs` を生成した
- [ ] テストメールで動作確認した（メールログ記録・Slack通知）
- [ ] 5分おきの自動実行トリガーが登録された
