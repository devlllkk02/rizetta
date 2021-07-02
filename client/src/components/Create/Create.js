import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudUploadAlt, faUpload } from "@fortawesome/free-solid-svg-icons";
import "./Create.scss";
import Modal from "../Modal/Modal";

import { ToastContainer, toast } from "react-toastify";
import { ToastProperties } from "../../Toast";
import "react-toastify/dist/ReactToastify.css";

function Create() {
  const history = useHistory();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [preview, setPreview] = useState("");
  const [imageurl, setImageUrl] = useState("");

  const [ingredients, setIngredients] = useState("");
  const [ingredientsarray, setIngredientsArray] = useState([]);
  const [instructions, setInstructions] = useState("");
  const [instructionsarray, setInstructionsArray] = useState([]);

  const [display, setDisplay] = useState("none");

  useEffect(() => {
    if (imageurl) {
      fetch("/createrecipe", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
        body: JSON.stringify({
          title: title,
          description: description,
          photo: imageurl,
          ingredients: ingredientsarray,
          instructions: instructionsarray,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("success");
          history.push("/feed");
        })
        .catch((error) => console.log(error));
    }
  }, [imageurl]);

  const UploadImage = (e) => {
    e.preventDefault();

    //Checking Empty Fields
    if (!title || !description || !image || !ingredients || !instructions) {
      return toast.error("Please enter all the fields!", ToastProperties);
    }
    //Checking Title Lenght
    if (title.length > 50) {
      return toast.error(
        "Error!, The title should be less than 50 characters in length",
        ToastProperties
      );
    }
    //Checking Description Lenght
    if (description.length > 100) {
      return toast.error(
        "Error!, The description should be less than 100 characters in length",
        ToastProperties
      );
    }

    setDisplay("flex");
    setIngredientsArray(ingredients.split("\n"));
    setInstructionsArray(instructions.split("\n"));
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

  const Test = (e) => {
    e.preventDefault();
    setIngredientsArray(ingredients.split("\n"));
    setInstructionsArray(instructions.split("\n"));
    // console.log(title);
    // console.log(description);
    // console.log(ingredientsarray);
    // console.log(instructionsarray);
  };

  useEffect(() => {
    console.log(title);
    console.log(description);
    console.log(ingredientsarray);
    console.log(instructionsarray);
  }, [ingredientsarray, instructionsarray]);

  return (
    <div className="create">
      <form className="create__container">
        <div className="create__topic">
          <h2>CREATE RECIPE</h2>
        </div>
        <div className="create__title">
          <p className="create__heading">Title</p>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="create__description">
          <p className="create__heading">Description</p>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="create__ingredients">
          <p className="create__heading">Ingredients</p>
          <textarea
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
          ></textarea>
        </div>
        <div className="create__instructions">
          <p className="create__heading">Instructions</p>
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
          ></textarea>
        </div>
        <div className="create__upload">
          <div className="create__upload__button">
            <label htmlFor="createfile">Choose Image</label>
          </div>
          <div className="create__upload__text">
            <input
              type="file"
              id="createfile"
              accept="image/*"
              onChange={(e) => {
                setImage(e.target.files[0]);
              }}
            />
            <input type="text" value={image.name} readOnly />
          </div>
        </div>
        <div className="create__image">
          {preview ? (
            <img src={preview} alt="cc" />
          ) : (
            <div className="create__image__null">
              <div className="create__image__null__image">
                <FontAwesomeIcon
                  className="create__image__null__image__icon"
                  icon={faCloudUploadAlt}
                />
              </div>
              <p>Upload Image...</p>
            </div>
          )}
        </div>

        <div className="create__buttons">
          <div className="create__button__cancel">
            <button
              onClick={() => {
                history.push("/feed");
              }}
            >
              Cancel
            </button>
          </div>
          <div className="create__button__create">
            <button onClick={(e) => UploadImage(e)}>Create</button>
          </div>
        </div>
      </form>
      <Modal display={display} message="Your recipe is been Created!" />
      <ToastContainer />
    </div>
  );
}

export default Create;
