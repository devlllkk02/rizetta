import React from "react";

//importing stylesheet
import "./Body.scss";

function Body() {
  return (
    <div className="text">
      <div className="text__heading">
        <h1>Caramel Apple Pie</h1>
        <p>Delicious Caramel Apple Pie to Enjoy with your friends and family</p>
      </div>
      <div className="text__image">
        <img src="./Images/defaultFood.jpg" />
      </div>
      <div className="text__icon"></div>
      <div className="text__ingre">
        <h2>Ingredients</h2>
        <ul>
          <li>½ cup milk</li>
          <li>¼ cup granulated sugar</li>
          <li>1 (¼ ounce) packet Platinum Yeast From Red Star</li>
          <li>4 tablespoons butter, cubed and softened</li>
          <li>1 egg, room temperature</li>
          <li>¼ teaspoon kosher salt</li>
          <li>2 cups all purpose flour</li>
        </ul>
      </div>
      <div className="text__instruc">
        <h2>Instructions</h2>
        <ol>
          <li>
            In a microwave safe bowl, heat the milk in 30 second intervals in
            the microwave to between 90- 105°F. Once heated, pour into the bowl
            of a stand mixer, followed by the sugar and yeast. Whisk to combine
            and let sit for 5-10 minutes, or until the yeast has become foamy
            and bubbly.{" "}
          </li>
          <li>
            Fit the stand mixer with the dough hook attachment and turn on low.
            Slowly add the softened butter and mix until the butter begins to
            lightly break up. Then, add the egg and mix until lightly combined.
            Add the salt and continue mixing on low speed. Then slowly add the
            flour, again mixing on low, until the dough begins to come together.
            Increase the speed to medium to create a fully formed dough ball,
            then turn the mixer to medium high and mix until the dough is smooth
            and elastic, about 5 minutes.{" "}
          </li>
          <li>
            Turn the dough out onto a clean work surface and knead slightly,
            forming the dough into a smooth ball. Then, add the dough to a
            greased bowl and cover with plastic wrap or a towel and keep in a
            warm place for 1 hour, or until the dough has doubled in size.{" "}
          </li>
          <li>
            While the dough is rising, make the filling. In a small mixing bowl,
            combine apple butter, cinnamon, cloves, allspice, nutmeg and salt.
            Set aside.{" "}
          </li>
          <li>
            Once the dough has doubled in size, remove it from the greased bowl
            onto a lightly floured work surface. Roll the dough out into a 10x12
            rectangle and add the reserved filling. Using an offset spatula, or
            the back of a spoon, spread the filling out to the edges of the
            rectangle, leaving a ½ inch of dough filling free. Then sprinkle the
            chopped walnuts over the filling and roll the long end of the dough
            into a tight spiral. Cut the dough into 6 equal pieces and cover
            with a towel. Grease a 9-inch pie pan and set aside.{" "}
          </li>
          <li>
            Next, make the caramel filling. In a 10 inch nonstick skillet on
            medium high heat, add the sugar. Cook, undisturbed, for 4 minutes,
            or until the sugar begins to melt. Then reduce the heat to medium
            and whisk the unmelted sugar to incorporate it and continue cooking
            until a dark amber color is achieved, 1-2 minutes. Remove the
            caramel from the heat and quickly whisk in the cubed butter. Once
            the butter is combined, pour it directly into the greased pie pan.
            Add the apples in a single layer, either fanning them out in a
            circle, or in rows. Then gently top the apples and caramel filling
            with the 6 buns. Cover tightly with aluminum foil and allow to rise
            for an additional 30 minutes.{" "}
          </li>
          <li>
            Preheat the oven to 375°F. Brush the tops of the buns with an egg
            wash and bake for 25 minutes, or until golden brown. If the buns
            begin to brown too quickly, cover with aluminum foil and continue to
            bake. Remove from the oven and allow to cool for 15-30 minutes. Then
            carefully invert the pie pan onto a large serving platter. Serve
            immediately and enjoy!
          </li>
        </ol>
      </div>
    </div>
  );
}

export default Body;
