import type { Dispatch, SetStateAction } from "react";
import Button from "@mui/material/Button";
import Swal from "sweetalert2";
import { format, subMonths, endOfMonth } from "date-fns";
import { KintoneRestAPIError } from "@kintone/rest-api-client";

import { KintoneApiCustmize } from "./KintoneApi";
import { APP_IDS } from "./statics";
import type {
  TimecardRecord,
  PayrollRecord,
  StaffRecord,
  LicenseRecord,
  PocketMoneyQuarterlyRecord,
  PocketMoneyManagerRecord,
  EsimBillingRecord,
  RepairMenuRecord,
  SalaryTableRecord,
  SalaryIncreaseRecord,
} from "./types";

type UpdateButtonProps = {
  setOpen: Dispatch<SetStateAction<boolean>>;
  baseDt: string;
  shop: string;
};

export const UpdateButton = (props: UpdateButtonProps) => {
  const { setOpen, baseDt, shop } = props;

  /**
   * 時刻を浮動小数に変更
   */
  const cnvHHMMtoFloat = (time: string | undefined): number => {
    if (!time) return 0;
    const result = time.match(/(-*)(\d+):(\d+)/);
    if (!result) return 0;
    return Number(result[1] + (Number(result[2]) + Number(result[3]) / 60));
  };

  // --- 登録・更新用の型定義 ---
  type PutRecordParams = {
    timecardRecs: TimecardRecord[];
    licenseRecs: LicenseRecord[];
    poketMoneryQuarterlyRecs: PocketMoneyQuarterlyRecord[];
    poketMoneyManagerRec?: PocketMoneyManagerRecord;
    esimBllingRecs: EsimBillingRecord[];
    thisMonthPayroll: PayrollRecord[];
  };

  type AddRecordParams = Omit<PutRecordParams, "thisMonthPayroll"> & {
    preMonthPayroll: PayrollRecord[];
    salarytableRecs: SalaryTableRecord[];
    evaluetionRecs: SalaryIncreaseRecord[];
    staffRecs: StaffRecord[];
  };

  /**
   * レコード新規作成
   */
  const addRecords = async ({
    timecardRecs,
    preMonthPayroll,
    licenseRecs,
    poketMoneryQuarterlyRecs,
    poketMoneyManagerRec,
    esimBllingRecs,
    salarytableRecs,
    evaluetionRecs,
    staffRecs,
  }: AddRecordParams) => {
    const dt = new Date(baseDt);
    const kintoneApi = new KintoneApiCustmize();

    const [initialSalary_f] = salarytableRecs
      .filter((rec) => rec.target.value === "フロント")
      .flatMap((rec) => [
        {
          baseSalary: rec.baseSalary.value,
          dutyAllowance: rec.dutyAllowance.value,
        },
      ]);

    const [initialSalary_m] = salarytableRecs
      .filter((rec) => rec.target.value === "外勤者")
      .flatMap((rec) => [
        {
          baseSalary: rec.baseSalary.value,
          dutyAllowance: rec.dutyAllowance.value,
        },
      ]);

    // タイムカードを１つずつ回して給与明細レコードを作成
    const postRecs = timecardRecs.flatMap((timecardRec) => {
      const staffCode = timecardRec.staffCode.value;

      const staffdata = staffRecs.find(
        (rec) => rec.staffCode.value === staffCode,
      );
      const preData = preMonthPayroll.find(
        (preRec) => preRec.staffCode.value === staffCode,
      );
      const evalutionData = evaluetionRecs.find(
        (rec) => rec.staffCode.value === staffCode,
      );

      if (!staffdata) return [];

      const isFront = staffdata.role.value === "フロント";

      // 社員台帳の履歴テーブルから役割を抽出
      const roleRow = staffdata.transferTb.value
        .filter(
          (row) =>
            row.value.setDt.value <= format(endOfMonth(dt), "yyyy-LL-dd"),
        )
        .sort((a, b) =>
          a.value.setDt.value < b.value.setDt.value ? 1 : -1,
        )[0];
      const role = roleRow ? roleRow.value.role_tb.value : "";

      // お小遣い集計
      const pmQuarterly = poketMoneryQuarterlyRecs.filter(
        (rec) => rec.staffCode.value === staffCode,
      );
      const managerRow = poketMoneyManagerRec?.tableStaff.value.find(
        (row) => row.value.staffCode.value === staffCode,
      );

      const poketMoney = {
        actual: pmQuarterly.reduce(
          (acc, rec) => acc + Number(rec.totalActualAllowance_0.value || 0),
          0,
        ),
        quaterly: pmQuarterly.reduce(
          (acc, rec) => acc + Number(rec.totalTargetAllowance.value || 0),
          0,
        ),
        manager: managerRow ? Number(managerRow.value.allowance.value || 0) : 0,
      };

      // 家族手当
      const famillyAllowance = (() => {
        const filterRows = staffdata.famillyAllowanceTable.value.filter(
          (row) => row.value.updateDt.value <= baseDt,
        );
        if (filterRows.length) {
          return Number(
            filterRows.reduce((prev, current) =>
              prev.value.updateDt.value > current.value.updateDt.value
                ? prev
                : current,
            ).value.famillyAllowance.value || 0,
          );
        } else {
          return 0;
        }
      })();

      // eSIM
      const esim = esimBllingRecs
        .filter((rec) => rec.staffCode.value === staffCode)
        .reduce((acc, rec) => acc + parseInt(rec.total.value || "0", 10), 0);

      const userData = {
        workType: timecardRec.workType.value,
        staffCode: staffCode,
        baseSalary: "0",
        dutyAllowance: "0",
        postAllowance: "0",
        post: "",
        grade: "",
        role: role ?? "",
        adjustSalary: "0",
        handHourlyWage: "0",
      };

      // 給与情報の決定ロジック
      if (userData.workType === "研修") {
        userData.baseSalary = staffdata.baseSalary.value;
        userData.dutyAllowance = staffdata.dutyAllowance.value;
        userData.postAllowance = staffdata.postAllowance.value;
        userData.post = staffdata.post.value;
        userData.grade = staffdata.grade.value;
        userData.adjustSalary = staffdata.adjustSalary.value;
      } else {
        if (evalutionData) {
          userData.baseSalary = evalutionData.baseSalary_after.value;
          userData.dutyAllowance = evalutionData.dutyAllowance_after.value;
          userData.postAllowance = evalutionData.postAllowance_after.value;
          userData.post = evalutionData.post_after.value;
          userData.grade = evalutionData.grade_after.value;
          userData.adjustSalary = evalutionData.adjustSalary_after.value;
        } else if (evaluetionRecs.length > 0) {
          // 新給与テーブル
          userData.baseSalary = isFront
            ? initialSalary_f?.baseSalary || "0"
            : initialSalary_m?.baseSalary || "0";
          userData.dutyAllowance = isFront
            ? initialSalary_f?.dutyAllowance || "0"
            : initialSalary_m?.dutyAllowance || "0";
          userData.grade = `${isFront ? "一般" : "総合"}職_1等級`;
        } else if (preData) {
          userData.baseSalary = preData.baseSalary.value;
          userData.dutyAllowance = preData.dutyAllowance.value;
          userData.postAllowance = preData.postAllowance.value;
          userData.post = preData.post.value;
          userData.grade = preData.grade.value;
          userData.adjustSalary = preData.adjustSalary.value;
          userData.handHourlyWage = preData.handHourlyWage.value;
        } else {
          userData.baseSalary = staffdata.baseSalary.value;
          userData.dutyAllowance = staffdata.dutyAllowance.value;
          userData.postAllowance = staffdata.postAllowance.value;
          userData.post = staffdata.post.value;
          userData.grade = staffdata.grade.value;
          userData.adjustSalary = staffdata.adjustSalary.value;
        }
      }

      const licenseData = licenseRecs
        .filter((license) => license.staffCode.value === staffCode)
        .flatMap((license) => [
          { value: { licenseId: { value: license.$id.value } } },
        ]);

      const lateEarlyRows = timecardRec.detailTable.value
        .filter((row) => /遅刻|早退/.test(row.value.other.value))
        .flatMap((row) => [
          {
            value: {
              遅早日: { value: row.value.dt.value },
              time: { value: row.value.notEnoughTime.value },
            },
          },
        ]);

      // 構築したレコードオブジェクト
      return {
        baseDt: { value: baseDt },
        keyCode: { value: `${baseDt}_${staffCode}` },
        staffCode: { value: staffCode },
        shop: { value: shop },
        deliveryShop: { value: preData?.deliveryShop.value ?? shop },
        role: { value: userData.role },
        workType: { value: userData.workType },
        totalWorkingTime: {
          value: cnvHHMMtoFloat(timecardRec.totalWorkingTime.value),
        },
        actualWorkTime: {
          value: cnvHHMMtoFloat(timecardRec.actualWorkTime.value),
        },
        upEarlyTime: { value: cnvHHMMtoFloat(timecardRec.upEarlyTime.value) },
        nonStatutoryOvertimeWork: {
          value: cnvHHMMtoFloat(timecardRec.nonStatutoryOvertimeWork.value),
        },
        statutoryOvertimeWork: {
          value: cnvHHMMtoFloat(timecardRec.statutoryOvertimeWork.value),
        },
        mdnOrverTime: {
          value: cnvHHMMtoFloat(timecardRec.totalMdnOrverTime.value),
        },
        totalOrverTime: {
          value: cnvHHMMtoFloat(timecardRec.totalOrverTime.value),
        },
        totalWorkingTimeForNum: {
          value: timecardRec.totalWorkingTimeForNum.value,
        },
        actualWorkTimeForNum: { value: timecardRec.actualWorkTimeForNum.value },
        upEarlyTimeForNum: { value: timecardRec.upEarlyTimeForNum.value },
        nonStatutoryOvertimeWorkForNum: {
          value: timecardRec.nonStatutoryOvertimeWorkForNum.value,
        },
        statutoryOvertimeWorkForNum: {
          value: timecardRec.statutoryOvertimeWorkForNum.value,
        },
        mdnOrverTimeForNum: {
          value: timecardRec.totalMdnOrverTimeForNum.value,
        },
        totalOrverTimeForNum: { value: timecardRec.totalOrverTimeForNum.value },
        cntAttend: { value: timecardRec.cntTotalAttend.value },
        cntHolidayWork: { value: timecardRec.cntTotalHolidayWork.value },
        cntSideBiss: { value: timecardRec.cntTotalSideBiss.value },
        cntTardy: { value: timecardRec.cntTotalTardy.value },
        cntLeaveEarly: { value: timecardRec.cntTotalLeaveEarly.value },
        cntAbsence: { value: timecardRec.cntTotalAbsence.value },
        cntSpacial: { value: timecardRec.cntTotalSpacial.value },
        cntHalfPTO: { value: timecardRec.cntTotalHalfPTO.value },
        cntTOWP: { value: timecardRec.cntTotalTOWP.value },
        cntPTO: { value: timecardRec.cntTotalPTO.value },
        cntAdjustment: { value: timecardRec.cntTotalAdjustment.value },
        baseWorkingTime: { value: timecardRec.baseWorkingTime.value },
        post: { value: userData.post },
        grade: { value: userData.grade },
        baseSalary: { value: userData.baseSalary },
        postAllowance: { value: userData.postAllowance },
        dutyAllowance: { value: userData.dutyAllowance },
        adjustSalary: { value: userData.adjustSalary },
        familyAllowance: {
          value:
            baseDt < "2024-05-01"
              ? Number(preData?.familyAllowance.value || 0)
              : famillyAllowance,
        },
        housingAllowance: {
          value: Number(preData?.housingAllowance.value || 0),
        },
        応援日数: { value: Number(preData?.応援日数.value || 0) },
        handHourlyWage: { value: Number(preData?.handHourlyWage.value || 0) },
        km: { value: Number(preData?.km.value || 0) },
        licenseTable: {
          value: licenseData.length
            ? licenseData
            : [{ value: { licenseId: { value: "" } } }],
        },
        spAllowanceTable: { value: [{ value: {} }] },
        deductionTable: { value: [{ value: {} }] },
        lateEarlyTable: {
          value: lateEarlyRows.length ? lateEarlyRows : [{ value: {} }],
        },
        poketMoneyMonth: {
          value: timecardRec.workType.value === "研修" ? 0 : poketMoney.actual,
        },
        poketMoneyQuarterly: {
          value:
            timecardRec.workType.value === "研修" ? 0 : poketMoney.quaterly,
        },
        poketMoneyManager: { value: poketMoney.manager },
        eSIM: { value: esim },
        dailyAllowance: {
          value: userData.workType === "研修" ? (isFront ? 9000 : 10000) : 0,
        },
        isOfficeWorker: { value: isFront ? "フロント" : "" },
      };
    });

    // as any で型チェックを緩和して送信
    if (postRecs.length) {
      await kintoneApi.addAllRecords({
        app: APP_IDS.payroll,
        records: postRecs,
      });
    }
  };

  /**
   * レコード更新
   */
  const putRecords = async ({
    timecardRecs,
    licenseRecs,
    poketMoneryQuarterlyRecs,
    poketMoneyManagerRec,
    esimBllingRecs,
    thisMonthPayroll,
  }: PutRecordParams) => {
    const kintoneApi = new KintoneApiCustmize();

    const putRecs = timecardRecs.flatMap((timecardRec) => {
      const staffCode = timecardRec.staffCode.value;
      const payrollRec = thisMonthPayroll.find(
        (rec) => rec.staffCode.value === staffCode,
      );

      // 資格データ
      const targetLicenses = licenseRecs.filter(
        (l) => l.staffCode.value === staffCode,
      );
      const licenseData =
        targetLicenses.length > 0
          ? targetLicenses.map((license) => {
              const existingRow = payrollRec?.licenseTable.value.find(
                (row) => row.value.licenseId.value === license.$id.value,
              );
              return {
                id: existingRow ? existingRow.id : undefined,
                value: { licenseId: { value: license.$id.value } },
              };
            })
          : [{ value: { licenseId: { value: "" } } }];

      // お小遣い集計
      const pmQuarterly = poketMoneryQuarterlyRecs.filter(
        (rec) => rec.staffCode.value === staffCode,
      );
      const managerRow = poketMoneyManagerRec?.tableStaff.value.find(
        (r) => r.value.staffCode.value === staffCode,
      );

      const poketMoney = {
        actual: pmQuarterly.reduce(
          (acc, rec) => acc + Number(rec.totalActualAllowance_0.value || 0),
          0,
        ),
        quaterly: pmQuarterly.reduce(
          (acc, rec) => acc + Number(rec.totalTargetAllowance.value || 0),
          0,
        ),
        manager: managerRow ? Number(managerRow.value.allowance.value || 0) : 0,
      };

      // eSIM
      const esim = esimBllingRecs
        .filter((rec) => rec.staffCode.value === staffCode)
        .reduce((acc, rec) => acc + parseInt(rec.total.value || "0", 10), 0);

      return {
        updateKey: {
          field: "keyCode",
          value: `${baseDt}_${staffCode}`,
        },
        record: {
          totalWorkingTime: {
            value: cnvHHMMtoFloat(timecardRec.totalWorkingTime.value),
          },
          actualWorkTime: {
            value: cnvHHMMtoFloat(timecardRec.actualWorkTime.value),
          },
          upEarlyTime: { value: cnvHHMMtoFloat(timecardRec.upEarlyTime.value) },
          statutoryOvertimeWork: {
            value: cnvHHMMtoFloat(timecardRec.statutoryOvertimeWork.value),
          },
          nonStatutoryOvertimeWork: {
            value: cnvHHMMtoFloat(timecardRec.nonStatutoryOvertimeWork.value),
          },
          mdnOrverTime: {
            value: cnvHHMMtoFloat(timecardRec.totalMdnOrverTime.value),
          },
          totalOrverTime: {
            value: cnvHHMMtoFloat(timecardRec.totalOrverTime.value),
          },
          totalWorkingTimeForNum: {
            value: timecardRec.totalWorkingTimeForNum.value,
          },
          actualWorkTimeForNum: {
            value: timecardRec.actualWorkTimeForNum.value,
          },
          upEarlyTimeForNum: { value: timecardRec.upEarlyTimeForNum.value },
          statutoryOvertimeWorkForNum: {
            value: timecardRec.statutoryOvertimeWorkForNum.value,
          },
          nonStatutoryOvertimeWorkForNum: {
            value: timecardRec.nonStatutoryOvertimeWorkForNum.value,
          },
          mdnOrverTimeForNum: {
            value: timecardRec.totalMdnOrverTimeForNum.value,
          },
          totalOrverTimeForNum: {
            value: timecardRec.totalOrverTimeForNum.value,
          },
          cntAttend: { value: timecardRec.cntTotalAttend.value },
          cntHolidayWork: { value: timecardRec.cntTotalHolidayWork.value },
          cntSideBiss: { value: timecardRec.cntTotalSideBiss.value },
          cntTardy: { value: timecardRec.cntTotalTardy.value },
          cntLeaveEarly: { value: timecardRec.cntTotalLeaveEarly.value },
          cntAbsence: { value: timecardRec.cntTotalAbsence.value },
          cntSpacial: { value: timecardRec.cntTotalSpacial.value },
          cntHalfPTO: { value: timecardRec.cntTotalHalfPTO.value },
          cntPTO: { value: timecardRec.cntTotalPTO.value },
          cntTOWP: { value: timecardRec.cntTotalTOWP.value },
          cntAdjustment: { value: timecardRec.cntTotalAdjustment.value },
          baseWorkingTime: { value: timecardRec.baseWorkingTime.value },
          poketMoneyMonth: {
            value:
              timecardRec.workType.value === "研修" ? 0 : poketMoney.actual,
          },
          poketMoneyQuarterly: {
            value:
              timecardRec.workType.value === "研修" ? 0 : poketMoney.quaterly,
          },
          poketMoneyManager: { value: poketMoney.manager },
          licenseTable: { value: licenseData },
          eSIM: { value: esim },
        },
      };
    });

    if (putRecs.length) {
      // as any で型チェックを緩和
      await kintoneApi.updateAllRecords({
        app: APP_IDS.payroll,
        records: putRecs,
      });
    }
  };

  /**
   * ボタンクリック時の処理
   */
  const handleClick = async () => {
    try {
      if (baseDt === "" || shop === "") {
        throw new Error("営業所・基準日を選択してください");
      }

      const dt = new Date(baseDt);
      const preMonthDate = format(subMonths(dt, 1), "yyyy-LL-dd");
      const preMonthEndDate = format(
        endOfMonth(subMonths(dt, 1)),
        "yyyy-LL-dd",
      );

      setOpen(true);
      const kintoneApi = new KintoneApiCustmize();

      // 1. 勤怠データ取得
      const timecardRecs = await kintoneApi.getRecords<TimecardRecord>({
        app: APP_IDS.timecard,
        query: `baseDt = "${baseDt}" and  shop in ("${shop}") limit 500`,
        fields: [
          "fixed",
          "staffCode",
          "grade",
          "workType",
          "totalWorkingTime",
          "actualWorkTime",
          "upEarlyTime",
          "statutoryOvertimeWork",
          "nonStatutoryOvertimeWork",
          "totalMdnOrverTime",
          "totalOrverTime",
          "totalWorkingTimeForNum",
          "actualWorkTimeForNum",
          "upEarlyTimeForNum",
          "statutoryOvertimeWorkForNum",
          "nonStatutoryOvertimeWorkForNum",
          "totalMdnOrverTimeForNum",
          "totalOrverTimeForNum",
          "cntTotalAttend",
          "cntTotalHolidayWork",
          "cntTotalSideBiss",
          "cntTotalTardy",
          "cntTotalLeaveEarly",
          "cntTotalAbsence",
          "cntTotalSpacial",
          "cntTotalAdjustment",
          "cntTotalPTO",
          "cntTotalHalfPTO",
          "cntTotalTOWP",
          "baseWorkingTime",
          "detailTable",
        ],
      });

      if (timecardRecs.length === 0) {
        throw new Error("指定した年月の勤怠データが存在しませんでした。");
      } else if (
        timecardRecs.filter((rec) => rec.fixed.value.length === 0).length
      ) {
        throw new Error("未確定の勤怠データがあるため処理を中断しました。");
      }

      const optQueryStaff = `and (staffCode = "${timecardRecs.map((timecardRec) => timecardRec.staffCode.value).join('" or staffCode = "')}")`;

      // 2. 給与データ取得 (当月・前月)
      const payrollRecs = await kintoneApi.getRecords<PayrollRecord>({
        app: APP_IDS.payroll,
        query: `(baseDt = "${preMonthDate}" or baseDt = "${baseDt}") ${optQueryStaff} limit 500`,
        fields: [
          "fixed",
          "baseDt",
          "staffCode",
          "handHourlyWage",
          "workType",
          "baseSalary",
          "dutyAllowance",
          "postAllowance",
          "post",
          "grade",
          "adjustSalary",
          "familyAllowance",
          "housingAllowance",
          "deliveryShop",
          "km",
          "応援日数",
          "licenseTable",
        ],
      });

      const preMonthPayroll = payrollRecs.filter(
        (rec) => rec.baseDt.value === preMonthDate,
      );
      const thisMonthPayroll = payrollRecs.filter(
        (rec) => rec.baseDt.value === baseDt,
      );

      if (thisMonthPayroll.filter((rec) => rec.fixed.value.length).length) {
        throw new Error(
          `${shop} ${baseDt} は確定済みレコードが含まれているため一括処理することはできません`,
        );
      }

      // 3. 修理外メニュー (ステータスチェックのみ)
      const repairMenuRecs = await kintoneApi.getRecords<RepairMenuRecord>({
        app: APP_IDS.repairmenu,
        query: `aggBaseDt >= "${preMonthDate}" and aggBaseDt<= "${preMonthEndDate}" and ステータス not in ("確定")`,
        fields: ["ステータス"],
      });

      if (
        repairMenuRecs.filter((rec) => rec["ステータス"].value !== "確定")
          .length
      ) {
        throw new Error(
          "修理外が未確定のレコードがあるため処理を中断いたしました。",
        );
      }

      // 4. お小遣い予実
      const poketMoneryQuarterlyRecs =
        await kintoneApi.getRecords<PocketMoneyQuarterlyRecord>({
          app: APP_IDS.budgetControlPoketMoney,
          query: `payrollTargetDt = "${baseDt}" limit 500`,
          fields: [
            "totalTargetAllowance",
            "totalActualAllowance_0",
            "staffCode",
            "fixed",
          ],
        });

      if (poketMoneryQuarterlyRecs.length) {
        if (
          poketMoneryQuarterlyRecs.filter((rec) => rec.fixed.value.length === 0)
            .length
        ) {
          throw new Error(
            "四半期お小遣いが未確定のものがあるため処理を中断いたしました。",
          );
        }
      }

      // 5. 責任者お小遣い
      const [poketMoneyManagerRec] =
        await kintoneApi.getRecords<PocketMoneyManagerRecord>({
          app: APP_IDS.managerPoketMoney,
          query: `payrollTargetDt = "${baseDt}" limit 1`,
          fields: ["tableStaff", "fixed"],
        });

      if (
        poketMoneyManagerRec !== undefined &&
        poketMoneyManagerRec.fixed.value.length === 0
      ) {
        throw new Error("責任者お小遣いが未確定のため処理を中断いたしました。");
      }

      // 6. eSIM請求
      const esimBllingRecs = await kintoneApi.getRecords<EsimBillingRecord>({
        app: APP_IDS.mobileBilling,
        query: `esimBillingDt = "${baseDt}" limit 500`,
        fields: ["staffCode", "total"],
      });

      // 7. 資格
      const licenseRecs = await kintoneApi.getRecords<LicenseRecord>({
        app: APP_IDS.license,
        query: `isEnabled in ("有効") and allowance > 0`,
        fields: ["staffCode", "$id"],
      });

      // 8. 新規作成に必要な情報（社員台帳、給与テーブル、昇給情報）を取得
      // 新規作成時のみ必要なので、thisMonthPayrollがない場合だけ取得するよう分岐しても良いが、
      // 複雑さを避けるためここで取得（最適化の余地あり）
      let salarytableRecs: SalaryTableRecord[] = [];
      let evaluetionRecs: SalaryIncreaseRecord[] = [];
      let staffRecs: StaffRecord[] = [];

      if (thisMonthPayroll.length === 0) {
        staffRecs = await kintoneApi.getRecords<StaffRecord>({
          app: APP_IDS.staff,
          query: `workStatus not in ("退職") or retirementDt >= "${baseDt}" limit 500`,
        });

        salarytableRecs = await kintoneApi.getRecords<SalaryTableRecord>({
          app: APP_IDS.salarytable,
          query: `setDt <= "${baseDt}" limit 2`,
        });

        if (dt.getMonth() + 1 === 4) {
          evaluetionRecs = await kintoneApi.getRecords<SalaryIncreaseRecord>({
            app: APP_IDS.salaryincrease,
            query: `year = "${dt.getFullYear() - 1}" limit 500`,
          });
        }
      }

      // メイン処理の実行
      if (thisMonthPayroll.length) {
        // 更新モード
        await putRecords({
          timecardRecs,
          licenseRecs,
          poketMoneryQuarterlyRecs,
          poketMoneyManagerRec,
          esimBllingRecs,
          thisMonthPayroll,
        });
      } else {
        // 新規作成モード
        await addRecords({
          timecardRecs,
          preMonthPayroll,
          licenseRecs,
          poketMoneryQuarterlyRecs,
          poketMoneyManagerRec,
          esimBllingRecs,
          salarytableRecs,
          evaluetionRecs,
          staffRecs,
        });
      }

      // 画面リロード
      const krewsheet = window.krewsheet;
      if (krewsheet) {
        (
          document.querySelector(
            "#krewsheet button[actions=refresh]",
          ) as HTMLButtonElement
        ).click();
      } else {
        location.reload();
      }
    } catch (error) {
      console.error(error);
      let errorMessage = "エラーが発生しました";
      if (error instanceof KintoneRestAPIError) {
        errorMessage = error.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      }

      Swal.fire({
        title: "Oops...",
        text: errorMessage,
        icon: "error",
      });
    } finally {
      setOpen(false);
    }
  };

  return (
    <div>
      <Button color="primary" variant="contained" onClick={handleClick}>
        新規作成・更新
      </Button>
    </div>
  );
};
