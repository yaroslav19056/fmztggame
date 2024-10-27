export default function Quotes() {
  return (
    <div
      style={{
        height: "80vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}>
      <div
        style={{
          textAlign: "center",
          width: "50%",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}>
        <h1>Цитаты</h1>
        <h3>В разработке</h3>
        <p>
          Открывайте эксклюзивные цитаты, коллекционируйте. Придайте смысла
          престижу.
        </p>
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
        }}></img>
    </div>
  );
}
