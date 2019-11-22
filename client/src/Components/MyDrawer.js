import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles, Divider, Avatar, Chip, List, ListItem, ListItemText, ListItemIcon } from "@material-ui/core";
import { Link } from "react-router-dom";
import {
  FaThLarge,
  FaBookReader,
  FaCentos,
  FaAsymmetrik,
  FaFileInvoiceDollar,
  FaHeadset,
  FaUserCog,
  FaSignOutAlt,
  FaReceipt,
  FaArrowCircleUp,
  FaArrowCircleDown,
  FaDonate,
  FaUserCircle,
  FaPeopleCarry
} from "react-icons/fa";

const styles = theme => ({
  drawer: {
    width: 300,
    [theme.breakpoints.down("md")]: {
      width: 250
    }
  },
  topArea: {
    width: "100%",
    height: "120px",
    marginTop: -20,
    background: "linear-gradient(to right, #c2e59c, #64b3f4)"
  },
  chip: {
    margin: theme.spacing()
  },
  avatar: {
    width: 60,
    height: 60,
    border: "2px solid #00c853"
  },
  avatarPosition: {
    position: "relative",
    top: 40,
    zIndex: 3
  },
  anchor: {
    textDecoration: "none"
  }
});

export class MyDrawer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      designation: "Visitor",
      name: "Guest",
      userImage: "https://i.ibb.co/6wHq3Zw/guest.jpg"
    };
  }
  componentWillReceiveProps = () => {
    if (localStorage.designation) {
      let designation = localStorage.designation;
      let name = localStorage.name;
      let userImage = localStorage.userImage;
      this.setState({ designation, name, userImage });
    }
  };

  render() {
    const { classes } = this.props;
    return (
      <section className={classes.drawer}>
        <div className={classes.topArea}>
          <span className={classes.avatarPosition}>
            <center>
              <Chip label={` Welcome ~  ${this.state.name}`} color="primary" className={classes.chip} />
              <Avatar alt="user-Img" src={this.state.userImage} className={classes.avatar} />
            </center>
          </span>
        </div>
        <br />
        <br />
        {this.state.designation === "Admin" ? (
          <List component="nav" aria-label="Main Drawer">
            <span onClick={this.props.handleDrawer}>
              <Link to="/dashboard" className={classes.anchor}>
                <ListItem button>
                  <ListItemIcon>
                    <FaThLarge />
                  </ListItemIcon>
                  <ListItemText primary="Dashboard" />
                </ListItem>
              </Link>
            </span>
            <span onClick={this.props.handleDrawer}>
              <Link to="/addUser" className={classes.anchor}>
                <ListItem button>
                  <ListItemIcon>
                    <FaUserCog />
                  </ListItemIcon>
                  <ListItemText primary="Add User" />
                </ListItem>
              </Link>
            </span>
            <span onClick={this.props.handleDrawer}>
              <Link to="/addfacility" className={classes.anchor}>
                <ListItem button>
                  <ListItemIcon>
                    <FaPeopleCarry />
                  </ListItemIcon>
                  <ListItemText primary="Add Facility" />
                </ListItem>
              </Link>
            </span>
            <span onClick={this.props.handleDrawer}>
              <Link to="/utility" className={classes.anchor}>
                <ListItem button>
                  <ListItemIcon>
                    <FaDonate />
                  </ListItemIcon>
                  <ListItemText primary="Upload Utility" />
                </ListItem>
              </Link>
            </span>
            <span onClick={this.props.handleDrawer}>
              <Link to="/payment" className={classes.anchor}>
                <ListItem button>
                  <ListItemIcon>
                    <FaArrowCircleUp />
                  </ListItemIcon>
                  <ListItemText primary="Payment" />
                </ListItem>
              </Link>
            </span>
            <span onClick={this.props.handleDrawer}>
              <Link to="/receipt" className={classes.anchor}>
                <ListItem button>
                  <ListItemIcon>
                    <FaArrowCircleDown />
                  </ListItemIcon>
                  <ListItemText primary="Receipt" />
                </ListItem>
              </Link>
            </span>
            <span onClick={this.props.handleDrawer}>
              <Link to="/transaction" className={classes.anchor}>
                <ListItem button>
                  <ListItemIcon>
                    <FaReceipt />
                  </ListItemIcon>
                  <ListItemText primary="Show Transaction" />
                </ListItem>
              </Link>
            </span>
          </List>
        ) : this.state.designation === "Manager" ? (
          <List component="nav" aria-label="Main Drawer">
            <span onClick={this.props.handleDrawer}>
              <Link to="/dashboard" className={classes.anchor}>
                <ListItem button>
                  <ListItemIcon>
                    <FaThLarge />
                  </ListItemIcon>
                  <ListItemText primary="Dashboard" />
                </ListItem>
              </Link>
            </span>
            <span onClick={this.props.handleDrawer}>
              <Link to="/utility" className={classes.anchor}>
                <ListItem button>
                  <ListItemIcon>
                    <FaDonate />
                  </ListItemIcon>
                  <ListItemText primary="Upload Utility" />
                </ListItem>
              </Link>
            </span>
            <span onClick={this.props.handleDrawer}>
              <Link to="/payment" className={classes.anchor}>
                <ListItem button>
                  <ListItemIcon>
                    <FaArrowCircleUp />
                  </ListItemIcon>
                  <ListItemText primary="Payment" />
                </ListItem>
              </Link>
            </span>
            <span onClick={this.props.handleDrawer}>
              <Link to="/receipt" className={classes.anchor}>
                <ListItem button>
                  <ListItemIcon>
                    <FaArrowCircleDown />
                  </ListItemIcon>
                  <ListItemText primary="Receipt" />
                </ListItem>
              </Link>
            </span>
            <span onClick={this.props.handleDrawer}>
              <Link to="/transaction" className={classes.anchor}>
                <ListItem button>
                  <ListItemIcon>
                    <FaReceipt />
                  </ListItemIcon>
                  <ListItemText primary="Show Transaction" />
                </ListItem>
              </Link>
            </span>
            <span onClick={this.props.handleDrawer}>
              <Link to="/addfacility" className={classes.anchor}>
                <ListItem button>
                  <ListItemIcon>
                    <FaPeopleCarry />
                  </ListItemIcon>
                  <ListItemText primary="Add Facility" />
                </ListItem>
              </Link>
            </span>
          </List>
        ) : this.state.designation === "Worker" ? (
          <List component="nav" aria-label="Main Drawer">
            <span onClick={this.props.handleDrawer}>
              <Link to="/dashboard" className={classes.anchor}>
                <ListItem button>
                  <ListItemIcon>
                    <FaThLarge />
                  </ListItemIcon>
                  <ListItemText primary="Dashboard" />
                </ListItem>
              </Link>
            </span>
            <span onClick={this.props.handleDrawer}>
              <Link to="/utility" className={classes.anchor}>
                <ListItem button>
                  <ListItemIcon>
                    <FaDonate />
                  </ListItemIcon>
                  <ListItemText primary="Upload Utility" />
                </ListItem>
              </Link>
            </span>
            <span onClick={this.props.handleDrawer}>
              <Link to="/transaction" className={classes.anchor}>
                <ListItem button>
                  <ListItemIcon>
                    <FaReceipt />
                  </ListItemIcon>
                  <ListItemText primary="Show Transaction" />
                </ListItem>
              </Link>
            </span>
          </List>
        ) : this.state.designation === "Guest" ? (
          <List component="nav" aria-label="Main Drawer">
            <span onClick={this.props.handleDrawer}>
              <Link to="/dashboard" className={classes.anchor}>
                <ListItem button>
                  <ListItemIcon>
                    <FaThLarge />
                  </ListItemIcon>
                  <ListItemText primary="Dashboard" />
                </ListItem>
              </Link>
            </span>
            <span onClick={this.props.handleDrawer}>
              <Link to="/requestfacilities" className={classes.anchor}>
                <ListItem button>
                  <ListItemIcon>
                    <FaPeopleCarry />
                  </ListItemIcon>
                  <ListItemText primary="Request Services" />
                </ListItem>
              </Link>
            </span>
            <span onClick={this.props.handleDrawer}>
              <Link to="/transaction" className={classes.anchor}>
                <ListItem button>
                  <ListItemIcon>
                    <FaReceipt />
                  </ListItemIcon>
                  <ListItemText primary="Show Transaction" />
                </ListItem>
              </Link>
            </span>
          </List>
        ) : this.state.designation === "Family" ? (
          "I am Family"
        ) : (
          ""
        )}
        <List component="nav" aria-label="Main Drawer">
          <span onClick={this.props.handleDrawer}>
            <Link to="/about" className={classes.anchor}>
              <ListItem button>
                <ListItemIcon>
                  <FaAsymmetrik />
                </ListItemIcon>
                <ListItemText primary="About Us" />
              </ListItem>
            </Link>
          </span>
          <span onClick={this.props.handleDrawer}>
            <Link to="/amenities" className={classes.anchor}>
              <ListItem button>
                <ListItemIcon>
                  <FaCentos />
                </ListItemIcon>
                <ListItemText primary="Our Amenities" />
              </ListItem>
            </Link>
          </span>
          <span onClick={this.props.handleDrawer}>
            <Link to="/blog" className={classes.anchor}>
              <ListItem button>
                <ListItemIcon>
                  <FaBookReader />
                </ListItemIcon>
                <ListItemText primary="Blog" />
              </ListItem>
            </Link>
          </span>
          <span onClick={this.props.handleDrawer}>
            <Link to="/pricing" className={classes.anchor}>
              <ListItem button>
                <ListItemIcon>
                  <FaFileInvoiceDollar />
                </ListItemIcon>
                <ListItemText primary="Pricing" />
              </ListItem>
            </Link>
          </span>
          <span onClick={this.props.handleDrawer}>
            <Link to="/contact" className={classes.anchor}>
              <ListItem button>
                <ListItemIcon>
                  <FaHeadset />
                </ListItemIcon>
                <ListItemText primary="Contact Us" />
              </ListItem>
            </Link>
          </span>

          <Divider />
          {this.state.designation === "Visitor" ? (
            <span onClick={this.props.handleDrawer}>
              <Link to="/login" className={classes.anchor}>
                <ListItem button>
                  <ListItemIcon>
                    <FaUserCircle />
                  </ListItemIcon>
                  <ListItemText primary="My Account" />
                </ListItem>
              </Link>
            </span>
          ) : (
            <span onClick={this.props.handleDrawer}>
              <ListItem
                button
                onClick={() => {
                  localStorage.clear();
                  window.location.reload();
                }}>
                <ListItemIcon>
                  <FaSignOutAlt />
                </ListItemIcon>
                <ListItemText primary="Log Out" />
              </ListItem>
            </span>
          )}
        </List>
      </section>
    );
  }
}
MyDrawer.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(MyDrawer);
