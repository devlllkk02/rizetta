import React, { useState, useEffect, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { UserContext } from "../../../App";
import Loading from "../../Loading/Loading";
import "./Edit.scss";
import Image from "./Profile.png";

import { ToastContainer, toast } from "react-toastify";
import { ToastProperties } from "../../../Toast";

function Edit() {
  const history = useHistory();
  const { state, dispatch } = useContext(UserContext);
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [bio, setBio] = useState();

  const [editData, setEditData] = useState(null);
  const [image, setImage] = useState("");
  const [preview, setPreview] = useState("");
  const [imageurl, setImageUrl] = useState("");
  const [imgchange, setImgChange] = useState(false);

  const [email, setEmail] = useState();
  const GetAUSer = () => {
    fetch("/editprofile", {
      method: "get",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setEditData(result);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    GetAUSer();
  }, []);

  //Getting User and Setting the field
  useEffect(() => {
    if (editData) {
      setFirstName(editData.firstName);
      setLastName(editData.lastName);
      setBio(editData.bio);
      setPreview(editData.image);
      console.log("USER", state);
    }
  }, [editData]);

  //Set Preview
  useEffect(() => {
    if (image) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // console.log(image);
        setPreview(reader.result);
      };

      reader.readAsDataURL(image);
    } else {
    }
  }, [image]);

  const UpdateUser = () => {
    if (imageurl === "") {
      setImageUrl(editData.image);
    }

    fetch("/updateprofile", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
      body: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
        bio: bio,
        image: imageurl,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("success");
        console.log(data);
        // history.push(`/recipe/${recipeId}`);
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...state,
            firstName: firstName,
            lastName: lastName,
            bio: bio,
            image: imageurl,
          })
        );

        dispatch({
          type: "UPDATE_USER",
          payload: {
            firstName: firstName,
            lastName: lastName,
            bio: bio,
            image: imageurl,
          },
        });

        console.log("user", state);
        history.push("/profile");
        window.location.reload();
      })
      .catch((error) => console.log(error));
  };

  const UploadImage = () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "rizetta-bucket");
    data.append("cloud_name", "rizetta-cloud");

    fetch("https://api.cloudinary.com/v1_1/rizetta-cloud/image/upload", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        setImageUrl(data.url);
        console.log("image posted");
      })
      .catch((error) => console.log(error));
  };

  const DeleteUser = () => {
    fetch("/deleteuser", {
      method: "put",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        if(result.error){
          toast.error(result.error, ToastProperties);
          console.log(result.error);
        }else{
          localStorage.clear();
          dispatch({ type: "CLEAR" });
          history.push("/signup");
          console.log(result)
        }
      

      })
      .catch((error) => console.log(error));
  };
  useEffect(() => {
    if (imageurl) {
      UpdateUser();
    }
  }, [imageurl]);

  const Test = () => {
    console.log(firstName);
    console.log(lastName);
    console.log(bio);
  };
  return (
    <>
      {editData ? (
        <div className="edit">
          <div className="edit__container">
            <div className="edit__userimage">
              <img src={preview} />
            </div>
            <div className="edit__upload">
              <div className="edit__upload__button">
                <label htmlFor="editfile">Choose Image</label>
              </div>
              <div className="edit__upload__text">
                <input
                  type="file"
                  id="editfile"
                  accept="image/*"
                  onChange={(e) => {
                    setImage(e.target.files[0]);
                    setImgChange(true);
                  }}
                />
                <input type="text" value={image.name} readOnly />
              </div>
            </div>
            <div className="edit__username">
              <div className="edit__firstname">
                <input
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="edit__lastname">
                <input
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>
            <div className="edit__bio">
              <textarea
                placeholder="Bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              ></textarea>
            </div>

            <div className="edit__buttons">
              <div className="edit__button__cancel">
                <button>Cancel</button>
              </div>
              <div className="edit__button__update">
                <button
                  onClick={() => {
                    if (imgchange) {
                      UploadImage();
                    } else {
                      if (imageurl === "") {
                        setImageUrl(editData.image);
                      }
                    }
                  }}
                >
                  Update
                </button>
              </div>
            </div>
            <div className="edit__delete">
              <div className="edit__delete__text">
                <p>
                  If you wish to Delete Your Account, Please Enter Your Email
                  Address in the Textbox Below?{" "}
                </p>
              </div>
              <div className="edit__delete__box">
                <input
                  type="text"
                  placeholder="Enter Your Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="edit__delete__button">
                <button onClick={() => DeleteUser()}>Delete My Account</button>
              </div>
            </div>
          </div>
          <ToastContainer />
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
}

export default Edit;
