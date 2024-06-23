import { SSIPlugin } from '@server-side-include/vite-plugin';
import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';


const AXE_LOCALE_JA = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'node_modules/axe-core/locales/ja.json'), 'utf-8'));

const InsertScriptPlugin = () => {
  return {
    name: 'insert-axe-script', // プラグイン名
    transformIndexHtml(html) {
			const axeScript = `
            <script src="https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.8.2/axe.min.js"></script>
            <script>
                window.onload = function() {

                            axe.configure({
                                locale: ${JSON.stringify(AXE_LOCALE_JA)},
																rules: [
																	{
																			id: 'color-contrast',
																			enabled: true
																	}
															]
                            });
														axe.run().then(function(results) {
															console.table('アクセシビリティ確認の結果：', results);
															if (results.violations.length > 0) {
																	console.log('アクセシビリティの問題点：');
																	results.violations.forEach(function(violation) {
																			console.log('問題:', violation.help);
																			console.log('詳細:', violation.description);
																			// 対象の要素を配列ではなく個別に出力合わせてfailureSummaryも出力
																			violation.nodes.forEach(function(node) {
																				console.log('対象要素:', node.html);
																				console.log('failureSummary:', node.failureSummary);
																			});
																			
																			console.log('詳細情報:', violation.helpUrl);
																			console.log('---');
																	});
															} else {
																	console.log('アクセシビリティの問題は見つかりませんでした。');
															}
													}
												);
                };
            </script>
            `;
      // axe-coreのスクリプトタグを挿入
      // HTMLの</head>タグの直前にスクリプトを挿入
      return html.replace('</head>', `${axeScript}</head>`);
    },
  };
};

export default defineConfig({
    root: './htdocs',
    server: {
      port: 3000,
    },
  plugins: [
    SSIPlugin({
      variables: {
        $locale: 'en',
      },
      rejectUnauthorized: true,
    }),
		InsertScriptPlugin(),
  ],

});