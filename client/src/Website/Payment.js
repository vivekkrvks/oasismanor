import React, { Component } from "react";
import PropTypes from "prop-types";
import FileSaver from "file-saver";
import {
  withStyles,
  Grid,
  Chip,
  Input,
  Dialog,
  DialogContent,
  DialogActions,
  Typography,
  Button,
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
import {
  DoneOutline,
  ClearAll,
  Add,
  Close,
  DeleteForever,
  AccountBalanceWallet,
  Print,
  Delete
} from "@material-ui/icons/";
import MySnackbar from "../Components/MySnackbar";
import axios from "axios";
import { styles, todayDate } from "../Components/Style";
import Select from "react-select";
import SearchIcon from "@material-ui/icons/Search";

class Payments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      date: todayDate(),
      currentBalance: "",
      voucherNo: "",
      ledger: null,
      amount: "",
      discount: "",
      mode: null,
      reminderDate: "",
      remarks: "",

      process: false,
      allLedgers: [],
      showMode: false,
      tempPayment: {
        bankName: "",
        beneficiary: "",
        accountNo: "",
        abaNo: "",
        branch: "",
        remarks: ""
      },
      allModes: [],
      allPayments: [],
      message: "Add Payment Mode",
      page: 0,
      rowsPerPage: 5
    };
  }
  componentWillMount() {
    this.getPayments("");
    this.getAllLedgers();
    this.getAllModes();
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
  changeObject = (value, name) => {
    let tempPayment = { ...this.state.tempPayment };
    if (name === "bankName") {
      tempPayment.bankName = value;
    } else if (name === "beneficiary") {
      tempPayment.beneficiary = value;
    } else if (name === "accountNo") {
      tempPayment.accountNo = value;
    } else if (name === "abaNo") {
      tempPayment.abaNo = value;
    } else if (name === "branch") {
      tempPayment.branch = value;
    } else if (name === "remarks") {
      tempPayment.remarks = value;
    }
    this.setState({ tempPayment });
  };
  addNew = () => {
    let tempPayment = this.state.tempPayment;
    let allOk = true;
    if (tempPayment.bankName === "") {
      this.setState({ message: "Enter the Bank Name" });
      allOk = false;
    } else if (tempPayment.beneficiary === "") {
      this.setState({ message: "Enter the Beneficiary Name" });
      allOk = false;
    } else if (tempPayment.accountNo === "") {
      this.setState({ message: "Enter the Account Number" });
      allOk = false;
    } else if (tempPayment.abaNo === "") {
      this.setState({ message: "Enter the ABA Number" });
      allOk = false;
    }
    if (allOk) {
      axios
        .post("/api/transaction/mopvoucher/", tempPayment)
        .then(res =>
          this.setState(
            {
              message: res.data.message
            },
            () => this.getAllModes()
          )
        )
        .catch(err => console.log(err));
      // this.state.allModes.push(res.data);
      // this.setState(this.state);
      // this.setState({ message: "New Payment Mode Added" });
      allOk = false;
    }
  };

  handleSave = () => {
    const paymentVoucherValues = {
      date: this.state.date,
      ledger: this.state.ledger,
      amount: this.state.amount,
      modeOfPayment: this.state.mode,
      discount: this.state.discount,
      reminderDate: this.state.reminderDate,
      remarks: this.state.remarks
    };
    let route = "/api/transaction/paymentvoucher/";
    route += this.state.id;
    axios
      .post(route, paymentVoucherValues)
      .then(res => this.child.handleSnackbar(res.data))
      .then(() => this.setState({}, () => this.getPayments("")))
      .catch(err => console.log(err));

    this.handleClear();
  };

  handleClear = () => {
    this.setState({
      id: "",
      date: todayDate(),
      currentBalance: "",
      voucherNo: "",
      ledger: null,
      amount: "",
      mode: null,
      discount: "",
      reminderDate: "",
      remarks: "",
      process: false
    });
  };

  handleDelete = id => {
    let route = "/api/transaction/paymentvoucher/deletepayment/";
    route += id;
    axios
      .delete(route)
      .then(res => this.child.handleSnackbar(res.data))
      .then(() => this.setState({}, () => this.getPayments("")))
      .catch(err => console.log(err));
    this.handleClear();
  };
  getPayments = word => {
    let route = "/api/transaction/paymentvoucher/allpayment/";
    route += word;
    axios
      .get(route)
      .then(res => this.setState({ allPayments: res.data }))
      .catch(err => console.log(err));
  };
  getAllModes = () => {
    axios
      .get("/api/transaction/mopvoucher/all")
      .then(res => this.setState({ allModes: res.data }))
      .catch(err => console.log(err));
  };
  getAllLedgers = () => {
    axios
      .get("/api/auth/person/")
      .then(res => this.setState({ allLedgers: res.data }))
      .catch(err => console.log(err));
  };

  getCurrentBalance = () => {
    this.setState({ process: true });
    let route = "/api/report/transactionreport/cb/get/";
    route += this.state.ledger.value;
    axios
      .get(route)
      .then(res => this.setState({ currentBalance: res.data, process: null }))
      .catch(err => console.log(err));
  };

  setPaymentData = id => {
    let route = "/api/transaction/paymentvoucher/get/";
    route += id;
    axios
      .get(route)
      .then(res => {
        this.setState({
          id: res.data[0]._id,
          companyId: res.data[0].companyId,
          voucherNo: res.data[0].paymentVoucherNumber,
          date: res.data[0].date,
          ledger: res.data[0].ledger,
          amount: res.data[0].amount,
          mode: res.data[0].modeOfPayment,
          discount: res.data[0].discount,
          reminderDate: res.data[0].reminderDate,
          remarks: res.data[0].remarks
        });
      })
      .catch(err => console.log(err));
  };
  b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || "";
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  handlePrint = () => {
    const data = {
      companyId: this.state.companyId,
      invoiceNumber: this.state.voucherNo,
      invoiceDate: this.state.date,
      currentBalance: this.state.currentBalance,
      ledgerName: this.state.ledger.value,
      address: this.state.ledger.address,
      mobileNo: this.state.ledger.mobileNo,
      discount: this.state.discount,
      mode: this.state.mode.label,
      reminderDate: this.state.reminderDate,
      amount: this.state.amount,
      remarks: this.state.remarks
    };

    axios
      .post("/api/print/pdfmake/pdf/payment", data)
      .then(res => {
        let blob = this.b64toBlob(
          res.data,
          'type: "application/pdf;charset=utf-8"}'
        );
        FileSaver.saveAs(
          blob,
          `Payment-VoucherNo.-${this.state.voucherNo}.pdf`
        );
      })
      .catch(err => console.log(err));
  };
  handleDeleteMode = id => {
    axios
      .delete(`/api/transaction/mopVoucher/deletepayment/${id}`)
      .then(res =>
        this.setState({ message: res.data.message }, () => this.getAllModes())
      )
      .catch(err => console.log(err));
  };
  render() {
    const { classes } = this.props;

    return (
      <section>
        <Grid container>
          <Grid item xs={12} md={12} lg={9}>
            <Grid container spacing={2}>
              <Paper className={classes.entryArea}>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <TextField
                      id="reminderDate"
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
                      <Chip
                        color="secondary"
                        variant="outlined"
                        label="Payment"
                        className={classes.chip}
                      />
                    </center>
                  </Grid>
                  <Grid item xs={4}>
                    {this.state.ledger && (
                      <span>
                        {this.state.process ? (
                          <LinearProgress className={classes.progress} />
                        ) : this.state.process === false ? (
                          <Tooltip title="Current Balance">
                            <IconButton
                              color="primary"
                              style={{ float: "right" }}
                              onClick={this.getCurrentBalance}
                            >
                              <AccountBalanceWallet />
                            </IconButton>
                          </Tooltip>
                        ) : null}
                      </span>
                    )}
                    <Typography
                      variant="subtitle1"
                      align="right"
                      color="primary"
                    >
                      {this.state.currentBalance &&
                        `${this.state.currentBalance}`}
                      <br />
                      {this.state.voucherNo &&
                        `Voucher No. : ${this.state.voucherNo}`}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Select
                      value={this.state.ledger}
                      onChange={this.handleSelectChange("ledger")}
                      options={this.state.allLedgers.map(d => ({
                        value: d._id,
                        label: `${d.name} ~ ${d.designation}`
                      }))}
                      isSearchable
                      isClearable
                      autoFocus
                      placeholder="Enter Ledger Name"
                    />
                  </Grid>
                  <Grid item xs={6} md={6}>
                    <TextField
                      label="Amount Paid"
                      placeholder="$"
                      type="number"
                      variant="outlined"
                      value={this.state.amount}
                      onChange={this.handleChange("amount")}
                    />
                  </Grid>
                  <Grid item xs={6} md={6}>
                    <TextField
                      label="Discount"
                      type="number"
                      value={this.state.discount}
                      onChange={this.handleChange("discount")}
                    />
                  </Grid>
                  <Grid item xs={11} md={5}>
                    <Select
                      value={this.state.mode}
                      onChange={this.handleSelectChange("mode")}
                      options={this.state.allModes.map(d => ({
                        value: d._id,
                        label: `${d.bankName} ~ ${d.accountNo}`
                      }))}
                      isSearchable
                      isClearable
                      classes={classes}
                      components={{ Control }}
                      textFieldProps={{
                        label: "Mode of Payment",
                        InputLabelProps: {
                          shrink: true
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={1} md={1}>
                    <IconButton
                      onClick={() => this.setState({ showMode: true })}
                      aria-label="add"
                      className={classes.margin}
                      size="small"
                    >
                      <Add fontSize="inherit" />
                    </IconButton>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      id="reminderDate"
                      label="Reminder Date"
                      value={this.state.reminderDate}
                      onChange={this.handleChange("reminderDate")}
                      fullWidth
                      type="date"
                      InputLabelProps={{
                        shrink: true
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Remarks"
                      value={this.state.remarks}
                      placeholder="Remarks (if any)"
                      fullWidth
                      onChange={this.handleChange("remarks")}
                    />
                  </Grid>
                </Grid>
              </Paper>

              <Grid container className={classes.actionButton}>
                <Grid item xs={12}>
                  <center>
                    <Tooltip title={this.state.id === "" ? "Save" : "Update"}>
                      <Fab
                        color="primary"
                        onClick={this.handleSave}
                        className={classes.button}
                      >
                        <DoneOutline />
                      </Fab>
                    </Tooltip>
                    <Tooltip title="Clear All">
                      <Fab
                        size="small"
                        color="secondary"
                        onClick={this.handleClear}
                        className={classes.button}
                      >
                        <ClearAll />
                      </Fab>
                    </Tooltip>
                    {this.state.id !== "" && (
                      <span>
                        <Tooltip title="Delete Forever">
                          <Fab
                            size="small"
                            color="secondary"
                            onClick={() => this.handleDelete(this.state.id)}
                            className={classes.button}
                          >
                            <DeleteForever />
                          </Fab>
                        </Tooltip>
                        <Tooltip title="Print">
                          <Fab
                            size="small"
                            color="primary"
                            onClick={() => this.handlePrint()}
                            className={classes.button}
                          >
                            <Print />
                          </Fab>
                        </Tooltip>
                      </span>
                    )}
                  </center>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          {/* Add New Payment Mode */}
          <Dialog
            maxWidth="lg"
            open={this.state.showMode}
            onClose={() => this.setState({ showMode: false })}
            aria-labelledby="show-Payment"
          >
            <Typography color="primary" align="center" gutterBottom>
              {this.state.message}
            </Typography>
            <DialogContent>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Bank Name</TableCell>
                    <TableCell align="right">Beneficiary Name</TableCell>
                    <TableCell align="right">Account&nbsp;No.</TableCell>
                    <TableCell align="right">ABA Numer</TableCell>
                    <TableCell align="right">Branch Address</TableCell>
                    <TableCell align="right">Remarks</TableCell>
                    <TableCell align="right" />
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <TextField
                        placeholder="Bank Name"
                        onChange={e =>
                          this.changeObject(e.target.value, "bankName")
                        }
                      />
                    </TableCell>
                    <TableCell align="right">
                      <TextField
                        placeholder="Beneficiary Name"
                        onChange={e =>
                          this.changeObject(e.target.value, "beneficiary")
                        }
                      />
                    </TableCell>
                    <TableCell align="right">
                      <TextField
                        placeholder="Account&nbsp;No."
                        type="number"
                        onChange={e =>
                          this.changeObject(e.target.value, "accountNo")
                        }
                      />
                    </TableCell>
                    <TableCell align="right">
                      <TextField
                        placeholder="Routing Numer"
                        type="number"
                        onChange={e =>
                          this.changeObject(e.target.value, "abaNo")
                        }
                      />
                    </TableCell>
                    <TableCell align="right">
                      <TextField
                        placeholder="Branch Address"
                        onChange={e =>
                          this.changeObject(e.target.value, "branch")
                        }
                      />
                    </TableCell>
                    <TableCell align="right">
                      <TextField
                        placeholder="Remarks"
                        onChange={e =>
                          this.changeObject(e.target.value, "remarks")
                        }
                      />
                    </TableCell>
                    <TableCell align="right" />
                  </TableRow>

                  {this.state.allModes.map(row => (
                    <TableRow key={row._id}>
                      <TableCell component="th" scope="row">
                        {row.bankName}
                      </TableCell>
                      <TableCell align="right">{row.beneficiary}</TableCell>
                      <TableCell align="right">{row.accountNo}</TableCell>
                      <TableCell align="right">{row.abaNo}</TableCell>
                      <TableCell align="right">{row.branch}</TableCell>
                      <TableCell align="right">{row.remarks}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          onClick={() => this.handleDeleteMode(row._id)}
                          aria-label="close"
                          size="small"
                        >
                          <Delete fontSize="inherit" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </DialogContent>
            <DialogActions>
              <IconButton
                onClick={() => this.setState({ showMode: false })}
                aria-label="close"
                size="medium"
              >
                <Close fontSize="inherit" />
              </IconButton>
              <Button onClick={() => this.addNew()} color="primary">
                Add New
              </Button>
            </DialogActions>
          </Dialog>

          {/* Below -> SnackBar for message print */}
          <MySnackbar onRef={ref => (this.child = ref)} />

          {/* Below is serch Section */}

          <Grid item xs={12} md={12} lg={3}>
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <Input
                placeholder="All Payments..."
                onChange={e => this.getPayments(e.target.value)}
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
                    {this.state.allPayments
                      .slice(
                        this.state.page * this.state.rowsPerPage,
                        this.state.page * this.state.rowsPerPage +
                          this.state.rowsPerPage
                      )
                      .map(data => (
                        <TableRow
                          key={data._id}
                          onClick={() => this.setPaymentData(data._id)}
                          hover
                        >
                          <TableCell component="td" scope="row">
                            Ledger Name : {data.ledger.label} <br />
                            Amount : {data.amount} <br />
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TablePagination
                        count={this.state.allPayments.length}
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
      </section>
    );
  }
}
Payments.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Payments);

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
