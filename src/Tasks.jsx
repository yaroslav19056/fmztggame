import { useEffect, useState } from "react";
import { ref, onValue, set, update, get } from "firebase/database";
import { database } from "./firebase.jsx";
import { ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const userId = window.Telegram.WebApp.initDataUnsafe?.user?.id;

  useEffect(() => {
    const refToTasks = ref(database, "tasks");
    const refToCompletedTasks = ref(database, `users/${userId}/completedTasks`);

    // Fetch tasks from Firebase
    onValue(refToTasks, (snapshot) => {
      const tasks = snapshot.val();
      setTasks(tasks || []);
    });

    // Fetch completed tasks for the user
    onValue(refToCompletedTasks, (snapshot) => {
      const completedTasks = snapshot.val() || [];
      setCompletedTasks(completedTasks);
    });
  }, [userId]);

  function taskChecked(channel, reward) {
    toast.success(`Задание ${channel} выполнено, награда: ${reward} фмзв`, {
      duration: 3000,
    });

    // Add reward to user's balance in Firebase
    // Добавление награды к балансу пользователя в Firebase
    const refToBalance = ref(database, `users/${userId}/points`);
    get(refToBalance).then((snapshot) => {
      const currentBalance = snapshot.val() || 0;

      // Убедитесь, что текущий баланс — число, и добавьте награду
      const newBalance =
        typeof currentBalance === "number" ? currentBalance + reward : reward;

      // Обновление значения без вложенной структуры
      set(refToBalance, newBalance);
    });

    // Mark the task as completed in Firebase
    const refToCompletedTasks = ref(database, `users/${userId}/completedTasks`);
    set(refToCompletedTasks, [...completedTasks, channel]);
  }

  async function checkSub(channel, reward) {
    const user = window.Telegram.WebApp.initDataUnsafe?.user;
    const refToInfo = await fetch(
      `https://api.telegram.org/bot7780848981:AAFc6poDpnPOnpLzvMUYYELrMZAmxubt8GQ/getChatMember?chat_id=@${channel}&user_id=${user.id}`
    );

    refToInfo.json().then((data) => {
      if (data.result.status === "left" || data.result.status === "kicked") {
        window.Telegram.WebApp.close();
        window.Telegram.WebApp.openTelegramLink(`https://t.me/${channel}`);
      } else {
        taskChecked(channel, reward);
      }
    });
  }

  function isTaskCompleted(channel) {
    return completedTasks.includes(channel);
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
                backgroundColor: isTaskCompleted(task.channel)
                  ? "#8f8f8f"
                  : "white",
                color: "white",
                fontSize: "15px",
                marginRight: "10px",
              }}
              onClick={() => checkSub(task.channel, task.reward)}
              disabled={isTaskCompleted(task.channel)}>
              <ArrowRight color="#575757" strokeWidth={1.75} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
