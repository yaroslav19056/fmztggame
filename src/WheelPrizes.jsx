import { ref, update, get } from "firebase/database"; // Предполагается, что Firebase уже настроен
import { database } from "./firebase.jsx"; // Путь к вашему файлу с Firebase
import React, { useState, useEffect } from "react";

import { Wheel } from "react-custom-roulette";
import toast from "react-hot-toast";

const data = [
  {
    //0
    option: "10000 фмзв",
    chance: 20,
    style: { backgroundColor: "rgb(237, 196, 179)", textColor: "black" },
  },
  {
    //1
    option: "цитата",
    chance: 3,
    style: { backgroundColor: "rgb(230, 184, 162)" },
  },
  {
    //2
    option: "1 000 000 фмзв",
    chance: 1,
    style: { backgroundColor: "rgb(222, 171, 144)" },
  },
  {
    //3
    option: "100 фмзв",
    chance: 45,
    style: { backgroundColor: "rgb(214, 159, 126)" },
  },
  {
    //4
    option: "+10000 ф/чс",
    chance: 15,
    style: { backgroundColor: "rgb(205, 151, 119)" },
  },
  {
    //5
    option: "фмзы * 2",
    chance: 10,
    style: { backgroundColor: "rgb(195, 142, 112)" },
  },
  {
    //6
    option: "ф/чс * 3",
    chance: 2,
    style: { backgroundColor: "rgb(176, 125, 98)" },
  },
  {
    //7
    option: "100 000 ф/чс",
    chance: 2,
    style: { backgroundColor: "rgb(157, 107, 83)" },
  },
  {
    //8
    option: "+1 престиж",
    chance: 1,
    style: { backgroundColor: "rgb(138, 90, 68)" },
  },
  {
    //9
    option: "2 цитаты",
    chance: 1,
    style: { backgroundColor: "rgb(119, 73, 54)" },
  },
];

function getWeightedRandomIndex() {
  const totalWeight = data.reduce((acc, item) => acc + item.chance, 0);
  let random = Math.floor(Math.random() * totalWeight);

  for (let i = 0; i < data.length; i++) {
    if (random < data[i].chance) return i;
    random -= data[i].chance;
  }
}

