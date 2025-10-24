# 作るもの
- chromeの拡張機能
- UIはなし。アイコンを押すと全てのサイトがマークダウンで表示される。
- [Jonghakseo/chrome-extension-boilerplate-react-vite](https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite)リポジトリのコードを参考に参照すること。
- マークダウン変換には[mizchi/readability](https://github.com/mizchi/readability)を使用。通常のreadabilityとは異なるのできちんと仕様を確認してから実装すること。

## 開発の基本理念

- 動くコードを書くだけでなく、品質・保守性・安全性を常に意識する
- プロジェクトの段階（プロトタイプ、MVP、本番環境）に応じて適切なバランスを取る
- 問題を見つけたら放置せず、必ず対処または明示的に記録する
- ボーイスカウトルール：コードを見つけた時よりも良い状態で残す

## エラーハンドリングの原則

- 関連が薄く見えるエラーでも必ず解決する
- エラーの抑制（@ts-ignore、try-catch で握りつぶす等）ではなく、根本原因を修正
- 早期にエラーを検出し、明確なエラーメッセージを提供
- エラーケースも必ずテストでカバーする
- 外部APIやネットワーク通信は必ず失敗する可能性を考慮

## コード品質の基準

- DRY原則：重複を避け、単一の信頼できる情報源を維持
- 意味のある変数名・関数名で意図を明確に伝える
- プロジェクト全体で一貫したコーディングスタイルを維持
- 小さな問題も放置せず、発見次第修正（Broken Windows理論）
- コメントは「なぜ」を説明し、「何を」はコードで表現

## テスト規律

- テストをスキップせず、問題があれば修正する
- 実装詳細ではなく振る舞いをテスト
- テスト間の依存を避け、任意の順序で実行可能に
- テストは高速で、常に同じ結果を返すように
- カバレッジは指標であり、質の高いテストを重視

## 保守性とリファクタリング

- 機能追加と同時に既存コードの改善を検討
- 大規模な変更は小さなステップに分割
- 使用されていないコードは積極的に削除
- 依存関係は定期的に更新（セキュリティと互換性のため）
- 技術的負債は明示的にコメントやドキュメントに記録

## パフォーマンスの意識

- 推測ではなく計測に基づいて最適化
- 初期段階から拡張性を考慮
- 必要になるまでリソースの読み込みを遅延
- キャッシュの有効期限と無効化戦略を明確に
- N+1問題やオーバーフェッチを避ける

## 信頼性の確保

- タイムアウト処理を適切に設定
- リトライ機構の実装（指数バックオフを考慮）
- サーキットブレーカーパターンの活用
- 一時的な障害に対する耐性を持たせる
- 適切なログとメトリクスで可観測性を確保

## プロジェクトコンテキストの理解

- ビジネス要件と技術要件のバランスを取る
- 現在のフェーズで本当に必要な品質レベルを判断
- 時間制約がある場合でも、最低限の品質基準を維持
- チーム全体の技術レベルに合わせた実装選択

## トレードオフの認識

- すべてを完璧にすることは不可能（銀の弾丸は存在しない）
- 制約の中で最適なバランスを見つける
- プロトタイプなら簡潔さを、本番なら堅牢性を優先
- 妥協点とその理由を明確にドキュメント化

## デバッグのベストプラクティス

- 問題を確実に再現できる手順を確立
- 二分探索で問題の範囲を絞り込む
- 最近の変更から調査を開始
- デバッガー、プロファイラー等の適切なツールを活用
- 調査結果と解決策を記録し、知識を共有

## 依存関係の管理

- 本当に必要な依存関係のみを追加
- package-lock.json等のロックファイルを必ずコミット
- 新しい依存関係追加前にライセンス、サイズ、メンテナンス状況を確認
- セキュリティパッチとバグ修正のため定期的に更新

## Writing Tests

This project uses **Vitest** as its primary testing framework. When writing
tests, aim to follow existing patterns. Key conventions include:

### Test Structure and Framework

- **Framework**: All tests are written using Vitest (`describe`, `it`, `expect`,
  `vi`).
- **File Location**: Test files (`*.test.ts` for logic, `*.test.tsx` for React
  components) are co-located with the source files they test.
- **Configuration**: Test environments are defined in `vitest.config.ts` files.
- **Setup/Teardown**: Use `beforeEach` and `afterEach`. Commonly,
  `vi.resetAllMocks()` is called in `beforeEach` and `vi.restoreAllMocks()` in
  `afterEach`.

### Mocking (`vi` from Vitest)

- **ES Modules**: Mock with
  `vi.mock('module-name', async (importOriginal) => { ... })`. Use
  `importOriginal` for selective mocking.
  - _Example_:
    `vi.mock('os', async (importOriginal) => { const actual = await importOriginal(); return { ...actual, homedir: vi.fn() }; });`
- **Mocking Order**: For critical dependencies (e.g., `os`, `fs`) that affect
  module-level constants, place `vi.mock` at the _very top_ of the test file,
  before other imports.
- **Hoisting**: Use `const myMock = vi.hoisted(() => vi.fn());` if a mock
  function needs to be defined before its use in a `vi.mock` factory.
- **Mock Functions**: Create with `vi.fn()`. Define behavior with
  `mockImplementation()`, `mockResolvedValue()`, or `mockRejectedValue()`.
- **Spying**: Use `vi.spyOn(object, 'methodName')`. Restore spies with
  `mockRestore()` in `afterEach`.

### Commonly Mocked Modules

- **Node.js built-ins**: `fs`, `fs/promises`, `os` (especially `os.homedir()`),
  `path`, `child_process` (`execSync`, `spawn`).
- **External SDKs**: `@google/genai`, `@modelcontextprotocol/sdk`.
- **Internal Project Modules**: Dependencies from other project packages are
  often mocked.

### Asynchronous Testing

- Use `async/await`.
- For timers, use `vi.useFakeTimers()`, `vi.advanceTimersByTimeAsync()`,
  `vi.runAllTimersAsync()`.
- Test promise rejections with `await expect(promise).rejects.toThrow(...)`.

### General Guidance

- When adding tests, first examine existing tests to understand and conform to
  established conventions.
- Pay close attention to the mocks at the top of existing test files; they
  reveal critical dependencies and how they are managed in a test environment.

