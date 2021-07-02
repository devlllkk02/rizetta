import React, { useState, useEffect } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import RizettaLOGO from "./Rizetta_LOGO.png";
import "./NewPassword.scss";

import { ToastContainer, toast } from "react-toastify";
import { ToastProperties } from "../../../Toast";
import "react-toastify/dist/ReactToastify.css";

function NewPassword() {
  const { token } = useParams();
  const history = useHistory();
  console.log(token);
  const [password, setPassword] = useState("");
  const [conpassword, setConPassword] = useState("");

  const PostNewPassword = (e) => {
    e.preventDefault();
    fetch("/newpassword", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        password: password,
        conpassword: conpassword,
        token: token,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.error);
        if (data.error) {
          toast.error(data.error, ToastProperties);
        } else {
          toast.success(data.message, ToastProperties);
          history.push("/login");
        }
      })
      .catch((error) => console.log(error));
  };
  return (
    <div className="newPassword">
      <div className="newPassword__container">
        <form className="newPassword__form">
          <div className="newPassword__form__header">
            <Link to="/" style={{ outline: "none" }}>
              <img
                className="newPassword__form__header__image"
                src={RizettaLOGO}
              />
            </Link>
          </div>
          <div className="newPassword__form__body">
            <div className="newPassword__body__item newPassword__email">
              <input
                type="password"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="newPassword__body__item newPassword__email">
              <input
                type="password"
                placeholder="Confirm New Password"
                value={conpassword}
                onChange={(e) => setConPassword(e.target.value)}
              />
            </div>
          </div>
          <div className="newPassword__button">
            {/* <button onClick={(e) => PostLogin(e)}>Log In</button> */}
            <button onClick={(e) => PostNewPassword(e)}>Save Password</button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

export default NewPassword;
