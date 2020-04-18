import React, { Component } from "react";

export class ScriptLoad {
  static async init(script) {
    return new Promise((resolve, reject) => {
      this.script = document.createElement("script");
      this.script.async = true;
      this.script.src = script;
      this.script.onload = ev => {
        resolve();
      };
      this.script.onerror = ev => reject(ev);

      let head = document.getElementsByTagName("head")[0];
      head.append(this.script);
    });
  }
}

export class BoxComponent extends Component {
  render() {
    return (
      <div className="popup-wrap" style={{ ...this.props.style }}>
        {this.props.appTitle}
        <div className="container" style={{ ...this.props.styleContainer }}>
          {this.props.children}
        </div>
      </div>
    );
  }
}

export class ModalComponent extends Component {
  state = {
    isShow: false
  };

  toggle() {
    this.setState({ isShow: !this.state.isShow });
  }

  render() {
    return (
      <div
        className={`${this.props.class} popup-wrap`}
        style={{
          display: this.state.isShow ? "flex" : "none",
          alignSelf: "center",
          position: "absolute",
          ...this.props.style
        }}
      >
        <div style={{ backgroundColor: "gold" }}>
          <div className="row row-between" style={{ margin: 8, height: 28 }}>
            <span style={{ fontSize: 16 }}>{this.props.title}</span>
            <button className="bt-bar-macos" onClick={() => this.toggle()} />
          </div>
        </div>

        <div style={{ margin: 8, ...this.props.bodyStyle }}>
          {this.props.children}
        </div>
      </div>
    );
  }
}

export class TextField extends Component {
  get value() {
    return this.field.value;
  }

  set value(x) {
    this.field.value = x;
  }

  render() {
    return (
      <div>
        <div className="row row-between">
          <span className="lb-field">{this.props.label}</span>
          <div>{this.props.trailing}</div>
        </div>
        <input
          ref={c => (this.field = c)}
          type={this.props.type}
          value={this.props.value}
          {...this.props}
        />
      </div>
    );
  }
}

export class Checkbox extends Component {
  __value = false;

  get value() {
    return this.checkbox.checked;
  }

  render() {
    return (
      <div className="row">
        <input ref={c => (this.checkbox = c)} type="checkbox" />
        <span>{this.props.label}</span>
      </div>
    );
  }
}

export class NavigationBar extends Component {
  render() {
    return (
      <div className="navigation-bar" style={{ ...this.props.style }}>
        <div className="row row-between">
          <div style={{ marign: "0 5px" }}>{this.props.leading}</div>
          <div style={{ fontSize: 17 }}>{this.props.title}</div>
          <div style={{ marign: "0 5px" }}>{this.props.trailing}</div>
        </div>
      </div>
    );
  }
}

export class AppPage extends Component {
  render() {
    return (
      <div className="app">
        {this.props.appTitle}
        {this.props.body}
      </div>
    );
  }
}

export class List extends Component {
  render() {
    return (
      <div
        className={`list ${this.props.class || ""}`}
        style={{ ...this.props.style }}
      >
        {this.props.data.map((item, index) => {
          return (
            <React.Fragment>
              {this.props.renderItem && this.props.renderItem(item, index)}
            </React.Fragment>
          );
        })}
      </div>
    );
  }
}

export class LabelRow extends Component {
  render() {
    return (
      <div className="row row-between label-row">
        <span className="lb-row">{this.props.label}</span>
        <span className="lb-row-value">{this.props.value}</span>
      </div>
    );
  }
}

export class Slider extends Component {
  state = {
    value: 0
  };

  get value() {
    return this.state.value;
  }

  set value(v) {
    this.setState({ value: v });
  }

  render() {
    return (
      <div>
        <div className="row row-between">
          <span>{this.props.label}</span>
          <span>{this.state.value}</span>
        </div>

        <input
          className="slider"
          type="range"
          min={this.props.min}
          max={this.props.max}
          value={this.props.value}
          step={this.props.step}
          onChange={event => {
            let v = event.target.value;
            this.setState({ value: v });
          }}
        />
      </div>
    );
  }
}

export class ProgressBar extends Component {
  state = {
    label: null,
    progress: 0,
    percent: 0
  };

  __value = 0;
  isDone = false;

  get percent() {
    return this.state.percent;
  }

  get value() {
    return this.__value;
  }

  set value(v) {
    if (v > this.props.max) {
      console.log(">> done", v);
      this.isDone = true;
      this.setState({ label: "Completed" });

      return;
    }

    let width = this.root.offsetWidth;
    let _width = (v * width) / this.props.max;

    let percent = (v * 100) / this.props.max;

    this.__value = v;

    this.setState({ progress: _width, percent: percent });
  }

  set label(string) {
    this.setState({ label: string });
  }

  render() {
    return (
      <div>
        <LabelRow
          label={this.props.label || this.state.label || "Tiến trình"}
          value={`${this.state.percent}%`}
        />

        <div
          ref={c => (this.root = c)}
          style={{
            height: 5,
            backgroundColor: this.props.backgroundColor || "lightgray",
            borderRadius: 5
          }}
        >
          <div
            style={{
              width: this.state.progress,
              height: 5,
              backgroundColor: this.props.foregroundColor || "#2196f3",
              borderRadius: 5
            }}
          />
        </div>
      </div>
    );
  }
}

export class ListItem extends Component {
  render() {
    return <div />;
  }
}

export class Indicator extends Component {
  state = {
    isVisible: true
  };

  toggle() {
    this.setState({ isVisible: !this.state.isVisible });
  }

  render() {
    return (
      <div
        style={{
          alignSelf: "center",
          display: this.state.isVisible ? "flex" : "none"
        }}
      >
        <div class=".loader">{this.props.text}</div>
      </div>
    );
  }
}
