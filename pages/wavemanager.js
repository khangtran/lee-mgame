import React, { Component } from "react";

import {
  ModalComponent,
  TextField,
  List,
  LabelRow,
  Slider,
  ProgressBar
} from "../lib/shared";
import { Services } from "../lib/services";

class Monster {
  constructor(name, level, speed, point) {
    this.name = name;
    this.level = level;
    this.speed = speed;
    this.image = "";
    this.point = point;
  }
}

class Wave {
  constructor(speeddrop, bonus) {
    this.drop_speed = speeddrop;
    this.bonus_point = bonus;
    this.monsters = [];
  }
}

class WaveManager {
  waves = [];

  monsters = [];

  constructor() {
    let a = new Monster("Cam", 1, 0.5, 10);
    let b = new Monster("Táo", 1, 0.25, 20);
    let c = new Monster("Chuối", 1, 0.75, 10);
    let d = new Monster("Dưa", 1, 1, 30);
    let e = new Monster("Thơm", 1, 1.25, 40);
    let f = new Monster("Boom", 1, 1.75, 0);

    this.monsters = [a, b, c, d, e, f];
  }

  add(wave) {
    this.waves.push(wave);
  }

  remove(index) {
    this.waves.splice(1, index);
  }

  edit(index, data) {
    this.waves[index] = data;
  }
}

var WaveManagerInstance = new WaveManager();

class UIWave extends Component {
  async componentDidMount() {
    let url = "https://103.68.82.73:4300/resource/wave.config.json";
    // let url = "http://103.68.82.73:4000/resource/wave.config.json";

    var response = await fetch(url, {
      method: "get",
      // referrer: "https://103.68.82.73:4300",
      // referrerPolicy: "no-referrer"
    });
    var result = await response.json();

    // WaveManagerInstance.waves = result;
    console.log("get waves", result);
  }

  totalPoint(index) {
    let wave = WaveManagerInstance.waves[index];
    let monsters = wave.monsters;
    let sum = 0;
    for (var i = 0; i < monsters.length; i++) {
      sum += monsters[i].point;
    }
    return sum;
  }

  render() {
    return (
      <div style={{ width: 250 }}>
        <LabelRow
          label="Quản lý màn chơi"
          value={WaveManagerInstance.waves.length}
        />
        <div style={{ height: 2 }} />
        <div className="list" style={{ height: 400 }}>
          {WaveManagerInstance.waves.map((item, index) => {
            return (
              <div
                className="cursor"
                key={index}
                style={{
                  backgroundColor: index % 2 === 0 ? "#eee" : "white"
                }}
                onClick={() =>
                  this.props.onClickItem && this.props.onClickItem(index)
                }
              >
                <div style={{ margin: 5 }}>
                  <LabelRow label="Tốc độ rơi" value={item.drop_speed} />
                  <LabelRow label="Điểm thưởng" value={item.bonus_point} />
                  <LabelRow label="Vật rơi" value={item.monsters.length} />
                  <LabelRow label="Tổng điểm" value={this.totalPoint(index)} />
                </div>
              </div>
            );
          })}
        </div>

        <div className="row row-between">
          <button>Thêm</button>
        </div>
      </div>
    );
  }
}

