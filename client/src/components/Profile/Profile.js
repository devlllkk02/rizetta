import React, { useState, useEffect, useContext } from "react";
import "./Profile.scss";
import "../Card/Card.scss"
import { Link } from "react-router-dom";
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
function Profile() {
  const { state, dispatch } = useContext(UserContext);
  const [profileData, setProfileData] = useState();
  const [user, setUser] = useState({});
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
    console.log(storedUser);
  }, []);
  useEffect(() => {
    GetMyRecipes();
  }, []);

  const GetMyRecipes = () => {
    fetch("/myrecipes", {
      method: "get",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setProfileData(result);
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
        GetMyRecipes();
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
        GetMyRecipes();
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
        // setprofileData(null);
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
            // const newData = profileData.map((item) => {
            //   if (item._id == result._id) {
            //     return result;
            //   } else {
            //     return item;
            //   }
            // });
            // setprofileData(null)
            // setprofileData(newData);

            GetMyRecipes();
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
        GetMyRecipes();
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
        GetMyRecipes();
      })
      .catch((error) => console.log(error));
  };

  return (
    <>
      {profileData ? (
        <div className="profile">
          <div className="profile__header">
            <div className="profile__header__container">
              <div className="profile__header__image">
                <img src={profileData.user.image} alt="Profile Pictute"></img>
              </div>
              <div className="profile__header__details">
                <div className="profile__header__details__name">
                  <p>{`${profileData.user.firstName} ${profileData.user.lastName}`}</p>
                </div>
                <div className="profile__header__details__total">
                  <div className="profile__header__details__recipes">
                    <p>{profileData.myrecipes.length} Recipes</p>
                  </div>
                  <div className="profile__header__details__followers">
                    <Link
                      to={`/profile/followers/${profileData.user._id}`}
                      style={{ textDecoration: "none" }}
                    >
                      <p>{`${profileData.user.followers.length} Followers`}</p>
                    </Link>
                  </div>
                  <div className="profile__header__details__following">
                    <Link
                      to={`/profile/following/${profileData.user._id}`}
                      style={{ textDecoration: "none" }}
                    >
                      <p>{`${profileData.user.following.length} Following`}</p>
                    </Link>
                  </div>
                </div>

                <div className="profile__header__details__bio">
                  <p>{`${profileData.user.bio}`}</p>
                </div>
              </div>
              <div className="profile__header__buttons">
                <div className="profile__header__button__edit">
                  <Link to="/profile/edit" style={{ textDecoration: "none" }}>
                    <button>Edit Profile</button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="profile__body">
            {profileData.myrecipes.map((item) => {
              const date = DateFormat(item.date);
              var score = 0;
              var rate;
              return (
                <div className="card" key={item._id} style={{height:"350px"}}>
                  <div className="card__image">
                  <Link to={`/recipe/${item._id}`} style={{ outline: "none" }}>
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

export default Profile;
