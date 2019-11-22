import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { withStyles, Container, Chip, TextField, Paper, IconButton, Table, TableBody, TableRow, TableCell, TablePagination, TableFooter } from "@material-ui/core";
import { styles } from "./Style";
import { MdDeleteForever, MdAdd, MdModeEdit } from "react-icons/md";
import MySnackbar from "./MySnackbar";
import axios from "axios";
class AddFacility extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      facility: "",
      price: "",
      remarks: "",
      allFacilities: [],
      page: 0,
      rowsPerPage: 5
    };
  }
  componentDidMount() {
    this.getFacilities("");
  }

  getFacilities = id => {
    let route = "/api/emp/facility/allfacility/";
    route += id;
    axios
      .get(route)
      .then(res => this.setState({ allFacilities: res.data }))
      .catch(err => console.log(err));
  };
  addNew = () => {
    let { facility, price, remarks, id } = this.state;
    if (facility && price) {
      let newData = {
        facility: facility,
        price: price,
        remarks: remarks
      };
      axios
        .post(`/api/emp/facility/${id}`, newData)
        .then(res => this.child.handleSnackbar(res.data))
        .then(() => this.setState({}, () => this.getFacilities("")))
        .catch(err => console.log(err));
      this.handleClear();
    } else {
      alert("Fill facility & Price");
    }
  };
  handleClear = () => {
    this.setState({
      id: "",
      facility: "",
      price: "",
      remarks: ""
    });
  };

  setFacility = id => {
    axios
      .get(`/api/emp/facility/get/${id}`)
      .then(res =>
        this.setState({
          id: res.data[0]._id,
          facility: res.data[0].facility,
          price: res.data[0].price,
          remarks: res.data[0].remarks
        })
      )
      .catch(err => console.log(err));
  };
  deleteFacility = id => {
    axios
      .delete(`/api/emp/facility/deletefacility/${id}`)
      .then(res => this.child.handleSnackbar(res.data))
      .then(() => this.setState({}, () => this.getFacilities("")))
      .catch(err => console.log(err));
  };
  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  render() {
    const { classes } = this.props;
    return (
      <Fragment>
        <Container>
          <Paper className={classes.entryArea}>
            <center>
              <Chip color="secondary" variant="outlined" label="Add Facility" className={classes.chip} />
            </center>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <TextField placeholder="Facility Name" fullWidth onChange={this.handleChange("facility")} value={this.state.facility} />
                  </TableCell>
                  <TableCell>
                    <TextField placeholder="Price" onChange={this.handleChange("price")} value={this.state.price} />
                  </TableCell>
                  <TableCell>
                    <TextField placeholder="Remarks" onChange={this.handleChange("remarks")} value={this.state.remarks} />
                  </TableCell>
                  <TableCell align="right" size="small">
                    <IconButton color="primary" onClick={() => this.addNew()} aria-label="close" size="medium">
                      <MdAdd fontSize="inherit" />
                    </IconButton>
                  </TableCell>
                </TableRow>
                {this.state.allFacilities.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map(row => (
                  <TableRow key={row._id} hover>
                    <TableCell component="th" scope="row">
                      {row.facility}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.price}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.remarks}
                    </TableCell>
                    <TableCell align="right" size="small">
                      <IconButton onClick={() => this.setFacility(row._id)} aria-label="close" size="small">
                        <MdModeEdit fontSize="inherit" />
                      </IconButton>
                    </TableCell>
                    <TableCell align="right" size="small">
                      <IconButton onClick={() => this.deleteFacility(row._id)} aria-label="close" size="small">
                        <MdDeleteForever fontSize="inherit" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    count={this.state.allFacilities.length}
                    rowsPerPage={this.state.rowsPerPage}
                    page={this.state.page}
                    onChangePage={(e, page) => this.setState({ page })}
                    onChangeRowsPerPage={this.handleChange("rowsPerPage")}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </Paper>
        </Container>

        <MySnackbar onRef={ref => (this.child = ref)} />
      </Fragment>
    );
  }
}
AddFacility.propTypes = {
  classes: PropTypes.object.isRequired
};
export default withStyles(styles)(AddFacility);