class UIMonster extends Component {
  render() {
    return (
      <div style={{ width: 250 }}>
        <LabelRow
          label="Quản lý quái vật"
          value={WaveManagerInstance.monsters.length}
        />
        <div style={{ height: 2 }} />
        <div className="list" style={{ height: 400 }}>
          {WaveManagerInstance.monsters.map((item, index) => {
            return (
              <div
                className="cursor"
                key={index}
                style={{
                  backgroundColor: index % 2 === 0 ? "#eee" : "white"
                }}
                onClick={() =>
                  this.props.onClickItem && this.props.onClickItem(index)
                }
              >
                <div style={{ margin: 5, flexDirection: "row" }}>
                  <div
                    style={{ margin: 5 }}
                    onClick={
                      this.props.onUploadIcon && this.props.onUploadIcon(index)
                    }
                  >
                    <img src="https://img.icons8.com/material-rounded/48/000000/image.png" />
                  </div>
                  <div style={{ width: "100%" }}>
                    <LabelRow label="Tên" value={item.name} />
                    <LabelRow label="Điểm" value={item.point} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="row row-between">
          <button>Thêm</button>
        </div>
      </div>
    );
  }
}

class UploadServer extends Component {
  state = {
    btLabel: "Upload"
  };

  toggle() {
    this.modal.toggle();
  }

  onUploadServer = async () => {
    if (this.state.btLabel === "Done") {
      this.toggle();
      return;
    }

    if (WaveManagerInstance.waves.length < 10) {
      alert("Cần ít nhất 10 vòng chơi để upload");
      return;
    }

    let progressing = setInterval(() => {
      if (this.progressUpload.isDone) {
        clearInterval(progressing);
        this.setState({ btLabel: "Done" });
      }
      this.progressUpload.value += 1;
    }, 100);

    let data = JSON.stringify(WaveManagerInstance.waves);
    let result = await Services.uploadWave(data);
    console.log(">> result", result.message);
  };

  render() {
    return (
      <ModalComponent ref={c => (this.modal = c)} title="Cập nhật dữ liệu">
        <div>
          <ProgressBar ref={c => (this.progressUpload = c)} max={100} />

          <div style={{ height: 15 }} />

          <span style={{ fontSize: 14, color: "#616161", alignSelf: "center" }}>
            Thao tác này không thể hoàn tác.
          </span>
          <div style={{ height: 2 }} />

          <button onClick={this.onUploadServer}>{this.state.btLabel}</button>
        </div>
      </ModalComponent>
    );
  }
}

export default class WavePage extends Component {
  state = {
    isloading: false,
    currentList: []
  };

  isEdit = false;

  onNewWave = () => {
    this.popup_wave.toggle();
    this.tmp_wave = new Wave(1, 10);
  };

  onSave = () => {
    let waves = { waves: WaveManagerInstance.waves };
    this.field_wavedata.value = JSON.stringify(waves);
  };

  popup_wave_done() {
    let bonus = this.field_bonus.value;
    let drop_speed = this.field_speed.value;

    let wave = new Wave(drop_speed, bonus);
    wave.monsters = this.state.currentList;

    if (!this.isEdit) {
      WaveManagerInstance.add(wave);
      console.log(">> new wave added");
    }
    this.setState({ currentList: [] });

    this.popup_wave.toggle();
    this.isEdit = false;
  }

  onWaveEdit(index) {
    console.log(">> edit wave", index);
    this.popup_wave.toggle();
    this.isEdit = true;
    let wave = WaveManagerInstance.waves[index];

    this.field_bonus.value = wave.bonus_point;
    this.field_speed.value = wave.drop_speed;

    this.setState({ currentList: wave.monsters });
  }

  onMonsterEdit(index) {
    console.log(">> edit monster", index);
    this.popup_monster.toggle();
  }

  onSelectDrop(index) {
    let monster = WaveManagerInstance.monsters[index];
    let list = this.state.currentList;
    list.push(monster);

    this.setState({ currentList: list });
  }

  render() {
    return (
      <div>
        <ModalComponent ref={c => (this.popup_monster = c)} title="Chỉnh sửa">
          <div>
            <TextField label="Điểm" value="" />
            <TextField label="Icon" value="" />
          </div>
          <div style={{ height: 5 }} />
          <div className="row" style={{ justifyContent: "flex-end" }}>
            <button className="bt-color-blue">Xong</button>
          </div>
        </ModalComponent>

        <ModalComponent ref={c => (this.popup_wave = c)} title="Thông số">
          <div>
            <Slider
              ref={c => (this.field_speed = c)}
              label="Tốc độ rơi"
              min="0.1"
              max={2}
              step="0.1"
            />

            <div style={{ height: 5 }} />
            <TextField ref={c => (this.field_bonus = c)} label="Điểm thưởng" />
            <div style={{ height: 5 }} />

            <div className="row row-between">
              <span>Vật rơi</span>
              <span style={{ fontSize: 14 }}>Chọn từ danh sách</span>
            </div>

            <div>
              <List
                class="row"
                data={WaveManagerInstance.monsters}
                renderItem={(item, index) => {
                  return (
                    <div
                      className="cursor"
                      key={index}
                      style={{
                        flex: "none",
                        width: 125,
                        backgroundColor: index % 2 === 0 ? "#eee" : "white"
                      }}
                      onClick={() => this.onSelectDrop(index)}
                    >
                      <div style={{ margin: "8px 4px" }}>
                        <span>
                          {item.name} - {item.point} điểm
                        </span>
                      </div>
                    </div>
                  );
                }}
              />
            </div>

            <div style={{ height: 5 }} />

            <span>Đã thêm</span>
            <div>
              <List
                style={{ height: 200 }}
                ref={c => (this.listMonster = c)}
                data={this.state.currentList}
                renderItem={(item, index) => {
                  return (
                    <div
                      key={index}
                      style={{
                        flex: "none",
                        backgroundColor: index % 2 === 0 ? "#eee" : "white"
                      }}
                    >
                      <div style={{ margin: "8px 4px" }}>
                        <div className="row row-between">
                          <span>{item.name}</span>
                          <button className="bt-color-red">Xóa</button>
                        </div>
                      </div>
                    </div>
                  );
                }}
              />
            </div>

            <div style={{ height: 5 }} />
            <div className="row" style={{ justifyContent: "flex-end" }}>
              <button
                className="bt-color-blue"
                onClick={() => this.popup_wave_done()}
              >
                Done
              </button>
            </div>
          </div>
        </ModalComponent>

        <UploadServer ref={c => (this.popup_upload = c)} />

        <div style={{ margin: 8 }}>
          <div className="row row-between">
            <button onClick={this.onNewWave}>Tạo mới</button>
            <button onClick={this.onSave}>Lưu</button>
            <button onClick={() => this.popup_upload.toggle()}>
              Triển khai
            </button>
          </div>
        </div>

        <div className="row row-between" style={{ margin: 8 }}>
          <UIWave onClickItem={index => this.onWaveEdit(index)} />

          <UIMonster onClickItem={index => this.onMonsterEdit(index)} />

          <textarea
            ref={c => (this.field_wavedata = c)}
            style={{ width: 250, height: 400 }}
          />
        </div>
      </div>
    );
  }
}
