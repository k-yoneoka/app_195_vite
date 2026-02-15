declare namespace License {
  interface LicenseRecord {
    取得日: kintone.fieldTypes.Date;
    有効期限有無: kintone.fieldTypes.RadioButton;
    資格: kintone.fieldTypes.SingleLineText;
    所属: kintone.fieldTypes.DropDown;
    次回更新予定日: kintone.fieldTypes.Date;
    staffCode: kintone.fieldTypes.SingleLineText;
    失効日: kintone.fieldTypes.Date;
    営業所: kintone.fieldTypes.DropDown;
    担当者: kintone.fieldTypes.SingleLineText;
    allowance: kintone.fieldTypes.Number;
    次回有効期限: kintone.fieldTypes.Date;
    就業状態: kintone.fieldTypes.RadioButton;
    資格番号: kintone.fieldTypes.SingleLineText;
    isEnabled: kintone.fieldTypes.DropDown;
    レコード名: kintone.fieldTypes.SingleLineText;

    ユーザー選択: kintone.fieldTypes.UserSelect;
    資格証: kintone.fieldTypes.File;
  }
  interface SavedLicenseRecord extends LicenseRecord {
    $id: kintone.fieldTypes.Id;
    $revision: kintone.fieldTypes.Revision;
    更新者: kintone.fieldTypes.Modifier;
    作成者: kintone.fieldTypes.Creator;
    レコード番号: kintone.fieldTypes.RecordNumber;
    更新日時: kintone.fieldTypes.UpdatedTime;
    作成日時: kintone.fieldTypes.CreatedTime;
  }
}
