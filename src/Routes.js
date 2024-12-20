import React from "react";
import NotFound from "./containers/NotFound";
import Login from "./containers/Login";
import Signup from "./containers/Signup";
import NewNote from "./containers/NewNote";
import Notes from "./containers/Notes";
import ForgetPassword from "./containers/ForgetPassword";
import { Switch, Route } from "react-router-dom";
import Home from "./containers/Home";
export default function Routess() {
    return (<>
        <Switch>
            <Route exact path="/">
                <Home />
            </Route>
            <Route exact path="/login">
                <Login />
            </Route>
            <Route exact path="/signup">
                <Signup />
            </Route>
            <Route exact path="/notes/new">
                <NewNote />
            </Route>
            <Route exact path="/notes/:id">
                <Notes />
            </Route>
            <Route exact path="/forget">
        <ForgetPassword />
      </Route>
            <Route>
                <NotFound />
            </Route>

        </Switch>
    </>
    );
}
