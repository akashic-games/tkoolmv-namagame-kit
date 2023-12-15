# gamejson-helper

『RPGツクールMV』で作成されたゲームをニコ生ゲームに変換する際の補助ツールです。  
ニコ生ゲーム (Akashic Engine 製ゲーム) に必要な設定ファイル「game.json」の内容を自動生成します。  
**[Akashic Web サイトで公開されている](https://akashic-games.github.io/shin-ichiba/tkool-mv/gamejson-helper/)ので、通常ゲーム開発者がこれを利用する必要はありません。**

![スクリーンショット](./doc/screenshot.png)

ここで生成された game.json をダウンロードボタンでダウンロードできます。

## ビルド

```sh
npm i
npm run build
```

`dist/` ディレクトリに index.html などが生成されます。

## 使用方法

`dist/index.html` を Web サーバでホストし、ブラウザで開いてください。`file://` では動作しません。
詳細は[ニコ生ゲームへの変換手順](https://akashic-games.github.io/shin-ichiba/tkool-mv/exchange-to-nicolive-game.html)を参照してください。
