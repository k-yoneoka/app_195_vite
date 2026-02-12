// src/desktop/App.tsx
// Reactコンポーネントはここ（App.tsx）に書くのが作法です

export const App = () => {
  return (
    <div
      style={{
        padding: "10px",
        background: "#e3f2fd",
        border: "1px solid #2196f3",
      }}
    >
      <h3>🚀 Hello Kintone from React!</h3>
      <button onClick={() => alert("動いています!！")}>クリックしてね</button>
    </div>
  );
};
