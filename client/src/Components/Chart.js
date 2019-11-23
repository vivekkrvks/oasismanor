import React, { useEffect, useState } from "react";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import { makeStyles, Container } from "@material-ui/core/";
import axios from "axios";
import { Carousel } from "react-responsive-carousel";
import Progress from "./Progress";

const useStyles = makeStyles(theme => ({
  graphBg: {
    backgroundColor: "#cbf0f2",
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2)
  }
}));

export function AdminChart() {
  const classes = useStyles();
  const [dataLib, setDataLib] = useState({});
  const [userCount, setUserCount] = useState({});
  const [enquiry, setEnquiry] = useState({ labels: [] });

  useEffect(() => {
    // api for Enquiry chart
    axios
      .get("/api/report/chart/enqgraph/get")
      .then(res => setEnquiry(res.data))
      .catch(err => console.log(err));

    // api for User Count chart
    axios
      .get("/api/report/chart/userchart/get/")
      .then(res => setUserCount(res.data))
      .catch(err => console.log(err));

    // api for Asset Liability Count chart
    axios
      .get("/api/report/chart/incexp/get")
      .then(res => setDataLib(res.data))
      .catch(err => console.log(err));
  }, []);

  if (enquiry.labels.length === 0) {
    return <Progress />;
  } else
    return (
      <Container maxWidth="md">
        <Carousel showThumbs={false}>
          <div className={classes.graphBg}>
            <Bar data={enquiry} options={{ maintainAspectRatio: true }} />
          </div>
          <div className={classes.graphBg}>
            <Doughnut data={userCount} options={{ maintainAspectRatio: true }} />
          </div>
          <div className={classes.graphBg}>
            <Line data={dataLib} options={{ maintainAspectRatio: true }} />
          </div>
        </Carousel>
      </Container>
    );
}
