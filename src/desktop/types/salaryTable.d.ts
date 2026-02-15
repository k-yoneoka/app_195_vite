declare namespace SalaryTable {
  interface SalaryTableRecord {
    みなし残業_9等級: kintone.fieldTypes.Number;
    みなし残業_7等級: kintone.fieldTypes.Number;
    ピッチ_10等級: kintone.fieldTypes.Number;
    みなし残業_5等級: kintone.fieldTypes.Number;
    みなし残業_3等級: kintone.fieldTypes.Number;
    みなし残業_1等級: kintone.fieldTypes.Number;
    setDt: kintone.fieldTypes.Date;
    職務手当_2等級: kintone.fieldTypes.Number;
    基礎給_3等級: kintone.fieldTypes.Number;
    メモ: kintone.fieldTypes.SingleLineText;
    基礎給_1等級: kintone.fieldTypes.Number;
    基礎給_7等級: kintone.fieldTypes.Number;
    基礎給_5等級: kintone.fieldTypes.Number;
    基礎給_10等級: kintone.fieldTypes.Number;
    基礎給_9等級: kintone.fieldTypes.Number;
    ピッチ_3等級: kintone.fieldTypes.Number;
    ピッチ_1等級: kintone.fieldTypes.Number;
    職務手当_8等級: kintone.fieldTypes.Number;
    ピッチ_9等級: kintone.fieldTypes.Number;
    ピッチ_7等級: kintone.fieldTypes.Number;
    職務手当_4等級: kintone.fieldTypes.Number;
    ピッチ_5等級: kintone.fieldTypes.Number;
    職務手当_6等級: kintone.fieldTypes.Number;
    みなし残業_8等級: kintone.fieldTypes.Number;
    みなし残業_6等級: kintone.fieldTypes.Number;
    みなし残業_4等級: kintone.fieldTypes.Number;
    みなし残業_2等級: kintone.fieldTypes.Number;
    職務手当_10等級: kintone.fieldTypes.Number;
    職務手当_1等級: kintone.fieldTypes.Number;
    職務手当_3等級: kintone.fieldTypes.Number;
    基礎給_2等級: kintone.fieldTypes.Number;
    基礎給_6等級: kintone.fieldTypes.Number;
    基礎給_4等級: kintone.fieldTypes.Number;
    基礎給_8等級: kintone.fieldTypes.Number;
    target: kintone.fieldTypes.RadioButton;
    ピッチ_2等級: kintone.fieldTypes.Number;
    職務手当_9等級: kintone.fieldTypes.Number;
    ピッチ_8等級: kintone.fieldTypes.Number;
    ピッチ_6等級: kintone.fieldTypes.Number;
    職務手当_5等級: kintone.fieldTypes.Number;
    みなし残業_10等級: kintone.fieldTypes.Number;
    ピッチ_4等級: kintone.fieldTypes.Number;
    職務手当_7等級: kintone.fieldTypes.Number;
    dutyAllowance: kintone.fieldTypes.Calc;
    baseSalary: kintone.fieldTypes.Calc;

    給与テーブル: kintone.fieldTypes.File;
  }
  interface SavedSalaryTableRecord extends SalaryTableRecord {
    $id: kintone.fieldTypes.Id;
    $revision: kintone.fieldTypes.Revision;
    更新者: kintone.fieldTypes.Modifier;
    作成者: kintone.fieldTypes.Creator;
    レコード番号: kintone.fieldTypes.RecordNumber;
    作成日時: kintone.fieldTypes.CreatedTime;
    更新日時: kintone.fieldTypes.UpdatedTime;
  }
}
