import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles, Dialog, DialogTitle, DialogActions, DialogContent, TextField, Button, Typography } from "@material-ui/core/";
import "../App.css";
import axios from "axios";
const styles = theme => ({
  titleOk: {
    textAlign: "center",
    color: "#26bf1e",
    background: "#b4f1f7"
  }
});

class Availability extends Component {
  constructor(props) {
    super(props);

    this.state = {
      appear: false,
      name: "",
      email: "",
      mobile: "",
      address: "",
      message: "Move your one step to grab best deal for you."
    };
  }
  componentDidMount() {
    this.props.onRef(this);
  }
  componentWillUnmount() {
    this.props.onRef(null);
  }
  handleAppear = () => {
    this.setState({ appear: !this.state.appear });
  };
  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };
  handleBooking = () => {
    const { name, email, mobile, address } = this.state;
    if (name === "") {
      this.setState({ message: "Please Enter the Name" });
    } else if (email === "") {
      this.setState({ message: "Please Enter your Email" });
    } else if (mobile === "") {
      this.setState({ message: "Enter Mobile No." });
    } else if (address === "") {
      this.setState({ message: "Enter your Address" });
    }
    if (name !== "" && email !== "" && mobile !== "" && address !== "") {
      const enquiry = { name: name, email: email, mobile: mobile, address: address, subject: "Seat enquiry", message: "Interested in seat availability.", formType: "Seat enquiry" };
      axios
        .post("api/other/room", enquiry)
        .then(res => this.setState({ name: "", email: "", mobile: "", address: "", message: res.data }))
        .catch(err => console.log(err));
    }
  };

  render() {
    const { classes } = this.props;
    return (
      <Dialog open={this.state.appear} disableBackdropClick onClose={() => this.handleAppear()}>
        <DialogTitle className={classes.titleOk}>Submit the form & We will get back to you.</DialogTitle>
        <DialogContent>
          <Typography color="secondary" align="center">
            {this.state.message}
          </Typography>
          <TextField autoFocus margin="dense" value={this.state.name} onChange={this.handleChange("name")} label="Your Name" fullWidth />
          <TextField margin="dense" value={this.state.email} onChange={this.handleChange("email")} label="Email Address" type="email" fullWidth />
          <TextField margin="dense" label="Mobile No." value={this.state.mobile} onChange={this.handleChange("mobile")} type="number" fullWidth />
          <TextField margin="dense" label="Address" value={this.state.address} onChange={this.handleChange("address")} fullWidth />
        </DialogContent>
        <DialogActions>
          <Button className="fab" onClick={() => this.setState({ appear: false })}>
            Cancel
          </Button>
          <Button variant="outlined" className="fab" onClick={() => this.handleBooking()} color="primary">
            Book Now
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
Availability.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Availability);
