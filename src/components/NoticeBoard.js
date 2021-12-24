import React from "react";
import BoardItem from "./BoardItem";

const NoticeBoard = () => {
  return (
    <div className="notice-board">
      <h3>Notice Board</h3>
      <BoardItem />
      <BoardItem />
      <a>show more</a>
    </div>
  );
};

export default NoticeBoard;
