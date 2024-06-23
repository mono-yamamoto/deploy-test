#!/bin/bash

# コピー先のディレクトリを定義
DEST_DIR="./share"

# コピー先ディレクトリが存在しない場合は作成
if [ ! -d "$DEST_DIR" ]; then
    mkdir -p "$DEST_DIR"
fi

# コピーするファイルのリスト
FILES=(
"./htdocs/shared/unchangeable/js/headerfooter.js"
"./htdocs/shared/unchangeable/js/keyvisual-movie.js"
"./htdocs/shared/unchangeable/js/local-navigation-light.js"
"./htdocs/shared/unchangeable/js/local-navigation.js"
"./htdocs/shared/unchangeable/js/modal.js"
"./htdocs/shared/unchangeable/js/products-slider.js"
"./htdocs/shared/unchangeable/js/tab-content.js"
"./htdocs/shared/unchangeable/js/toggle.js"
)

# ファイルをコピー
for file in "${FILES[@]}"; do
    cp "$file" "$DEST_DIR"
done

echo "ファイルのコピーが完了しました。"
