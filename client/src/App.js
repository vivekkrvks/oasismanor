import React, { Fragment, Component } from "react";
import PropTypes from "prop-types";
import { AppBar, Toolbar, withStyles, CssBaseline, useScrollTrigger, Button, Hidden, SwipeableDrawer, Slide, IconButton, Tooltip } from "@material-ui/core/";
import { AccountCircle } from "@material-ui/icons";
import MenuIcon from "@material-ui/icons/Menu";
import MyDrawer from "./Components/MyDrawer";
import MainRoute from "./Components/MainRoute";
import { Link } from "react-router-dom";
import logo from "./svg/logo.svg";
import "./App.css";

const styles = theme => ({
  grow: {
    flexGrow: 1
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: 0
  },
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex"
    }
  },
  toolbar: theme.mixins.toolbar,
  anchor: {
    textDecoration: "none"
  }
});

function HideOnScroll(props) {
  const { children, window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({ target: window ? window() : undefined });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

HideOnScroll.propTypes = {
  children: PropTypes.node.isRequired,
  // Injected by the documentation to work in an iframe.
  // You won't need it on your project.
  window: PropTypes.func
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      drawerOpen: false
    };
  }
  handleDrawerToggle = () => {
    this.setState(state => ({ drawerOpen: !state.drawerOpen }));
  };
  render() {
    const { classes } = this.props;
    return (
      <Fragment>
        <CssBaseline />
        <HideOnScroll>
          <AppBar color="default">
            <Toolbar>
              <IconButton color="inherit" aria-label="Menu" onClick={this.handleDrawerToggle} className={classes.menuButton}>
                <MenuIcon />
              </IconButton>
              <Link to="/">
                <img src={logo} alt="logo" />
              </Link>
              <div className={classes.grow} />
              <div className={classes.sectionDesktop}>
                <Link to="/about" className={classes.anchor}>
                  <Button color="primary" className="font">
                    About Us
                  </Button>
                </Link>
                <Link to="/amenities" className={classes.anchor}>
                  <Button color="primary" className="font">
                    Amenities
                  </Button>
                </Link>
                <Link to="/blog" className={classes.anchor}>
                  <Button color="primary" className="font">
                    Blog
                  </Button>
                </Link>
                <Link to="/pricing" className={classes.anchor}>
                  <Button color="primary" className="font">
                    Pricing
                  </Button>
                </Link>
                <Link to="/contact" className={classes.anchor}>
                  <Button color="primary" className="font">
                    Contact Us
                  </Button>
                </Link>
              </div>
              <Link to="/login" className={classes.anchor}>
                <Tooltip title="Login">
                  <IconButton color="primary">
                    <AccountCircle />
                  </IconButton>
                </Tooltip>
              </Link>
            </Toolbar>
          </AppBar>
        </HideOnScroll>
        <Hidden>
          <SwipeableDrawer
            open={this.state.drawerOpen}
            onOpen={this.handleDrawerToggle}
            onClose={this.handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper
            }}
            ModalProps={{
              keepMounted: true // Better open performance on mobile.
            }}>
            <MyDrawer open={this.state.drawerOpen} handleDrawer={this.handleDrawerToggle} />
          </SwipeableDrawer>
        </Hidden>
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <MainRoute />
        </main>
      </Fragment>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(App);
