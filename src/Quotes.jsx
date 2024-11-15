import { useState, useEffect } from "react";
import { ref, onValue, set, update } from "firebase/database";
import { database } from "./firebase";
import Loading from "react-loading";

export default function Quotes() {
  const [quotes, setQuotes] = useState([]);
  const [quoteTimers, setQuoteTimers] = useState({});
  const user = window.Telegram.WebApp.initDataUnsafe?.user;

  useEffect(() => {
    const quotesRef = ref(database, "quotes");
    const userQuotesRef = ref(database, `users/${user.id}/quotesHave`);

    onValue(quotesRef, (quotesSnapshot) => {
      const allQuotes = quotesSnapshot.val();
      onValue(userQuotesRef, (userQuotesSnapshot) => {
        const userQuotes = userQuotesSnapshot.val() || {};

        const availableQuotes = Object.keys(allQuotes)
          .filter((key) => userQuotes[key])
          .map((key) => ({ id: key, text: allQuotes[key].text }));

        setQuotes(availableQuotes);
        // Инициализация таймеров для каждой цитаты
        initializeTimers(availableQuotes);
      });
    });
  }, []);

  const initializeTimers = (quotes) => {
    const timers = {};
    quotes.forEach((quote) => {
      const lastAttemptRef = ref(
        database,
        `users/${user.id}/quotesLastAttempt/${quote.id}`
      );
      onValue(
        lastAttemptRef,
        (snapshot) => {
          const lastAttempt = snapshot.val();
          if (lastAttempt) {
            timers[quote.id] = getRemainingTime(lastAttempt);
          } else {
            timers[quote.id] = null;
          }
          setQuoteTimers({ ...timers });
        },
        { onlyOnce: true }
      );
    });
  };

  const addSpinAttempt = (quoteId) => {
    const now = Date.now();
    const lastAttemptRef = ref(
      database,
      `users/${user.id}/quotesLastAttempt/${quoteId}`
    );
    const userSpinRef = ref(database, `users/${user.id}/spinAttempts`);

    onValue(
      lastAttemptRef,
      (snapshot) => {
        const lastAttempt = snapshot.val();
        const timeElapsed = now - (lastAttempt || 0);

        if (!lastAttempt || timeElapsed >= 86400000) {
          // 86400000 ms = 24 hours
          set(lastAttemptRef, now); // Обновляем время последней попытки
          onValue(
            userSpinRef,
            (spinSnapshot) => {
              const currentAttempts = spinSnapshot.val() || 0;
              update(ref(database, `users/${user.id}`), {
                spinAttempts: currentAttempts + 1,
              });
            },
            { onlyOnce: true }
          );
          setQuoteTimers((prev) => ({ ...prev, [quoteId]: 86400000 })); // Запуск таймера на 24 часа
        }
      },
      { onlyOnce: true }
    );
  };

  const getRemainingTime = (lastAttempt) => {
    const now = Date.now();
    const elapsed = now - lastAttempt;
    return elapsed < 86400000 ? 86400000 - elapsed : null;
  };

  useEffect(() => {
    const timerInterval = setInterval(() => {
      setQuoteTimers((prevTimers) => {
        const updatedTimers = {};
        Object.keys(prevTimers).forEach((quoteId) => {
          const remainingTime = prevTimers[quoteId];
          if (remainingTime !== null) {
            updatedTimers[quoteId] = Math.max(remainingTime - 1000, 0);
          }
        });
        return { ...prevTimers, ...updatedTimers };
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, []);

  const formatTime = (time) => {
    const hours = String(Math.floor((time / (1000 * 60 * 60)) % 24)).padStart(
      2,
      "0"
    );
    const minutes = String(Math.floor((time / (1000 * 60)) % 60)).padStart(
      2,
      "0"
    );
    const seconds = String(Math.floor((time / 1000) % 60)).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <div
      style={{
        height: "80vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        overflowY: "auto", // Enable scrolling
      }}>
      <div
        style={{
          textAlign: "center",
          width: "80%",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}>
        {quotes.length === 0 ? (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Loading type="spin" color="#ffffff" height={50} width={50} />
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              width: "100%",
            }}>
            {quotes.map((quote) => (
              <div
                key={quote.id}
                style={{
                  display: "flex",
                  gap: "10px",
                  flexDirection: "column",
                  width: "100%",
                  padding: "10px",
                  borderRadius: "10px",
                  backgroundImage: "url(/bgQuotes.png)",
                  backgroundSize: "cover",
                }}>
                <div style={{ display: "flex", justifyContent: "flex-start" }}>
                  <p style={{ fontFamily: "cursive", width: "70%" }}>
                    "{quote.text}"
                  </p>
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  {quoteTimers[quote.id] && quoteTimers[quote.id] > 0 ? (
                    <p style={{ fontFamily: "cursive", fontSize: "14px" }}>
                      {formatTime(quoteTimers[quote.id])}
                    </p>
                  ) : (
                    <button
                      onClick={() => addSpinAttempt(quote.id)}
                      style={{
                        border: "none",
                        backgroundColor: "rgba(208, 208, 208, 0.5)",
                        color: "white",
                        cursor: "pointer",
                        fontFamily: "cursive",
                        fontSize: "14px",
                        padding: "5px",
                        borderRadius: "5px",
                      }}>
                      +1 попытка
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <img
        src="/whitepiatno.png"
        style={{
          position: "absolute",
          width: "90%",
          height: "auto",
          objectFit: "contain",
          zIndex: "-1",
          filter: "blur(60px)",
          opacity: "0.5",
        }}
      />
    </div>
  );
}
