import React, { Component } from "react";
// import PropTypes from "prop-types";
import { withStyles, Table, TableBody, TableCell, TableHead, TableRow, TableFooter, TablePagination, Typography, Container, Paper, Tabs, Tab } from "@material-ui/core";
import { AdminChart } from "./Chart";
import { FaChartBar, FaTable, FaUserEdit, FaTrash } from "react-icons/fa";
import MyAccount from "./MyAccount";
import axios from "axios";

const styles = theme => ({
  tab: {
    position: "absolute",
    bottom: 0
  }
});

class Dashboard extends Component {
  constructor(props) {

    super(props);

    this.state = {
      designation: "Guest",
      tab: 0,
      enquiry: [{ date: "20/04/2019", name: "Raghav Jha", email: "raghav@gmail.com", phoneNo: "+91-6205060692", subject: "Contact", message: "Hi, Contact me." }],
      page: 0,
      rowsPerPage: 10
    };
   
  }
  componentDidMount() {
    const designation = localStorage.getItem("designation");
    this.setState({ designation });
  }
  componentWillMount() {
    this.getEnquiry();
  }
  getEnquiry = () => {
    axios
      .get("/api/report/chart/enquiryList/get")
      .then(res => this.setState({ enquiry: res.data }))
      .catch(err => console.log(err));
  };
  render() {
    window.onload = function() {
      if(!window.location.hash) {
          window.location = window.location + '#loaded';
          window.location.reload();
      }
  }
    // if (this.state.loggedIn === false) {
    //   return <Redirect to="/login" />;
    // }
    const { classes } = this.props;
    const { tab } = this.state;
    if (this.state.designation === "Admin") {
      return (
        <section>
          {tab === 0 ? (
            <AdminChart />
          ) : tab === 1 ? (
            <div>
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
                    {this.state.enquiry.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map((row, i) => (
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
                          <FaTrash />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TablePagination
                        count={this.state.enquiry.length}
                        rowsPerPage={this.state.rowsPerPage}
                        page={this.state.page}
                        onChangePage={(e, page) => this.setState({ page })}
                        onChangeRowsPerPage={e => this.setState({ rowsPerPage: e.target.value })}
                      />
                    </TableRow>
                  </TableFooter>
                </Table>
              </Container>
            </div>
          ) : tab === 2 ? (
            <MyAccount />
          ) : (
            <div>Select a Tab </div>
          )}
          <Paper square className={classes.tab}>
            <Tabs value={this.state.tab} onChange={(e, v) => this.setState({ tab: v })} variant="fullWidth" indicatorColor="secondary" centered textColor="primary" aria-label="icon tabs example">
              <Tab icon={<FaChartBar />} label="Charts" />
              <Tab icon={<FaTable />} label="Data View" />
              <Tab icon={<FaUserEdit />} label="My Account" />
            </Tabs>
          </Paper>
        </section>
      );
    } else if (this.state.designation === "Manager") {
      return (
        <section>
          {tab === 0 ? (
            <AdminChart />
          ) : tab === 1 ? (
            <div>
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
                    {this.state.enquiry.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map((row, i) => (
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
                          <FaTrash />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TablePagination
                        count={this.state.enquiry.length}
                        rowsPerPage={this.state.rowsPerPage}
                        page={this.state.page}
                        onChangePage={(e, page) => this.setState({ page })}
                        onChangeRowsPerPage={e => this.setState({ rowsPerPage: e.target.value })}
                      />
                    </TableRow>
                  </TableFooter>
                </Table>
              </Container>
            </div>
          ) : tab === 2 ? (
            <MyAccount />
          ) : (
            <div>Select a Tab </div>
          )}
          <Paper square className={classes.tab}>
            <Tabs value={this.state.tab} onChange={(e, v) => this.setState({ tab: v })} variant="fullWidth" indicatorColor="secondary" centered textColor="primary" aria-label="icon tabs example">
              <Tab icon={<FaChartBar />} label="Charts" />
              <Tab icon={<FaTable />} label="Data View" />
              <Tab icon={<FaUserEdit />} label="My Account" />
            </Tabs>
          </Paper>
        </section>
      );
    } else if (this.state.designation === "Worker") {
      return (
        <section>
          <MyAccount />
        </section>
      );
    } else if (this.state.designation === "Guest") {
      return (
        <section>
          <MyAccount />
        </section>
      );
    } else if (this.state.designation === "Family") {
      return (
        <section>
          <MyAccount />
        </section>
      );
    } else
      return (
        <Typography variant="h1" component="h2">
          Sorry ! I can not understand your designation.
        </Typography>
      );
  }
}
Dashboard.propTypes = {};

// Dashboard.propTypes = {
//   classes: PropTypes.object.isRequired
// };
export default withStyles(styles)(Dashboard);
