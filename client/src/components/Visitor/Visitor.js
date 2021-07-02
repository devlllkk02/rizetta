import React, { useState, useEffect, useContext } from "react";
import "./Visitor.scss";
import "../Card/Card.scss";
import { Link, useParams } from "react-router-dom";
import { UserContext } from "../../App";
import { DateFormat } from "../../DateFormat";
import ReactStars from "react-stars";
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

function Visitor() {
  const { userId } = useParams();
  console.log(userId);
  const { state, dispatch } = useContext(UserContext);
  const [visitorData, setVisitorData] = useState(null);
  const [user, setUser] = useState({});
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
    console.log(storedUser);
  }, []);
  useEffect(() => {
    GetVisitorRecipes();
  }, []);

  const GetVisitorRecipes = () => {
    fetch(`/visitor/${userId}`, {
      method: "get",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setVisitorData(result);
      })
      .catch((error) => console.log(error));
  };
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
        GetVisitorRecipes();
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
        GetVisitorRecipes();
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
        // setvisitorData(null);
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
            // const newData = visitorData.map((item) => {
            //   if (item._id == result._id) {
            //     return result;
            //   } else {
            //     return item;
            //   }
            // });
            // setvisitorData(null)
            // setvisitorData(newData);

            GetVisitorRecipes();
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
        GetVisitorRecipes();
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
        GetVisitorRecipes();
      })
      .catch((error) => console.log(error));
  };

  const Follow = (followId) => {
    fetch("/follow", {
      method: "put",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        followId: followId,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        GetVisitorRecipes();
      })
      .catch((error) => console.log(error));
  };
  const UnFollow = (followId) => {
    fetch("/unfollow", {
      method: "put",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        followId: followId,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        GetVisitorRecipes();
      })
      .catch((error) => console.log(error));
  };

  return (
    <>
      {visitorData ? (
        <div className="visitor">
          <div className="visitor__header">
            <div className="visitor__header__container">
              <div className="visitor__header__image">
                <img src={visitorData.user.image} alt="Visitor Pictute"></img>
              </div>
              <div className="visitor__header__details">
                <div className="visitor__header__details__name">
                  <p>{`${visitorData.user.firstName} ${visitorData.user.lastName}`}</p>
                </div>
                <div className="visitor__header__details__total">
                  <div className="visitor__header__details__recipes">
                    <p>{visitorData.recipes.length} Recipes</p>
                  </div>
                  <div className="visitor__header__details__followers">
                    <Link
                      to={`/profile/followers/${userId}`}
                      style={{ textDecoration: "none" }}
                    >
                      <p>{`${visitorData.user.followers.length} Followers`}</p>
                    </Link>
                  </div>
                  <div className="visitor__header__details__following">
                    <Link
                      to={`/profile/following/${userId}`}
                      style={{ textDecoration: "none" }}
                    >
                      <p>{`${visitorData.user.following.length} Following`}</p>
                    </Link>
                  </div>
                </div>

                <div className="visitor__header__details__bio">
                  <p>{`${visitorData.user.bio}`}</p>
                </div>
              </div>

              <div className="visitor__header__buttons">
                {console.log("User", state._id)}
                {visitorData.user.followers.some(
                  (follower) => follower["_id"] === state._id
                ) ? (
                  <div className="visitor__header__button__unfollow">
                    <button onClick={() => UnFollow(visitorData.user._id)}>
                      Unfollow
                    </button>
                  </div>
                ) : (
                  <div className="visitor__header__button__follow">
                    <button onClick={() => Follow(visitorData.user._id)}>
                      Follow
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="visitor__body">
            {visitorData.recipes.map((item) => {
              const date = DateFormat(item.date);
              var score = 0;
              var rate;
              return (
                <div
                  className="card"
                  key={item._id}
                  style={{ height: "350px" }}
                >
                  <div className="card__image">
                    <Link
                      to={`/recipe/${item._id}`}
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
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
}

export default Visitor;
