import React, { Component } from "react";
import { render } from "react-dom";
import "./style.css";
import { BrowserRouter as Router, Route } from "react-router-dom";

import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";

import ProfilePage from "./pages/profile";
import EditProfilePage from "./pages/editprofile";

import HomePage from "./pages/home";
import PaymentPage from "./pages/payment";
import ScanQRPage from "./pages/scanqr";

import PrivacyPage from "./pages/privacy";

import WavePage from "./pages/wavemanager";

// <Route path="/home" component={HomePage} />

class App extends Component {
  render() {
    return (
      <Router>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/signup" component={RegisterPage} />

        <Route path="/profile" component={ProfilePage} />
        <Route path="/edit" component={EditProfilePage} />

        <Route exact path="/scanqr" component={ScanQRPage} />
        <Route path="/payment" component={PaymentPage} />

        <Route exact path="/privacy" component={PrivacyPage} />

        <Route exact path="/admin/editor" component={WavePage} />
      </Router>
    );
  }
}

render(<App />, document.getElementById("root"));
