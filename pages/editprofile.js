import React, { Component } from "react";

import { TextField, NavigationBar, AppPage } from "../lib/shared";

import { ProfileInstance } from "../lib/Helper";

export default class EditProfilePage extends Component {
  componentDidMount() {
    console.log(">> profile instance", ProfileInstance);
  }

  onUpdate = () => {};

  render() {
    return (
      <AppPage
        appTitle={<NavigationBar title="Thông tin cá nhân" />}
        body={
          <div style={{ margin: "8px" }}>
            <TextField label="Họ tên" value={ProfileInstance.username} />
            <div style={{ height: 5 }} />

            <TextField
              label="Số điện thoại"
              value={ProfileInstance.phone}
              trailing={<span>Xác thực</span>}
            />

            <div style={{ height: 5 }} />
            <TextField label="Email" value={ProfileInstance.email} />
            <div style={{ height: 5 }} />

            <div className="row row-between">
              <span>Mật khẩu</span>
              <button
                style={{ backgroundColor: "red", color: "white", height: 28 }}
              >
                Thay đổi
              </button>
            </div>

            {
              // <TextField
              //   label="Mật khẩu hiện tại"
              //   type="password"
              //   value="Tran Quang Khang"
              // />
            }

            <div style={{ height: 20 }} />
            <button onClick={this.onUpdate}>Cập nhật</button>
          </div>
        }
      />
    );
  }
}
