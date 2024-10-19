import React from "react"; // Предполагается, что это файл инициализации Firebase

export default function Airdrop() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "70vh",
        flexDirection: "column",
        gap: "20px",
      }}>
      <button>Сбросить всё</button>
      <img
        src="/fmzCoin.png"
        alt="logo"
        style={{ width: "60%", height: "auto" }}
      />
      <h2>$FMZ</h2>
      <h3>Airdrop is soon</h3>
    </div>
  );
}
