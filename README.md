# Markdown Viewer Chrome Extension

Chrome拡張機能で、任意のウェブサイトをマークダウン形式で表示します。

## 機能

- アイコンをクリックするだけで、現在のウェブページをマークダウン形式に変換
- UIなしのシンプルな設計
- @mizchi/readabilityを使用して高品質なコンテンツ抽出
- レスポンシブなマークダウン表示

## インストール

1. このリポジトリをクローンまたはダウンロード
2. `npm install`を実行して依存関係をインストール
3. `npm run build`を実行してビルド
4. Chromeブラウザで`chrome://extensions/`を開く
5. デベロッパーモードを有効にする
6. `dist`フォルダをChromeに読み込む

## 使用方法

1. 任意のウェブサイトを開く
2. 拡張機能アイコンをクリック
3. ページがマークダウン形式で表示される
4. アイコンを再度クリックすると元の表示に戻る

## 技術仕様

- **マークダウン変換**: @mizchi/readability
- **ビルドツール**: Vite
- **言語**: TypeScript
- **フレームワーク**: React (UIなし)
- **マニフェスト**: v3

## 開発

```bash
# 依存関係のインストール
npm install

# 開発モードで起動
npm run dev

# プロダクションビルド
npm run build

# プレビュー
npm run preview
```

## ライセンス

MIT License