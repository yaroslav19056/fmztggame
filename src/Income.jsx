import React from "react";

export default function Income() {
  const cards = [
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
                  disabled="true"
                  style={{
                    padding: "10px",
                    borderRadius: "10px",
                    border: "none",
                    width: "100%",
                    backgroundColor: "#cccccc",
                    marginBottom: "10px",
                  }}>
                  {card.price} фмзв
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
