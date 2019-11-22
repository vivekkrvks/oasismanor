import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles(theme => ({
  page: {
    position: "fixed",
    zIndex: 5,
    left: "50%",
    top: "50%",
    height: 70,
    width: 70,
    borderRadius: 10,
    opacity: 1,
    backgroundColor: "rgba(0,0,0,0.4)"
  },
  progress: {
    margin: theme.spacing(2)
  }
}));

export default function Progress() {
  const classes = useStyles();

  return (
    <div className={classes.page}>
      <CircularProgress className={classes.progress} color="secondary" />
    </div>
  );
}
