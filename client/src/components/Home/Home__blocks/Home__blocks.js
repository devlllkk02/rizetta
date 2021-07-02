import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlusCircle,
  faSearch,
  faShareSquare,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import "./Home__blocks.scss";
function Homeblocks() {
  return (
    <div className="home__blocks">
      {/* Block 1 */}
      <div className="home__block home__block__1">
        <div className="home__block__title">
          <p>CREATE</p>
        </div>
        <div className="home__block__icon">
          <FontAwesomeIcon
            className="home__block__icon__item"
            icon={faPlusCircle}
          />
        </div>
        <div className="home__block__content">
          <p>
            You can publish your scrumptious cooking and recipe ideas by
            creating an account in Rizetta
          </p>
        </div>
      </div>
      {/* Block 2 */}
      <div className="home__block home__block__2">
        <div className="home__block__title">
          <p>SEARCH</p>
        </div>
        <div className="home__block__icon">
          <FontAwesomeIcon
            className="home__block__icon__item"
            icon={faSearch}
          />
        </div>
        <div className="home__block__content">
          <p>
            Discover recipes based on the food you love and the friends you
            follow
          </p>
        </div>
      </div>
      {/* Block 3 */}
      <div className="home__block home__block__3">
        <div className="home__block__title">
          <p>RATE</p>
        </div>
        <div className="home__block__icon">
          <FontAwesomeIcon className="home__block__icon__item" icon={faStar} />
        </div>
        <div className="home__block__content">
          <p>
            Try out your favourite recipes and give the recipe a star rating
            from 1 to 5
          </p>
        </div>
      </div>
      {/* Block 4 */}
      <div className="home__block home__block__4">
        <div className="home__block__title">
          <p>SHARE</p>
        </div>
        <div className="home__block__icon">
          <FontAwesomeIcon
            className="home__block__icon__item"
            icon={faShareSquare}
          />
        </div>
        <div className="home__block__content">
          <p>
          You can share other users’ ideas with your friends and save delicious recipes
          </p>
        </div>
      </div>
    </div>
  );
}

export default Homeblocks;
