import React, { useState, useEffect, useContext } from "react";
import "./Bookmark.scss";
import "../Card/Card.scss"
import { DateFormat } from "../../DateFormat";
import ReactStars from "react-stars";
import { UserContext } from "../../App";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faHeart as faHeartEmpty,
  faBookmark as faBookmarkEmpty,
} from "@fortawesome/free-regular-svg-icons";
import {
  faHeart as faHeartFill,
  faBookmark as faBookmarkFill,
} from "@fortawesome/free-solid-svg-icons";
import Loading from "../Loading/Loading";

function Bookmark() {
  const { state, dispatch } = useContext(UserContext);
  const [bookmarkData, setbookmarkData] = useState([]);

  const GetAllRecipes = () => {
    fetch("/bookmark", {
      method: "get",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    })
      .then((res) => res.json())
      .then((savedData) => {
        console.log(savedData);
        setbookmarkData(savedData.savedRecipes);
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
        // setbookmarkData(null);
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
            // const newData = bookmarkData.map((item) => {
            //   if (item._id == result._id) {
            //     return result;
            //   } else {
            //     return item;
            //   }
            // });
            // setbookmarkData(null)
            // setbookmarkData(newData);

            GetAllRecipes();
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
    <>
      {bookmarkData ? (
        <div className="bookmark">
          {bookmarkData.map((item) => {
            const date = DateFormat(item.date);
            var score = 0;
            var rate;
            return (
              <div className="card" key={item._id}>
                <div className="card__header">
                  <div className="card__user__image">
                    <img src={item.postedBy.image} alt="" />
                  </div>
                  <div className="card__user__details">
                    <div className="card__user__name">
                      <p>
                        {item.postedBy.firstName} {item.postedBy.lastName}
                      </p>
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
                  <Link to={`recipe/${item._id}`} style={{ outline: "none" }}>
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
    </>
  );
}

export default Bookmark;
/*
 <div className="bookmark__item">
        <div className="bookmark__item__header">
          <div className="bookmark__item__user__image">
            <img src="item.postedBy.imag" alt="" />
          </div>
          <div className="bookmark__item__user__details">
            <div className="bookmark__item__user__name">
              <p>ss</p>
            </div>
            <div className="bookmark__item__user__date">
              <FontAwesomeIcon icon={faClock} />
              <p>d</p>
            </div>
          </div>
        </div>
        <div className="bookmark__item__image">
          <img src="item.photo" alt="" />
        </div>
        <div className="bookmark__item__title">
          <p>item.title</p>
        </div>
        <div className="bookmark__item__description">
          <p>item.description</p>
        </div>
        <div className="bookmark__item__ratings">
          <div className="bookmark__item__heart">
            <div className="bookmark__item__heart__icon">
              <FontAwesomeIcon
                icon={faHeartEmpty}
                className="icon__heartEmpty"
              />
            </div>
            <div className="bookmark__item__heart__text">
              <p>142 Likes</p>
            </div>
          </div>
          <div className="bookmark__item__stars">
            <div className="bookmark__item__stars__text">
              <p>3.25/5</p>
            </div>
            <div className="bookmark__item__stars__icon">
              <ReactStars
                count={5}
                
                size={20}
                color2={"#E16120"}
              />
            </div>
          </div>
        </div>
      </div>
    



*/
