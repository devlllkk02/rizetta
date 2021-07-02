import React, { useState, useEffect, useRef, useContext } from "react";
import "./Recipe.scss";
import UserImage from "./Profile.png";
import { Link } from "react-router-dom";
import { UserContext } from "../../App";
import { DateFormat } from "../../DateFormat";
import ReactStars from "react-stars";
import { useParams, useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faHeart as faHeartEmpty,
  faBookmark as faBookmarkEmpty,
} from "@fortawesome/free-regular-svg-icons";
import {
  faHeart as faHeartFill,
  faBookmark as faBookmarkFill,
  faTrash,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import Loading from "../Loading/Loading";

function Recipe() {
  const { state, dispatch } = useContext(UserContext);
  const history = useHistory();
  const { recipeId } = useParams();
  const [recipeData, setRecipeData] = useState(null);
  const [date, setDate] = useState();

  const [comment, setComment] = useState();
  const [commentId, setCommentId] = useState();
  const [mycomments, setMyComments] = useState();
  const [edit, setEdit] = useState(false);

  var score = 0;
  var rate;

  const isInitialMount = useRef(true);

  function compare(a, b) {
    return -a.createdAt + b.createdAt;
  }
  const GetARecipe = () => {
    fetch(`/recipe/${recipeId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.error) {
          // history.push("/recipe");
        } else {
          console.log(result);
          setRecipeData(result);
          setMyComments(result.comments.sort(compare));
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    GetARecipe();
  }, []);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      setDate(DateFormat(recipeData.date));
    }
  }, [recipeData]);

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
        GetARecipe();
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
        GetARecipe();
      })
      .catch((error) => console.log(error));
  };
  const DeleteRecipe = (recipeId) => {
    console.log(recipeId);
    fetch(`/deleterecipe/${recipeId}`, {
      method: "delete",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        history.push("/feed");
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
        GetARecipe();
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
        GetARecipe();
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

            GetARecipe();
          })
          .catch((error) => console.log(error));
      })
      .catch((error) => console.log(error));
  };

  const AddUpdateComment = (recipeId, commentId, text) => {
    if (edit) {
      fetch("/updatecomment", {
        method: "put",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          commentId: commentId,
          text: text,
        }),
      })
        .then((res) => res.json())
        .then((result) => {
          console.log(result);
          setComment("");
          GetARecipe();
        })
        .catch((error) => console.log(error));
      setEdit(false);
    } else {
      fetch("/addcomment", {
        method: "put",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipeId: recipeId,
          text: text,
        }),
      })
        .then((res) => res.json())
        .then((result) => {
          console.log(result);
          setComment("");

          GetARecipe();
        })
        .catch((error) => console.log(error));
    }
  };
  const DeleteComment = (recipeId, commentId) => {
    fetch("/deletecomment", {
      method: "put",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        recipeId: recipeId,
        commentId: commentId,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        GetARecipe();
      })
      .catch((error) => console.log(error));
  };

  return (
    <>
      {recipeData && date && mycomments ? (
        <div className="recipe">
          <div className="recipe__header">
            <div className="recipe__header__profile">
              <div className="recipe__header__profile__image">
                <Link
                  to={
                    state._id == recipeData.postedBy._id
                      ? "/profile"
                      : `/profile/${recipeData.postedBy._id}`
                  }
                >
                  <img
                    src={recipeData.postedBy.image}
                    alt="Profile Pictute"
                  ></img>
                </Link>
              </div>
              <div className="recipe__header__profile__details">
                <div className="recipe__header__details__name">
                  <Link
                    to={
                      state._id == recipeData.postedBy._id
                        ? "/profile"
                        : `/profile/${recipeData.postedBy._id}`
                    }
                    style={{ textDecoration: "none" }}
                  >
                    <p>{`${recipeData.postedBy.firstName} ${recipeData.postedBy.lastName}`}</p>
                  </Link>
                </div>
                <div className="recipe__header__details__date">
                  <FontAwesomeIcon icon={faClock} />
                  <p>{`${date.date} ${date.month.short} ${date.year}`}</p>
                </div>
              </div>
            </div>
            <div className="recipe__header__buttons">
              {state._id == recipeData.postedBy._id ? (
                <>
                  <div className="recipe__header__button__delete">
                    <button onClick={() => DeleteRecipe(recipeData._id)}>
                      Delete
                    </button>
                  </div>
                  <div className="recipe__header__button__edit">
                    <button
                      onClick={() => {
                        history.push(`/update/${recipeId}`);
                      }}
                    >
                      Edit
                    </button>
                  </div>
                  <div className="recipe__header__bookmark">
                    {recipeData.bookmark.includes(state._id) ? (
                      <FontAwesomeIcon
                        icon={faBookmarkFill}
                        className="icon__bookmarkFill"
                        onClick={() => UnBookmarkRecipe(recipeData._id)}
                      />
                    ) : (
                      <FontAwesomeIcon
                        icon={faBookmarkEmpty}
                        className="icon__bookmarkEmpty"
                        onClick={() => BookmarkRecipe(recipeData._id)}
                      />
                    )}
                  </div>
                </>
              ) : (
                <div className="recipe__header__bookmark">
                  {recipeData.bookmark.includes(state._id) ? (
                    <FontAwesomeIcon
                      icon={faBookmarkFill}
                      className="icon__bookmarkFill"
                      onClick={() => UnBookmarkRecipe(recipeData._id)}
                    />
                  ) : (
                    <FontAwesomeIcon
                      icon={faBookmarkEmpty}
                      className="icon__bookmarkEmpty"
                      onClick={() => BookmarkRecipe(recipeData._id)}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="recipe__body">
            <div className="recipe__title">
              <p>{recipeData.title}</p>
            </div>
            <div className="recipe__description">
              <p>{recipeData.description}</p>
            </div>
            <div className="recipe__image">
              <img src={recipeData.photo} />
            </div>
            <div className="recipe__ratings">
              <div className="recipe__ratings__heart">
                <div className="recipe__ratings__heart__icon">
                  {recipeData.hearts.includes(state._id) ? (
                    <FontAwesomeIcon
                      icon={faHeartFill}
                      className="icon__heartFill"
                      onClick={() => UnHeartRecipe(recipeData._id)}
                    />
                  ) : (
                    <FontAwesomeIcon
                      icon={faHeartEmpty}
                      className="icon__heartEmpty"
                      onClick={() => HeartRecipe(recipeData._id)}
                    />
                  )}
                </div>
                <div className="recipe__ratings__heart__text">
                  <p>{`${recipeData.hearts.length} likes`}</p>
                </div>
              </div>
              <div className="recipe__ratings__star">
                <div className="recipe__ratings__star__text">
                  {recipeData.ratings.map((rating) => {
                    score += rating.score;
                  })}
                  {/* {console.log(score / recipeData.ratings.length)} */}
                  {score ? (
                    <p>{(score / recipeData.ratings.length).toFixed(2)}</p>
                  ) : (
                    <p></p>
                  )}
                </div>
                <div className="recipe__ratings__star__icon">
                  {recipeData.ratings.map((rating) => {
                    // console.log(rating.postedBy._id == state._id);

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
                      RateRecipe(recipeData._id, score);
                    }}
                  />
                </div>
              </div>
              <div className="recipe__ratings__bookmark">
                {recipeData.bookmark.includes(state._id) ? (
                  <FontAwesomeIcon
                    icon={faBookmarkFill}
                    className="icon__bookmarkFill"
                    onClick={() => UnBookmarkRecipe(recipeData._id)}
                  />
                ) : (
                  <FontAwesomeIcon
                    icon={faBookmarkEmpty}
                    className="icon__bookmarkEmpty"
                    onClick={() => BookmarkRecipe(recipeData._id)}
                  />
                )}
              </div>
            </div>
            <div className="recipe__ingredients">
              <h2>Ingredients</h2>
              <ul>
                {recipeData.ingredients.map((ingredient) => {
                  return (
                    <li key={recipeData.ingredients.indexOf(ingredient)}>
                      {ingredient}
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="recipe__instructions">
              <h2>Instructions</h2>
              <ol>
                {recipeData.instructions.map((instruction) => {
                  return (
                    <li key={recipeData.instructions.indexOf(instruction)}>
                      {instruction}
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>

          <div className="recipe__comments">
            <div className="recipe__comments__header">
              <div className="recipe__comments__header__text">
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>
              <div className="recipe__comments__header__button">
                <button
                  onClick={() => AddUpdateComment(recipeId, commentId, comment)}
                >
                  {edit ? "Update" : "Send"}
                </button>
              </div>
            </div>
            <div className="recipe__comments__body">
              {recipeData.comments.map((comment) => {
                const date = DateFormat(comment.date);
                return (
                  <div className="recipe__comment">
                    <div className="recipe__comment__userimage">
                      <img src={comment.postedBy.image} alt="dd" />
                      <p>{`${date.date} ${date.month.short} ${date.year}`}</p>
                    </div>
                    <div className="recipe__comment__description">
                      <div className="recipe__comment__top">
                        <div className="recipe__comment__top__details">
                          <p>{`${comment.postedBy.firstName} ${comment.postedBy.lastName}`}</p>
                        </div>
                        <div className="recipe__comment__top__buttons">
                          {state._id === comment.postedBy._id && (
                            <>
                              <div className="recipe__comment__top__button__delete">
                                <button
                                  onClick={() =>
                                    DeleteComment(recipeId, comment._id)
                                  }
                                >
                                  <FontAwesomeIcon
                                    icon={faTrash}
                                    className="icon__trash"
                                  />
                                  <p> Delete</p>
                                </button>
                              </div>
                              <div className="recipe__comment__top__button__edit">
                                <button
                                  onClick={() => {
                                    setEdit(true);
                                    setComment(comment.text);
                                    setCommentId(comment._id);
                                  }}
                                >
                                  <FontAwesomeIcon
                                    icon={faEdit}
                                    className="icon__edit"
                                  />
                                  <p>Edit</p>
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="recipe__comment__bottom">
                        <p>{comment.text}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="recipe__spacing"></div>
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
}

export default Recipe;
