import React from "react";
import { Link } from "react-router-dom";
import "./Home__banner.scss";

function Homebanner() {
  return (
    <div className="home__banner">
      <div className="home__banner__container">
        <div className="home__banner__logo">
          <img src="./Images/Rizetta_LOGO.png" alt="logo" />
        </div>
        <div className="home__banner__slogan">
          <p>Discover The Chef In You</p>
        </div>
        <div className="home__banner__content1">
          <p>
            Want to share your recipes with your friends. What are you waiting
            for?
          </p>
        </div>
        <div className="home__banner__content2">
          <p>Get Started Now</p>
        </div>
        <div className="home__buttons">
          <div className="home__buttons__signup">
            <Link to="/signup" style={{ textDecoration: "none" }}>
              <button>Sign up</button>
            </Link>
          </div>
          <div className="home__buttons__login">
            <Link to="/login" style={{ textDecoration: "none" }}>
              <button>Log In</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Homebanner;
