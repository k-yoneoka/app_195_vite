declare namespace EsimBilling {
  interface EsimBillingRecord {
    esimBillingDt: kintone.fieldTypes.Date;
    shop: kintone.fieldTypes.DropDown;
    単価: kintone.fieldTypes.Number;
    belong: kintone.fieldTypes.RadioButton;
    月: kintone.fieldTypes.SingleLineText;
    手数料: kintone.fieldTypes.Number;
    合計: kintone.fieldTypes.Number;
    dt: kintone.fieldTypes.Date;
    通話通信量料: kintone.fieldTypes.Number;
    消費税: kintone.fieldTypes.Number;
    ソリューション: kintone.fieldTypes.Number;
    消費計: kintone.fieldTypes.Number;
    model: kintone.fieldTypes.SingleLineText;
    基本使用料: kintone.fieldTypes.Number;
    staffCode: kintone.fieldTypes.SingleLineText;
    tax: kintone.fieldTypes.Number;
    mobileNo: kintone.fieldTypes.Link;
    請求額計: kintone.fieldTypes.Number;
    MMS: kintone.fieldTypes.Number;
    デバイス管理: kintone.fieldTypes.RadioButton;
    データプラン料金: kintone.fieldTypes.Number;
    年: kintone.fieldTypes.SingleLineText;
    国際通話通信: kintone.fieldTypes.Number;
    保守パック: kintone.fieldTypes.Number;
    割振: kintone.fieldTypes.Number;
    SMS: kintone.fieldTypes.Number;
    user: kintone.fieldTypes.SingleLineText;
    その他: kintone.fieldTypes.Number;
    コンテンツ情報料: kintone.fieldTypes.Number;
    total: kintone.fieldTypes.Calc;
    お客様料金項目合計: kintone.fieldTypes.Calc;
    device: kintone.fieldTypes.Calc;
    isEsimPaymentExclusion: kintone.fieldTypes.CheckBox;
    ユーザー選択: kintone.fieldTypes.UserSelect;
  }
  interface SavedEsimBillingRecord extends EsimBillingRecord {
    $id: kintone.fieldTypes.Id;
    $revision: kintone.fieldTypes.Revision;
    更新者: kintone.fieldTypes.Modifier;
    作成者: kintone.fieldTypes.Creator;
    レコード番号: kintone.fieldTypes.RecordNumber;
    更新日時: kintone.fieldTypes.UpdatedTime;
    作成日時: kintone.fieldTypes.CreatedTime;
  }
}
