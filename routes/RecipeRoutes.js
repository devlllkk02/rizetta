const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Recipe = mongoose.model("Recipe");
const User = mongoose.model("User");

const Auth = require("../middleware/Auth");

//? ------ GET ROUTES ------

//ROUTE : GET : All Recipes
router.get("/allrecipes", Auth, (req, res) => {
  Recipe.find()
    .populate("postedBy")
    .populate("ratings.postedBy", "_id")
    .sort({ createdAt: -1 })
    .then((savedRecipes) => res.json({ savedRecipes }))
    .catch((error) => console.log(error));
});

//ROUTE : GET : One Recipe
router.get("/recipe/:recipeId", Auth, (req, res) => {
  Recipe.findOne({ _id: req.params.recipeId })
    .populate("postedBy")
    .populate("ratings.postedBy")
    .populate("comments.postedBy")
    .sort({ "comments.createdAt": 1 })
    .then((recipe) => {
      res.send(recipe);
    })
    .catch((error) => {
      console.log(error);
      return res.status(422).json({ error: "Invalid Recipe Id!" });
    });
});

//ROUTE : GET : My Recipes
router.get("/myrecipes", Auth, (req, res) => {
  User.findById(req.user._id)
    .then((user) => {
      Recipe.find({ postedBy: req.user._id })
        .populate("postedBy")
        .populate("ratings.postedBy", "_id")
        .sort({ createdAt: -1 })
        .then((myrecipes) => res.json({ user: user, myrecipes: myrecipes }))
        .catch((error) => console.log(error));
    })
    .catch((error) => console.log(error));
});

//ROUTE : GET : My Bookmarks
router.get("/bookmark", Auth, (req, res) => {
  Recipe.find({ bookmark: { $in: req.user._id } })
    .populate("postedBy")
    .populate("ratings.postedBy", "_id")
    .sort({ createdAt: -1 })
    .then((savedRecipes) => res.json({ savedRecipes }))
    .catch((error) => console.log(error));
});

//? ------ POST ROUTES ------

//ROUTE : POST : A Recipe
router.post("/createrecipe", Auth, (req, res) => {
  const { title, description, photo, ingredients, instructions } = req.body;

  //Checking Empty Fields
  if (!title || !description || !photo || !ingredients || !instructions) {
    return res.status(422).json({ error: "Please enter all the fields!" });
  }

  const recipe = new Recipe({
    title: title,
    description: description,
    photo: photo,
    ingredients: ingredients,
    instructions: instructions,
    postedBy: req.user,
  });

  recipe
    .save()
    .then((savedRecipe) =>
      res.json({ message: "Recipe created successfully!", recipe: savedRecipe })
    )
    .catch((error) => console.log(error));
});

//ROUTE : POST : Search Recipes
router.post("/seffarchrecipes", Auth, (req, res) => {
  let RecipePattern = new RegExp(`^${req.body.recipeQuery}`);

  Recipe.find({ title: req.body.recipeQuery })
    .populate("postedBy")
    .populate("ratings.postedBy", "_id")
    .then((recipe) => {
      res.send(recipe);
    })
    .catch((error) => console.log(error));
});

//? ------ UPDATE ROUTES ------

//ROUTE : Update : A Recipe
router.put("/update/:recipeId", Auth, (req, res) => {
  Recipe.findByIdAndUpdate(req.params.recipeId, req.body, {
    new: true,
  }).exec((error, result) => {
    if (error) {
      return res.status(422).json({ error: error });
    } else {
      res.send(result);
    }
  });
});

