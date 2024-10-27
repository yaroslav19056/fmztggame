import React from "react";
import { ref, update } from "firebase/database"; // Предполагается, что Firebase уже настроен
import { database } from "./firebase.jsx"; // Путь к вашему файлу с Firebase

export default function Airdrop() {
  const user = window.Telegram.WebApp.initDataUnsafe?.user; // Получаем информацию о пользователе

  const handleReset = () => {
    if (!user?.id) {
      console.log("User is not authenticated.");
      return;
    }

    const userRef = ref(database, "users/" + user.id);
    const resetData = {
      points: 0,
      levelIndex: 0,
      prestige: 0,
      profitPerHour: 0,
      timestamp: Date.now(),
      cards: [
        {
          title: "Тягучесть",
          description: "Чем меньше тягучесть, тем лучше фимоз",
          price: 250,
          level: 1,
          multiplier: 1.2,
          income: 1,
        },
        {
          title: "Авторитет",
          description: "Станьте самым авторитетным фимозником",
          price: 250,
          level: 1,
          multiplier: 1.3,
          income: 1,
        },
        {
          title: "Узнаваемость",
          description: "Узнаваемость вас сделает узнаваемым ваш фимоз",
          price: 250,
          level: 1,
          multiplier: 1.4,
          income: 1,
        },
        {
          title: "Суперспособности",
          description: "Владея фимозом, вы получаете суперспособности",
          price: 250,
          level: 1,
          multiplier: 1.5,
          income: 1,
        },
        {
          title: "Качество",
          description: "Качественный фимоз - залог успеха",
          price: 250,
          level: 1,
          multiplier: 1.25,
          income: 1,
        },
        {
          title: "Влажность",
          description: "Чем влажнее фимоз, тем легче его тянуть",
          price: 250,
          level: 1,
          multiplier: 1.1,
          income: 1,
        },
      ],
    };

    // Обновляем данные в Firebase
    update(userRef, resetData)
      .then(() => {
        console.log("Data has been reset in Firebase.");
      })
      .catch((error) => {
        console.error("Error resetting data:", error);
      });

    // Сбрасываем данные в localStorage
    localStorage.setItem(
      "pointsData_" + user.id,
      JSON.stringify({
        points: 0,
        levelIndex: 0,
        prestige: 0,
        timestamp: Date.now(),
      })
    );

    console.log("Data has been reset in localStorage.");
  };

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
      <button onClick={handleReset}>Сбросить всё</button>{" "}
      {/* Добавляем обработчик */}
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
