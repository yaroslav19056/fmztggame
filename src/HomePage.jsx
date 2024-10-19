import React, { useRef, useEffect } from "react";
import styles from "./HomePage.module.css";
import { ref, update, onValue } from "firebase/database";
import { database } from "./firebase.jsx";

function HomePage() {
  const levels = [
    "Бомж фимозник",
    "Фимоз убежище",
    "Нормис фимоз",
    "Фимозофил",
    "Пикми фимоз",
    "Опытный фимозник",
    "Фимоз Nike pro",
    "Фимоз в мешочке",
    "Дик фейс фимоз",
    "Мастер фимоза",
    "Гуру растягиваний",
    "Фимоз щовэл",
    "Сигма фимоз",
    "Легенда фимоза",
    "босс фимоза",
    "Бог фимоза",
    "повысить качество фимоза",
  ];

  const levelRequirements = [
    50, 100, 200, 400, 800, 1600, 3200, 6400, 12800, 25600, 51200, 102400,
    204800, 409600, 819200, 1638400, 1, 99999999999999999999999999999,
  ];

  const pointsPerTap = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
  ];

  const images = [
    "/fimozzBgTrans_max.png",
    "/fimozzBgTransp_min.png",
    "/fimozzBgTransp.png",
    "/fimozzBgTransp__min.png",
    "/fimozzBgTransp__max.png",
  ]; // уровни и другие данные остались без изменений

  const [units, setUnits] = React.useState([]);
  const sizeRef = useRef(90);
  const [points, setPoints] = React.useState(0);
  const pointsRef = useRef(0); // для хранения текущих поинтов
  const user = window.Telegram.WebApp.initDataUnsafe?.user;

  // Функция для кеширования данных
  const cacheData = (points, timestamp) => {
    localStorage.setItem(
      "pointsData_" + user.id,
      JSON.stringify({ points, timestamp })
    );
  };

  // Загрузка данных из кеша или Firebase при монтировании компонента
  useEffect(() => {
    if (user?.id) {
      // Проверяем кешированные данные
      const cachedData = JSON.parse(
        localStorage.getItem("pointsData_" + user.id)
      );

      const refToDB = ref(database, "users/" + user?.id);
      onValue(refToDB, (snapshot) => {
        const data = snapshot.val();
        const serverTimestamp = data?.timestamp || 0;
        const localTimestamp = cachedData?.timestamp || 0;

        // Если в кеше есть данные и они новее, чем на сервере, используем кеш
        if (cachedData && localTimestamp > serverTimestamp) {
          setPoints(cachedData.points);
          pointsRef.current = cachedData.points;
        } else {
          // Иначе используем данные Firebase и обновляем кеш
          setPoints(data?.points || 0);
          pointsRef.current = data?.points || 0;
          cacheData(data?.points || 0, serverTimestamp);
        }
      });
    }
  }, [user]);

  const tapFmz = (event, isTouch = false) => {
    // Увеличение размера изображения на момент клика
    sizeRef.current += 3;
    setTimeout(() => {
      sizeRef.current = 90;
    }, 10);

    // Обновление поинтов при каждом клике
    setPoints((prevPoints) => {
      const newPoints = prevPoints + 1;
      pointsRef.current = newPoints;
      return newPoints;
    });

    const { clientX, clientY } = isTouch ? event.touches[0] : event;
    const newUnit = {
      id: Date.now() + clientX + clientY,
      x: clientX,
      y: clientY,
    };
    setUnits((prevUnits) => [...prevUnits, newUnit]);

    setTimeout(() => {
      setUnits((prevUnits) =>
        prevUnits.filter((unit) => unit.id !== newUnit.id)
      );
    }, 2000);
  };

  // Обновление данных в Firebase при размонтировании компонента
  useEffect(() => {
    return () => {
      if (!user?.id) return;

      const refToDB = ref(database, "users/" + user.id);
      const timestamp = Date.now();

      try {
        update(refToDB, {
          points: pointsRef.current,
          timestamp, // обновляем метку времени при сохранении данных
        });

        // Сохраняем данные в кеш с новой меткой времени
        cacheData(pointsRef.current, timestamp);
      } catch (error) {
        console.error("Ошибка при обновлении поинтов:", error);
      }
    };
  }, [user]);

  window.Telegram.WebApp.enableClosingConfirmation();

  return (
    <div
      className={styles.App}
      style={{
        width: "100vw",
        height: "83vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        flexDirection: "column",
      }}>
      <h1 style={{ margin: "5px" }}>бмж фмзнк</h1>
      <h3 style={{ margin: "5px" }}>{points} фимозов</h3>
      <img
        src={images[0]}
        style={{
          width: `${sizeRef.current}vw`,
          marginBottom: "10px",
          marginTop: "10px",
        }}
        onClick={tapFmz}
        alt="fmz"
      />
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          backgroundColor: "#c8c8c8",
          padding: "10px",
          width: "80vw",
          borderRadius: "10px",
          justifyContent: "space-between",
        }}>
        <div>
          <p style={{ fontWeight: "bold", color: "black" }}>
            Повысить до уровня: 52
          </p>
          <p style={{ fontWeight: "bold", color: "black" }}>
            Нужно фимозов: 53
          </p>
        </div>
        <button
          style={{
            padding: "10px",
            borderRadius: "10px",
            border: "none",
            background:
              "linear-gradient(162deg, rgba(255,188,0,1) 0%, rgba(254,0,184,1) 31%, rgba(0,104,255,1) 65%, rgba(1,255,0,1) 100%)",
          }}
          onClick={() => console.log("Повысить уровень")}>
          Повысить уровень
        </button>
      </div>

      {units.map((unit) => (
        <span
          key={unit.id}
          className={styles.unit}
          style={{ top: unit.y, left: unit.x }}>
          +1
        </span>
      ))}
    </div>
  );
}

export default HomePage;
