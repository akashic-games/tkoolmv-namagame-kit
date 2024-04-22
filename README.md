<p align="center">
<img src="https://github.com/akashic-games/tkoolmv-namagame-kit/blob/main/img/akashic.png"/>
</p>

# tkoolmv-namagame-kit

「[RPG ツクール MV ニコ生ゲーム化キット][kit]」のリポジトリです。

キットの不具合などは [Issues][issue] ページで新規 issue を作成してご連絡ください。

[kit]: https://akashic-games.github.io/shin-ichiba/tkool-mv/index.html
[issue]: https://github.com/akashic-games/tkoolmv-namagame-kit/issues

## キットの構成要素
キットは以下のものから構成されます

- [ランタイム](https://github.com/akashic-games/tkoolmv-namagame-runtime): ツクールMVのコアスクリプトをニコ生ゲーム用に改造したスクリプト
- [コンバーター](https://github.com/akashic-games/tkoolmv-namagame-converter): ツクールMVのゲームをニコ生ゲームに変換する Windows アプリケーション

## リリース方法
以下のコマンドで、RPG ツクール MV ニコ生ゲーム化キットをzip化したものを Github リポジトリの現バージョンのリリースノートにアップロードします。ただし、Windows 環境でしか動作しません。

```bash
npm i
npm run release
```

### リリース内容
上記コマンドで具体的に以下のことが行われます。

- コンバーターのリポジトリに現バージョンの Release Note とタグを作成
- コンバーターの zip を署名付きで、上記 Release Note にアップロード
- 以下の内容で本リポジトリの main ブランチ更新
  - tkoolmv-namagame-converter サブモジュールを最新に更新
  - patch バージョン更新
  - CHANGELOG 更新
- 本リポジトリに現バージョンの Release Note とタグを作成
- キットの zip を作成して、上記 Release Note にアップロード

## ライセンス
本リポジトリは MIT License の元で公開されています。
詳しくは [LICENSE](https://github.com/akashic-games/tkoolmv-namagame-kit/blob/main/LICENSE) をご覧ください。

ただし、画像ファイルおよび音声ファイルは
[CC BY 2.1 JP](https://creativecommons.org/licenses/by/2.1/jp/) の元で公開されています。
