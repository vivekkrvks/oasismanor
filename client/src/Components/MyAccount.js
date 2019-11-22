import React, { Component, Fragment } from "react";
import {
  withStyles,
  Chip,
  Container,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  LinearProgress,
  Tooltip,
  IconButton,
  Typography,
  Grid,
  Avatar
} from "@material-ui/core";
import axios from "axios";
import MySnackbar from "./MySnackbar";
import Progress from "./Progress";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { AccountBalanceWallet } from "@material-ui/icons/";
const styles = theme => ({
  chip: {
    marginTop: theme.spacing()
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular
  },
  progress: {
    width: "50%",
    float: "right",
    marginTop: theme.spacing()
  }
});

class MyAccount extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: "",
      userImage: "https://image.ibb.co/hXNh1z/img.jpg",
      name: "",
      designation: "",
      mobile: "",
      address: "",
      state: "",
      pinCode: "",
      email: "",
      password: "",
      remarks: "",
      salary: "",
      duration: "",
      documents: [],
      beneficiary: "",
      bankName: "",
      acNo: "",
      abaNo: "",
      branch: "",
      joiningDate: "",
      guest: "",
      selectedUserImg: null,
      oldPass: "",
      newPass: "",
      repeatPass: "",
      err: false,
      currentBalance: "",
      process: false
    };
  }

  componentWillMount() {
    this.getUser(localStorage.getItem("id"));
  }
  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };
  handlePassChange = () => {
    const {id, oldPass, newPass, repeatPass } = this.state;
    if (newPass === repeatPass) {
     const pass ={ oldPass:oldPass, newPass:newPass }
      axios
        .post(`/api/auth/register/pass/${id}`, pass)
        .then(res => 
          this.child.handleSnackbar(res.data))
        .catch(err => console.log(err));
    } else {
      this.child.handleSnackbar({ message: "Password Do not matched.", variant: "error" });
    }
  };
  getCurrentBalance = () => {
    this.setState({ process: true });
    let route = "/api/report/transactionreport/cb/get/";
    route += this.state.id;
    axios
      .get(route)
      .then(res => this.setState({ currentBalance: res.data, process: null }))
      .catch(err => console.log(err));
  };

  getUser = id => {
    axios
      .get(`/api/auth/get/${id}`)
      .then(res =>
        this.setState({
          id: res.data[0]._id,
          userImage: res.data[0].userImage,
          name: res.data[0].name,
          designation: res.data[0].designation,
          mobile: res.data[0].mobile,
          address: res.data[0].address,
          state: res.data[0].state,
          pinCode: res.data[0].pinCode,
          email: res.data[0].emailId,
          password: res.data[0].value,
          remarks: res.data[0].remarks,
          salary: res.data[0].salary,
          duration: res.data[0].duration,
          documents: res.data[0].documents,
          beneficiary: res.data[0].beneficiary,
          bankName: res.data[0].bankName,
          acNo: res.data[0].acNo,
          abaNo: res.data[0].abaNo,
          branch: res.data[0].branch,
          joiningDate: res.data[0].joiningDate,
          guest: res.data[0].guest,
          loading: false
        })
      )
      .catch(err => console.log(err));
  };

  render() {
    const { classes } = this.props;
    return (
      <Fragment>
        <Container>
          <center>
            <Chip color="primary" label={`Hello ${this.state.name}`} className={classes.chip} />
          </center>
          <Grid container>
            <Grid item xs={4} />
            <Grid item xs={4}>
              <center>
                <label htmlFor="userImage">
                  <Avatar alt="userImage" src={this.state.userImage} className={classes.chip} style={{ width: 80, height: 80, border: "2px solid #2196F3" }} />
                </label>
              </center>
            </Grid>
            <Grid item xs={4}>
              {this.state.process ? (
                <LinearProgress className={classes.progress} />
              ) : this.state.process === false ? (
                <Tooltip title="Current Balance">
                  <IconButton color="primary" style={{ float: "right" }} onClick={this.getCurrentBalance}>
                    <AccountBalanceWallet />
                  </IconButton>
                </Tooltip>
              ) : null}
              <Typography variant="subtitle1" align="right" color="secondary">
                {this.state.currentBalance}
              </Typography>
            </Grid>
          </Grid>

          <br />
          <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
              <Typography color="primary" className={classes.heading}>
                General Info
              </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Grid container>
                <Grid item xs={12} md={4}>
                  <Typography>{`Name : ${this.state.name}`}</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography>{`Designation : ${this.state.designation}`}</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography>{`Mobile No. : ${this.state.mobile}`}</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography>{`Address : ${this.state.address}`}</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography>{`State : ${this.state.state}`}</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography>{`PIN : ${this.state.pinCode}`}</Typography>
                </Grid>
              </Grid>
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
              <Typography color="primary" className={classes.heading}>
                Bank Details
              </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Grid container>
                <Grid item xs={12} md={4}>
                  <Typography>{`Bank Name : ${this.state.bankName}`}</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography>{`Account No. : ${this.state.acNo}`}</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography>{`Routing No. : ${this.state.abaNo}`}</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography>{`Branch Name : ${this.state.branch}`}</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography>{`Joining Date : ${this.state.joiningDate}`}</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography>{`Salary/Rent: ${this.state.salary} / ${this.state.duration}`}</Typography>
                </Grid>
              </Grid>
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
              <Typography color="primary" className={classes.heading}>
                My Documents
              </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>File Name</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Size</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.documents.map((t, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <a href={t.url} target="_blank" rel="noopener noreferrer">
                          {t.name}
                        </a>
                      </TableCell>
                      <TableCell>{t.format}</TableCell>
                      <TableCell>{t.size}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
              <Typography color="secondary" className={classes.heading}>
                Change Password
              </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <TextField
                    label="Enter Existing Password"
                    placeholder="Existing Password"
                    value={this.state.oldPass}
                    onChange={this.handleChange("oldPass")}
                    required
                    type="password"
                    autoFocus
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField label="Enter NEW Password" placeholder="New Password" value={this.state.newPass} type="password" onChange={this.handleChange("newPass")} required fullWidth />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    label="Repeat Password"
                    placeholder="Repeat Password"
                    type="password"
                    value={this.state.repeatPass}
                    onChange={this.handleChange("repeatPass")}
                    onBlur={() => (this.state.newPass !== this.state.repeatPass ? this.setState({ err: true }) : this.setState({ err: false }))}
                    required
                    error={this.state.err}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <center>
                    <Chip onClick={() => this.handlePassChange()} label="Change Password" />
                  </center>
                </Grid>
              </Grid>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </Container>
        {this.state.loading && <Progress />} <MySnackbar onRef={ref => (this.child = ref)} />
      </Fragment>
    );
  }
}
export default withStyles(styles)(MyAccount);
