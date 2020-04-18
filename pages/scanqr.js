import React, { Component } from "react";
import { BoxComponent } from "../lib/shared";
import QrReader from "react-qr-reader";

export default class ScanQRPage extends Component {
  isLoading = false;

  handleScan = data => {
    if (data && !this.isLoading) {
      this.isLoading = true;
      if (navigator.vibrate) {
        window.navigator.vibrate(200);
      }
      console.log(">> data", data);

      this.props.history.push("/payment");
    }
  };

  handleError = err => {
    console.log(err);
    alert(err);
  };

  render() {
    return (
      <div>
        <QrReader
          facingMode="environment"
          delay={300}
          onError={this.handleError}
          onScan={this.handleScan}
          style={{
            width: "85%",
            height: "100%",
            alignSelf: "center",
            marginTop: "10%"
          }}
        />

        <div
          style={{ alignSelf: "center", width: "85%", backgroundColor: "gold" }}
        >
          <span style={{ margin: "8px", textAlign: "center" }}>
            Quét mã QR thanh toán
          </span>
        </div>
      </div>
    );
  }
}
