import "dotenv/config";
import { execSync } from "child_process";

// .env から設定を読み込む（APP_IDを追加）
const { KINTONE_BASE_URL, KINTONE_USERNAME, KINTONE_PASSWORD, KINTONE_APP_ID } =
  process.env;

if (
  !KINTONE_BASE_URL ||
  !KINTONE_USERNAME ||
  !KINTONE_PASSWORD ||
  !KINTONE_APP_ID
) {
  console.error(
    "エラー: .envファイルに接続情報またはアプリID (KINTONE_APP_ID) が設定されていません。",
  );
  process.exit(1);
}

// カスタマイズ適用コマンド
// --app オプションでアプリIDを指定し、マニフェストの内容を適用します
const command = `npx cli-kintone customize apply --base-url ${KINTONE_BASE_URL} --username ${KINTONE_USERNAME} --password ${KINTONE_PASSWORD} --app ${KINTONE_APP_ID} --input customize-manifest.json --watch`;

console.log(`🚀 アプリID: ${KINTONE_APP_ID} にカスタマイズを適用中...`);

try {
  execSync(command, { stdio: "inherit" });
} catch (error) {
  // Ctrl+Cで止めたときのエラー抑制
}
