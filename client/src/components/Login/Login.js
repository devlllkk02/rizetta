import "./Login.scss";

import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../App";
import { Link, useHistory } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import { ToastProperties } from "../../Toast";
import "react-toastify/dist/ReactToastify.css";

function Login() {
  const history = useHistory();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { state, dispatch } = useContext(UserContext);

  const PostLogin = (e) => {
    e.preventDefault();
    fetch("/login", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.error) {
          toast.error(data.error, ToastProperties);
        } else {
          toast.success(data.message, ToastProperties);
          localStorage.setItem("jwt", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          dispatch({ type: "USER", payload: data.user });

          history.push("/feed");
        }
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className="login">
      <div className="login__container">
        <form className="login__form">
          <div className="login__form__header">
            <Link to="/" style={{ outline: "none" }}>
              <img
                className="login__form__header__image"
                src="./Images/Rizetta_LOGO.png"
              />
            </Link>
          </div>
          <div className="login__form__body">
            <div className="login__body__item login__name">
              {/* <div className="login__name__first">
                <input type="text" placeholder="First Name" />
              </div>
              <div className="login__name__last">
                <input type="text" placeholder="Last Name" />
              </div> */}
            </div>
            <div className="login__body__item login__email">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="login__body__item login__password">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="login__body__item login__conpassword">
              {/* <input type="password" placeholder="Confirm Password" /> */}
            </div>
            <div className="login__body__item login__upload">
              {/* <div className="login__upload__button">
                <label htmlFor="loginfile">Choose Image</label>
              </div>
              <div className="login__upload__text">
                <input
                  type="file"
                  id="loginfile"
                  onChange={(e) => {
                    setFiles(e.target.files[0]);
                  }}
                />
                <input type="text" value={files.name} readOnly />
              </div> */}
            </div>
          </div>
          <div className="login__button">
            <button onClick={(e) => PostLogin(e)}>Log In</button>
          </div>
          <div className="login__links">
            <Link style={{ textDecoration: "none" }} to="/resetpassword">
              <p style={{ fontSize: "12px", marginBottom: "5px" }}>
                Forgot Your Password?
              </p>
            </Link>
            <p>Don’t Have an Account?</p>
            <Link to="/signup" className="login__link">
              Sign Up
            </Link>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Login;
