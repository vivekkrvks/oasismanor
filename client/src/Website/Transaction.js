import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { withStyles, Container, Chip, Grid, Paper, Table, TableBody, TableRow, TableCell, TablePagination, TableFooter, TableHead } from "@material-ui/core";
import { styles } from "../Components/Style";
import Progress from "../Components/Progress";
import Select from "react-select";
import axios from "axios";

class Transaction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      name: "",
      ledger: null,
      allData: [],
      allUsers: [],
      cb: "",
      loading: true,
      page: 0,
      rowsPerPage: 20
    };
  }

  componentWillMount() {
    const name = localStorage.getItem("name");
    const id = localStorage.getItem("id");
    const designation = localStorage.getItem("designation");
    this.setState({ name, id });
    if (designation === "Admin" || designation === "Manager") {
      this.getUsers();
    }
    this.getTransaction(id);
  }

  handleSelectChange = name => value => {
    this.setState({
      [name]: value
    });
    if (value) {
      this.setState({ name: value.label, id: value.id }, () => this.getTransaction(value.value));
    }
  };
  getTransaction = id => {
    this.setState({ loading: true });
    let route = "/api/report/transactionreport/alltransaction/get/";
    route += id;
    axios
      .get(route)
      .then(res => this.setState({ allData: res.data, loading: false }))
      .catch(err => console.log(err));
    this.getCB(id);
  };
  getCB = id => {
    axios
      .get(`/api/report/transactionreport/cb/get/${id}`)
      .then(res => this.setState({ cb: res.data, loading: false }))
      .catch(err => console.log(err));
  };
  getUsers = () => {
    this.setState({ loading: true });
    axios
      .get("/api/auth/person/")
      .then(res => this.setState({ allUsers: res.data, loading: false }))
      .catch(err => console.log(err));
  };
  render() {
    const { classes } = this.props;
    return (
      <Fragment>
        <Container>
          <Paper className={classes.entryArea}>
            <Grid container>
              <Grid item md={4}>
                <center>
                  <Chip variant="outlined" label={this.state.cb} className={classes.chip} />
                </center>
              </Grid>
              <Grid item xs={12} md={4}>
                <center>
                  <Chip color="secondary" variant="outlined" label={`Ledger : ${this.state.name}`} className={classes.chip} />
                </center>
              </Grid>
              <Grid item xs={12} md={4}>
                <Select
                  className={classes.chip}
                  value={this.state.ledger}
                  onChange={this.handleSelectChange("ledger")}
                  options={this.state.allUsers.map(d => ({
                    value: d._id,
                    label: d.name
                  }))}
                  isSearchable
                  isClearable
                  placeholder="Select Ledger"
                />
              </Grid>
              <Grid item xs={12}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Particulars</TableCell>
                      <TableCell align="center">Debit</TableCell>
                      <TableCell align="center">Credit</TableCell>
                      <TableCell>Naration</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.allData.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map((row, i) => (
                      <TableRow key={i} hover>
                        <TableCell component="th" scope="row">
                          {row.date}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {row.particulars}
                        </TableCell>
                        <TableCell align="center" size="small">
                          {row.debit}
                        </TableCell>
                        <TableCell align="center" size="small">
                          {row.credit}
                        </TableCell>
                        <TableCell size="small">{row.naration}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TablePagination
                        count={this.state.allData.length}
                        rowsPerPage={this.state.rowsPerPage}
                        page={this.state.page}
                        onChangePage={(e, page) => this.setState({ page })}
                        onChangeRowsPerPage={e => this.setState({ rowsPerPage: e.target.value })}
                      />
                    </TableRow>
                  </TableFooter>
                </Table>
              </Grid>
            </Grid>
          </Paper>

          {this.state.loading && <Progress />}
        </Container>
      </Fragment>
    );
  }
}
Transaction.propTypes = {
  classes: PropTypes.object.isRequired
};
export default withStyles(styles)(Transaction);
