import React from "react";
import ReactDOM from "react-dom";
import App from "./app";
import { BrowserRouter as Router } from "react-router-dom";
import Auth0ProviderWithHistory from "./providerWithHistory";

import "./index.css";

ReactDOM.render(
  <Auth0ProviderWithHistory>
    <Router>
      <App />
    </Router>
  </Auth0ProviderWithHistory>,
  document.getElementById("root")
);
