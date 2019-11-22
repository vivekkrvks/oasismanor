import React, { useEffect, useState } from "react";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import { makeStyles, Container } from "@material-ui/core/";
import axios from "axios";
import { Carousel } from "react-responsive-carousel";

const useStyles = makeStyles(theme => ({
  graphBg: {
    backgroundColor: "#cbf0f2",
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2)
  }
}));

export function AdminChart() {
  const [userCount, setUserCount] = useState({});
  const classes = useStyles();
  useEffect(() => {
    axios
      .get("/api/report/chart/userchart/get/")
      .then(res => setUserCount(res.data))
      .catch(err => console.log(err));
  }, []);
  return (
    <Container maxWidth="lg">
      <Carousel showThumbs={false}>
        <div className={classes.graphBg}>
          <AssetLib />
        </div>
        <div className={classes.graphBg}>
          <Doughnut data={userCount} options={{ maintainAspectRatio: true }} />
        </div>
     
        <div className={classes.graphBg}>
          <Enquiry />
        </div>
      </Carousel>
    </Container>
  );
}

function AssetLib() {
  const [dataLib, setDataLib] = useState({});
  useEffect(() => {
    axios
      .get("/api/report/chart/incexp/get")
      .then(res => setDataLib(res.data))
      .catch(err => console.log(err));
  }, []);
  return (
    <div>
      <Line data={dataLib} options={{ maintainAspectRatio: true }} />
    </div>
  );
}

// function UserCount() {
//   const [data, setData] = useState({});
//   useEffect(() => {
//     axios
//       .get("/api/report/chart/userchart/get/")
//       .then(res => setData(res.data))
//       .catch(err => console.log(err));
//   }, []);

//   return (
//     <div>
//       <Doughnut data={data} options={{ maintainAspectRatio: true }} />
//     </div>
//   );
// }

// function RentFig() {
//   const data = {
//     labels: ["Dues Rent", "Paid Rent"],
//     datasets: [
//       {
//         data: [2, 4],
//         backgroundColor: ["rgba(255, 99, 132, 0.8)", "rgba(54, 162, 235, 0.8)"],
//         borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)"],
//         borderWidth: 1
//       }
//     ]
//   };
//   return (
//     <div>
//       <Doughnut data={data} options={{ maintainAspectRatio: true }} />
//     </div>
//   );
// }

function Enquiry() {
  const [data, setData] = useState({});
  useEffect(() => {
    axios
      .get("/api/report/chart/enqgraph/get")
      .then(res => setData(res.data))
      .catch(err => console.log(err));
  }, []);
  
  return (
    <div>
      <Bar data={data} options={{ maintainAspectRatio: true }} />
    </div>
  );
}
