import React, { Component } from "react";

import { TextField, NavigationBar, AppPage } from "../lib/shared";
import { Services } from "../lib/services";

import { ProfileInstance } from "../lib/Helper";

export default class ProfilePage extends Component {
  state = {
    isLoading: false,
    data: null
  };

  componentDidMount() {
    this.getProfile();
  }

  async getProfile() {
    let session = sessionStorage.getItem("@authen");
    if (session === null) {
      console.log(">> Chưa đăng nhập");
    } else {
      this.setState({ isLoading: true });
    }
  }

  onSignOut = () => {
    sessionStorage.clear();

    this.props.history.push("/");
  };

  render() {
    const btStyle = {
      backgroundColor: "#2196f3",
      color: "white",
      height: 28,
      fontSize: 13
    };
    const btRed = {
      backgroundColor: "red",
      color: "white",
      bottom: 0,
      position: "absolute",
      width: "100%",
      // margin: 8
    };

    return (
      <AppPage
        appTitle={<NavigationBar title="Thông tin" />}
        body={
          <div style={{ height: "100%", position: "relative" }}>
            <div className="row row-between" style={{ margin: "0" }}>
              <button style={btStyle}>Kết bạn</button>

              <button
                style={btStyle}
                onClick={() => this.props.history.push("/edit")}
              >
                Xem thông tin
              </button>

              <button style={btStyle}>Tặng quà</button>
            </div>

            <div style={{ height: 5 }} />

            <div style={{ margin: "8px" }}>
              <TextField label="Ranking" value="Uống dạo" disabled />
              <div style={{ height: 5 }} />
              <TextField
                label="Lee Point"
                value={ProfileInstance.point}
                disabled
              />
              <div style={{ height: 5 }} />

              <div style={{ height: 20 }} />
            </div>

            <button style={btRed} onClick={this.onSignOut}>
              Đăng xuất
            </button>
          </div>
        }
      />
    );
  }
}
