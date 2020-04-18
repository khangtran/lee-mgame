export class RequestURL {
  constructor(url, method, body, header) {
    this.url = url;
    this.method = method;
    this.body = body;
    this.header = header;
    if (this.header === undefined) {
      this.header = { "content-type": "application/json" };
    }
    this.onError = null;
  }

  authen() {
    let token = sessionStorage.getItem("@token");
    let headers = {
      Authorization: `Bearer ${token}`,
      "content-type": "application/json"
    };
    this.header = headers;
  }

  async execute() {
    console.log(">> [HTTP] Request", this);

    try {
      if (this.method === "post") {
        let response = await fetch(this.url, {
          method: "post",
          body: JSON.stringify(this.body),
          headers: this.header,
          rejectUnauthorized: false
        });
        let result = await response.json();
        console.log(">> [HTTP] Response", result);
        return result;
      }

      let response = await fetch(this.url, { headers: this.header });
      let result = await response.json();
      console.log(">> [HTTP] Response", result);
      return result;
    } catch (error) {
      console.log(">> error", error);
      this.onError && this.onError(error);
    }
  }
}
