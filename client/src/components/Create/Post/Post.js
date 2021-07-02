import React from "react";
import "./Post.scss";

function Post() {
  return (
    <div className="post">
      <div className="rectangle">
        <h1 className="texts">CREATE RECIPE</h1>
        <div className="editform">
          <form>
            <h3 className="titles">Title</h3>
            <textarea cols="20" rows="2" className="msg-box"></textarea>
            <h3 className="titles">Description</h3>
            <textarea cols="20" rows="5" className="msg-box"></textarea>
            <h3 className="titles">Ingredients</h3>
            <textarea cols="20" rows="8" className="msg-box"></textarea>
            <h3 className="titles">Instructions</h3>
            <textarea cols="20" rows="8" className="msg-box"></textarea>
          </form>
        </div>
        <div className="BtnGrp">
          <button class="CancelBtn">Cancel</button>
          <br />
          <br />
          <button class="Savebtn">Save</button>
          <br />
          <br />
        </div>
      </div>
    </div>
  );
}

export default Post;
