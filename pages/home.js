import React, { Component } from "react";

import { BoxComponent, ModalComponent, ScriptLoad } from "../lib/shared";
import { ProfileInstance, Helper } from "../lib/Helper";
import { Services } from "../lib/services";

import jwtdecode from "jwt-decode";

class ProfileBar extends Component {
  state = {
    isLoading: false
  };
  userid = "";

  componentDidMount() {
    let token = sessionStorage.getItem("@token");
    if (token === null) console.log(">> không tìm thấy usertoken");
    else {
      this.userid = jwtdecode(token).nameid;

      let session = sessionStorage.getItem("@authen");
      if (session === null) {
        console.log("Chưa đăng nhập");
      } else {
        Helper.getProfile();
      }
    }
  }

  async onUpdate() {
    let response = await Services.getLeePoint(this.userid);
    if (response.code === 0) {
      ProfileInstance.point = response.data;
      this.setState({});
    }
  }

  render() {
    return (
      <div style={{ width: "100%", backgroundColor: "gold" }}>
        <div className="row row-between" style={{ margin: "5px 8px" }}>
          <div className="row cursor" onClick={this.props.onClickAvatar}>
            <img
              className="avatar"
              id="imgAvatar"
              src={this.props.avatar}
              alt=""
            />
            <div>
              <span style={{ fontSize: 15 }}>{ProfileInstance.username}</span>
              <span style={{ fontSize: 15 }}>{ProfileInstance.point} LP</span>
            </div>
          </div>
          <h4>Lee MGame</h4>
        </div>
      </div>
    );
  }
}

class UserAgentDectect {
  constructor(ua) {
    let arrs = ua.split(" ");

    this.os = arrs[1]
      .replace("(", "")
      .replace(")", "")
      .replace(";", "");
    this.browser = arrs[2];
    this.isMobile = ua.includes("Mobile") ? true : false;
  }

  static instance() {
    return new UserAgentDectect(window.navigator.userAgent);
  }

  static from(ua) {
    return new UserAgentDectect(ua);
  }
}

export default class HomePage extends Component {
  state = {
    device: null,
    sensorData: null,
    isPair: false
  };
  host = "";
  ping = 0;
  isCalibrate = false;
  sensorData = { beta: 0, gamma: 0, alpha: 0 };
  calibrateSensor = { x: 0, y: 0, z: 0 };
  cursor = { x: 280, y: 280 };

  score = 0;
  point = 0;

  simulatorControllerGamepad() {
    // gia lap
    window.addEventListener("keypress", e => {
      switch (e.charCode) {
        case "KeyA":
          this.sensorData.beta -= 0.1;
          break;
        case "KeyD":
          this.sensorData.beta += 0.1;
          break;
      }
    });

    // send data socketio
    this.socket.emit("sensor", this.sensorData);
  }

  async componentDidMount() {
    let params = new URLSearchParams(window.location.search);
    let code = params.get("code");
    let version = params.get("ver");
    let ua = UserAgentDectect.instance();
    console.log(">> Detect device: ", ua.isMobile, code, ua.os);

    window.addEventListener(
      "deviceorientation",
      event => this.onOrientation(event),
      true
    );

    await ScriptLoad.init(
      "https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.0.3/socket.io.js"
    );
    window.io = io;

    let host_homework = "https://192.168.100.11:4300";
    let host_workplace = "https://192.168.150.161:4300";

    let host_release = "https://gameapi.leecafeteria.net:4300";
    let host_test = "https://103.68.82.73:4300";

    this.host = host_test;
    if (version === "debug") this.host = host_workplace;

    this.socket = io(this.host, {
      timeout: 30000,
      rejectUnauthorized: false,
      reconnectionAttempts: 5
    });
    if (this.socket === undefined) return;

    this.setState({});
    // html_tag
    var ping_tag = document.getElementById("ping");
    let debug_tag = document.getElementById("debug-sensor");

    // socket init
    debug_tag.innerText = "Đang khởi tạo";
    console.log("socket init ...");
    this.socket.on("connect", () => {
      debug_tag.innerText = "Kết nối máy chủ thành công";
      console.log("Connected server");

      if (code !== null) {
        let ua = window.navigator.userAgent;
        let msg = { code: code, ua: ua };
        this.socket.emit("pair", msg, response => {
          if (response.authen) {
            window.addEventListener(
              "deviceorientation",
              event => this.handleOrientation(event),
              true
            );
            this.setState({ isPair: true });
          }
        });

        this.socket.on("sync-score", msg => {
          console.log(">> gamepad", msg);
          this.effectFloatNumbering("score", this.score, msg.score);
          this.score += msg.score;
        });
      } else {
        this.socket.emit("register", () => {
          console.log(">> Screen.register");
        });

        this.socket.on("pair", msg => {
          console.log("screen.pair", msg);

          if (msg.authen) {
            this.setState({ isPair: true, device: msg.device });
            let status_tag = document.getElementById("status");

            let device = UserAgentDectect.from(msg.device).os;
            status_tag.innerText = `Đã kết nối (${device})`;

            // calibrate
            this.calibratePanel.show(5, () => {
              this.calibrateSensor.x = this.sensorData.beta;
              this.calibrateSensor.y = this.sensorData.gamma;
              this.calibrateSensor.z = this.sensorData.alpha;

              this.isCalibrate = true;

              console.log("calibrate", this.calibrateSensor);
            });
          }
        });

        this.socket.on("close-connect", () => {
          console.log(">> device disconnect");
          this.setState({ isPair: false });
          document.getElementById("debug-sensor").innerText = "Mất kêt nối";
        });
      }

      this.socket.on("pong", msg => {
        console.log(">> ping", msg);

        if (this.ping !== msg) {
          this.ping = msg;
          ping_tag.innerText = `Ping: ${msg}ms`;
        }
      });

      this.socket.on("disconnect", () => {
        this.setState({ isPair: false });
        document.getElementById("debug-sensor").innerText = "Mất kêt nối";
        console.log(">> server disconnect");
      });

      this.socket.on("error", err => {
        console.log(">> socket error", err);
      });
    });

    // simulatorControllerGamepad();
  }

