import React from "react";

// importing stylesheet
import "./prof-details.scss";

function ProfDetails() {
  return (
    <div className="profDet">
      <div className="profDet__container">
        {/* profile picture */}
        <div className="profDet__container_pic">
          <img src="./Images/Profile.png" />
        </div>
        {/* name and last seeen */}
        <div className="profDet__container__text">
          <h1>Binuli Fernando</h1>
          <p>10 April 2021</p>
        </div>
        {/* buttons */}
        <div className="profDet__container__buttons">
          <button>Delete</button>
          <button>Edit</button>
        </div>
      </div>
    </div>
  );
}

export default ProfDetails;
