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
  Dialog,
  DialogContent,
  DialogActions,
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
import { DoneOutline, ClearAll, DeleteForever, Delete, Close, AccountBalanceWallet, Image } from "@material-ui/icons/";
import AddIcon from "@material-ui/icons/Add";
import MySnackbar from "../Components/MySnackbar";
import Progress from "../Components/Progress";
import axios from "axios";
import { styles, todayDate } from "../Components/Style";
import Select from "react-select";
import SearchIcon from "@material-ui/icons/Search";

class Utility extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      date: todayDate(),
      currentBalance: "",
      voucherNo: "",
      utility: null,
      ledger: null,
      document: "",
      amount: "",
      refNo: "",
      viaBank: true,
      remarks: "",

      loading: false,
      showDialog: false,
      tempUtility: "",
      message: "List of All Utilities",

      allLedgers: [],
      allUtility: [],
      searchUtility: [],
      page: 0,
      rowsPerPage: 5
    };
  }
  componentWillMount() {
    this.getUtility();
    this.getAllLedgers();
    this.searchUtility("");
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };
  handleSelectChange = name => value => {
    this.setState({
      [name]: value
    });
  };

  handleSave = () => {
    this.setState({ loading: true });
    const utility = {
      date: this.state.date,
      utility: this.state.utility,
      ledger: this.state.ledger,
      document: this.state.document,
      amount: this.state.amount,
      viaBank: this.state.viaBank,
      refNo: this.state.refNo,
      remarks: this.state.remarks
    };
    let route = "/api/emp/uploadutility/";
    route += this.state.id;
    axios
      .post(route, utility)
      .then(res => this.child.handleSnackbar(res.data))
      .then(() => this.setState({}, () => this.searchUtility("")))
      .catch(err => console.log(err));

    this.handleClear();
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

  handleClear = () => {
    this.setState({
      id: "",
      date: todayDate(),
      currentBalance: "",
      voucherNo: "",
      utility: null,
      ledger: null,
      document: "",
      amount: "",
      refNo: "",
      viaBank: true,
      remarks: "",
      loading: false
    });
  };

  handleDelete = id => {
    this.setState({ loading: true });
    let route = "/api/emp/uploadutility/deleteutility/";
    route += id;
    axios
      .delete(route)
      .then(res => this.child.handleSnackbar(res.data))
      .then(() => this.setState({}, () => this.searchUtility("")))
      .catch(err => console.log(err));
    this.handleClear();
  };
  getUtility = () => {
    let route = "/api/emp/utility/allutility/";
    axios
      .get(route)
      .then(res => this.setState({ allUtility: res.data }))
      .catch(err => console.log(err));
  };
  searchUtility = word => {
    let route = "/api/emp/uploadutility/allutility/";
    route += word;
    axios
      .get(route)
      .then(res => this.setState({ searchUtility: res.data }))
      .catch(err => console.log(err));
  };
  getAllLedgers = () => {
    axios
      .get("/api/auth/person/")
      .then(res => this.setState({ allLedgers: res.data }))
      .catch(err => console.log(err));
  };

  getCurrentBalance = () => {
    this.setState({ loading: true });
    let route = "/api/report/transactionreport/cb/get/";
    route += this.state.ledger.value;
    axios
      .get(route)
      .then(res => this.setState({ currentBalance: res.data }))
      .catch(err => console.log(err));
    this.setState({ loading: false });
  };
  addNewUtility = () => {
    let newUtility = { utility: this.state.tempUtility };
    if (newUtility.utility) {
      axios
        .post("/api/emp/utility/", newUtility)
        .then(res => this.setState({ message: res.data.message }, () => this.getUtility()))
        .catch(err => console.log(err));
    } else {
      this.setState({ message: "Write Utility Name" });
    }
  };
  deleteUtility = id => {
    axios
      .delete(`/api/emp/utility/deleteutility/${id}`)
      .then(res => this.setState({ message: res.data.message }, () => this.getUtility()))
      .catch(err => console.log(err));
  };

  setUtilityData = id => {
    let route = " /api/emp/uploadutility/get/";
    route += id;
    axios
      .get(route)
      .then(res => {
        this.setState({
          id: res.data[0]._id,
          date: res.data[0].date,
          voucherNo: res.data[0].voucherNo,
          utility: res.data[0].utility,
          ledger: res.data[0].ledger,
          document: res.data[0].document,
          amount: res.data[0].amount,
          refNo: res.data[0].refNo,
          viaBank: res.data[0].viaBank,
          remarks: res.data[0].remarks
        });
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
                      <Chip color="secondary" variant="outlined" label="Upload Utility" className={classes.chip} />
                    </center>
                  </Grid>
                  <Grid item xs={4}>
                    {this.state.ledger && (
                      <span>
                        {this.state.loading ? (
                          <LinearProgress className={classes.progress} />
                        ) : this.state.loading === false ? (
                          <Tooltip title="Current Balance">
                            <IconButton color="primary" style={{ float: "right" }} onClick={this.getCurrentBalance}>
                              <AccountBalanceWallet />
                            </IconButton>
                          </Tooltip>
                        ) : null}
                      </span>
                    )}
                    <Typography variant="subtitle1" align="right" color="primary">
                      {this.state.currentBalance && `${this.state.currentBalance}`}
                      <br />
                      {this.state.voucherNo && `Voucher No. : ${this.state.voucherNo}`}
                    </Typography>
                  </Grid>
                  <Grid item xs={11}>
                    <Select
                      value={this.state.utility}
                      onChange={this.handleSelectChange("utility")}
                      options={this.state.allUtility.map(d => ({
                        value: d._id,
                        label: d.utility
                      }))}
                      isSearchable
                      isClearable
                      autoFocus
                      placeholder="Select Utility ..."
                    />
                  </Grid>
                  <Grid item xs={1}>
                    <IconButton onClick={() => this.setState({ showDialog: true })} color="primary" size="small" aria-label="add" className={classes.fab}>
                      <AddIcon />
                    </IconButton>
                  </Grid>
                  <Grid item xs={6} md={4}>
                    <TextField label="Amount Paid" placeholder="$" type="number" variant="outlined" value={this.state.amount} onChange={this.handleChange("amount")} />
                  </Grid>
                  <Grid item xs={6} md={4}>
                    <FormControlLabel
                      control={<Switch checked={this.state.viaBank} onChange={() => this.setState({ viaBank: !this.state.viaBank })} value={this.state.viaBank ? "Bank / Online" : "Cash"} />}
                      label={this.state.viaBank ? "Bank / Online" : "Cash"}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    {this.state.viaBank && <TextField label="Refrence No." fullWidth placeholder="Transaction ID" value={this.state.refNo} onChange={this.handleChange("refNo")} />}
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Select
                      value={this.state.ledger}
                      onChange={this.handleSelectChange("ledger")}
                      options={this.state.allLedgers.map(d => ({
                        value: d._id,
                        label: d.name
                      }))}
                      isSearchable
                      isClearable
                      classes={classes}
                      components={{ Control }}
                      textFieldProps={{
                        label: "Link Ledger",
                        InputLabelProps: {
                          shrink: true
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Payment Slip"
                      type="file"
                      name="paymentSlip"
                      style={{ float: "right" }}
                      InputLabelProps={{
                        shrink: true
                      }}
                      onChange={e => this.fileUpload(e.target.files[0])}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField label="Remarks" value={this.state.remarks} placeholder="Remarks (if any)" fullWidth onChange={this.handleChange("remarks")} />
                  </Grid>
                </Grid>
              </Paper>

              <Grid container className={classes.actionButton}>
                <Grid item xs={12}>
                  <center>
                    <Tooltip title={this.state.id === "" ? "Save" : "Update"}>
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
          {this.state.loading && <Progress />}
          <MySnackbar onRef={ref => (this.child = ref)} />

          {/* Below is Add New Utility Dialog  */}
          <Dialog maxWidth="lg" open={this.state.showDialog} onClose={() => this.setState({ showDialog: false })} aria-labelledby="show-Add-Utility">
            <Typography color="primary" align="center" gutterBottom>
              {this.state.message}
            </Typography>
            <DialogContent>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <TextField placeholder="New Utility" onChange={this.handleChange("tempUtility")} value={this.state.tempUtility} />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => this.addNewUtility()} aria-label="close" size="medium">
                        <AddIcon fontSize="inherit" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                  {this.state.allUtility.map(row => (
                    <TableRow key={row._id}>
                      <TableCell component="th" scope="row">
                        {row.utility}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton onClick={() => this.deleteUtility(row._id)} aria-label="close" size="small">
                          <Delete fontSize="inherit" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </DialogContent>
            <DialogActions>
              <IconButton onClick={() => this.setState({ showDialog: false })} aria-label="close" size="medium">
                <Close fontSize="inherit" />
              </IconButton>
            </DialogActions>
          </Dialog>

          {/* Below is serch Section */}

          <Grid item xs={12} md={12} lg={3}>
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <Input
                placeholder="All Utilities..."
                onChange={e => this.searchUtility(e.target.value)}
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
                    {this.state.searchUtility.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map(data => (
                      <TableRow key={data._id} onClick={() => this.setUtilityData(data._id)} hover>
                        <TableCell component="td" scope="row">
                          Utility : {data.utility.label} <br />
                          Amount : {data.amount} $ ~ By : {data.name}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TablePagination
                        count={this.state.searchUtility.length}
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
Utility.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Utility);

function inputComponent({ inputRef, ...props }) {
  return <div ref={inputRef} {...props} />;
}

function Control(props) {
  return (
    <TextField
      fullWidth
      InputProps={{
        inputComponent,
        inputProps: {
          className: props.selectProps.classes.input,
          inputRef: props.innerRef,
          children: props.children,
          ...props.innerProps
        }
      }}
      {...props.selectProps.textFieldProps}
    />
  );
}
