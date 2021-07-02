import React, { useState, useEffect, useContext } from "react";
import "./Followers.scss";
import { UserContext } from "../../../App";
import { Link, useParams } from "react-router-dom";
import Image from "./Profile.png";
import Loading from "../../Loading/Loading";

function Followers() {
  const { state, dispatch } = useContext(UserContext);
  const { userId } = useParams();
  // console.log(userId);
  const [followersData, setFollowersData] = useState();

  const GetFollowers = () => {
    fetch(`/visitor/${userId}`, {
      method: "get",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setFollowersData(result);
      })
      .catch((error) => console.log(error));
  };
  const RemoveFollow = (followId) => {
    fetch("/removefollow", {
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
        GetFollowers();
      })
      .catch((error) => console.log(error));
  };
  useEffect(() => {
    GetFollowers();
  }, []);

  return (
    <>
      {followersData ? (
        <div className="followers">
          <div className="followers__container">
            <div className="followers__userimage">
              <img src={followersData.user.image} />
            </div>
            <div className="followers__username">
              <p>{`${followersData.user.firstName} ${followersData.user.lastName}`}</p>
            </div>
            <div className="followers__nav">
              <div className="followers__nav__left">
                <Link
                  to={`/profile/followers/${userId}`}
                  style={{ textDecoration: "none" }}
                >
                  <p>{`${followersData.user.followers.length} Followers`}</p>
                </Link>
              </div>
              <div className="followers__nav__right">
                <Link
                  to={`/profile/following/${userId}`}
                  style={{ textDecoration: "none" }}
                >
                  <p>{`${followersData.user.following.length} Following`}</p>
                </Link>
              </div>
            </div>
            <div className="followers__border">
              <div className="followers__border__left"></div>
              <div className="followers__border__right"></div>
            </div>

            <div className="followers__list">
              {followersData.user.followers.map((follower) => {
                return (
                  <div className="followers__item">
                    <div className="followers__item__image">
                      <Link
                        to={
                          state._id == follower._id
                            ? "/profile"
                            : `/profile/${follower._id}`
                        }
                        style={{ textDecoration: "none" }}
                      >
                        <img src={follower.image} alt="" />
                      </Link>
                    </div>
                    <div className="followers__item__name">
                      <Link
                        to={
                          state._id == follower._id
                            ? "/profile"
                            : `/profile/${follower._id}`
                        }
                        style={{ textDecoration: "none" }}
                      >
                        <p>{`${follower.firstName} ${follower.lastName}`}</p>
                      </Link>
                    </div>
                    <div className="followers__item__button">
                      {state._id === followersData.user._id && (
                        <button
                          onClick={() => {
                            // console.log(follower._id)
                            RemoveFollow(follower._id);
                          }}
                        >
                          Remove
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

export default Followers;
