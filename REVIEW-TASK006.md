# Code Review — TASK-006
レビュアー: CodeReviewer  
対象: Task Board Web App (Express + React)  
日付: 2026-05-28

---

## サマリー

| 深刻度 | 件数 |
|---|---|
| CRITICAL | 0 |
| MAJOR | 2 |
| MINOR | 4 |

CRITICALなし。MAJORは2件ともセキュリティ／安定性に関わるため、リリース前に修正必須。

---

## MAJOR-1: パストラバーサル（server.js）

**ファイル:** `server.js` — `readTask()`, `writeTask()`, PATCH/COMMENTエンドポイント  
**問題:** `req.params.id` を一切検証せずにファイルパスへ直接展開している。

```js
// 現状 — id = "../../server" の場合、TASKS_DIR外に到達可能
const file = path.join(TASKS_DIR, `${id}.md`)
```

**リスク:** ローカル専用ツールとはいえ、ブラウザ上のXSSや悪意ある拡張機能からAPIを叩かれた場合にサーバープロセスが読み書きできる任意ファイルへアクセスされる。

**修正方針:** IDをホワイトリスト正規表現 `/^TASK-\d+$/` で検証し、不正なIDは 400 を返す。

---

## MAJOR-2: readAllTasks の一括失敗（server.js）

**ファイル:** `server.js` lines 21–30  
**問題:** `.map()` 内でファイル読み取り・パースを行っているが、1ファイルでもエラーが起きると配列全体が例外を投げ、`GET /api/tasks` が 500 になる。

```js
// 現状 — 1ファイルのエラーで全タスク消える
.map(file => {
  const raw = fs.readFileSync(...)
  const { data, content } = matter(raw)  // ← malformed YAML で throw
  return { ...data, body: content.trim() }
})
```

**リスク:** AIエージェントが直接ファイルを編集した場合（このシステムの想定ユースケース）、YAMLの書き方が崩れるとUIが全タスク消えたように見える。

**修正方針:** 各ファイルの読み取りを個別に try/catch し、失敗したファイルはスキップする。

---

## MINOR-1: SSEエラー表示がクリアされない（App.jsx:44）

`es.onerror` でエラーバーを表示するが、`EventSource` は自動再接続する。再接続後もエラー表示が残り続ける。

**修正案:** `es.onopen` または `onmessage` 受信時に `setError(null)` を呼ぶ。

---

## MINOR-2: モーダル内Assigneeフィールドがstale（TaskModal.jsx:83）

Assigneeの `<input>` が `defaultValue` を使っているため、SSEでタスクが更新されてもフィールドが再描画されない。

**修正案:** `key={task.assignee}` をinputに追加して強制再マウントするか、`value` + `onChange` に変更する。

---

## MINOR-3: getNextId の競合リスク（server.js:46–51）

同時に2件の POST が来た場合、両方が同じIDを計算する可能性がある。単一ユーザーのローカルツールなので現実的なリスクは低い。

**修正案（将来）:** インメモリカウンターまたはファイルロックで採番を直列化する。

---

## MINOR-4: コメント本文のMarkdownインジェクション（server.js:114）

`author` と `text` がそのままMarkdownに埋め込まれる。HTMLレンダリングはしていないため現状はXSSにはならないが、Markdownシンタックスの破損リスクがある。

**修正案（将来）:** authornameに英数字・スペース以外を含む場合はサニタイズする。

---

## 判定

MAJOR-1・MAJOR-2 を修正後、TASK-006 をDoneにクローズ可能。  
MINOR は次の機能追加サイクルで対応推奨。
