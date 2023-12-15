<p align="center">
<img src="https://github.com/akashic-games/tkoolmv-namagame-kit/blob/main/img/akashic.png"/>
</p>

# tkoolmv-namagame-kit

「[RPG ツクール MV ニコ生ゲーム化キット][kit]」のリポジトリです。

キットの不具合などは [Issues][issue] ページで新規 issue を作成してご連絡ください。

[kit]: https://akashic-games.github.io/shin-ichiba/tkool-mv/index.html
[issue]: https://github.com/akashic-games/tkoolmv-namagame-kit/issues

## ビルド方法
以下のコマンドでビルドを実行します。

```bash
npm install
```

上記コマンド実行後、`dist` ディレクトリ下に `tkoolmv-namagame-kit` ディレクトリと `gamejson-helper` が生成されます。

### tkoolmv-namagame-kit の内容
以下のようなディレクトリ構造になっています。
- game: ニコ生ゲーム変換用テンプレート
- plugins: RPGツクールMVで利用するプラグインが配置
- README.html: RPGツクールMVのゲームをニコ生ゲームに変換する方法が記載されたマニュアル

### gamejson-helper の内容
以下のようなファイル構造になっています。
- index.html: game.json生成ページ。公式ページで https://akashic-games.github.io/shin-ichiba/tkool-mv/gamejson-helper/ というURLで利用される
- index.*.js: game.json生成ページで利用されるスクリプト

## 開発者向け

### runtime/ に .ts ファイルを追加・削除する場合

このディレクトリの成果物は、ゲームにスクリプトアセットとして同梱されるファイルです。
そのため、ファイルを追加・削除した場合 static/game.json に反映する必要があります。

上の tkoolmv-namgame-kit.zip を生成する手順でゲームのスクリプトファイルを生成した後、
dist/tkoolmv-namagame-kit/game/game.json を static/game.json に上書きしてコミットしてください。

### テスト方法
以下のコマンドで、runtime, gamejson-helper, static に対して lint が実行されます。

```bash
npm test
```

## ライセンス
本リポジトリは MIT License の元で公開されています。
詳しくは [LICENSE](https://github.com/akashic-games/tkoolmv-namagame-kit/blob/main/LICENSE) をご覧ください。

ただし、画像ファイルおよび音声ファイルは
[CC BY 2.1 JP](https://creativecommons.org/licenses/by/2.1/jp/) の元で公開されています。
