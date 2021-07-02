import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../App";
import "./Navbar.scss";
import Rizetta_LOGO from "./Rizetta_LOGO.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookmark,
  faPlusCircle,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useHistory } from "react-router-dom";

function Navbar() {
  const history = useHistory();
  const { state, dispatch } = useContext(UserContext);
  const [user, setUser] = useState({});
  const Logout = () => {
    localStorage.clear();
    dispatch({ type: "CLEAR" });
    history.push("/login");
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
    console.log(storedUser);
  }, []);
  return (
    <>
      <div className="navbar">
        <div className="navbar__container">
          <div className="navbar__logo">
            <Link to="/feed" style={{ outline: "none" }}>
              <img src={Rizetta_LOGO} alt="rizetta" />
            </Link>
          </div>
          <div className="navbar__links">
            <div className="navbar__link__search">
              <Link to="/search/recipes" className="navbar__link__search">
                <FontAwesomeIcon
                  className="navbar__search__icon"
                  icon={faSearch}
                />
              </Link>
            </div>
            <div className="navbar__link__bookmark">
              <Link to="/bookmark" className="navbar__link__bookmark">
                <FontAwesomeIcon
                  className="navbar__bookmark__icon"
                  icon={faBookmark}
                />
              </Link>
            </div>
            <div className="navbar__link__create">
              <Link to="/create" className="navbar__link__create">
                <FontAwesomeIcon
                  className="navbar__create__icon"
                  icon={faPlusCircle}
                />
              </Link>
            </div>
          </div>
          <div className="navbar__user">
            <div className="navbar__user__image">
              <Link to="/profile">
                <img src={user.image} alt="" />
              </Link>
            </div>
            <div className="navbar__user__details">
              <div className="navbar__user__name">
                <Link to="/profile" className="navbar__user__name__link">
                  <p>{`${user.firstName} ${user.lastName}`}</p>
                </Link>
              </div>
              <div className="navbar__user__status">
                <p onClick={() => Logout()}>Logout</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="navbar__spacer"></div>
    </>
  );
}

export default Navbar;
