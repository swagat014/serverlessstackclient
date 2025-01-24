import React, { useState, useEffect } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { AppContext } from "./libs/contextLib";
import { Auth } from "aws-amplify";
import { onError } from "./libs/errorLib";
import { useHistory } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Routes from "./Routes";
import Nav from "react-bootstrap/Nav";

import "./App.css";

function App() {
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const history = useHistory();

  async function handleLogout() {
    await Auth.signOut();
    userHasAuthenticated(false);
    history.push("/login");
  }

  useEffect(() => {
    onLoad();
  }, []);
  async function onLoad() {
    try {
      await Auth.currentSession();
      userHasAuthenticated(true);
    } catch (e) {
      if (e !== "No current user") {
        onError(e);
      }
    }
    setIsAuthenticating(false);
  }

  return (
    !isAuthenticating && (
      <div className="App container py-3">
        <Navbar collapseOnSelect bg="light" expand="md" className="custom-navbar">
          <LinkContainer to="/">
            <Navbar.Brand className="navbar-brand">Scratch</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-end">
            <Nav activeKey={window.location.pathname}>
              {isAuthenticated ? (
                <>
                  <Nav.Link onClick={handleLogout} className="nav-link-logout">
                    Logout
                  </Nav.Link>
                </>
              ) : (
                <>
                  <LinkContainer to="/signup">
                    <Nav.Link className="nav-link">Signup</Nav.Link>
                  </LinkContainer>
                  <LinkContainer to="/login">
                    <Nav.Link className="nav-link">Login</Nav.Link>
                  </LinkContainer>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Navbar>

        <AppContext.Provider value={{ isAuthenticated, userHasAuthenticated }}>
          <Routes />
        </AppContext.Provider>
      </div>
    )
  );
}

export default App;
