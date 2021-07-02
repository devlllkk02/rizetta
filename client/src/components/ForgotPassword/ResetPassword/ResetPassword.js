import React, { useState, useEffect } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import "./ResetPassword.scss";

import { ToastContainer, toast } from "react-toastify";
import { ToastProperties } from "../../../Toast";
import "react-toastify/dist/ReactToastify.css";

function ResetPassword() {
  const history = useHistory();
  const [email, setEmail] = useState("");

  const PostResetPassword = (e) => {
    e.preventDefault();
    fetch("/resetpassword", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.error);
        if (data.error) {
          toast.error(data.error, ToastProperties);
        } else {
          toast.success(data.message, ToastProperties);
          // history.push("/login");
        }
      })
      .catch((error) => console.log(error));
  };
  return (
    <div className="resetPassword">
      <div className="resetPassword__container">
        <form className="resetPassword__form">
          <div className="resetPassword__form__header">
            <Link to="/" style={{ outline: "none" }}>
              <img
                className="resetPassword__form__header__image"
                src="./Images/Rizetta_LOGO.png"
              />
            </Link>
          </div>
          <div className="resetPassword__form__body">
            <div className="resetPassword__body__item resetPassword__email">
              <input
                type="email"
                placeholder="Enter Your Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div className="resetPassword__button">
            <button onClick={(e) => PostResetPassword(e)}>
              Reset Password
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

export default ResetPassword;
