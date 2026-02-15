import { createRoot } from "react-dom/client";
import { format, addMonths, startOfMonth } from "date-fns";
import { KintoneRestAPIError } from "@kintone/rest-api-client";
// 自作のモジュール読み込み
import { Menu } from "./Menu";
import { KintoneApiCustmize } from "./KintoneApi";
import { APP_IDS, VIEW_IDS } from "./statics";
import type { PayrollRecord, LicenseRecord } from "./types";
// import "./myStyle.css"; // CSS読み込み

(() => {
  console.log("デスクトップカスタマイズが読み込まれました");
  // ---------------------------------------------------
  // 1. 一覧画面：独自メニュー (React) の表示
  // ---------------------------------------------------
  kintone.events.on("app.record.index.show", async (event) => {
    console.log("一覧画面表示イベント:", event);
    // 特定の一覧IDの場合のみ表示
    if (event.viewId === VIEW_IDS.PAYROLL_LATEST) {
      const kintoneApi = new KintoneApiCustmize();

      try {
        // 最新の給与データを取得して、日付リストを作成する
        // (anyを使わずにジェネリクスで型指定)
        const records = await kintoneApi.getRecords<PayrollRecord>({
          app: APP_IDS.payroll,
          query: "order by baseDt desc limit 500",
          fields: ["baseDt", "fixed"],
        });

        const dates = [
          ...new Set(
            records
              .filter((rec) => rec.fixed.value.length === 0)
              .map((rec) => rec.baseDt.value),
          ),
        ];

        // データがない場合は翌月を追加
        if (dates.length === 0 && records.length > 0) {
          dates.push(
            format(
              addMonths(new Date(records[0].baseDt.value), 1),
              "yyyy-LL-dd",
            ),
          );
        } else if (dates.length === 0) {
          // レコード自体が0件の場合の初期値など
          dates.push(format(new Date(), "yyyy-LL-dd"));
        }

        const container = kintone.app.getHeaderMenuSpaceElement();
        // 自分専用のIDを決めておく
        const myMenuId = "my-custom-payroll-menu-root";
        console.log("メニュー表示用コンテナ:", container);
        console.log(container?.hasChildNodes());
        if (container && !document.getElementById(myMenuId)) {
          // まだ無い場合のみ、自分専用の場所を作る
          const myWrapper = document.createElement("div");
          myWrapper.id = myMenuId;

          // 他のボタンと並ぶようにスタイル調整（必要に応じて）
          myWrapper.style.display = "inline-block";
          myWrapper.style.verticalAlign = "top";

          // Kintoneのヘッダースペースに追加
          container.appendChild(myWrapper);

          // 自分専用の場所にReactを描画
          const root = createRoot(myWrapper);
          root.render(<Menu dates={dates} />);
        }
      } catch (error) {
        console.error("メニュー表示エラー:", error);
      }
    }
    return event;
  });

  // ---------------------------------------------------
  // 2. PrintCreator (帳票) ボタンの表示制御
  // ---------------------------------------------------
  kintone.events.on(
    ["app.record.index.show", "app.record.detail.show"],
    (event) => {
      if (
        event.type.includes("detail") ||
        event.viewId === VIEW_IDS.PRINT_CREATOR_TARGET
      ) {
        // 少し待ってからDOMを操作 (PrintCreatorの仕様に合わせる)
        setTimeout(() => {
          const el = document.querySelector(
            "#print-creator-root",
          ) as HTMLDivElement;
          if (el) {
            el.style.display = "inline-block";
          }
        }, 1000);
      }
    },
  );

  // ---------------------------------------------------
  // 3. 新規作成時：日付変更時の自動入力
  // ---------------------------------------------------
  kintone.events.on(
    ["app.record.create.change.baseDt", "app.record.create.change.name"],
    (event) => {
      const record = event.record as unknown as PayrollRecord;
      const staffCode = record.staffCode.value;

      // 日付を「月初」に変換
      const baseDt = record.baseDt.value
        ? format(startOfMonth(new Date(record.baseDt.value)), "yyyy-LL-dd")
        : "";

      // 値を書き戻す
      record.baseDt.value = baseDt;
      record.keyCode.value =
        baseDt && staffCode ? `${baseDt}_${staffCode}` : "";

      return event;
    },
  );

  // ---------------------------------------------------
  // 4. 保存実行時：ライセンス情報の自動転記
  // ---------------------------------------------------
  kintone.events.on(["app.record.create.submit"], async (event) => {
    const record = event.record as unknown as PayrollRecord;
    const staffCode = record.staffCode.value;

    if (!staffCode) {
      return event;
    }

    try {
      const kintoneApi = new KintoneApiCustmize();

      // ライセンス情報の取得 (API)
      // 条件: スタッフコード一致 & 有効 & 手当>0
      const query = `staffCode = "${staffCode}" and isEnabled in ("有効") and allowance > 0`;
      const licenses = await kintoneApi.getRecords<LicenseRecord>({
        app: APP_IDS.license,
        query: query,
      });

      // サブテーブル用データに変換
      const licenseRows = licenses.map((license) => ({
        value: {
          licenseId: { value: license.$id.value },
        },
      }));

      // レコードのテーブルを上書き
      record.licenseTable.value =
        licenseRows.length > 0
          ? licenseRows
          : [{ value: { licenseId: { value: "" } } }]; // 空行

      // APIを使って保存 (標準の保存をキャンセルしてAPIで行う特殊フロー)
      // ※注意: recordオブジェクトをそのまま渡すとkintoneの仕様上エラーになることがあるため、必要なデータのみ抽出するのが理想ですが、
      // ここでは元のロジックを尊重して record を渡します。
      await kintoneApi.addRecord({ app: APP_IDS.payroll, record: record });

      // 保存完了後に一覧へリダイレクト
      location.href = `/k/${kintone.app.getId()}/`;
      return false; // 標準の保存処理をキャンセル
    } catch (error) {
      console.error(error);
      // エラーメッセージを表示
      let errorMessage = "不明なエラーが発生しました";

      if (error instanceof KintoneRestAPIError) {
        // kintone APIのエラー（バリデーションエラーなど）
        // 必要であれば error.errors を見るとフィールドごとの詳細エラーも取れます
        errorMessage = error.message;
      } else if (error instanceof Error) {
        // 一般的なJavaScriptエラー（ReferenceErrorなど）
        errorMessage = error.message;
      } else {
        // それ以外の何か（文字列がthrowされた場合など）
        errorMessage = String(error);
      }

      event.error = "保存中にエラーが発生しました: " + errorMessage;
      return event;
    }
  });
})();
