import React from "react";
import { makeStyles, Typography } from "@material-ui/core/";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles(theme => ({
  page: {
    position: "fixed",
    zIndex: 5,
    left: "45vw",
    top: "45vh",
    height: 110,
    width: 110,
    borderRadius: 10,
    opacity: 1,
    backgroundColor: "rgba(0,0,0,0.2)"
  },
  progress: {
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(4),
    marginRight: theme.spacing(3),
    marginBottom: theme.spacing(2)
  }
}));

export default function Progress() {
  const classes = useStyles();

  return (
    <div className={classes.page}>
      <CircularProgress className={classes.progress} color="secondary" />
      <Typography align="center" color="secondary">
        Loading...
      </Typography>
    </div>
  );
}