export default function WheelPrizes() {
  const [spinAttempts, setSpinAttempts] = useState(0);
  const [userQuotesHave, setUserQuotesHave] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [overlayClass, setOverlayClass] = useState("overlay");
  const [currentPoints, setCurrentPoints] = useState(0);
  const [currentPrestige, setCurrentPrestige] = useState(0);
  const [currentProfitPerHour, setCurrentProfitPerHour] = useState(0);
  const user = window.Telegram.WebApp.initDataUnsafe?.user; // Получаем информацию о пользователе

  useEffect(() => {
    if (user?.id) {
      const userRef = ref(database, `users/${user.id}/spinAttempts`);
      get(userRef).then((snapshot) => {
        if (snapshot.exists()) {
          setSpinAttempts(snapshot.val());
        }
      });
    }
  }, [user]);

  useEffect(() => {
    if (user?.id) {
      const userRef = ref(database, "users/" + user.id);
      get(userRef).then((snapshot) => {
        if (snapshot.exists()) {
          const userData = snapshot.val();
          setCurrentPoints(userData.points || 0);
          setCurrentPrestige(userData.prestige || 0);
          setCurrentProfitPerHour(userData.profitPerHour || 0);
        }
      });
    }
  }, [user]);

  useEffect(() => {
    if (user?.id) {
      const quotesRef = ref(database, "quotes");
      const userRef = ref(database, "users/" + user.id);

      // Fetch all quotes
      get(quotesRef).then((snapshot) => {
        if (snapshot.exists()) {
          setQuotes(Object.keys(snapshot.val()));
        }
      });

      // Fetch user's quotesHave
      get(userRef).then((snapshot) => {
        if (snapshot.exists()) {
          const userData = snapshot.val();
          setUserQuotesHave(userData.quotesHave || {});
        }
      });
    }
  }, [user]);

  // Helper function to get a random quote
  const getRandomQuote = (numQuotes = 1) => {
    // Filter out quotes the user already has
    const availableQuotes = quotes.filter(
      (quoteId) => !userQuotesHave[quoteId]
    );

    if (availableQuotes.length < numQuotes) {
      console.log("Not enough quotes available");
      return [];
    }

    // Shuffle and select required number of quotes
    const selectedQuotes = [];
    while (selectedQuotes.length < numQuotes) {
      const randomIndex = Math.floor(Math.random() * availableQuotes.length);
      const quoteId = availableQuotes[randomIndex];

      if (!selectedQuotes.includes(quoteId)) {
        selectedQuotes.push(quoteId);
      }
    }
    return selectedQuotes;
  };

  const handleSpinClick = () => {
    if (!mustSpin && spinAttempts > 0) {
      const newPrizeNumber = getWeightedRandomIndex();
      setPrizeNumber(newPrizeNumber);
      setMustSpin(true);

      // Уменьшение числа попыток и обновление в базе данных
      const userRef = ref(database, `users/${user.id}`);
      update(userRef, { spinAttempts: spinAttempts - 1 })
        .then(() => setSpinAttempts((prev) => prev - 1))
        .catch((error) => console.error("Error updating spinAttempts:", error));
    }
  };

  function handleBuyClick() {
    if (currentPoints >= 3690) {
      const refToUsr = ref(database, "users/" + user.id);
      update(refToUsr, {
        points: currentPoints - 3690,
        spinAttempts: spinAttempts + 1,
      })
        .then(() => {
          setCurrentPoints((prevPoints) => prevPoints - 3690);
          setSpinAttempts((prevAttempts) => prevAttempts + 1);
        })
        .catch((error) =>
          console.error("Error updating points or spinAttempts:", error)
        );
    }
  }

  const showPrize = () => setOverlayClass("overlay fade-in");

  const hidePrize = () => {
    setOverlayClass("overlay fade-out");
    setTimeout(() => setOverlayClass("overlay"), 500);
  };

  const handleReset = () => {
    if (!user?.id) {
      console.log("User is not authenticated.");
      return;
    }

    const userRef = ref(database, "users/" + user.id);
    const resetData = {
      spinAttempts: 0,
      quotesLastAttempt: null,
      quotesHave: null,
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

  function handleGivePrize() {
    if (!user?.id) {
      console.log("User is not authenticated.");
      return;
    }

    const userRef = ref(database, "users/" + user.id);
    let updates = {};

    // Fetch current values from Firebase
    get(userRef).then((snapshot) => {
      if (!snapshot.exists()) {
        console.error("User data not found.");
        return;
      }

      const userData = snapshot.val();
      const currentPoints = userData.points || 0;
      const currentPrestige = userData.prestige || 0;
      const currentProfitPerHour = userData.profitPerHour || 0;

      switch (prizeNumber) {
        case 0: // "10000 фмзв"
          updates.points = currentPoints + 10000;
          break;

        case 1: // "цитата"
          const singleQuote = getRandomQuote(1);
          singleQuote.forEach((quoteId) => {
            updates[`quotesHave/${quoteId}`] = true;
          });
          break;

        case 2: // "1 000 000 фмзв"
          updates.points = currentPoints + 1000000;
          break;

        case 3: // "100 фмзв"
          updates.points = currentPoints + 100;
          break;

        case 4: // "+10000 ф/чс"
          updates.profitPerHour = currentProfitPerHour + 10000;
          break;

        case 5: // "фмзы * 2"
          updates.points = currentPoints * 2;
          break;

        case 6: // "ф/чс * 3"
          updates.profitPerHour = currentProfitPerHour * 3;
          break;

        case 7: // "100 000 ф/чс"
          updates.profitPerHour = currentProfitPerHour + 100000;
          break;

        case 8: // "+1 престиж"
          updates.prestige = currentPrestige + 1;
          break;

        case 9: // "2 цитаты"
          const twoQuotes = getRandomQuote(2);
          twoQuotes.forEach((quoteId) => {
            updates[`quotesHave/${quoteId}`] = true;
          });
          break;

        default:
          console.log("No prize awarded.");
          return;
      }

      // Update Firebase with the new values
      update(userRef, updates).catch((error) =>
        console.error("Error updating prize values:", error)
      );
    });
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "70vh",
        flexDirection: "column",
        gap: "20px",
        marginTop: "20px",
      }}>
      <button
        onClick={handleReset}
        style={{
          border: "none",
          backgroundColor: "rgba(184, 184, 184, 0.4)",
          padding: "10px 20px",
          borderRadius: "5px",
        }}>
        Сбросить всё
      </button>{" "}
      {/* Добавляем обработчик */}
      <Wheel
        spinDuration={1}
        mustStartSpinning={mustSpin}
        prizeNumber={prizeNumber}
        data={data}
        onStopSpinning={() => {
          setMustSpin(false);
          showPrize();
          handleGivePrize();
        }}
      />
      <button
        onClick={handleSpinClick}
        disabled={spinAttempts === 0} // Отключаем кнопку, если попыток нет
        style={{
          marginTop: "20px",
          backgroundColor:
            spinAttempts === 0 ? "gray" : "rgba(184, 184, 184, 0.4)",
          border: "none",
          padding: "10px 20px",
          borderRadius: "5px",
          width: "200px",
          color: "white",
          fontWeight: "bold",
        }}>
        Крутить ({spinAttempts} попыток)
      </button>
      <button
        onClick={handleBuyClick}
        disabled={currentPoints < 3690}
        style={{
          marginTop: "20px",
          backgroundColor:
            currentPoints < 3690 ? "gray" : "rgba(184, 184, 184, 0.4)",
          border: "none",
          padding: "10px 20px",
          borderRadius: "5px",
          width: "200px",
          color: "white",
          fontWeight: "bold",
        }}>
        Купить попытку (3690 фмзв)
      </button>
      <div
        className={overlayClass}
        style={{
          backdropFilter: "blur(5px)",
          width: "100vw",
          height: "100vh",
          position: "absolute",
          zIndex: "10",
          display: "flex",
          justifyContent: "space-evenly",
          alignItems: "center",
          flexDirection: "column",
        }}
        onClick={hidePrize}>
        <img src="/money-face.gif" alt="sus" style={{ width: "200px" }} />
        <h1 style={{ color: "white", fontSize: "30px", fontWeight: "bold" }}>
          Ты выиграл:
        </h1>
        <p
          style={{
            fontSize: "30px",
            fontWeight: "bold",
            background:
              "linear-gradient(162deg, rgba(255,188,0,1) 0%, rgba(254,0,184,1) 51%, rgba(0,215,255,1) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            color: "white",
          }}>
          {data[prizeNumber].option} !
        </p>
      </div>
    </div>
  );
}
