/* eslint-disable @typescript-eslint/no-explicit-any */

// ↑ この1行を追加することで、このファイル内だけ any の使用が許可されます

declare namespace kintone {
  /**
   * kintone REST API を実行します
   * @template T レスポンスの型 (指定しない場合は any)
   */
  function api<T = any>(
    pathOrUrl: string,
    method: "GET" | "POST" | "PUT" | "DELETE",
    params: any, // パラメータも柔軟性を確保するため any に戻します
  ): Promise<T>;

  /**
   * ローディングスピナーの表示・非表示
   */
  function showLoading(state: "VISIBLE" | "HIDDEN"): Promise<void>;

  namespace api {
    /**
     * APIのURLを取得します
     */
    function url(path: string, detectGuestSpace?: boolean): string;

    /**
     * GETリクエスト用のURLを取得します
     */
    function urlForGet(
      path: string,
      params: any,
      detectGuestSpace?: boolean,
    ): string;
  }

  namespace app {
    /**
     * アプリIDを取得します
     */
    function getId(): number | null;

    /**
     * ヘッダーメニューの要素を取得します
     */
    function getHeaderMenuSpaceElement(): HTMLElement | null;
  }
}
