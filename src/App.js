import { useState, useEffect } from "react";
import "./App.css";
import HomePage from "./HomePage";
import BottomBar from "./BottomBar";
import Airdrop from "./Airdrop";
import Income from "./Income";
import toast from "react-hot-toast";
import Tasks from "./Tasks";
import { ref, set, get } from "firebase/database"; // Добавляем firebase функции
import { database } from "./firebase.jsx"; // Импортируем базу
import { debounce } from 'lodash';

function App() {
  const [currentPage, setCurrentPage] = useState("Home");
  const user = window.Telegram.WebApp.initDataUnsafe?.user;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

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
          Фимозов в час: 0 {/* Отображаем прибыль */}
        </p>
      </div>
      {currentPage === "Home" && <HomePage />}
      {currentPage === "Income" && <Income />}
      {currentPage === "Tasks" && <Tasks />}
      {currentPage === "Airdrop" && <Airdrop />}
      <BottomBar currentPage={currentPage} onPageChange={handlePageChange} />
    </div>
  );
}

export default App;
