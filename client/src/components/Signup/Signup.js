import "./Signup.scss";

import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import { ToastProperties } from "../../Toast";
import "react-toastify/dist/ReactToastify.css";

function Signup() {
  const history = useHistory();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [conpassword, setConPassword] = useState("");
  const [image, setImage] = useState("");
  const [imageurl, setImageUrl] = useState("");

  const [disabled, setDisabled] = useState(false);
  const [mouse, setMouse] = useState(false);
  useEffect(() => {
    if (imageurl) {
      fetch("/signup", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: password,
          conpassword: conpassword,
          image: imageurl,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            toast.error(data.error, ToastProperties);
          } else {
            toast.success(data.message, ToastProperties);
            setDisabled(false);
            history.push("/login");
          }
        })
        .catch((error) => console.log(error));
    }
  }, [imageurl]);

  const ErrorHandling = () => {
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !conpassword ||
      !image
    ) {
      setDisabled(false);
      return toast.error("Please enter all the fields!", ToastProperties);
    }

    //Checking the email format
    if (
      !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
        email
      )
    ) {
      setDisabled(false);
      return toast.error("Invalid Email", ToastProperties);
    }

    //Password Mismatch
    if (password != conpassword) {
      setDisabled(false);
      return toast.error("Passwords Missmatch!", ToastProperties);
    } else {
      UploadImage();
    }
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
      })
      .catch((error) => console.log(error));
  };

  const PostSignup = (e) => {
    setDisabled(true);
    e.preventDefault();
    ErrorHandling();
  };

  const ButtonStyles = () => {
    if (disabled) {
      if (mouse) {
        return {
          backgroundColor: "rgba(74,74,74,0.7)",
          color: "#ffffff",
          borderColor: "transparent",
          cursor: "progress",
        };
      } else {
        return {
          backgroundColor: "rgba(74,74,74,0.7)",
          borderColor: "transparent",
        };
      }
    } else {
      if (mouse) {
        return { backgroundColor: "transparent", borderColor: "#4b9b96" };
      } else {
        return { backgroundColor: "#4b9b96", borderColor: "#4b9b96" };
      }
    }
  };
  return (
    <div className="signup">
      <div className="signup__container">
        <form className="signup__form">
          <div className="signup__form__header">
            <Link to="/" style={{ outline: "none" }}>
              <img
                className="sigup__form__header__image"
                src="./Images/Rizetta_LOGO.png"
              />
            </Link>
          </div>
          <div className="signup__form__body">
            <div className="signup__body__item signup__name">
              <div className="signup__name__first">
                <input
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="signup__name__last">
                <input
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>
            <div className="signup__body__item signup__email">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="signup__body__item signup__password">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="signup__body__item signup__conpassword">
              <input
                type="password"
                placeholder="Confirm Password"
                value={conpassword}
                onChange={(e) => setConPassword(e.target.value)}
              />
            </div>
            <div className="signup__body__item signup__upload">
              <div className="signup__upload__button">
                <label htmlFor="signupfile">Choose Image</label>
              </div>
              <div className="signup__upload__text">
                <input
                  type="file"
                  id="signupfile"
                  accept="image/*"
                  onChange={(e) => {
                    setImage(e.target.files[0]);
                  }}
                />
                <input type="text" value={image.name} readOnly />
              </div>
            </div>
          </div>
          <div className="signup__button">
            <button
              onClick={(e) => PostSignup(e)}
              disabled={disabled}
              onMouseOver={() => setMouse(true)}
              onMouseLeave={() => setMouse(false)}
              style={ButtonStyles()}
            >
              Sign Up
            </button>
          </div>
          <div className="signup__links">
            <p>Already Have an Account ?</p>
            <Link to="/login" className="signup__link">
              Log In
            </Link>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Signup;
