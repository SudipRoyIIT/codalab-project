import zIndex from "@mui/material/styles/zIndex";
import React from "react";

function Item(props) {
  return (
    <div
      className="post-card"
      style={{
        display: "flex",
        border: "1px solid #ddd",
        marginBottom: "10px",
        borderRadius: "5px",
        cursor: "pointer",
        position:'relative',
      }}
      onClick={props.onClick} // Attach the onClick handler
    >
      <img
        src={props.urlToImage}
        className="post-image"
        alt="Post Image"
        style={{
          width: "50px",
          height: "50px",
          objectFit: "cover", // Corrected the typo from "overfit" to "objectFit"
          padding: "3px",
          borderRadius: "10px",
          margin: "10px",
        }}
      />
      <div className="post-content" style={{ flex: "1" }}>
        <h6
          className="post-title"
          style={{ marginLeft: "5px", marginTop: "10px" }}
        >
          {props.newsTopic}
        </h6>
        <p className="post-description" style={{ marginLeft: "5px" }}>
          {props.newsDescription}
        </p>
      </div>
    </div>
  );
}

export default Item;
