import Search from "../assets/images/sidebar/search.png";

function Searchbox() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        width: "360px",
        minHeight: "40px",
        maxheight: "40px",
        borderRadius: "12px",
        background: "#fff",
        border: "1px solid #cccfd0",
        marginTop: "12px",
        marginBottom: "12px",
        padding: "0 15px",
      }}
    >
      <img src={Search} alt="" className="searchLogo" />
      <input
        type="text"
        placeholder="Search messages, people"
        style={{
          flex: 1,
          border: "none",
          outline: "none",
          fontSize: "14px",
          color: "#333333",
          borderRadius: "15px",
          background: "transparent",
          marginLeft: "3px"
        }}
      />
    </div>
  );
}
export default Searchbox;
