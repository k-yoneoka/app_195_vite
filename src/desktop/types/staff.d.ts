declare namespace Staff {
  interface StaffRecord {
    追記備考: kintone.fieldTypes.SingleLineText;
    MLsDt: kintone.fieldTypes.Date;
    employmentStatus: kintone.fieldTypes.DropDown;
    配偶者_市区町村: kintone.fieldTypes.SingleLineText;
    普通免許取得日: kintone.fieldTypes.Date;
    緊急連絡先_フリガナ: kintone.fieldTypes.SingleLineText;
    baseWorkingTime: kintone.fieldTypes.Time;
    緊急連絡先_町名: kintone.fieldTypes.SingleLineText;
    isManager: kintone.fieldTypes.RadioButton;
    pitch: kintone.fieldTypes.Number;
    町名: kintone.fieldTypes.SingleLineText;
    staffCode: kintone.fieldTypes.SingleLineText;
    緊急連絡先_それ以降: kintone.fieldTypes.SingleLineText;
    緊急連絡先_都道府県: kintone.fieldTypes.SingleLineText;
    配偶者_収入: kintone.fieldTypes.Number;
    grade: kintone.fieldTypes.SingleLineText;
    雇用保険_被保険者番号: kintone.fieldTypes.SingleLineText;
    給与振込先_その他記入欄: kintone.fieldTypes.MultiLineText;
    estimateName: kintone.fieldTypes.SingleLineText;
    支店名: kintone.fieldTypes.SingleLineText;
    role: kintone.fieldTypes.DropDown;
    配偶者_郵便番号: kintone.fieldTypes.SingleLineText;
    運転免許証番号: kintone.fieldTypes.SingleLineText;
    連絡先: kintone.fieldTypes.Link;
    緊急連絡先_住所フリガナ: kintone.fieldTypes.SingleLineText;
    givenNameCode: kintone.fieldTypes.SingleLineText;
    配偶者_生年月日: kintone.fieldTypes.Date;
    緊急連絡先_氏名: kintone.fieldTypes.SingleLineText;
    みなし時間: kintone.fieldTypes.Number;
    中型免許取得日: kintone.fieldTypes.Date;
    postAllowance: kintone.fieldTypes.Number;
    支店コード: kintone.fieldTypes.SingleLineText;
    配偶者_住所フリガナ: kintone.fieldTypes.SingleLineText;
    口座番号: kintone.fieldTypes.SingleLineText;
    基本行動: kintone.fieldTypes.SingleLineText;
    交付年月日: kintone.fieldTypes.Date;
    本名: kintone.fieldTypes.SingleLineText;
    配偶者_その他記入欄: kintone.fieldTypes.MultiLineText;
    fullNameReading: kintone.fieldTypes.SingleLineText;
    緊急連絡先_連絡先: kintone.fieldTypes.Link;
    都道府県: kintone.fieldTypes.SingleLineText;
    joinDt: kintone.fieldTypes.Date;
    免許証の色: kintone.fieldTypes.DropDown;
    住所フリガナ: kintone.fieldTypes.SingleLineText;
    生年月日: kintone.fieldTypes.Date;
    基礎年金番号: kintone.fieldTypes.SingleLineText;
    配偶者_都道府県: kintone.fieldTypes.SingleLineText;
    配偶者_性別: kintone.fieldTypes.DropDown;
    配偶者_それ以降: kintone.fieldTypes.SingleLineText;
    配偶者_氏名: kintone.fieldTypes.SingleLineText;
    post: kintone.fieldTypes.SingleLineText;
    緊急連絡先_市区町村: kintone.fieldTypes.SingleLineText;
    緊急連絡先_郵便番号: kintone.fieldTypes.SingleLineText;
    cimName: kintone.fieldTypes.SingleLineText;
    配偶者_職業: kintone.fieldTypes.SingleLineText;
    郵便番号: kintone.fieldTypes.SingleLineText;
    それ以降: kintone.fieldTypes.SingleLineText;
    name: kintone.fieldTypes.SingleLineText;
    dutyAllowance: kintone.fieldTypes.Number;
    フリガナ_本名: kintone.fieldTypes.SingleLineText;
    免許証の有効期限: kintone.fieldTypes.Date;
    shop: kintone.fieldTypes.DropDown;
    belong: kintone.fieldTypes.DropDown;
    adjustSalary: kintone.fieldTypes.Number;
    code: kintone.fieldTypes.SingleLineText;
    LWid: kintone.fieldTypes.SingleLineText;
    surNameCode: kintone.fieldTypes.SingleLineText;
    baseSalary: kintone.fieldTypes.Number;
    市区町村: kintone.fieldTypes.SingleLineText;
    緊急連絡先_関係: kintone.fieldTypes.SingleLineText;
    銀行コード: kintone.fieldTypes.SingleLineText;
    性別: kintone.fieldTypes.DropDown;
    firestoreId: kintone.fieldTypes.SingleLineText;
    被扶養者の有無: kintone.fieldTypes.RadioButton;
    配偶者_フリガナ: kintone.fieldTypes.SingleLineText;
    workStatus: kintone.fieldTypes.RadioButton;
    研修期間中の日給: kintone.fieldTypes.Number;
    retirementDt: kintone.fieldTypes.Date;
    配偶者_町名: kintone.fieldTypes.SingleLineText;
    配偶者_基礎年金番号: kintone.fieldTypes.SingleLineText;
    basicActId: kintone.fieldTypes.Number;
    銀行名: kintone.fieldTypes.SingleLineText;
    workType: kintone.fieldTypes.DropDown;
    大型免許取得日: kintone.fieldTypes.Date;
    在職期間: kintone.fieldTypes.Calc;
    isDirector: kintone.fieldTypes.CheckBox;
    primaryOrganization: kintone.fieldTypes.OrganizationSelect;
    selectUser: kintone.fieldTypes.UserSelect;
    人事考課_評価者: kintone.fieldTypes.UserSelect;
    organizations: kintone.fieldTypes.OrganizationSelect;
    famillyAllowanceTable: {
      type: "SUBTABLE";
      value: Array<{
        id: string;
        value: {
          isPartnerFamillyAllowanceTarget_0: kintone.fieldTypes.RadioButton;
          配偶者以外の扶養者人数: kintone.fieldTypes.Number;
          updateDt: kintone.fieldTypes.Date;
          famillyAllowance: kintone.fieldTypes.Calc;
        };
      }>;
    };
    配偶者以外の扶養者: {
      type: "SUBTABLE";
      value: Array<{
        id: string;
        value: {
          扶養者_職業: kintone.fieldTypes.SingleLineText;
          扶養者_住所: kintone.fieldTypes.SingleLineText;
          扶養者_フリガナ: kintone.fieldTypes.SingleLineText;
          expirationDt: kintone.fieldTypes.Date;
          配偶者以外の扶養者メモ: kintone.fieldTypes.SingleLineText;
          扶養者_収入: kintone.fieldTypes.Number;
          扶養者_性別: kintone.fieldTypes.DropDown;
          扶養者_続柄: kintone.fieldTypes.DropDown;
          扶養者_氏名: kintone.fieldTypes.SingleLineText;
          扶養者_生年月日: kintone.fieldTypes.Date;
        };
      }>;
    };
    transferTb: {
      type: "SUBTABLE";
      value: Array<{
        id: string;
        value: {
          shop_tb: kintone.fieldTypes.DropDown;
          setDt: kintone.fieldTypes.Date;
          role_tb: kintone.fieldTypes.DropDown;
          memo_tb: kintone.fieldTypes.SingleLineText;
          belong_tb: kintone.fieldTypes.DropDown;
        };
      }>;
    };
  }
  interface SavedStaffRecord extends StaffRecord {
    $id: kintone.fieldTypes.Id;
    $revision: kintone.fieldTypes.Revision;
    作成者: kintone.fieldTypes.Creator;
    更新者: kintone.fieldTypes.Modifier;
    レコード番号: kintone.fieldTypes.RecordNumber;
    更新日時: kintone.fieldTypes.UpdatedTime;
    作成日時: kintone.fieldTypes.CreatedTime;
  }
}
