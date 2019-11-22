import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import setAuthToken from "../utils/setAuthToken";
import { withStyles, Avatar, Button, Paper, Typography, InputAdornment, FormControlLabel, Switch, TextField, Container } from "@material-ui/core";
import LockIcon from "@material-ui/icons/LockOutlined";
import axios from "axios";
import MySnackbar from "./MySnackbar";

const styles = theme => ({
  root: {
    width: "auto",
    display: "block",
    marginLeft: theme.spacing(),
    marginRight: theme.spacing(),
    [theme.breakpoints.up(400 + theme.spacing(2))]: {
      width: 400,
      marginLeft: "auto",
      marginRight: "auto"
    }
  },
  paper: {
    marginTop: theme.spacing(),
    marginBottom: theme.spacing(),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: `${theme.spacing()}px ${theme.spacing()}px ${theme.spacing()}px`
  },
  avatar: {
    margin: theme.spacing(),
    backgroundColor: theme.palette.secondary.main
  },
  otpBtn: {
    marginTop: theme.spacing(3),
    [theme.breakpoints.down("sm")]: {
      marginTop: theme.spacing()
    },
    margin: theme.spacing()
  },
  form: {
    width: "100%", // Fix IE11 issue.
    marginTop: theme.spacing()
  },
  submit: {
    marginTop: theme.spacing()
  }
});

class Login extends Component {
  constructor(props) {
    super(props);
    const token = localStorage.getItem("token");
    let loggedIn = true;
    if (token == null) {
      loggedIn = false;
    }
    this.state = {
      mobileNo: "",
      otp: "",
      usePassword: false,
      showPassword: false,
      userName: "",
      password: "",
      loggedIn
    };
  }
  handleChange = prop => event => {
    this.setState({ [prop]: event.target.value });
  };

  handleLogin = () => {
    const { mobileNo, otp, usePassword } = this.state;
    const loginData = {
      emailId: this.state.userName,
      password: this.state.password
    };

    if (usePassword === true) {
      // use Password Login Code
      axios
        .post("/api/auth/login", loginData)
        .then(res => {
          if (res.data.token) {
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("designation", res.data.designation);
            localStorage.setItem("userImage", res.data.userImage);
            localStorage.setItem("name", res.data.name);
            localStorage.setItem("id", res.data.id);
            this.setState({ loggedIn: true });
            setAuthToken(res.data.token);
            
          }else{
            this.child.handleSnackbar(res.data);

          }
        })
        .catch(err => console.log(err));
    } else {
      // use mobile-OTP Login code
      console.log(mobileNo, otp);
      // if (mobileNo === "123" && otp === "123") {
      //   this.setState({ loggedIn: true });
      //   localStorage.setItem("token", "sadjksjajdkajsdak");
      // }
    }
  };

  render() {
    if (this.state.loggedIn) {
      return <Redirect to="/dashboard" />;
    }
    const { classes } = this.props;
    return (
      <section className={classes.root}>
        <Container>
          <Paper className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockIcon />
            </Avatar>
            <Typography align="center" color="primary" variant="inherit">
              Welcome to Oasis Manors
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={this.state.usePassword}
                  onChange={() => this.setState({ usePassword: !this.state.usePassword })}
                  value={this.state.usePassword ? "Use Password" : "Use Mobile (OTP)"}
                />
              }
              label={this.state.usePassword ? "Use Password" : "Use Mobile - OTP"}
            />

            {this.state.usePassword ? (
              <div id="usePassword">
                <TextField id="userName" autoFocus fullWidth onChange={this.handleChange("userName")} margin="normal" variant="outlined" label="Enter User Name" />
                <TextField id="password" fullWidth onChange={this.handleChange("password")} margin="normal" variant="outlined" type="password" label="Password" />
              </div>
            ) : (
              <form className={classes.form}>
                <TextField
                  id="mobileNo"
                  autoFocus
                  onChange={this.handleChange("mobileNo")}
                  margin="normal"
                  variant="outlined"
                  label="Mobile Number"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">+91 </InputAdornment>
                  }}
                />
                <Button variant="outlined" color="primary" className={classes.otpBtn}>
                  Get OTP
                </Button>
                <TextField id="otp" onChange={this.handleChange("otp")} variant="outlined" label="Enter OTP" />
              </form>
            )}
            <Button fullWidth variant="contained" onClick={() => this.handleLogin()} color="primary" className={classes.submit}>
              Sign in
            </Button>
          </Paper>
          <MySnackbar onRef={ref => (this.child = ref)} />
        </Container>
      </section>
    );
  }
}

Login.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Login);
