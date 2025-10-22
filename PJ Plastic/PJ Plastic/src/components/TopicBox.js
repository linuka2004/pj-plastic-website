import React from "react";

function TopicBox({ title, description }) {
  return (
    <div className="topic-box">
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}

export default TopicBox;
