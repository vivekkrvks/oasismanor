import React, { Component } from "react";
import PropTypes from "prop-types";
import FormData from "form-data";
import { fade } from "@material-ui/core/styles/colorManipulator";
import {
  withStyles,
  Grid,
  Avatar,
  Input,
  Chip,
  TextField,
  InputAdornment,
  Paper,
  Fab,
  Tooltip,
  MenuItem,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  TableFooter
} from "@material-ui/core";
import { DoneOutline, ClearAll, DeleteForever, AccountCircle } from "@material-ui/icons/";
import MySnackbar from "../Components/MySnackbar";
import { todayDate } from "../Components/Style";
import Progress from "./Progress";
import axios from "axios";
import SearchIcon from "@material-ui/icons/Search";

const styles = theme => ({
  entryArea: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(),
    padding: theme.spacing(2),
    paddingTop: 0,
    marginLeft: "auto",
    marginRight: "auto",
    maxWidth: "95%"
  },
  chip: {
    marginTop: theme.spacing()
  },
  actionButton: {
    marginTop: theme.spacing(3)
  },
  button: {
    margin: theme.spacing(2)
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade("#2196F3", 0.15),
    "&:hover": {
      backgroundColor: fade("#2196F3", 0.35)
    },
    margin: 10,
    width: "100%",
    [theme.breakpoints.up("xs")]: {
      marginLeft: theme.spacing(),
      width: "auto"
    }
  },
  searchIcon: {
    width: theme.spacing(8),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  input: {
    display: "flex",
    padding: 0
  },
  inputRoot: {
    color: "inherit",
    width: "100%"
  },
  inputInput: {
    paddingTop: theme.spacing(),
    paddingRight: theme.spacing(),
    paddingBottom: theme.spacing(),
    paddingLeft: theme.spacing(10),
    transition: theme.transitions.create("width"),
    width: "100%"
  },
  searchResult: {
    margin: 10
  }
});

class AddUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      _id: "",
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
      joiningDate: todayDate(),
      guest: "",
      selectedUserImg: null,

      loading: false,
      allUsers: [],
      page: 0,
      rowsPerPage: 5
    };
  }
  componentDidMount() {
    this.getUsers("");
  }
  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };
  fileUpload = async (e, name) => {
    if (e) {
      this.setState({ loading: true });
      if (name === "document") {
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
          .then(res =>
            this.setState(prevState => ({
              documents: [
                { name: selectedFile.name, url: res.data.result.secure_url, format: res.data.result.format, size: res.data.result.bytes, public_id: res.data.result.public_id },
                ...prevState.documents
              ],
              loading: false
            }))
          )
          .catch(err => console.log(err));
      } else if (name === "userImage") {
        this.setState({
          selectedUserImg: e
        });
        let reader = new FileReader();
        let file = e;
        reader.onloadend = () => {
          this.setState({
            userImage: reader.result
          });
        };
        file && reader.readAsDataURL(file);
        const data = new FormData();
        data.append("photo", file, file.name);
        await axios
          .post(`/api/other/fileupload/upload`, data, {
            headers: {
              accept: "application/json",
              "Accept-Language": "en-US,en;q=0.8",
              "Content-Type": `multipart/form-data; boundary=${data._boundary}`
            }
          })
          .then(res => this.setState({ userImage: res.data.result.secure_url, loading: false }))
          .catch(err => console.log(err));
      }
    }
  };
  handleSave = () => {
    this.setState({ loading: true });
    let newUser = {
      _id: this.state._id,
      userImage: this.state.userImage,
      name: this.state.name,
      designation: this.state.designation,
      mobile: this.state.mobile,
      address: this.state.address,
      state: this.state.state,
      pinCode: this.state.pinCode,
      emailId: this.state.email,
      password: this.state.password,
      remarks: this.state.remarks,
      salary: this.state.salary,
      duration: this.state.duration,
      documents: this.state.documents,
      beneficiary: this.state.beneficiary,
      bankName: this.state.bankName,
      acNo: this.state.acNo,
      abaNo: this.state.abaNo,
      branch: this.state.branch,
      joiningDate: this.state.joiningDate,
      guest: this.state.guest
    };
    axios
      .post(`/api/auth/register/${this.state._id}`, newUser)
      .then(res => {
        this.child.handleSnackbar(res.data);
        this.handleClear();
      })
      .then(() => this.setState({}, () => this.getUsers("")))
      .catch(err => console.log(err));
  };

  handleClear = () => {
    this.setState({
      _id: "",
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
      joiningDate: todayDate(),
      guest: "",

      selectedUserImg: null,
      loading: false
    });
  };

  handleDelete = (id, cloudId, i) => {
    if (cloudId) {
      if (id) {
        this.setState({ loading: true });
        axios
          .post("/api/other/fileupload/delete", { public_id: cloudId })
          .then(res => this.child.handleSnackbar(res.data))
          .then(() =>
            this.setState(
              prevState => ({
                documents: [...prevState.documents.splice(i, i + 1)]
              }),
              () => this.handleSave()
            )
          )
          .catch(err => console.log(err));
      } else {
        axios
          .post("/api/other/fileupload/delete", { public_id: cloudId })
          .then(res => this.child.handleSnackbar(res.data))
          .catch(err => console.log(err));
      }
    } else {
      this.setState({ loading: true });
      let route = "/api/auth/deleteuser/";
      route += id;
      axios
        .delete(route)
        .then(res => this.child.handleSnackbar(res.data))
        .then(() => this.setState({}, () => this.getUsers("")))
        .catch(err => console.log(err));
      this.handleClear();
    }
  };
  getUsers = word => {
    this.setState({ loading: true });
    let route = "/api/auth/person/";
    route += word;
    axios
      .get(route)
      .then(res => this.setState({ allUsers: res.data, loading: false }))
      .catch(err => console.log(err));
  };

  setUserData = id => {
    this.setState({ loading: true });
    let route = "/api/auth/get/";
    route += id;
    axios
      .get(route)
      .then(res => {
        this.setState({
          _id: res.data[0]._id,
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
        });
      })
      .catch(err => console.log(err));
  };

  render() {
    const { classes } = this.props;
    return (
      <section>
        <Grid container>
          <Grid item xs={12} md={12} lg={9}>
            <Paper className={classes.entryArea}>
              <Grid container spacing={2}>
                <Grid item xs={4} />
                <Grid item xs={4}>
                  <center>
                    <Chip color="primary" label="Add User" className={classes.chip} />
                    <input accept="image/*" style={{ display: "none" }} id="userImage" type="file" onChange={e => this.fileUpload(e.target.files[0], "userImage")} />
                    <label htmlFor="userImage">
                      <Tooltip title="Click to Change User Image" placement="right">
                        <Avatar alt="userImage" src={this.state.userImage} className={classes.chip} style={{ width: 80, height: 80, border: "2px solid #2196F3" }} />
                      </Tooltip>
                    </label>
                  </center>
                </Grid>
                <Grid item xs={4} />
                <Grid item xs={12} md={4}>
                  <TextField
                    label="Name of the Person"
                    placeholder="Name..."
                    value={this.state.name}
                    onChange={this.handleChange("name")}
                    required
                    autoFocus
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AccountCircle />
                        </InputAdornment>
                      )
                    }}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField select id="designation" label="Designation" fullWidth value={this.state.designation} onChange={this.handleChange("designation")}>
                    <MenuItem value="Admin">Admin</MenuItem>
                    <MenuItem value="Manager">Manager</MenuItem>
                    <MenuItem value="Worker">Worker</MenuItem>
                    <MenuItem value="Guest">Guest Member </MenuItem>
                    <MenuItem value="Family">Family member</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField label="Contact Number" fullWidth type="number" value={this.state.mobile} onChange={this.handleChange("mobile")} />
                </Grid>
                <Grid item xs={12} md={8}>
                  <TextField label="Full Address" fullWidth value={this.state.address} onChange={this.handleChange("address")} />
                </Grid>
                <Grid item xs={6} sm={4}>
                  <TextField select fullWidth id="state" label="State" value={this.state.state} onChange={this.handleChange("state")}>
                    <MenuItem key="Al" value="Alabama - AL">
                      Alabama - AL
                    </MenuItem>
                    <MenuItem key="AZ" value="Arizona - AZ">
                      Arizona - AZ
                    </MenuItem>
                    <MenuItem key="AR" value="Arkansas - AR">
                      Arkansas - AR
                    </MenuItem>
                    <MenuItem key="AK" value="Alaska - AK ">
                      Alaska - AK
                    </MenuItem>
                    <MenuItem key="CA" value="Caoptionfornia - CA">
                      Caoptionfornia - CA
                    </MenuItem>
                    <MenuItem key="CO" value="Colorado - CO">
                      Colorado - CO
                    </MenuItem>
                    <MenuItem key="CT" value="Connecticut - CT">
                      Connecticut - CT
                    </MenuItem>
                    <MenuItem key="DE" value="Delaware - DE">
                      Delaware - DE
                    </MenuItem>
                    <MenuItem key="FL" value="Florida - FL">
                      Florida - FL
                    </MenuItem>
                    <MenuItem key="GA" value="Georgia - GA">
                      Georgia - GA
                    </MenuItem>
                    <MenuItem key="HI" value="Hawaii - HI">
                      Hawaii - HI
                    </MenuItem>
                    <MenuItem key="ID" value="Idaho - ID">
                      Idaho - ID
                    </MenuItem>
                    <MenuItem key="IL" value="Iloptionnois - IL">
                      Iloptionnois - IL
                    </MenuItem>
                    <MenuItem key="IN" value="Indiana - IN">
                      Indiana - IN
                    </MenuItem>
                    <MenuItem key="IA" value="Iowa - IA">
                      Iowa - IA
                    </MenuItem>
                    <MenuItem key="KS" value="Kansas - KS">
                      Kansas - KS
                    </MenuItem>
                    <MenuItem key="KY" value="Kentucky - KY">
                      Kentucky - KY
                    </MenuItem>
                    <MenuItem key="LA" value="Louisiana - LA">
                      Louisiana - LA
                    </MenuItem>
                    <MenuItem key="ME" value="Maine - ME">
                      Maine - ME
                    </MenuItem>
                    <MenuItem key="MD" value="Maryland - MD">
                      Maryland - MD
                    </MenuItem>
                    <MenuItem key="MA" value="Massachusetts - MA">
                      Massachusetts - MA
                    </MenuItem>
                    <MenuItem key="MI" value="Michigan - MI">
                      Michigan - MI
                    </MenuItem>
                    <MenuItem key="MN" value="Minnesota - MN">
                      Minnesota - MN
                    </MenuItem>
                    <MenuItem key="MS" value="Mississippi - MS">
                      Mississippi - MS
                    </MenuItem>
                    <MenuItem key="MO" value="Missouri - MO">
                      Missouri - MO
                    </MenuItem>
                    <MenuItem key="MT" value="Montana - MT">
                      Montana - MT
                    </MenuItem>
                    <MenuItem key="NE" value="Nebraska - NE">
                      Nebraska - NE
                    </MenuItem>
                    <MenuItem key="NV" value="Nevada - NV">
                      Nevada - NV
                    </MenuItem>
                    <MenuItem key="NH" value="New Hampshire - NH">
                      New Hampshire - NH
                    </MenuItem>
                    <MenuItem key="NJ" value="New Jersey - NJ">
                      New Jersey - NJ
                    </MenuItem>
                    <MenuItem key="NM" value="New Mexico - NM">
                      New Mexico - NM
                    </MenuItem>
                    <MenuItem key="NY" value="New York - NY">
                      New York - NY
                    </MenuItem>
                    <MenuItem key="NC" value="North Carooptionna - NC">
                      North Carooptionna - NC
                    </MenuItem>
                    <MenuItem key="ND" value="North Dakota - ND">
                      North Dakota - ND
                    </MenuItem>
                    <MenuItem key="OH" value="Ohio - OH">
                      Ohio - OH
                    </MenuItem>
                    <MenuItem key="OK" value="Oklahoma - OK">
                      Oklahoma - OK
                    </MenuItem>
                    <MenuItem key="OR" value="Oregon - OR">
                      Oregon - OR
                    </MenuItem>
                    <MenuItem key="PA" value="Pennsylvania - PA">
                      Pennsylvania - PA
                    </MenuItem>
                    <MenuItem key="RI" value="Rhode Island - RI">
                      Rhode Island - RI
                    </MenuItem>
                    <MenuItem key="SC" value="South Carooptionna - SC">
                      South Carooptionna - SC
                    </MenuItem>
                    <MenuItem key="SD" value="South Dakota - SD">
                      South Dakota - SD
                    </MenuItem>
                    <MenuItem key="TN" value="Tennessee - TN">
                      Tennessee - TN
                    </MenuItem>
                    <MenuItem key="TX" value="Texas - TX ">
                      Texas - TX
                    </MenuItem>
                    <MenuItem key="UT" value="Utah - UT">
                      Utah - UT
                    </MenuItem>
                    <MenuItem key="VT" value="Vermont - VT">
                      Vermont - VT
                    </MenuItem>
                    <MenuItem key="VA" value="Virginia - VA">
                      Virginia - VA
                    </MenuItem>
                    <MenuItem key="WA" value="Washington - WA">
                      Washington - WA
                    </MenuItem>
                    <MenuItem key="WV" value="West Virginia - WV">
                      West Virginia - WV
                    </MenuItem>
                    <MenuItem key="WI" value="Wisconsin - WI">
                      Wisconsin - WI
                    </MenuItem>
                    <MenuItem key="WY" value="Wyoming - WY">
                      Wyoming - WY
                    </MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <TextField label="Postal Code" fullWidth type="number" value={this.state.pinCode} onChange={this.handleChange("pinCode")} />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField label="Email" type="email" fullWidth value={this.state.email} onChange={this.handleChange("email")} />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField label="Password" fullWidth value={this.state.password} onChange={this.handleChange("password")} />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField label="Description / Remarks" fullWidth value={this.state.remarks} onChange={this.handleChange("remarks")} />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Grid container>
                    <Grid item xs={6}>
                      <TextField label="Salary / Rent ($)" type="number" fullWidth value={this.state.salary} onChange={this.handleChange("salary")} />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField label="Duration" select fullWidth value={this.state.duration} onChange={this.handleChange("duration")}>
                        <MenuItem value="Monthly">Monthly</MenuItem>
                        <MenuItem value="Hourly">Hourly</MenuItem>
                      </TextField>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Agreement Document"
                    type="file"
                    InputLabelProps={{
                      shrink: true
                    }}
                    onChange={e => this.fileUpload(e.target.files[0], "document")}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField label="Full beneficiary name" fullWidth value={this.state.beneficiary} onChange={this.handleChange("beneficiary")} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField label="Enter Bank Name" fullWidth value={this.state.bankName} onChange={this.handleChange("bankName")} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField label="Bank A/c Number" fullWidth type="number" value={this.state.acNo} onChange={this.handleChange("acNo")} />
                </Grid>
                <Grid item xs={6} md={4}>
                  <TextField label="Routing Number" fullWidth type="number" value={this.state.abaNo} onChange={this.handleChange("abaNo")} />
                </Grid>
                <Grid item xs={6} md={4}>
                  <TextField label="Branch Address" fullWidth value={this.state.branch} onChange={this.handleChange("branch")} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    id="Date"
                    label="Joing Date"
                    margin="dense"
                    value={this.state.joiningDate}
                    onChange={this.handleChange("joiningDate")}
                    type="date"
                    fullWidth
                    InputLabelProps={{
                      shrink: true
                    }}
                  />
                </Grid>
                {this.state.designation === "Family" && (
                  <Grid item xs={12} md={4}>
                    <TextField select id="allUser" label="Family of Guest..." fullWidth value={this.state.guest} onChange={this.handleChange("guest")}>
                      {this.state.allUsers.map(f => (
                        <MenuItem key={f.name} value={f.name}>
                          {f.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                )}
                <Grid container className={classes.actionButton}>
                  <Grid item xs={12}>
                    <center>
                      <Tooltip title={this.state._id === "" ? "Save" : "Update"}>
                        <Fab color="primary" onClick={this.handleSave} className={classes.button}>
                          <DoneOutline />
                        </Fab>
                      </Tooltip>
                      <Tooltip title="Clear All">
                        <Fab size="small" color="secondary" onClick={this.handleClear} className={classes.button}>
                          <ClearAll />
                        </Fab>
                      </Tooltip>
                      {this.state._id !== "" && (
                        <Tooltip title="Delete Forever">
                          <Fab size="small" color="secondary" onClick={() => this.handleDelete(this.state._id)} className={classes.button}>
                            <DeleteForever />
                          </Fab>
                        </Tooltip>
                      )}
                    </center>
                  </Grid>
                  <Grid item xs={12}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>File Name</TableCell>
                          <TableCell>Type</TableCell>
                          <TableCell>Size</TableCell>
                          <TableCell></TableCell>
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
                            <TableCell>
                              <DeleteForever onClick={() => this.handleDelete(this.state._id, t.public_id, i)} />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          {/* Below -> SnackBar for message print */}
          {this.state.loading && <Progress />} <MySnackbar onRef={ref => (this.child = ref)} />
          {/* Below is serch Section */}
          <Grid item xs={12} md={12} lg={3} className={classes.root}>
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <Input
                placeholder="Search User..."
                onChange={e => this.getUsers(e.target.value)}
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
                    {this.state.allUsers.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map(data => (
                      <TableRow key={data._id} onClick={() => this.setUserData(data._id)} hover>
                        <TableCell component="td" scope="row">
                          Name : {data.name} <br />
                          Designation : {data.designation}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TablePagination
                        count={this.state.allUsers.length}
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
AddUser.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(AddUser);
