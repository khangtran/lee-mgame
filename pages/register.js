import React, { Component } from "react";
import { BrowserRouter as Router } from "react-router-dom";

import {
  BoxComponent,
  ModalComponent,
  ScriptLoad,
  Checkbox
} from "../lib/shared";

import { Services } from "../lib/services";
import { Helper, Account } from "../lib/Helper";

export default class RegisterPage extends Component {
  state = {
    isLoading: false,
    errors: []
  };

  onValidate(email, phone, name, pass, check_terms) {
    let errors = [];

    if (!email.includes("@"))
      errors.push("Email không đúng định dạng: yourname@gmail.com");

    if (phone.length < 9) errors.push("Số điện thoại không hợp lệ (>= 9)");
    if (name.length < 3) errors.push("Tên đăng nhập có ít nhất 3 ký tự");
    if (pass.length < 6) errors.push("Mật khẩu phải nhiều hơn 6 ký tự");

    if (!check_terms)
      errors.push("Bạn cần phải đồng ý điều khoản sử dụng dịch vụ");

    return errors;
  }

  async onSignup() {
    let phone = this.field_phone.value;
    let name = this.field_name.value;
    let pass = this.field_pass.value;
    let email = this.field_email.value;

    let isTerms = this.check_terms.value;
    let errors = this.onValidate(email, phone, name, pass, isTerms);

    if (errors.length > 0) {
      this.setState({ errors: errors });
      return;
    }

    let response = await Services.register(email, phone, name, pass);

    if (response.succeeded) {
      sessionStorage.setItem("@authen", JSON.stringify(response.user));
      this.props.history.push("/home");
    } else {
      errors = response.errors.map((item, index) => item.description);
      this.setState({ errors: errors });
    }
  }

  render() {
    return (
      <div className="background">
        <div style={{ width: 350, alignSelf: "center", marginTop: 20 }}>
          <h2> Lee Loyalty </h2>

          <div>
            <span>Email</span>
            <input ref={c => (this.field_email = c)} required type="email" />
          </div>

          <div style={{ height: 10 }} />

          <div>
            <span>Số điện thoại</span>
            <input ref={c => (this.field_phone = c)} required />
          </div>

          <div style={{ height: 10 }} />

          <div>
            <span>Tên đăng nhập</span>
            <input ref={c => (this.field_name = c)} required />
          </div>

          <div style={{ height: 10 }} />

          <div>
            <span>Mật khẩu</span>
            <input ref={c => (this.field_pass = c)} type="password" required />
          </div>

          <div style={{ height: 20 }} />

          <Checkbox
            ref={c => (this.check_terms = c)}
            label={
              <span>
                Bạn đã đồng ý với
                <span
                  className="cursor"
                  style={{ color: "blue" }}
                  onClick={() => this.props.history.push("privacy")}
                >
                  {" "}
                  Điều Khoản của Lee Loyalty
                </span>
                .
              </span>
            }
          />

          <button onClick={() => this.onSignup()}>Đăng Ký</button>

          <div style={{ height: 20 }} />

          <div style={{ backgroundColor: "#ffcdd2", border: "1px solid red" }}>
            {this.state.errors.map((item, index) => (
              <div key={index} style={{ margin: "2px 5px" }}>
                <span>• {item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}
