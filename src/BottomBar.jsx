import styles from "./BottomBar.module.css";
import { Gem, Coins, House, ListChecks, ScrollText } from "lucide-react";

export default function BottomBar({ onPageChange, currentPage }) {
  return (
    <div
      style={{
        height: "50px",
        position: "fixed",
        bottom: "0",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        backgroundColor: "black",
        paddingTop: "5px",
      }}>
      <button
        style={{
          marginLeft: "10px",
          marginRight: "10px",
          height: "90%",
          width: "20%",
          borderRadius: "10px",
          border: "none",
          backgroundColor: "black",
        }}
        className={currentPage === "Home" ? styles.active : ""}
        onClick={() => onPageChange("Home")}>
        <House
          color={currentPage === "Home" ? "#ffffff" : "#878787"}
          strokeWidth={1.75}
        />
      </button>
      <button
        style={{
          marginLeft: "10px",
          marginRight: "10px",
          height: "90%",
          width: "20%",
          borderRadius: "10px",
          border: "none",
          backgroundColor: "black",
        }}
        className={currentPage === "Income" ? styles.active : ""}
        onClick={() => onPageChange("Income")}>
        <Coins
          color={currentPage === "Income" ? "#ffffff" : "#878787"}
          strokeWidth={1.75}
        />
      </button>

      <button
        style={{
          marginLeft: "10px",
          marginRight: "10px",
          height: "90%",
          width: "20%",
          borderRadius: "10px",
          border: "none",
          backgroundColor: "black",
        }}
        className={currentPage === "Tasks" ? styles.active : ""}
        onClick={() => onPageChange("Tasks")}>
        <ListChecks
          color={currentPage === "Tasks" ? "#ffffff" : "#878787"}
          strokeWidth={1.75}
        />
      </button>
      <button
        style={{
          marginLeft: "10px",
          marginRight: "10px",
          height: "90%",
          width: "20%",
          borderRadius: "10px",
          border: "none",
          backgroundColor: "black",
        }}
        className={currentPage === "Airdrop" ? styles.active : ""}
        onClick={() => onPageChange("Airdrop")}>
        <Gem
          color={currentPage === "Airdrop" ? "#ffffff" : "#878787"}
          strokeWidth={1.75}
        />
      </button>
      <button
        style={{
          marginLeft: "10px",
          marginRight: "10px",
          height: "90%",
          width: "20%",
          borderRadius: "10px",
          border: "none",
          backgroundColor: "black",
        }}
        className={currentPage === "Quotes" ? styles.active : ""}
        onClick={() => onPageChange("Quotes")}>
        <ScrollText
          color={currentPage === "Quotes" ? "#ffffff" : "#878787"}
          strokeWidth={1.75}
        />
      </button>
    </div>
  );
}
