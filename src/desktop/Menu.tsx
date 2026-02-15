import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
// 型定義は 'import type' で読み込む (TypeScriptのエラー回避)
import type { TextFieldProps } from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Grid from "@mui/material/Grid";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { format } from "date-fns";

import { APP_IDS } from "./statics";
import { UpdateButton } from "./UpdateButton";

// セレクトボックスの共通部品
type CustomSelectProps = TextFieldProps & {
  minWidth?: string;
  children: React.ReactNode;
};

const CustomSelect = ({
  children,
  minWidth,
  ...selectProps
}: CustomSelectProps) => {
  return (
    <TextField
      select
      variant="standard"
      size="small"
      // 非推奨の InputLabelProps ではなく slotProps を使用
      slotProps={{ inputLabel: { shrink: true } }}
      {...selectProps}
      sx={{ minWidth: minWidth ?? "120px", ...selectProps.sx }}
    >
      {children}
    </TextField>
  );
};

// メニューコンポーネント本体
type MenuProps = {
  dates: string[];
};

export const Menu = ({ dates }: MenuProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [shop, setShop] = useState<string>("");
  const [shops, setShops] = useState<string[]>([]);
  const [baseDt, setBaseDt] = useState<string>(dates[0] || "");

  useEffect(() => {
    // 営業所一覧を取得 (kintone API)
    (async () => {
      try {
        const resp = await kintone.api(
          kintone.api.url("/k/v1/app/form/fields.json", true),
          "GET",
          {
            app: APP_IDS.payroll,
          },
        );

        const options = resp.properties.shop.options;
        // index順にソート
        const sortedShops = Object.keys(options).sort((a, b) =>
          options[a].index > options[b].index ? 1 : -1,
        );

        setShops(["---", ...sortedShops]);
      } catch (e) {
        console.error("営業所一覧の取得に失敗しました", e);
      }
    })();
  }, []);

  return (
    <Grid
      container
      spacing={3}
      alignItems="flex-end"
      sx={{ marginBottom: 3, marginRight: 3, float: "left" }}
    >
      {/* ローディング画面 */}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      {/* 基準日選択 */}
      <Grid>
        <CustomSelect
          label="基準日"
          value={baseDt}
          onChange={(e) => setBaseDt(e.target.value)}
        >
          {dates.map((item, index) => (
            <MenuItem key={index} value={item === "---" ? "" : item}>
              {item === "---" ? item : format(new Date(item), "yyyy年LL月")}
            </MenuItem>
          ))}
        </CustomSelect>
      </Grid>

      {/* 営業所選択 */}
      <Grid>
        <CustomSelect
          label="営業所"
          value={shop}
          onChange={(e) => setShop(e.target.value)}
        >
          {shops.map((shopName, index) => (
            <MenuItem key={index} value={shopName === "---" ? "" : shopName}>
              {shopName}
            </MenuItem>
          ))}
        </CustomSelect>
      </Grid>

      {/* 更新ボタン (UpdateButton) */}
      <Grid>
        <UpdateButton setOpen={setOpen} baseDt={baseDt} shop={shop} />
      </Grid>
    </Grid>
  );
};
