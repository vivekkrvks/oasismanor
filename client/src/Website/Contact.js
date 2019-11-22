import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Chat from "../svg/Chat.svg";
import { withStyles, Grid, Typography, Paper, Breadcrumbs, Container, TextField, Fab } from "@material-ui/core";
import { Home, Email, NearMe, WhereToVote, MobileScreenShare } from "@material-ui/icons";
import Footer from "../Components/Footer";
import "../App.css";
import axios from "axios";

const styles = theme => ({
  bread: {
    padding: theme.spacing(1, 2),
    zIndex: 2,
    marginRight: "auto",
    marginLeft: "auto",
    marginTop: "1%",
    maxWidth: 230
  },
  link: {
    display: "flex",
    textDecoration: "none"
  },
  icon: {
    marginRight: theme.spacing(0.5),
    width: 20,
    height: 20
  },
  funImg: {
    padding: theme.spacing(1),
    maxWidth: "80%",
    maxHeight: "80%"
  },
  myContainer: {
    zIndex: 2,
    marginTop: "-50px",
    marginBottom: "30px"
  },
  form: {
    padding: theme.spacing(2),
    lineHeight: 5
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(1)
  }
});

class Contact extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      mobile: "",
      address: "",
      subject: "",
      message: "",
      err: "Feel free to Contact us anytime"
    };
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };
  handleSubmit = () => {
    const { name, email, mobile, address, subject, message } = this.state;
    if (name === "") {
      this.setState({ err: "Please Enter the Name" });
    } else if (email === "") {
      this.setState({ err: "Please Enter your Email" });
    } else if (mobile === "") {
      this.setState({ err: "Enter Mobile No." });
    }
    if (name !== "" && email !== "" && mobile !== "") {
      const enquiry = { name: name, email: email, mobile: mobile, address: address, subject: subject, message: message, formType: "contact" };
      axios
        .post("api/other/room", enquiry)
        .then(res => this.setState({ name: "", email: "", mobile: "", address: "", subject: "", message: "", err: res.data }))
        .catch(err => console.log(err));
    }
  };
  render() {
    const { classes } = this.props;

    return (
      <section>
        <Grid container>
          <Grid item xs={12} className="top-look">
            <Paper elevation={0} className={classes.bread}>
              <Breadcrumbs aria-label="breadcrumb">
                <Link color="inherit" to="/" className={classes.link}>
                  <Home className={classes.icon} />
                  Home
                </Link>
                <Typography color="textPrimary" className={classes.link}>
                  <Email className={classes.icon} />
                  Contact Us
                </Typography>
              </Breadcrumbs>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Container maxWidth="xl" className={classes.myContainer}>
              <Paper elevation={5}>
                <Grid container justify="center" alignItems="center" alignContent="center">
                  <Grid item xs={12} md={6}>
                    <center>
                      <img className={classes.funImg} src={Chat} alt="Contact-img" />
                      <Typography variant="body1" color="primary">
                        <WhereToVote />
                        Oasis Manor : 15116 Roxford Street Sylmar, CA 91342
                      </Typography>
                      <Link to="Tel: +1 310-9954859" style={{ textDecoration: "none" }}>
                        <Typography variant="body1" color="secondary">
                          <MobileScreenShare />
                          +1 310-9954859
                        </Typography>
                      </Link>
                    </center>
                  </Grid>
                  <Grid item xs={12} md={6} className={classes.form}>
                    <Typography align="center" color="secondary" variant="subtitle1">
                      {this.state.err}
                    </Typography>
                    <TextField value={this.state.name} onChange={this.handleChange("name")} fullWidth label="Your Name" />
                    <TextField value={this.state.email} onChange={this.handleChange("email")} fullWidth type="email" label="Email Address" />
                    <TextField value={this.state.mobile} onChange={this.handleChange("mobile")} fullWidth type="number" label="Phone Number" />
                    <TextField value={this.state.subject} onChange={this.handleChange("subject")} fullWidth label="Subject" />
                    <TextField
                      value={this.state.message}
                      onChange={this.handleChange("message")}
                      aria-label="message"
                      multiline
                      rowsMax="4"
                      placeholder="Enter your message here..."
                      fullWidth
                      label="Message"
                    />
                    <center>
                      <Fab onClick={() => this.handleSubmit()} variant="extended" color="secondary" size="small" aria-label="send" value="Send" style={{ paddingLeft: "20px" }}>
                        Send
                        <NearMe className={classes.extendedIcon} />
                      </Fab>
                    </center>
                  </Grid>
                </Grid>
              </Paper>
            </Container>
          </Grid>
          <Grid item xs={12}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3295.2296370493787!2d-118.4645646848214!3d34.319170780534165!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c28fc01a994ea7%3A0x23b6ad49d6b55df!2s15116%20Roxford%20St%2C%20Sylmar%2C%20CA%2091342%2C%20USA!5e0!3m2!1sen!2sin!4v1568903404012!5m2!1sen!2sin"
              width="100%"
              height="400"
              title="Oasis-on-Google-Map"
              frameBorder="0"
              allowFullScreen></iframe>
          </Grid>
        </Grid>
        <Footer />
      </section>
    );
  }
}

Contact.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Contact);
