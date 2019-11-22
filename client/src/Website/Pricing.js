import React from "react";
import { makeStyles } from "@material-ui/core/styles";
// import { Grid, TextField, Button, Paper } from "@material-ui/core";

const useStyles = makeStyles({
  root: {
    flexGrow: 1
  }
});

const Pricing = () => {
  const classes = useStyles();
  //   const [mainImage, setMainImage] = React.useState([]);

  return (
    <section className={classes.root}>
      <h4>I am Price Page</h4>
    </section>
  );
};

export default Pricing;
