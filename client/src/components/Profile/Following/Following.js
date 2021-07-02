import React, { useState, useEffect, useContext } from "react";
import "./Following.scss";
import { UserContext } from "../../../App";
import { Link, useParams } from "react-router-dom";
import Image from "./Profile.png";
import Loading from "../../Loading/Loading";

function Following() {
  const { state, dispatch } = useContext(UserContext);
  const { userId } = useParams();
  // console.log(userId);
  const [followingData, setFollowingData] = useState();

  const GetFollowing = () => {
    fetch(`/visitor/${userId}`, {
      method: "get",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setFollowingData(result);
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
        GetFollowing();
      })
      .catch((error) => console.log(error));
  };
  useEffect(() => {
    GetFollowing();
  }, []);

  return (
    <>
      {followingData ? (
        <div className="following">
          <div className="following__container">
            <div className="following__userimage">
              <img src={followingData.user.image} />
            </div>
            <div className="following__username">
              <p>{`${followingData.user.firstName} ${followingData.user.lastName}`}</p>
            </div>
            <div className="following__nav">
              <div className="following__nav__left">
                <Link
                  to={`/profile/followers/${userId}`}
                  style={{ textDecoration: "none" }}
                >
                  <p>{`${followingData.user.followers.length} Followers`}</p>
                </Link>
              </div>
              <div className="following__nav__right">
                <Link
                  to={`/profile/following/${userId}`}
                  style={{ textDecoration: "none" }}
                >
                  <p>{`${followingData.user.following.length} Following`}</p>
                </Link>
              </div>
            </div>
            <div className="following__border">
              <div className="following__border__left"></div>
              <div className="following__border__right"></div>
            </div>

            <div className="following__list">
              {followingData.user.following.map((following) => {
                return (
                  <div className="following__item">
                    <div className="following__item__image">
                      <Link
                        to={
                          state._id == following._id
                            ? "/profile"
                            : `/profile/${following._id}`
                        }
                        style={{ textDecoration: "none" }}
                      >
                        <img src={following.image} alt="" />
                      </Link>
                    </div>
                    <div className="following__item__name">
                      <Link
                        to={
                          state._id == following._id
                            ? "/profile"
                            : `/profile/${following._id}`
                        }
                        style={{ textDecoration: "none" }}
                      >
                        <p>{`${following.firstName} ${following.lastName}`}</p>
                      </Link>
                    </div>
                    <div className="following__item__button">
                      {state._id === followingData.user._id && (
                        <button
                          onClick={() => {
                            UnFollow(following._id);
                          }}
                        >
                          Unfollow
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
}

export default Following;