  handleMontion(ev) {
    this.setState({ sensorData: ev.acceleration });
    console.log(ev);
  }

  onOrientation(ev) {
    // let debug = document.getElementById("debug-sensor");
    // debug.innerText = `\nX: ${ev.beta.toFixed(2)} | Y: ${ev.gamma.toFixed(
    //   2
    // )} | Z: ${ev.alpha.toFixed(2)}`;
  }

  handleOrientation(ev) {
    let beta = parseFloat(ev.beta.toFixed(2));
    let gamma = parseFloat(ev.gamma.toFixed(2));
    let alpha = parseFloat(ev.alpha.toFixed(2));

    if (
      this.sensorData.beta !== beta ||
      this.sensorData.gamma !== gamma ||
      this.sensorData.alpha !== alpha
    ) {
      this.sensorData.beta = beta;
      this.sensorData.gamma = gamma;
      this.sensorData.alpha = alpha;

      this.socket.emit("sensor", this.sensorData);
      // this.updateCursor(this.sensorData);
    }
  }

  async onConvertScoreToLeePoint() {
    let token = sessionStorage.getItem("@token");
    let userid = jwtdecode(token).nameid;
    let response = await Services.doReward(
      userid,
      userid,
      10,
      "Quy đổi điểm game sang điểm LeePoint"
    );

    if (response.code === 0) {
      let oldPoint = this.point;
      this.point += this.score;

      this.effectFloatNumbering("score", this.score, 0);
      this.effectFloatNumbering("leepoint", oldPoint, this.point);

      this.score = 0;
      this.profileBar.onUpdate();
    }
  }

  onBuy() {
    // this.props.history.push("/payment");
    this.props.history.push("/scanqr");
  }

  effectFloatNumbering(elementID, startValue, desireValue) {
    let current = startValue;
    let mode = "";
    let id = setInterval(() => {
      if (startValue > desireValue) {
        current -= 1;
        mode = "des";
      }

      if (startValue < desireValue) {
        current += 1;
        mode = "inc";
      }

      document.getElementById(elementID).innerText = current;
      if (
        (current <= desireValue && mode === "des") ||
        (current >= desireValue && mode === "inc")
      ) {
        current = desireValue;
        clearInterval(id);
      }
    }, 15);
  }

  randomRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  render() {
    return (
      <div style={{ height: "100%" }}>
        <BoxComponent
          style={{ height: 375, marginTop: "8%", width: 275 }}
          appTitle={
            <ProfileBar
              ref={c => (this.profileBar = c)}
              avatar="https://randomuser.me/api/portraits/thumb/men/10.jpg"
              onClickAvatar={() => this.props.history.push("/profile")}
            />
          }
        >
          <div style={{ alignItems: "center", marginTop: 10 }}>
            <span>Điểm số</span>
            <span id="score" style={{ fontSize: 30 }}>
              0
            </span>
          </div>

          <div style={{ alignItems: "center", marginTop: 10 }}>
            <span>Điểm LeePoint (LP)</span>
            <span id="leepoint" style={{ fontSize: 30 }}>
              0
            </span>
          </div>

          <div style={{ position: "absolute", bottom: 0, width: "115%" }}>
            {
              // <button onClick={() => this.mLeaderboard.toggle()}>
              //   Leaderboard
              // </button>
            }
            <button onClick={() => this.onConvertScoreToLeePoint()}>
              Quy đổi LP
            </button>

            <button onClick={() => this.onBuy()}>Thanh toán bằng LP</button>
          </div>
        </BoxComponent>

        <div style={{ bottom: 100, position: "absolute", alignSelf: "center" }}>
          <BoxComponent>
            <a
              href={this.host}
              target="_blank"
              style={{ margin: "5px 0", alignSelf: "center", fontSize: 13 }}
            >
              Cho phép kết nối tới máy chủ
            </a>
          </BoxComponent>
        </div>

        <div className="panel-debug" style={{ visibility: "hidden" }}>
          <div style={{ margin: 8 }}>
            <div
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <span id="status">
                {!this.state.isPair ? "Chờ kết nối" : "Đã kết nối"}
              </span>
              <span id="ping">Ping: 0ms</span>
            </div>
            <pre id="debug-sensor" style={{ marginTop: 4 }}>
              X | Y | Z
            </pre>
          </div>
        </div>

        <ModalComponent
          ref={c => (this.mLeaderboard = c)}
          style={{ width: 350, backgroundColor: "white" }}
          // bodyStyle={{ margin: "0 10%" }}
        >
          <div className="row-between" style={{ backgroundColor: "#dfdfdf" }}>
            <h3>Leaderboard</h3>
            <button
              style={{ width: 25, backgroundColor: "red", color: "white" }}
              onClick={() => this.mLeaderboard.toggle()}
            >
              X
            </button>
          </div>

          {["Leesin", "Kayle", "Teemo", "Yauso", `Kai'sa`, "Akali", "Sona"].map(
            (item, index) => (
              <div
                key={index}
                className="row-between"
                style={{
                  backgroundColor: index % 2 === 0 ? "#dfdfdf" : "white"
                }}
              >
                <span style={{ margin: 8 }}>{item}</span>
                <span style={{ margin: 8 }}>
                  {Math.round(index * this.randomRange(10, 100))}
                </span>
              </div>
            )
          )}
        </ModalComponent>
      </div>
    );
  }
}
