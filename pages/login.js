import React, { Component } from "react";
import { BrowserRouter as Router } from "react-router-dom";

import {
  BoxComponent,
  ModalComponent,
  TextField,
  Checkbox,
  Indicator
} from "../lib/shared";
import { Services } from "../lib/services";

import { Helper, Account } from "../lib/Helper";

export default class LoginPage extends Component {
  state = {
    isLoading: false,
    errors: []
  };

  componentDidMount() {
    let authen = sessionStorage.getItem("@authen");
    console.log("@authen", authen);

    if (authen !== null) {
      this.props.history.push("/home");
    } else {
      this.setState({ isLoading: true });
    }
  }

  onValidate(name, pass) {
    let errors = [];

    if (name === "") errors.push("Tên đăng nhập không được rỗng");
    if (pass === "") errors.push("Mật khẩu không được rỗng");

    return errors;
  }

  async onLogin() {
    let name = this.field_name.value;
    let pass = this.field_pass.value;

    let errors = this.onValidate(name, pass);

    if (errors.length > 0) {
      this.setState({ errors: errors });
      return;
    }

    let remember = this.check_remember.value;
    let response = await Services.login(name, pass, remember);

    if (response.status !== undefined) {
      alert(response.title);
      return;
    }

    if (response.currentUser !== null) {
      sessionStorage.setItem("@authen", JSON.stringify(response.currentUser));
      sessionStorage.setItem("@token", response.jwtToken);

      this.props.history.push("/home");
    } else {
      errors = [];
      errors.push("Tài khoản không tồn tại");
      this.setState({ errors: errors });
    }

    response.onError = error => {
      console.log(">> onLogin", error);
    };
  }

  onSignup = () => {
    this.props.history.push("/signup");
  };

  render() {
    return (
      <div style={{ backgroundColor: "gold", height: "100%" }}>
        {(this.state.isLoading && (
          <div style={{ width: 325, alignSelf: "center", marginTop: 20 }}>
            <h2> Lee Loyalty </h2>

            <TextField ref={c => (this.field_name = c)} label="Tên đăng nhập" />
            <div style={{ height: 10 }} />
            <TextField
              ref={c => (this.field_pass = c)}
              label="Mật khẩu"
              type="password"
            />
            <div style={{ height: 10 }} />

            <Checkbox
              ref={c => (this.check_remember = c)}
              label={<span>Ghi nhớ</span>}
            />

            <button onClick={() => this.onLogin()}>Đăng nhập</button>

            <div style={{ height: 10 }} />
            {this.state.errors.length > 0 && (
              <div
                style={{ backgroundColor: "#ffcdd2", border: "1px solid red" }}
              >
                {this.state.errors.map((item, index) => (
                  <div key={index} style={{ margin: "2px 5px" }}>
                    <span>• {item}</span>
                  </div>
                ))}
              </div>
            )}

            <div style={{ height: 20 }} />
            <span>Chưa có tài khoản</span>
            <button onClick={this.onSignup}>Đăng ký</button>
          </div>
        )) || (
          <div>
            <span>Kết nối máy chủ</span>
          </div>
        )}
      </div>
    );
  }
}
