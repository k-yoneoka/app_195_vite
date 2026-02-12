// src/desktop/index.tsx
import { createRoot } from "react-dom/client";
import { App } from "./App"; // 作成したファイルを読み込む

kintone.events.on(["app.record.index.show"], (event: unknown) => {
  console.log("デスクトップ版プラグインが動作しました！");
  if (document.getElementById("my-plugin-root")) return event;

  const headerSpace = kintone.app.getHeaderMenuSpaceElement();
  if (headerSpace) {
    const rootEl = document.createElement("div");
    rootEl.id = "my-plugin-root";
    headerSpace.appendChild(rootEl);

    const root = createRoot(rootEl);
    root.render(<App />);
  }
  return event;
});
