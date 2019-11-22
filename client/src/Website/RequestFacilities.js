import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import {
  withStyles,
  Grid,
  Chip,
  Input,
  Typography,
  Switch,
  FormControlLabel,
  TextField,
  Paper,
  IconButton,
  Fab,
  LinearProgress,
  Tooltip,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  TableFooter
} from "@material-ui/core";
import { DoneOutline, ClearAll, DeleteForever, AccountBalanceWallet, Image } from "@material-ui/icons/";
import MySnackbar from "../Components/MySnackbar";
import Progress from "../Components/Progress";
import axios from "axios";
import { styles, todayDate } from "../Components/Style";
import Select from "react-select";
import SearchIcon from "@material-ui/icons/Search";

class RequestFacilities extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      date: todayDate(),
      currentBalance: "",
      voucherNo: "",
      facilities: null,
      visualToFamily: true,
      refNo: "",
      document: "",
      paid: false,

      remarks: "",

      total: 0,
      loading: false,

      allUtilities: [],
      allFacilities: [],
      page: 0,
      rowsPerPage: 5
    };
  }
  componentWillMount() {
    this.getFacilities("");
    this.getUtilities();
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };
  handleSelectChange = name => value => {
    this.setState(
      {
        [name]: value
      },
      () => this.calTotal()
    );
  };
  getUtilities = () => {
    axios
      .get("/api/emp/facility/allfacility")
      .then(res => this.setState({ allUtilities: res.data }))
      .catch(err => console.log(err));
  };
  fileUpload = async e => {
    if (e) {
      this.setState({ loading: true });
      const selectedFile = e;
      const data = new FormData();
      data.append("photo", selectedFile, selectedFile.name);
      await axios
        .post(`/api/other/fileupload/upload`, data, {
          headers: {
            accept: "application/json",
            "Accept-Language": "en-US,en;q=0.8",
            "Content-Type": `multipart/form-data; boundary=${data._boundary}`
          }
        })
        .then(res => this.setState({ document: res.data.result.secure_url }))
        .catch(err => console.log(err));
      this.setState({ loading: false });
    }
  };

  handleSave = () => {
    this.setState({ loading: true });
    const RequestFacilities = {
      date: this.state.date,
      facilities: this.state.facilities,
      visualToFamily: this.state.visualToFamily,
      paid: this.state.paid,
      refNo: this.state.refNo,
      voucherNo: this.state.voucherNo,
      document: this.state.document,
      remarks: this.state.remarks
    };
    let route = "/api/emp/requestfacilities/";
    route += this.state.id;
    axios
      .post(route, RequestFacilities)
      .then(res => this.child.handleSnackbar(res.data))
      .then(() => this.setState({}, () => this.getFacilities("")))
      .catch(err => console.log(err));

    this.handleClear();
  };

  handleClear = () => {
    this.setState({
      id: "",
      date: todayDate(),
      currentBalance: "",
      voucherNo: "",
      facilities: null,
      visualToFamily: true,
      refNo: "",
      document: "",
      paid: false,

      remarks: "",

      total: 0,
      loading: false
    });
  };
  calTotal = () => {
    const data = this.state.facilities;
    let total = 0;
    if (data) {
      data.map(d => (total += +d.price));
    }
    this.setState({ total });
  };

  handleDelete = id => {
    this.setState({ loading: true });
    let route = "/api/emp/requestfacilities/deletefacilities/";
    route += id;
    axios
      .delete(route)
      .then(res => this.child.handleSnackbar(res.data))
      .then(() => this.setState({}, () => this.getFacilities("")))
      .catch(err => console.log(err));
    this.handleClear();
  };
  getFacilities = id => {
    let route = "/api/emp/requestfacilities/all/";
    route += id;
    axios
      .get(route)
      .then(res => this.setState({ allFacilities: res.data }))
      .catch(err => console.log(err));
  };

  setFacility = id => {
    let route = "/api/emp/requestfacilities/get/";
    route += id;
    axios
      .get(route)
      .then(res => {
        this.setState(
          {
            id: res.data[0]._id,
            date: res.data[0].date,
            voucherNo: res.data[0].voucherNo,
            facilities: res.data[0].facilities,
            visualToFamily: res.data[0].visualToFamily,
            refNo: res.data[0].refNo,
            document: res.data[0].document,
            paid: res.data[0].paid,
            remarks: res.data[0].remarks
          },
          () => this.calTotal()
        );
      })
      .catch(err => console.log(err));
  };
  render() {
    const { classes } = this.props;

    return (
      <Fragment>
        <Grid container>
          <Grid item xs={12} md={12} lg={9}>
            <Grid container spacing={2}>
              <Paper className={classes.entryArea}>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <TextField
                      id="Date"
                      label="Date"
                      margin="dense"
                      value={this.state.date}
                      onChange={this.handleChange("date")}
                      type="date"
                      InputLabelProps={{
                        shrink: true
                      }}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <center>
                      <Chip color="secondary" variant="outlined" label="Request Services" className={classes.chip} />
                    </center>
                  </Grid>
                  <Grid item xs={4}>
                    {this.state.loading ? (
                      <LinearProgress className={classes.progress} />
                    ) : this.state.loading === false ? (
                      <Tooltip title="Current Balance">
                        <IconButton color="primary" style={{ float: "right" }} onClick={this.getCurrentBalance}>
                          <AccountBalanceWallet />
                        </IconButton>
                      </Tooltip>
                    ) : null}

                    <Typography variant="subtitle1" align="right" color="primary">
                      {this.state.currentBalance && `${this.state.currentBalance}`}
                      <br />
                      {this.state.voucherNo && `Voucher No. : ${this.state.voucherNo}`}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Select
                      value={this.state.facilities}
                      onChange={this.handleSelectChange("facilities")}
                      options={this.state.allUtilities.map(d => ({
                        value: d._id,
                        price: d.price,
                        label: `${d.facility} ~ ${d.price} $`
                      }))}
                      isSearchable
                      isClearable
                      autoFocus
                      isMulti
                      placeholder="Select Facilities ..."
                    />
                  </Grid>
                  <Grid item xs={6} md={4}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={this.state.visualToFamily}
                          onChange={() => this.setState({ visualToFamily: !this.state.visualToFamily })}
                          value={this.state.visualToFamily ? "Visual to Family" : "Hide from Family"}
                        />
                      }
                      label={this.state.visualToFamily ? "Visual to Family" : "Hide from Family"}
                    />
                  </Grid>
                  <Grid item xs={6} md={4}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={this.state.paid}
                          onChange={() => this.setState({ paid: !this.state.paid })}
                          value={this.state.paid ? `$ ${this.state.total} ~ Paid` : `$ ${this.state.total} ~ Not Paid`}
                        />
                      }
                      label={this.state.paid ? `$ ${this.state.total} ~ Paid` : `$ ${this.state.total} ~ Not Paid`}
                    />
                  </Grid>
                  {this.state.paid ? (
                    <Grid item xs={12} md={4}>
                      <TextField label="Refrence No." placeholder="Transaction ID" value={this.state.refNo} onChange={this.handleChange("refNo")} />
                      <input style={{ display: "none" }} onChange={e => this.fileUpload(e.target.files[0])} id="uploadDoc" multiple type="file" />
                      <label htmlFor="uploadDoc">
                        <Fab size="small" variant="extended" component="span" className={classes.button}>
                          Document
                        </Fab>
                      </label>
                    </Grid>
                  ) : (
                    <Grid item xs={12} md={4}>
                      <Typography align="center">You can also pay later.</Typography>
                    </Grid>
                  )}

                  <Grid item xs={12}>
                    <TextField label="Additional information" value={this.state.remarks} placeholder="Remarks (if any)" fullWidth onChange={this.handleChange("remarks")} />
                  </Grid>
                </Grid>
              </Paper>

              <Grid container className={classes.actionButton}>
                <Grid item xs={12}>
                  <center>
                    <Tooltip title={this.state.id === "" ? "Place Order" : "Update your Order"}>
                      <Fab color="primary" onClick={this.handleSave} className={classes.button}>
                        <DoneOutline />
                      </Fab>
                    </Tooltip>
                    <Tooltip title="Clear All">
                      <Fab size="small" color="secondary" onClick={this.handleClear} className={classes.button}>
                        <ClearAll />
                      </Fab>
                    </Tooltip>
                    {this.state.document !== "" && (
                      <Tooltip title="View File">
                        <a href={this.state.document} target="_blank" rel="noopener noreferrer">
                          <Fab size="small" color="secondary" className={classes.button}>
                            <Image />
                          </Fab>
                        </a>
                      </Tooltip>
                    )}
                    {this.state.id !== "" && (
                      <Tooltip title="Delete Forever">
                        <Fab size="small" color="secondary" onClick={() => this.handleDelete(this.state.id)} className={classes.button}>
                          <DeleteForever />
                        </Fab>
                      </Tooltip>
                    )}
                  </center>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          {/* Below -> SnackBar for message print */}
          {this.state.loading && <Progress loading={this.state.loading} />}
          <MySnackbar onRef={ref => (this.child = ref)} />

          {/* Below is serch Section */}

          <Grid item xs={12} md={12} lg={3}>
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <Input
                placeholder="Search by Voucher No"
                onChange={e => this.getFacilities(e.target.value)}
                disableUnderline
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput
                }}
              />
            </div>
            <div className={classes.searchResult}>
              <Paper>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        Search Results
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.allFacilities.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map(data => (
                      <TableRow key={data._id} onClick={() => this.setFacility(data._id)} hover>
                        <TableCell component="td" scope="row">
                          Voucher No. : {data.voucherNo} ~ By : {data.name} <br />
                          Order Date : {data.currentdate}
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
            </div>
          </Grid>
        </Grid>
      </Fragment>
    );
  }
}
RequestFacilities.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(RequestFacilities);
