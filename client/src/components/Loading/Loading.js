import React from "react";
import "./Loading.scss";

import RizettaSVG from "./Rizetta__Loading__ANIMATED.svg";
function Loading() {
  return (
    <div className="loading">
      <object
        className="loading__svg"
        data={RizettaSVG}
        type="image/svg+xml"
      ></object>
    </div>
  );
}

export default Loading;
