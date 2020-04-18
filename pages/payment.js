import React, { Component } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { BoxComponent, LabelRow, TextField } from "../lib/shared";

import { Services } from "../lib/services";
import { Helper } from "../lib/Helper";

export default class PaymentPage extends Component {
  state = {
    isCompleted: false,
    isLoading: false,
    isReady: false,
    query: null
  };

  componentDidMount() {
    let params = new URLSearchParams(window.location.search);
    let userid = params.get("uid");
    let username = params.get("un");
    let point = params.get("lp");
    let orderid = params.get("oid");
    let ordername = params.get("on");
    let orderprice = params.get("op");

    if (userid !== null && username !== null) {
      this.setState({
        isReady: true,
        query: {
          uid: userid,
          uname: username,
          upoint: point,
          oid: orderid,
          oname: ordername,
          oprice: orderprice
        }
      });
    }

    console.log(">> query", userid);
  }

  onPayment = () => {
    alert("Đã thanh toán thành công. Chúc bạn một ngày tốt đẹp.");

    setTimeout(() => {
      this.props.history.back();
    }, 2);
  };

  render() {
    return (
      <div>
        <BoxComponent
          style={{ height: 475, width: 375, top: "10%" }}
          styleContainer={{ justifyContent: "space-between" }}
          appTitle={
            <div style={{ width: "100%", backgroundColor: "gold" }}>
              <div className="row row-between" style={{ margin: "0 8px" }}>
                <h3>Cổng thanh toán LeePoint</h3>
              </div>
            </div>
          }
        >
          {(this.state.isReady && (
            <div style={{ width: "100%", height: "100%" }}>
              <div>
                <TextField
                  label="Tài khoản"
                  value={this.state.query.uid}
                  disabled
                />
                <div style={{ height: 10 }} />
                <TextField
                  label="Họ tên"
                  value={this.state.query.uname.toUpperCase()}
                  disabled
                />
                <div style={{ height: 10 }} />
                <TextField
                  label="LeePoint"
                  value={this.state.query.upoint}
                  disabled
                />
                <div style={{ height: 10 }} />
                <TextField
                  label="Đơn hàng"
                  value={this.state.query.oid}
                  disabled
                />
                <div style={{ height: 10 }} />
                <TextField
                  label="Tên nước "
                  value={this.state.query.oname}
                  disabled
                />
                <div style={{ height: 10 }} />
                <TextField
                  label="Đơn giá"
                  value={this.state.query.op}
                  disabled
                />
              </div>

              <button
                className="bt-color-coffee"
                style={{
                  width: "100%",
                  position: "absolute",
                  bottom: 0
                }}
                onClick={this.onPayment}
              >
                Thanh toán
              </button>
            </div>
          )) || (
            <div>
              <span>Không tìm thấy dữ liệu</span>
            </div>
          )}
        </BoxComponent>
      </div>
    );
  }
}
