import React, { useState, useEffect, useContext } from "react";
import "./SearchUser.scss";
import { UserContext } from "../../../App";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import Loading from "../../Loading/Loading";

function SearchUser() {
  const [searchUserData, setSearchUserData] = useState();
  const [search, setSearch] = useState([]);
  const { state, dispatch } = useContext(UserContext);

  const GetAllUsers = () => {
    fetch("/allusers", {
      method: "get",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setSearchUserData(result);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    GetAllUsers();
  }, []);
  return (
    <div className="searchUser">
      <div className="searchUser__searchbar">
        <input
          type="text"
          placeholder="Search Users..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            // SearchRecipes(search);
          }}
        />
        <FontAwesomeIcon className="icon__search" icon={faSearch} />
      </div>
      <div className="searchUser__nav">
        <div className="searchUser__nav__left">
          <Link style={{ textDecoration: "none" }} to="/search/users">
            <p>Users</p>
          </Link>
        </div>
        <div className="searchUser__nav__right">
          <Link style={{ textDecoration: "none" }} to="/search/recipes">
            <p>Recipes</p>
          </Link>
        </div>
      </div>
      <div className="searchUser__border">
        <div className="searchUser__border__left"></div>
        <div className="searchUser__border__right"></div>
      </div>
      {searchUserData ? (
        <div className="searchUser__list">
          {searchUserData
            .filter((item) => {
              if (search == "") {
                return null;
              } else if (
                item.firstName
                  .toLocaleLowerCase()
                  .includes(search.toLocaleLowerCase()) ||
                item.lastName
                  .toLocaleLowerCase()
                  .includes(search.toLocaleLowerCase())
              ) {
                return item;
              }
            })
            .map((user) => {
              return (
                <Link
                  style={{ textDecoration: "none" }}
                  to={
                    state._id == user._id ? "/profile" : `/profile/${user._id}`
                  }
                >
                  <div className="searchUser__item">
                    <div className="searchUser__item__image">
                      <img src={user.image} alt="" />
                    </div>
                    <div className="searchUser__item__name">
                      <p>{`${user.firstName} ${user.lastName}`}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
        </div>
      ) : (
        <Loading />
      )}
    </div>
  );
}

export default SearchUser;
