// Windowインターフェースを拡張して、krewsheetプロパティを追加
interface Window {
  krewsheet?: {
    // krewSheetオブジェクトの中身の詳細が不明な場合や、
    // 今回のように「存在チェック」だけで使う場合は any で定義してOKです
    [key: string]: unknown;
  };
}
