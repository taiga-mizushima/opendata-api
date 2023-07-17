// React, ReactDOM, ConcurrentModeをインポート
import React from "react";
import ReactDOM from "react-dom";

// Appコンポーネントをインポート
import App from "./App";

// ルート要素を取得
const rootElement = document.getElementById("root");

// ReactDOM.renderでAppコンポーネントをレンダリング
ReactDOM.render(<App />, rootElement);
