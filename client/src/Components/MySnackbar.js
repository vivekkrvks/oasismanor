import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import ErrorIcon from "@material-ui/icons/Error";
import InfoIcon from "@material-ui/icons/Info";
import CloseIcon from "@material-ui/icons/Close";
import green from "@material-ui/core/colors/green";
import amber from "@material-ui/core/colors/amber";
import IconButton from "@material-ui/core/IconButton";
import Snackbar from "@material-ui/core/Snackbar";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import WarningIcon from "@material-ui/icons/Warning";
import { withStyles } from "@material-ui/core/styles";

const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon
};

const styles = theme => ({
  success: {
    backgroundColor: green[600]
  },
  error: {
    backgroundColor: theme.palette.error.dark
  },
  info: {
    backgroundColor: theme.palette.primary.dark
  },
  warning: {
    backgroundColor: amber[700]
  },
  icon: {
    fontSize: 20
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing()
  },
  message: {
    display: "flex",
    alignItems: "center"
  }
});

class MySnackbar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      appear: false,
      message: "",
      variant: "success"
    };
  }
  componentDidMount() {
    this.props.onRef(this);
  }
  componentWillUnmount() {
    this.props.onRef(null);
  }
  handleSnackbar = data => {
    this.setState({ appear: !this.state.appear, message: data.message, variant: data.variant });
  };

  render() {
    const { classes } = this.props;
    const Icon = variantIcon[this.state.variant];

    return (
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "center"
        }}
        open={this.state.appear}
        autoHideDuration={5000}
        onClose={() => this.setState({ appear: false, message: "" })}>
        <SnackbarContent
          className={classes[this.state.variant]}
          aria-describedby="client-snackbar"
          message={
            <span id="client-snackbar" className={classes.message}>
              <Icon className={classNames(classes.icon, classes.iconVariant)} />
              {this.state.message}
            </span>
          }
          action={[
            <IconButton key="close" aria-label="Close" color="inherit" className={classes.close} onClick={() => this.setState({ appear: false, message: "" })}>
              <CloseIcon className={classes.icon} />
            </IconButton>
          ]}
        />
      </Snackbar>
    );
  }
}
MySnackbar.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(MySnackbar);

// variant: PropTypes.oneOf(["success", "warning", "error", "info"]).isRequired
