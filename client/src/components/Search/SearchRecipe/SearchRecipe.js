import React, { useState, useEffect, useContext } from "react";
import "./SearchRecipe.scss";
import "../../Card/Card.scss"
import { UserContext } from "../../../App";
import { DateFormat } from "../../../DateFormat";
import ReactStars from "react-stars";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import {
  faClock,
  faHeart as faHeartEmpty,
  faBookmark as faBookmarkEmpty,
} from "@fortawesome/free-regular-svg-icons";
import {
  faHeart as faHeartFill,
  faBookmark as faBookmarkFill,
} from "@fortawesome/free-solid-svg-icons";
import Loading from "../../Loading/Loading";
function SearchRecipe() {
  const [searchRecipeData, setSearchRecipeData] = useState();
  const [search, setSearch] = useState("");
  const { state, dispatch } = useContext(UserContext);

  const GetAllRecipes = () => {
    fetch("/allrecipes", {
      method: "get",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    })
      .then((res) => res.json())
      .then((savedData) => {
        console.log(savedData);
        setSearchRecipeData(savedData.savedRecipes);
      })
      .catch((error) => console.log(error));
  };

  const SearchRecipes = (recipeQuery) => {
    fetch("/searchrecipes", {
      method: "post",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        recipeQuery: recipeQuery,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setSearchRecipeData(result);
      })
      .catch((error) => console.log(error));
  };
  useEffect(() => {
    GetAllRecipes();
  }, []);

  const HeartRecipe = (recipeId) => {
    fetch("/heart", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
      body: JSON.stringify({
        recipeId: recipeId,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        // console.log(result);
        GetAllRecipes();
      })
      .catch((error) => console.log(error));
  };
  const UnHeartRecipe = (recipeId) => {
    fetch("/unheart", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
      body: JSON.stringify({
        recipeId: recipeId,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        // console.log(result);
        GetAllRecipes();
      })
      .catch((error) => console.log(error));
  };
  const RateRecipe = (recipeId, score) => {
    fetch("/unrate", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
      body: JSON.stringify({
        recipeId: recipeId,
        score: score,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        // console.log(result);
        fetch("/rate", {
          method: "put",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
          body: JSON.stringify({
            recipeId: recipeId,
            score: score,
          }),
        })
          .then((res) => res.json())
          .then((result) => {
            // console.log(result);
            // const newData = feedData.map((item) => {
            //   if (item._id == result._id) {
            //     return result;
            //   } else {
            //     return item;
            //   }
            // });
            // setSearchRecipeData(null)
            // setSearchRecipeData(newData);

            GetAllRecipes();
            // SearchRecipes(search);
          })
          .catch((error) => console.log(error));
      })
      .catch((error) => console.log(error));
  };

  const BookmarkRecipe = (recipeId) => {
    fetch("/bookmark", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
      body: JSON.stringify({
        recipeId: recipeId,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        GetAllRecipes();
      })
      .catch((error) => console.log(error));
  };
  const UnBookmarkRecipe = (recipeId) => {
    fetch("/unbookmark", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
      body: JSON.stringify({
        recipeId: recipeId,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        GetAllRecipes();
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className="searchRecipe">
      <div className="searchRecipe__searchbar">
        <input
          type="text"
          placeholder="Search Recipes..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            SearchRecipes(search);
          }}
        />
        <FontAwesomeIcon className="icon__search" icon={faSearch} />
      </div>
      <div className="searchRecipe__nav">
        <div className="searchRecipe__nav__left">
          <Link style={{ textDecoration: "none" }} to="/search/users">
            <p>Users</p>
          </Link>
        </div>
        <div className="searchRecipe__nav__right">
          <Link style={{ textDecoration: "none" }} to="/search/recipes">
            <p>Recipes</p>
          </Link>
        </div>
      </div>
      <div className="searchRecipe__border">
        <div className="searchRecipe__border__left"></div>
        <div className="searchRecipe__border__right"></div>
      </div>
      <div className="searchRecipe__list">
        {searchRecipeData  ? (
          <div className="searchRecipe__list__container">
            {searchRecipeData
              .filter((item) => {
                if (search == "") {
                  return null;
                } else if (
                  item.title
                    .toLocaleLowerCase()
                    .includes(search.toLocaleLowerCase())
                ) {
                  return item;
                }
              })
              .map((item) => {
                const date = DateFormat(item.date);
                var score = 0;
                var rate;
                return (
                  <div className="card" key={item._id}>
                    <div className="card__header">
                      <div className="card__user__image">
                        <Link
                          to={
                            state._id == item.postedBy._id
                              ? "/profile"
                              : `/profile/${item.postedBy._id}`
                          }
                        >
                          <img src={item.postedBy.image} alt="" />
                        </Link>
                      </div>
                      <div className="card__user__details">
                        <div className="card__user__name">
                          <Link
                            style={{ textDecoration: "none" }}
                            to={
                              state._id == item.postedBy._id
                                ? "/profile"
                                : `/profile/${item.postedBy._id}`
                            }
                          >
                            <p>
                              {item.postedBy.firstName} {item.postedBy.lastName}
                            </p>
                          </Link>
                        </div>
                        <div className="card__user__date">
                          <FontAwesomeIcon icon={faClock} />
                          <p>{`${date.date} ${date.month.short} ${date.year}`}</p>
                        </div>
                      </div>
                      <div className="card__bookmark">
                        {item.bookmark.includes(state._id) ? (
                          <FontAwesomeIcon
                            icon={faBookmarkFill}
                            className="icon__bookmarkFill"
                            onClick={() => UnBookmarkRecipe(item._id)}
                          />
                        ) : (
                          <FontAwesomeIcon
                            icon={faBookmarkEmpty}
                            className="icon__bookmarkEmpty"
                            onClick={() => BookmarkRecipe(item._id)}
                          />
                        )}
                      </div>
                    </div>
                    <div className="card__image">
                      <Link
                        to={`recipe/${item._id}`}
                        style={{ outline: "none" }}
                      >
                        <img src={item.photo} alt="" />
                      </Link>
                    </div>
                    <div className="card__title">
                      <p>{item.title}</p>
                    </div>
                    <div className="card__description">
                      <p>{item.description}</p>
                    </div>
                    <div className="card__ratings">
                      <div className="card__heart">
                        <div className="card__heart__icon">
                          {item.hearts.includes(state._id) ? (
                            <FontAwesomeIcon
                              icon={faHeartFill}
                              className="icon__heartFill"
                              onClick={() => UnHeartRecipe(item._id)}
                            />
                          ) : (
                            <FontAwesomeIcon
                              icon={faHeartEmpty}
                              className="icon__heartEmpty"
                              onClick={() => HeartRecipe(item._id)}
                            />
                          )}
                        </div>
                        <div className="card__heart__text">
                          <p>{`${item.hearts.length} likes`}</p>
                        </div>
                      </div>
                      <div className="card__stars">
                        <div className="card__stars__text">
                          {item.ratings.map((rating) => {
                            score += rating.score;
                          })}

                          {score ? (
                            <p>{(score / item.ratings.length).toFixed(2)}</p>
                          ) : (
                            <p></p>
                          )}
                        </div>
                        <div className="card__stars__icon">
                          {item.ratings.map((rating) => {
                            console.log(rating.postedBy._id == state._id);

                            if (rating.postedBy._id == state._id) {
                              rate = rating.score;
                            }
                          })}

                          <ReactStars
                            count={5}
                            size={20}
                            value={rate}
                            color2={"#E16120"}
                            onChange={(score) => {
                              RateRecipe(item._id, score);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        ) : (
          <Loading />
        )}
      </div>
    </div>
  );
}

export default SearchRecipe;
