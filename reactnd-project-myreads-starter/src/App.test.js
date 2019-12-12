import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

/** 
 该课程并不教授测试驱动开发。 
 虽然不是必需要求，但你可以使用此文件来测试应用程序。 
**/

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<App />, div);
});
