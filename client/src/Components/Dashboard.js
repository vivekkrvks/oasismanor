import React, { useContext, useState, useEffect, Fragment } from "react";
import { makeStyles, Table, TableBody, TableCell, TableHead, TableRow, TableFooter, TablePagination, Typography, Container, Paper, Tabs, Tab } from "@material-ui/core";
import { AdminChart } from "./Chart";
import { FaChartBar, FaTable, FaUserEdit, FaTrash } from "react-icons/fa";
import MyAccount from "./MyAccount";
import { MainContext } from "./MainContext";
import { Redirect } from "react-router-dom";
import axios from "axios";

const useStyles = makeStyles(theme => ({
  tab: {
    position: "relative",
    bottom: 0,
    width: "100vw",
    marginBottom: theme.spacing(1)
  }
}));

export default function Dashboard() {
  const classes = useStyles();
  const { userInfo } = useContext(MainContext);
  const [tab, setTab] = useState(0);

  const BottomNav = () => {
    return (
      <Paper square className={classes.tab}>
        <Tabs value={tab} onChange={(e, v) => setTab(v)} variant="fullWidth" indicatorColor="secondary" centered textColor="primary" aria-label="icon tabs example">
          <Tab icon={<FaChartBar />} label="Charts" />
          <Tab icon={<FaTable />} label="Data View" />
          <Tab icon={<FaUserEdit />} label="My Account" />
        </Tabs>
      </Paper>
    );
  };
  switch (userInfo.designation) {
    case "Admin":
      return (
        <Fragment>
          <BottomNav />
          {tab === 0 ? (
            <div>
              <AdminChart />
            </div>
          ) : tab === 1 ? (
            <TableView />
          ) : tab === 2 ? (
            <MyAccount />
          ) : (
            <div>
              <h4>Select a Tab</h4>
            </div>
          )}
        </Fragment>
      );

    case "Manager":
      return <div>I am manager</div>;

    case "Worker":
      return <div>I am Worker</div>;

    case "Guest":
      return <div>I am Guest</div>;

    case "Family":
      return <div>I am Family</div>;

    default:
      return <Redirect to="/login" />;
  }
}

function TableView() {
  const [enquiry, setEnquiry] = useState([]);
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState(10);
  const getEnquiry = () => {
    axios
      .get("/api/report/chart/enquiryList/get")
      .then(res => setEnquiry(res.data))
      .catch(err => console.log(err));
  };
  useEffect(() => {
    getEnquiry();
  }, []);
  const handleRowDelete = id => {
    console.log("Delete this ID :" + id);
  };
  return (
    <Fragment>
      <Container maxWidth="lg">
        <Typography align="center" gutterBottom color="secondary">
          Enquiry List
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Name</TableCell>
              <TableCell align="center">Email</TableCell>
              <TableCell align="center">Phone No.</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>Message</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {enquiry.slice(page * rows, page * rows + rows).map((row, i) => (
              <TableRow key={i} hover>
                <TableCell component="th" scope="row">
                  {row.date}
                </TableCell>
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="center" size="small">
                  {row.email}
                </TableCell>
                <TableCell align="center" size="small">
                  {row.phoneNo}
                </TableCell>
                <TableCell size="small">{row.subject}</TableCell>
                <TableCell>{row.message}</TableCell>
                <TableCell>
                  <FaTrash onClick={() => handleRowDelete(row._id)} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination count={enquiry.length} rowsPerPage={rows} page={page} onChangePage={(e, page) => setPage(page)} onChangeRowsPerPage={e => setRows(e.target.value)} />
            </TableRow>
          </TableFooter>
        </Table>
      </Container>
    </Fragment>
  );
}
