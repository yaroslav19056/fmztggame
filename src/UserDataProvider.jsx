// import React, { createContext, useContext, useState, useEffect } from "react";
// import { ref, get, set, update } from "firebase/database";
// import { database } from "./firebase";

// // Создание контекста
// const UserDataContext = createContext();

// export const useUserData = () => useContext(UserDataContext);

// // Провайдер для общего состояния
// export const UserDataProvider = ({ children, userId }) => {
//   const [userData, setUserData] = useState({
//     points: 0,
//     cards: [],
//     levelIndex: 0,
//     prestige: 0,
//   });

//   // Функция для загрузки данных из Firebase
//   const loadUserData = async () => {
//     if (userId) {
//       const dbRef = ref(database, `users/${userId}`);
//       const snapshot = await get(dbRef);
//       if (snapshot.exists()) {
//         alert("Loaded user data:", snapshot.val()); // Debugging line
//         setUserData(snapshot.val());
//       } else {
//         alert("No data found, creating default values.");
//         await set(dbRef, { points: 0, cards: [], levelIndex: 0, prestige: 0 });
//         setUserData({ points: 0, cards: [], levelIndex: 0, prestige: 0 });
//       }
//     }
//   };

//   // Функция для обновления данных в Firebase
//   const updateUserData = async (newDataOrUpdater) => {
//     // if (userId) {
//     //   const dbRef = ref(database, `users/${userId}`);

//     //   // Обрабатываем обновление данных
//     //   const updatedData =
//     //     typeof newDataOrUpdater === "function"
//     //       ? newDataOrUpdater(userData)
//     //       : newDataOrUpdater;

//     //   // Обновляем Firebase и локальное состояние только после успешного обновления
//     //   try {
//     //     await update(dbRef, updatedData); // Ждем обновления в Firebase
//     //     setUserData((prevData) => ({ ...prevData, ...updatedData })); // Обновляем локальное состояние
//     //   } catch (error) {
//     //     alert("Ошибка обновления данных в Firebase:", error);
//     //   }
//     // }
//   };

//   useEffect(() => {
//     loadUserData();
//   }, [userId]);

//   return (
//     <UserDataContext.Provider value={{ userData, updateUserData }}>
//       {children}
//     </UserDataContext.Provider>
//   );
// };
