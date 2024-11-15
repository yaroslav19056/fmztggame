import React, { useEffect, useState } from "react";
import { ref, update, onValue } from "firebase/database";
import { database } from "./firebase"; // Adjust the path to your Firebase config

export default function Income() {
  const initialCards = [
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
  ];

  const [cards, setCards] = useState(initialCards);
  const [points, setPoints] = useState(0); // Points from Firebase
  const [profitPerHour, setProfitPerHour] = useState(0); // Profit per hour from Firebase
  const user = window.Telegram.WebApp.initDataUnsafe?.user;

  useEffect(() => {
    if (user?.id) {
      const userRef = ref(database, "users/" + user.id);
      onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        setPoints(data?.points || 0);
        setProfitPerHour(data?.profitPerHour || 0); // Load profit per hour from Firebase

        if (data?.cards) {
          setCards(data.cards); // Load card data from Firebase
        }
      });
    }
  }, [user]);

  const upgradeCard = (index) => {
    const updatedCards = [...cards];
    const card = updatedCards[index];

    if (points >= card.price) {
      // Deduct points and upgrade the card
      const newPoints = points - card.price;
      const newLevel = card.level + 1;

      // Update card's price and income based on multiplier
      card.price = (card.price * card.multiplier * 1.2).toFixed(3);
      card.level = newLevel;
      const incomeIncrease = card.income; // Calculate income increase
      card.income = +(card.income * card.multiplier * 1.22).toFixed(3); // Increase income based on card level

      // Update profitPerHour
      const newProfitPerHour = profitPerHour + incomeIncrease;

      setCards(updatedCards);
      setPoints(newPoints);
      setProfitPerHour(newProfitPerHour);

      const userRef = ref(database, "users/" + user.id);
      update(userRef, {
        points: newPoints,
        cards: updatedCards,
        profitPerHour: newProfitPerHour, // Save the updated profit per hour
      });
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "auto",
        flexDirection: "column",
        gap: "20px",
        marginTop: "20px",
        marginBottom: "70px",
        width: "100vw",
      }}>
      <div
        style={{
          display: "flex",
          gap: "20px",
          justifyContent: "center",
          flexDirection: "column",
          width: "90%",
        }}>
        {cards.map((card, index) => {
          let emoji = "";
          switch (index) {
            case 0:
              emoji = "/bicep-flex.gif";
              break;
            case 1:
              emoji = "/cool-with-glasses.gif";
              break;
            case 2:
              emoji = "/trumpet.gif";
              break;
            case 3:
              emoji = "/thunder.gif";
              break;
            case 4:
              emoji = "/dick.gif";
              break;
            case 5:
              emoji = "/drool.gif";
              break;
            default:
              emoji = "";
          }

          return (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                flexDirection: "row",
                gap: "10px",
                padding: "10px",
                borderRadius: "10px",
                backgroundColor: "#6b6b6b",
                width: "90vw",
                height: "auto",
                boxSizing: "border-box",
              }}>
              <img
                src={emoji}
                alt="emoji"
                style={{ width: "100px", height: "100px" }}
              />
              <div>
                <h4
                  style={{
                    color: "white",
                    fontSize: "14px",
                    margin: "0",
                    marginBottom: "10px",
                  }}>
                  {card.title} (LVL {card.level})
                </h4>
                <p style={{ margin: "0", fontSize: "12px" }}>
                  {card.description}
                </p>
                <p
                  style={{
                    margin: "0",
                    fontSize: "12px",
                    fontWeight: "bold",
                    marginBottom: "10px",
                    marginTop: "10px",
                  }}>
                  {card.income} фмзв/час
                </p>
                <button
                  disabled={points < card.price} // Disable if not enough points
                  style={{
                    padding: "10px",
                    borderRadius: "10px",
                    border: "none",
                    width: "100%",
                    backgroundColor:
                      points >= card.price ? "#ffd700" : "#cccccc",
                    marginBottom: "10px",
                  }}
                  onClick={() => upgradeCard(index)}>
                  {Math.round(card.price)} фмзв
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
