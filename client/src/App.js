import { useEffect, useReducer, createContext, useContext } from "react";
import "./App.scss";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  useHistory,
} from "react-router-dom";

import Signup from "./components/Signup/Signup";
import Login from "./components/Login/Login";
import Homebanner from "./components/Home/Home__banner/Home__banner";
import Homeintro from "./components/Home/Home__intro/Home__intro";
import Hometeam from "./components/Home/Home__team/Home__team";
import Homefooter from "./components/Home/Home__footer/Home__footer";
import Homeblocks from "./components/Home/Home__blocks/Home__blocks";
import Navbar from "./components/Navbar/Navbar";
import Feed from "./components/Feed/Feed";
import Bookmark from "./components/Bookmark/Bookmark";
import Profile from "./components/Profile/Profile";
import Visitor from "./components/Visitor/Visitor";
import Create from "./components/Create/Create";
import Update from "./components/Update/Update";

import { initialState, reducer } from "../src/reducers/userReducer";
import Recipe from "./components/Recipe/Recipe";
import Post from "./components/Create/Post/Post";
import Followers from "./components/Profile/Followers/Followers";
import Following from "./components/Profile/Following/Following";
import Edit from "./components/Profile/Edit/Edit";
import SearchUser from "./components/Search/SearchUser/SearchUser";
import SearchRecipe from "./components/Search/SearchRecipe/SearchRecipe";
import ResetPassword from "./components/ForgotPassword/ResetPassword/ResetPassword";
import NewPassword from "./components/ForgotPassword/NewPassword/NewPassword";
import Loading from "./components/Loading/Loading";
export const UserContext = createContext();

const Routing = () => {
  const history = useHistory();
  const { state, dispatch } = useContext(UserContext);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
      // history.push("/feed");
      dispatch({ type: "USER", payload: user });
    } else {
      if (
        !history.location.pathname.startsWith("/newpassword") &&
        !history.location.pathname.startsWith("/resetpassword") &&
        !history.location.pathname.endsWith("/")
      ) {
        history.push("/login");
      }
    }
  }, []);

  return (
    <div className="App">
      <Switch>
        {/* Loading */}
        <Route path="/loading">
          <Navbar />
          <Loading />
        </Route>
        {/* Recipe */}
        <Route path="/recipe/:recipeId">
          <Navbar />
          <Recipe />
        </Route>
        {/* Update */}
        <Route path="/update/:recipeId">
          <Navbar />
          <Update />
        </Route>
        {/* Create */}
        <Route path="/create">
          <Navbar />
          <Create />
        </Route>
        {/* Profile */}
        <Route exact path="/profile">
          <Navbar />
          <Profile />
        </Route>
        {/* Profile - Edit */}
        <Route exact path="/profile/edit">
          <Navbar />
          <Edit />
        </Route>
        {/* Profile - Following*/}
        <Route exact path="/profile/following/:userId">
          <Navbar />
          <Following />
        </Route>
        {/* Profile - Followers*/}
        <Route exact path="/profile/followers/:userId">
          <Navbar />
          <Followers />
        </Route>
        {/* Visitor Profile */}
        <Route path="/profile/:userId">
          <Navbar />
          <Visitor />
        </Route>
        {/* Search - User */}
        <Route path="/search/users">
          <Navbar />
          <SearchUser />
        </Route>
        {/* Search - Recipe */}
        <Route path="/search/recipes">
          <Navbar />
          <SearchRecipe />
        </Route>
        {/* Bookmark */}
        <Route path="/bookmark">
          <Navbar />
          <Bookmark />
        </Route>
        {/* Feed */}
        <Route path="/feed">
          <Navbar />
          <Feed />
        </Route>
        {/* Sign Up */}
        <Route path="/signup">
          <Signup />
        </Route>
        {/* Login */}
        <Route path="/login">
          <Login />
        </Route>
        {/* Reset Password */}
        <Route path="/resetpassword">
          <ResetPassword />
        </Route>
        {/* New Password */}
        <Route path="/newpassword/:token">
          <NewPassword />
        </Route>
        {/* Home */}
        <Route path="/home"></Route>
        {/* Welcome */}
        <Route exact path="/">
          <Homebanner />
          <Homeintro />
          <Homeblocks />
          <Hometeam />
          <Homefooter />
        </Route>
      </Switch>
    </div>
  );
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <UserContext.Provider value={{ state: state, dispatch: dispatch }}>
      <Router>
        <Routing />
      </Router>
    </UserContext.Provider>
  );
}

export default App;
