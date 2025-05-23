# CHANGELOG

## 2.0.2
* [@akashic/tkoolmv-namagame-converter@2.0.2](https://github.com/akashic-games/tkoolmv-namagame-converter/releases/tag/v2.0.2)
* [@akashic/tkoolmv-namagame-runtime@2.1.0](https://github.com/akashic-games/tkoolmv-namagame-runtime/releases/tag/v2.1.0)

## 2.0.1
* [@akashic/tkoolmv-namagame-converter@2.0.1](https://github.com/akashic-games/tkoolmv-namagame-converter/releases/tag/v2.0.1)
* [@akashic/tkoolmv-namagame-runtime@2.1.0](https://github.com/akashic-games/tkoolmv-namagame-runtime/releases/tag/v2.1.0)

## 2.0.0
* [@akashic/tkoolmv-namagame-converter@2.0.0](https://github.com/akashic-games/tkoolmv-namagame-converter/releases/tag/v2.0.0)
* [@akashic/tkoolmv-namagame-runtime@2.0.3](https://github.com/akashic-games/tkoolmv-namagame-runtime/releases/tag/v2.0.3)

## 1.4.0
- 非サポートプラグインにも対応できるように
- タイトル画面への遷移時、グローバル変数を初期化し直すように
- グローバル変数の循環参照を解消

## 1.3.3
- MAP上で敵にエンカウントできるように
- 戦闘時に敵にステータスアイコンが表示されるように
- コンソールログの量を削減

## 1.3.2
- 同梱しているコンバーターを更新
  - (コンバーターは現在キットとは別リポジトリで管理しているため、キット自体の変更はない)

## 1.3.1
- gamejson-helper で生成される game.json の akashic-runtime のバージョンが 3.7.17-0 になるように

## 1.3.0
- ツクールMVの「画面の色調変更」機能をサポートできるように

## 1.2.4
- リリースGitHub Actionsがエラーのまま続行する問題を修正

## 1.2.3
- 画像の読み込み処理が一度に大量に発生するとゲームが処理落ちしてしまう問題を修正
- 画像ファイルが存在しない場合のエラーハンドリングを修正

## 1.2.2
- gamejson-helper の .js ファイルが相対パスで参照されるように修正

## 1.2.1
- gamejson-helper の .js ファイルが同梱されない問題を修正

## 1.2.0
- 配布時にコンバーターを同梱するように
  - (コンバーターは現在キットとは別リポジトリで管理しているため、キット自体の変更はない)

## 1.1.3
- 並列処理イベントを長時間使用するとゲームが処理落ちしてしまう問題を修正

## 1.1.2
- 1.1.1 でビルドに失敗する問題を修正

## 1.1.1
- akashic-hover-plugin を更新し型定義を参照するように修正

## 1.1.0
- AkashicRankingMode にタイマー制御するプラグインコマンドを追加

## 1.0.0
- 初期リリース