//ROUTE : UPDATE : Heart A Recipe
router.put("/heart", Auth, (req, res) => {
  Recipe.findByIdAndUpdate(
    req.body.recipeId,
    { $push: { hearts: req.user._id } },
    { new: true }
  )
    .populate("postedBy")
    .exec((error, result) => {
      if (error) {
        return res.status(422).json({ error: error });
      } else {
        res.send(result);
      }
    });
});
//ROUTE : UPDATE : Un Heart A Recipe
router.put("/unheart", Auth, (req, res) => {
  Recipe.findByIdAndUpdate(
    req.body.recipeId,
    { $pull: { hearts: req.user._id } },
    { new: true }
  )
    .populate("postedBy")
    .exec((error, result) => {
      if (error) {
        return res.status(422).json({ error: error });
      } else {
        res.send(result);
      }
    });
});
//ROUTE : UPDATE : UnRate A Recipe
router.put("/unrate", Auth, (req, res) => {
  Recipe.findByIdAndUpdate(
    req.body.recipeId,
    {
      $pull: { ratings: { postedBy: req.user } },
      // $push: { ratings: { score: req.body.score, postedBy: req.user } },
    },
    { new: true }
  )
    .populate("postedBy")
    .exec((error, result) => {
      if (error) {
        return res.status(422).json({ error: error });
      } else {
        res.send(result);
      }
    });
});
//ROUTE : UPDATE : Rate A Recipe
router.put("/rate", Auth, (req, res) => {
  Recipe.findByIdAndUpdate(
    req.body.recipeId,
    {
      // $pull: { ratings: { postedBy: req.user } },
      $push: { ratings: { score: req.body.score, postedBy: req.user } },
    },
    { new: true }
  )
    .populate("postedBy")
    .exec((error, result) => {
      if (error) {
        return res.status(422).json({ error: error });
      } else {
        res.send(result);
      }
    });
});
//ROUTE : UPDATE : Bookmark A Recipe
router.put("/bookmark", Auth, (req, res) => {
  Recipe.findByIdAndUpdate(
    req.body.recipeId,
    { $addToSet: { bookmark: req.user._id } },
    { new: true }
  ).exec((error, result) => {
    if (error) {
      return res.send(404).json({ error: error });
    } else {
      res.send(result);
    }
  });
});
//ROUTE : UPDATE : UnBookmark A Recipe
router.put("/unbookmark", Auth, (req, res) => {
  Recipe.findByIdAndUpdate(
    req.body.recipeId,
    { $pull: { bookmark: req.user._id } },
    { new: true }
  ).exec((error, result) => {
    if (error) {
      return res.send(404).json({ error: error });
    } else {
      res.send(result);
    }
  });
});

//ROUTE : UPDATE : Add a Comment
router.put("/addcomment", Auth, (req, res) => {
  Recipe.findByIdAndUpdate(
    req.body.recipeId,
    {
      $push: { comments: { text: req.body.text, postedBy: req.user } },
    },
    { new: true }
  ).exec((error, result) => {
    if (error) {
      return res.send(404).json({ error: error });
    } else {
      res.send(result);
    }
  });
});

//ROUTE : UPDATE : Update a Comment
router.put("/updatecomment", Auth, (req, res) => {
  Recipe.findOneAndUpdate(
    { "comments._id": req.body.commentId },
    { $set: { "comments.$.text": req.body.text } },
    { new: true }
  ).exec((error, result) => {
    if (error) {
      return res.send(404).json({ error: error });
    } else {
      res.send(result);
    }
  });
});

//ROUTE : UPDATE : Remove a Comment
router.put("/deletecomment", Auth, (req, res) => {
  Recipe.findByIdAndUpdate(
    req.body.recipeId,
    {
      $pull: { comments: { _id: req.body.commentId } },
    },
    { new: true }
  ).exec((error, result) => {
    if (error) {
      return res.send(404).json({ error: error });
    } else {
      res.send(result);
    }
  });
});
//? ------ DELETE ROUTES ------

//ROUTE : Delete : A Recipe
router.delete("/deleterecipe/:recipeId", Auth, (req, res) => {
  Recipe.findOne({ _id: req.params.recipeId }).exec((error, recipe) => {
    if (error || !recipe) {
      return res.status(422).json({ error: error });
    }
    // res.send(recipe);
    if (recipe.postedBy._id.toString() === req.user._id.toString()) {
      recipe
        .remove()
        .then((result) => {
          res.json({ message: "Recipe deleted successfully!", result: result });
        })
        .catch((error) => console.log(error));
    }
  });
});

module.exports = router;
