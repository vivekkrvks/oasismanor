import { fade } from "@material-ui/core/styles/colorManipulator";
const styles = theme => ({
  root: {
    flexGrow: 1,
    width: "100%"
  },
  entryArea: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(),
    padding: theme.spacing(2),
    paddingTop: 0,
    marginLeft: "auto",
    marginRight: "auto",
    maxWidth: "95%"
  },
  productCell: {
    minWidth: "250px",
    [theme.breakpoints.down("sm")]: {
      minWidth: "190px"
    }
  },
  progress: {
    width: "50%",
    float: "right",
    marginTop: theme.spacing()
  },
  checkboxCell: {
    minWidth: "180px",
    [theme.breakpoints.down("sm")]: {
      minWidth: "120px"
    }
  },
  chip: {
    marginTop: theme.spacing()
  },
  actionButton: {
    marginTop: theme.spacing(2)
  },
  button: {
    margin: theme.spacing(2)
  },
  snackbarContent: {
    backgroundColor: "#43a047"
  },
  snackbarMessage: {
    display: "flex",
    alignItems: "center"
  },
  snackbarIcon: {
    fontSize: 20,
    opacity: 0.9,
    marginRight: theme.spacing()
  },
  snackbarclose: {
    padding: theme.spacing() / 2
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade("#2196F3", 0.15),
    "&:hover": {
      backgroundColor: fade("#2196F3", 0.35)
    },
    margin: 10,
    width: "100%",
    [theme.breakpoints.up("xs")]: {
      marginLeft: theme.spacing(),
      width: "auto"
    }
  },
  searchIcon: {
    width: theme.spacing(9),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  input: {
    display: "flex",
    padding: 0
  },
  inputRoot: {
    color: "inherit",
    width: "100%"
  },
  inputInput: {
    paddingTop: theme.spacing(),
    paddingRight: theme.spacing(),
    paddingBottom: theme.spacing(),
    paddingLeft: theme.spacing(10),
    transition: theme.transitions.create("width"),
    width: "100%"
  },
  searchResult: {
    margin: 10
  }
});

function arrowGenerator(color) {
  return {
    '&[x-placement*="bottom"] $arrow': {
      top: 0,
      left: 0,
      marginTop: "-0.95em",
      width: "3em",
      height: "1em",
      "&::before": {
        borderWidth: "0 1em 1em 1em",
        borderColor: `transparent transparent ${color} transparent`
      }
    },
    '&[x-placement*="top"] $arrow': {
      bottom: 0,
      left: 0,
      marginBottom: "-0.95em",
      width: "3em",
      height: "1em",
      "&::before": {
        borderWidth: "1em 1em 0 1em",
        borderColor: `${color} transparent transparent transparent`
      }
    },
    '&[x-placement*="right"] $arrow': {
      left: 0,
      marginLeft: "-0.95em",
      height: "3em",
      width: "1em",
      "&::before": {
        borderWidth: "1em 1em 1em 0",
        borderColor: `transparent ${color} transparent transparent`
      }
    },
    '&[x-placement*="left"] $arrow': {
      right: 0,
      marginRight: "-0.95em",
      height: "3em",
      width: "1em",
      "&::before": {
        borderWidth: "1em 0 1em 1em",
        borderColor: `transparent transparent transparent ${color}`
      }
    }
  };
}

const todayDate = function todayDate() {
  var d = new Date(),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();
  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;
  return year + "-" + month + "-" + day;
};

export { styles, arrowGenerator, todayDate };
