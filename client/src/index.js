import React from "react";
import ReactDOM from "react-dom";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import lightGreen from "@material-ui/core/colors/lightGreen";
import { deepPurple, green } from "@material-ui/core/colors";
import { MainProvider } from "./Components/MainContext";

const theme = createMuiTheme({
  palette: {
    primary: lightGreen,
    secondary: deepPurple,
    textPrimary: green[700]
  },
  status: {
    danger: "orange"
  },
  typography: {
    fontFamily: ["Courgette", "serif", "BlinkMacSystemFont"].join(",")
  }
});

ReactDOM.render(
  <MainProvider>
    <BrowserRouter>
      <MuiThemeProvider theme={theme}>
        <App />
      </MuiThemeProvider>
    </BrowserRouter>
  </MainProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
