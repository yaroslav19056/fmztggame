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
    204800, 409600, 819200, 1638400, 1,
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
  ];

  const [units, setUnits] = React.useState([]);
  const sizeRef = useRef(90);
  const [points, setPoints] = React.useState(0);
  const pointsRef = useRef(0);
  const [levelIndex, setLevelIndex] = React.useState(0);
  const levelRef = useRef(0);
  const [prestige, setPrestige] = React.useState(0); // Track prestige level
  const prestigeRef = useRef(0);
  const user = window.Telegram.WebApp.initDataUnsafe?.user;

  const cacheData = (points, levelIndex, prestige, timestamp) => {
    localStorage.setItem(
      "pointsData_" + user.id,
      JSON.stringify({ points, levelIndex, prestige, timestamp })
    );
  };

  useEffect(() => {
    if (user?.id) {
      const cachedData = JSON.parse(
        localStorage.getItem("pointsData_" + user.id)
      );

      const refToDB = ref(database, "users/" + user.id);
      onValue(refToDB, (snapshot) => {
        const data = snapshot.val();
        const serverTimestamp = data?.timestamp || 0;
        const localTimestamp = cachedData?.timestamp || 0;

        if (cachedData && localTimestamp > serverTimestamp) {
          setPoints(cachedData.points);
          setLevelIndex(cachedData.levelIndex);
          setPrestige(cachedData.prestige);
          pointsRef.current = cachedData.points;
          levelRef.current = cachedData.levelIndex;
          prestigeRef.current = cachedData.prestige;
        } else {
          setPoints(data?.points || 0);
          setLevelIndex(data?.levelIndex || 0);
          setPrestige(data?.prestige || 0);
          pointsRef.current = data?.points || 0;
          levelRef.current = data?.levelIndex || 0;
          prestigeRef.current = data?.prestige || 0;
          cacheData(
            data?.points || 0,
            data?.levelIndex || 0,
            data?.prestige || 0,
            serverTimestamp
          );
        }
      });
    }
  }, [user]);

  const tapFmz = (event, isTouch = false) => {
    sizeRef.current += 3;
    setTimeout(() => {
      sizeRef.current = 90;
    }, 10);

    setPoints((prevPoints) => {
      const newPoints = prevPoints + pointsPerTap[levelRef.current];
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

  const prestigeHandler = () => {
    // Reset points and levels, increase prestige
    setPoints(0);
    setLevelIndex(0);
    pointsRef.current = 0;
    levelRef.current = 0;

    const newPrestige = prestigeRef.current + 1;
    setPrestige(newPrestige);
    prestigeRef.current = newPrestige;

    // Update Firebase and localStorage
    const refToDB = ref(database, "users/" + user.id);
    const timestamp = Date.now();
    update(refToDB, {
      points: pointsRef.current,
      levelIndex: levelRef.current,
      prestige: newPrestige,
      timestamp,
    });
    cacheData(pointsRef.current, levelRef.current, newPrestige, timestamp);
  };

  const levelUp = () => {
    if (levelIndex === levels.length - 1) {
      prestigeHandler(); // Trigger prestige when reaching the final level
    } else if (pointsRef.current >= levelRequirements[levelRef.current]) {
      setPoints(
        (prevPoints) => prevPoints - levelRequirements[levelRef.current]
      );
      pointsRef.current -= levelRequirements[levelRef.current];

      const newLevelIndex = levelRef.current + 1;
      setLevelIndex(newLevelIndex);
      levelRef.current = newLevelIndex;

      const refToDB = ref(database, "users/" + user.id);
      const timestamp = Date.now();
      update(refToDB, {
        points: pointsRef.current,
        levelIndex: newLevelIndex,
        prestige: prestigeRef.current,
        timestamp,
      });
      cacheData(
        pointsRef.current,
        newLevelIndex,
        prestigeRef.current,
        timestamp
      );
    } else {
      console.log("Not enough points to level up.");
    }
  };

  useEffect(() => {
    return () => {
      if (!user?.id) return;

      const refToDB = ref(database, "users/" + user.id);
      const timestamp = Date.now();
      update(refToDB, {
        points: pointsRef.current,
        levelIndex: levelRef.current,
        prestige: prestigeRef.current,
        timestamp,
      });

      cacheData(
        pointsRef.current,
        levelRef.current,
        prestigeRef.current,
        timestamp
      );
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
      <h1 style={{ margin: "5px" }}>{levels[levelIndex]}</h1>
      <h3 style={{ margin: "5px" }}>{points} фимозов</h3>
      <img
        src={images[prestige]} // Change image based on prestige level
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
            {levelIndex === levels.length - 1
              ? "Достигнут финальный уровень! Повысить престиж?"
              : `Повысить до уровня: ${levels[levelIndex + 1]}`}
          </p>
          <p style={{ fontWeight: "bold", color: "black" }}>
            Нужно фимозов:{" "}
            {levelIndex === levels.length - 1
              ? 0
              : levelRequirements[levelIndex]}
          </p>
        </div>
        <button
          style={{
            padding: "10px",
            borderRadius: "10px",
            border: "none",
            background:
              levelIndex === levels.length - 1 ||
              points >= levelRequirements[levelIndex]
                ? "linear-gradient(162deg, rgba(255,188,0,1) 0%, rgba(254,0,184,1) 31%, rgba(0,104,255,1) 65%, rgba(1,255,0,1) 100%)"
                : "gray",
            cursor:
              levelIndex === levels.length - 1 ||
              points >= levelRequirements[levelIndex]
                ? "pointer"
                : "not-allowed",
          }}
          disabled={
            points < levelRequirements[levelIndex] &&
            levelIndex !== levels.length - 1
          }
          onClick={levelUp}>
          {levelIndex === levels.length - 1
            ? "Повысить престиж"
            : "Повысить уровень"}
        </button>
      </div>

      {units.map((unit) => (
        <span
          key={unit.id}
          className={styles.unit}
          style={{ top: unit.y, left: unit.x }}>
          +{pointsPerTap[levelIndex]}
        </span>
      ))}
    </div>
  );
}

export default HomePage;
