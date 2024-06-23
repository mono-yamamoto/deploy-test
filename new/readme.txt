コニカミノルタウェブサイトでは、一部SSIを利用している箇所があります。サンプルデータのご利用にあたっては、SSIの利用をお薦めいたします。
制作時には、テストサーバまたは仮想サーバ上でプレビューを行ってください。

----------------------------------
■サンプルデータ一覧
----------------------------------
/aa-bb/:	サンプルデータ（日本語）
/aa-en/:	サンプルデータ（英語）
/shared/:	共通リソースファイル (CSS, JS and so on)
readme.txt:	Read me （日本語）
readme_en.txt:	Read me （英語）

以下はファビコンとウェブクリップ用のファイルです。
/favicon.ico
/browserconfig.xml
/apple-touch-icon-precomposed-152x152.png
/apple-touch-icon-precomposed-120x120.png
/apple-touch-icon-precomposed.png
/img/tile/***.png

----------------------------------
■サンプルデータについて
----------------------------------
・ サンプルデータ用のファイルは、/aa-bb/sample-sitename 以下に配置しています。
ファイル名を適宜変更して、制作してください。
/aa-bb/sample-sitename/include 以下のインクルードファイルは、サイト毎に編集して配置してください。

・ /shared 以下は、コニカミノルタウェブサイト全体の共有ファイルを、テスト環境での確認用に配置しています。
ファイルの内容を変更しないでください。
また、納品ファイルには含めないでください。

・ ヘッダのサンプルデータは、主に事業サイトで使われるもの（グローバルナビゲーション無し）と、
主に企業サイトで使われるもの（グローバルナビゲーション付）の2パターンあります。
適用したいパターンを選択して使用してください。
「製品情報サンプル（/aa-bb/sample-sitename/product.html）」以外のサンプルデータでは、
グローバルナビゲーション付のヘッダを使用しているので、
グローバルナビゲーション無しのヘッダを使用する場合は、
<!--#include virtual="/aa-bb/include/header_corporate.inc" -->を
<!--#include virtual="/aa-bb/include/header-business.inc" -->へ書き換えてください。

・フッタのサンプルデータは、以下2パターン用意されています。
 　-「ソーシャルメディアオフィシャルアカウント」「お問い合わせ」ボタン無し
 　-「ソーシャルメディアオフィシャルアカウント」「お問い合わせ」ボタン付
適宜ご選択いただき、必要に応じてカスタマイズしてご利用ください。
「製品情報サンプル（/aa-bb/sample-sitename/product.html）」以外のサンプルデータでは、
「ソーシャルメディアオフィシャルアカウント」「お問い合わせ」ボタン付のものを使用しているので、
「ソーシャルメディアオフィシャルアカウント」「お問い合わせ」ボタン無しのものを使用する場合は、
<!--#include virtual="/aa-bb/include/footer-industrieslink.inc" -->を
<!--#include virtual="/aa-bb/include/footer-industrieslink-business.inc" -->へ書き換えてください。

・サイトの[国-言語]毎に、ヘッダ・フッタの一部を共通しています。
サンプルデータでは[国-言語]のディレクトリを/aa-bb/とダミーで設定しているので、
サイトを配置する[国-言語]のディレクトリに合わせて、
<!--#include virtual="/aa-bb/include/header_corporate.inc（header-business.inc）" -->を
<!--#include virtual="/[国-言語]/include/header_corporate.inc（header-business.inc）" -->へ、
<!--#include virtual="/aa-bb/include/footer-industrieslink.inc（footer-industrieslink-business.inc）" -->を
<!--#include virtual="/[国-言語]/include/footer-industrieslink.inc（footer-industrieslink-business.inc）" -->へ書き換えてください。



