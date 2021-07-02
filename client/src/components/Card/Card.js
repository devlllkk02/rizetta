import React, { useContext } from "react";
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

import "./Card.scss"

function Card({
  _id,
  MyDate,
  postedBy,
  bookmark,
  photo,
  title,
  description,
  hearts,
  ratings,
  GetAllRecipes
}) {
  const { state, dispatch } = useContext(UserContext);
  const date = DateFormat(MyDate);
  var score = 0;
  var rate;

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
        // setFeedData(null);
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
            // setFeedData(null)
            // setFeedData(newData);
            //GetAllRecipes();
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
    <div className="card" key={_id}>
      <div className="card__header">
        <div className="card__user__image">
          <Link
            to={
              state._id == postedBy._id
                ? "/profile"
                : `/profile/${postedBy._id}`
            }
          >
            <img src={postedBy.image} alt="" />
          </Link>
        </div>
        <div className="card__user__details">
          <div className="card__user__name">
            <Link
              style={{ textDecoration: "none" }}
              to={
                state._id == postedBy._id
                  ? "/profile"
                  : `/profile/${postedBy._id}`
              }
            >
              <p>
                {postedBy.firstName} {postedBy.lastName}
              </p>
            </Link>
          </div>
          <div className="card__user__date">
            <FontAwesomeIcon icon={faClock} />
            <p>{`${date.date} ${date.month.short} ${date.year}`}</p>
          </div>
        </div>
        <div className="card__bookmark">
          {bookmark.includes(state._id) ? (
            <FontAwesomeIcon
              icon={faBookmarkFill}
              className="icon__bookmarkFill"
              onClick={() => UnBookmarkRecipe(_id)}
            />
          ) : (
            <FontAwesomeIcon
              icon={faBookmarkEmpty}
              className="icon__bookmarkEmpty"
              onClick={() => BookmarkRecipe(_id)}
            />
          )}
        </div>
      </div>
      <div className="card__image">
        <Link to={`recipe/${_id}`} style={{ outline: "none" }}>
          <img src={photo} alt="" />
        </Link>
      </div>
      <div className="card__title">
        <p>{title}</p>
      </div>
      <div className="card__description">
        <p>{description}</p>
      </div>
      <div className="card__ratings">
        <div className="card__heart">
          <div className="card__heart__icon">
            {hearts.includes(state._id) ? (
              <FontAwesomeIcon
                icon={faHeartFill}
                className="icon__heartFill"
                onClick={() => UnHeartRecipe(_id)}
              />
            ) : (
              <FontAwesomeIcon
                icon={faHeartEmpty}
                className="icon__heartEmpty"
                onClick={() => HeartRecipe(_id)}
              />
            )}
          </div>
          <div className="card__heart__text">
            <p>{`${hearts.length} likes`}</p>
          </div>
        </div>
        <div className="card__stars">
          <div className="card__stars__text">
            {ratings.map((rating) => {
              score += rating.score;
            })}

            {score ? <p>{(score / ratings.length).toFixed(2)}</p> : <p></p>}
          </div>
          <div className="card__stars__icon">
            {ratings.map((rating) => {
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
                RateRecipe(_id, score);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;
