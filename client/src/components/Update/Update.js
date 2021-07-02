import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudUploadAlt, faUpload } from "@fortawesome/free-solid-svg-icons";
import Loading from "../Loading/Loading";
import "./Update.scss";

import Modal from "../Modal/Modal";

import { ToastContainer, toast } from "react-toastify";
import { ToastProperties } from "../../Toast";
import "react-toastify/dist/ReactToastify.css";

function Update() {
  const history = useHistory();
  const { recipeId } = useParams();

  const [updateData, setUpdateData] = useState(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [preview, setPreview] = useState("");
  const [imageurl, setImageUrl] = useState("");
  const [imgchange, setImgChange] = useState(false);

  const [ingredients, setIngredients] = useState("");
  const [ingredientsarray, setIngredientsArray] = useState([]);
  const [instructions, setInstructions] = useState("");
  const [instructionsarray, setInstructionsArray] = useState([]);

  const [display, setDisplay] = useState("none");
  //Get Recipe
  useEffect(() => {
    fetch(`/recipe/${recipeId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.error) {
          history.push("/feed");
        } else {
          console.log(result);
          setUpdateData(result);
          setPreview(result.photo);
        }
      })
      .catch((error) => {
        console.log(error);
      });
    console.log(imgchange);
  }, []);

  //Update Recipe : EFFECT
  useEffect(() => {
    if (updateData) {
      setTitle(updateData.title);
      setDescription(updateData.description);
      setIngredients(updateData.ingredients.join("\n"));
      setInstructions(updateData.instructions.join("\n"));
    }
  }, [updateData]);

  useEffect(() => {
    if (imageurl) {
      UpdateRecipe();
    }
  }, [imageurl]);

  const UpdateRecipe = () => {
    if (imageurl === "") {
      setImageUrl(updateData.photo);
    }

    fetch(`/update/${recipeId}`, {
      method: "put",
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
        history.push(`/recipe/${recipeId}`);
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

  const Test = () => {
    setIngredientsArray(ingredients.split("\n"));
    setInstructionsArray(instructions.split("\n"));
    console.log(title);
    console.log(description);
    console.log(ingredientsarray);
    console.log(instructionsarray);
    console.log(imageurl);
  };

  return (
    <>
      {updateData ? (
        <div className="update">
          <form className="update__container">
            <div className="update__topic">
              <h2>UPDATE RECIPE</h2>
            </div>
            <div className="update__title">
              <p className="update__heading">Title</p>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="update__description">
              <p className="update__heading">Description</p>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="update__ingredients">
              <p className="update__heading">Ingredients</p>
              <textarea
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
              ></textarea>
            </div>
            <div className="update__instructions">
              <p className="update__heading">Instructions</p>
              <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
              ></textarea>
            </div>
            <div className="update__upload">
              <div className="update__upload__button">
                <label htmlFor="updatefile">Choose Image</label>
              </div>
              <div className="update__upload__text">
                <input
                  type="file"
                  id="updatefile"
                  accept="image/*"
                  onChange={(e) => {
                    setImage(e.target.files[0]);
                    setImgChange(true);
                  }}
                />
                <input type="text" value={image.name} readOnly />
              </div>
            </div>
            <div className="update__image">
              <img src={preview} alt="Recipe Image" />
            </div>

            <div className="update__buttons">
              <div className="update__button__cancel">
                <button
                  onClick={() => {
                    history.push(`/recipe/${recipeId}`);
                  }}
                >
                  Cancel
                </button>
              </div>
              <div className="update__button__update">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setIngredientsArray(ingredients.split("\n"));
                    setInstructionsArray(instructions.split("\n"));

                    //Test();
                    if (imgchange) {
                      //Checking Empty Fields
                      if (
                        !title ||
                        !description ||
                        !image ||
                        !ingredients ||
                        !instructions
                      ) {
                        return toast.error(
                          "Please enter all the fields!",
                          ToastProperties
                        );
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
                      UploadImage();
                    } else {
                      if (imageurl === "") {
                        //Checking Empty Fields
                        if (
                          !title ||
                          !description ||
                          !ingredients ||
                          !instructions
                        ) {
                          return toast.error(
                            "Please enter all the fields!",
                            ToastProperties
                          );
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
                        setImageUrl(updateData.photo);
                      }
                    }
                  }}
                >
                  Update
                </button>
              </div>
            </div>
          </form>

          <Modal display={display} message="Your recipe is been Updated!" />
          <ToastContainer />
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
}
export default Update;
