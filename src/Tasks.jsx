import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "./firebase.jsx";
import { ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const refToTasks = ref(database, "tasks");

    onValue(refToTasks, (snapshot) => {
      const tasks = snapshot.val();
      setTasks(tasks);
    });
  }, []);

  function taskChecked(channel) {
    toast.success(`Задание ${channel} выполнено`, {
      duration: 3000,
    });
  }

  async function checkSub(channel) {
    const user = window.Telegram.WebApp.initDataUnsafe?.user;
    const refToInfo = await fetch(
      `https://api.telegram.org/bot7780848981:AAFc6poDpnPOnpLzvMUYYELrMZAmxubt8GQ/getChatMember?chat_id=@${channel}&user_id=${user.id}`
    );

    refToInfo.json().then((data) => {
      if (data.result.status === "left" || data.result.status === "kicked") {
        window.Telegram.WebApp.close();
        window.location.href = `https://t.me/${channel}`;
      } else {
        taskChecked(channel);
      }
    });
  }

  return (
    <div
      style={{
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
      }}>
      <h1 style={{ textAlign: "center" }}>Задания</h1>
      <div
        style={{
          width: "80vw",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        }}>
        {tasks.map((task, i) => (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              margin: "10px",
              border: "1px solid #878787",
              borderRadius: "10px",
              width: "100%",
            }}
            key={i}>
            <img
              src="/fmzCoin.png"
              alt=""
              style={{ width: "auto", height: "50px", marginLeft: "10px" }}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}>
              <p
                style={{
                  fontWeight: "bold",
                  margin: "5px 0 0 0",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}>
                {task.title}
              </p>
              <p
                style={{
                  fontWeight: "bold",
                  color: "#878787",
                  margin: "10px 0 10px 0",
                }}>
                {task.reward} фмзв
              </p>
            </div>
            <button
              style={{
                height: "50px",
                borderRadius: "10px",
                border: "none",
                backgroundColor: "white",
                color: "white",
                fontSize: "15px",
                marginRight: "10px",
              }}
              onClick={() => checkSub(task.channel)}>
              <ArrowRight color="#575757" strokeWidth={1.75} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
