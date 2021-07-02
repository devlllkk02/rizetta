import React from "react";
import "./Modal.scss";
import RizettaSVG from "./Rizetta__Loading__ANIMATED.svg";
function Modal({display,message}) {

  return (
    <div className="modal" style={{display:display}}>
      <div className="modal__container">
        <div className="modal__logo">
          <object
            className="loading__svg"
            data={RizettaSVG}
            type="image/svg+xml"
          ></object>
        </div>
        <div className="modal__pleasewait"><p>Plelase Wait...</p></div>
      <div className="modal__message"><p>{message}</p></div>
      </div>
    </div>
  );
}

export default Modal;
