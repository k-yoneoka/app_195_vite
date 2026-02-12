// kintoneのグローバルオブジェクト定義

declare namespace kintone {
  namespace events {
    // 一覧画面表示イベントの型定義
    /* eslint-disable @typescript-eslint/no-explicit-any */
    interface AppRecordIndexShowEvent<T = any> {
      appId: number;
      viewId: number;
      viewName: string;
      viewType: string;
      records: T[];
    }
  }

  namespace app {
    // ヘッダースペース要素取得関数の定義
    function getHeaderMenuSpaceElement(): HTMLElement | null;
    function getRecordId(): number | null;
  }

  // その他のイベント用メソッド
  const events: {
    on(event: string | string[], handler: (event: any) => any): void;
  };
}

// 画像ファイルのimport用
declare module "*.png";
declare module "*.svg";
