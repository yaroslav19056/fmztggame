import { useState, useEffect } from "react";
import "./App.css";
import HomePage from "./HomePage";
import BottomBar from "./BottomBar";
import WheelPrizes from "./WheelPrizes";
import Income from "./Income";
import Tasks from "./Tasks";
import toast from "react-hot-toast"; // Добавляем библиотеку для тостов
import { ref, set, get, onValue } from "firebase/database";
import { database } from "./firebase.jsx";
// @ts-ignore
import Quotes from "./Quotes.jsx";

function App() {
  const [currentPage, setCurrentPage] = useState("Home");
  const [profitPerHour, setProfitPerHour] = useState(0);
  const [points, setPoints] = useState(0);
  const user = window.Telegram.WebApp.initDataUnsafe?.user;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Рассчет оффлайн-прибыли при загрузке
  useEffect(() => {
    const loadUserData = async () => {
      if (user) {
        const userRef = ref(database, `users/${user.id}`);
        const snapshot = await get(userRef);
        const data = snapshot.val();

        if (data) {
          const lastVisit = data.lastVisit || Date.now();
          const timePassed = (Date.now() - lastVisit) / 1000 / 3600; // Время в часах
          const profitFromDB = data?.profitPerHour || 6; // Прибыль из базы данных

          // Рассчитываем оффлайн прибыль
          if (profitFromDB > 0) {
            const offlineIncome = profitFromDB * timePassed;
            const newPoints = (data.points || 0) + offlineIncome; // Обновляем очки с учетом оффлайн прибыли

            setPoints(newPoints); // Обновляем состояние очков
            toast.success(`Ты заработал ${offlineIncome.toFixed(2)} фимозов в офлайне`);

            // Обновляем очки и время последнего визита в базе данных
            await set(userRef, {
              ...data,
              points: newPoints,
              lastVisit: Date.now(), // Обновляем время последнего визита
            });
          }

          setProfitPerHour(profitFromDB);
        }
      }
    };

    loadUserData();
  }, [user]);

  // Подписка на изменения прибыли в час в реальном времени
  useEffect(() => {
    if (user && user.id) {
      const userRef = ref(database, `users/${user.id}/profitPerHour`);
      const unsubscribe = onValue(userRef, (snapshot) => {
        const newProfitPerHour = snapshot.val() || 0;
        setProfitPerHour(newProfitPerHour);
      });
  
      return () => unsubscribe();
    }
  }, [user]);
  

  return (
    <div>
      <div
        style={{
          backgroundColor: "#6b6b6b",
          color: "white",
          padding: "10px",
          margin: "10px 10px 0 10px",
          borderRadius: "10px",
        }}>
        <p
          style={{
            fontSize: "20px",
            fontWeight: "bold",
            margin: "0",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}>
          Фимозов в час: {profitPerHour} {/* Отображаем прибыль */}
        </p>
      </div>
      {currentPage === "Home" && <HomePage />}
      {currentPage === "Income" && <Income />}
      {currentPage === "Tasks" && <Tasks />}
      {currentPage === "WheelPrizes" && <WheelPrizes />}
      {currentPage === "Quotes" && <Quotes />}
      <BottomBar currentPage={currentPage} onPageChange={handlePageChange} />
    </div>
  );
}

export default App;
