import React, { Component } from "react";
import PropTypes from "prop-types";
// import { Link } from "react-router-dom";
import topBanner from "../svg/banner-assisted-living.jpg";
import { withStyles, Grid, Typography, Paper, Container } from "@material-ui/core";
import Footer from "../Components/Footer";
import { FaUserMd, FaWifi, FaClock, FaTshirt, FaLeaf, FaAppleAlt, FaBed, FaJoomla, FaJenkins } from "react-icons/fa";
// import client from "../Config/Contentful";
import "../App.css";

const styles = theme => ({
  topBanner: {
    top: "0%",
    height: "40vh",
    backgroundImage: `url("${topBanner}")`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center"
  },
  button: {
    margin: theme.spacing(1)
  },
  myContainer: {
    zIndex: 2,
    marginTop: "-40px",
    marginBottom: "30px"
  }
});

class Amenities extends Component {
  constructor(props) {
    super(props);

    this.state = {
      items: [],
      iconBox: [
        { icon: <FaClock />, title: "24-Hour Care", para: "Grab all facilities whenever you wish with our 24-Hour Front Desk Service" },
        { icon: <FaWifi />, title: "Free Wifi Campus", para: "High speed Wifi campus to get a strong connectivity available for our all guest." },
        { icon: <FaUserMd />, title: "Doctor on Call", para: "We do care about your Safe and Secure trip hence provide you the best." },
        { icon: <FaTshirt />, title: "Laundry Service", para: "Washing clothes is not at all your problem now, Our laundry service." },
        { icon: <FaAppleAlt />, title: "Healthy Diet", para: "We prepare the healthy meal always as it is the first essential thing." },
        { icon: <FaBed />, title: "Comfertable Bed", para: "Washing clothes is not at all your problem now, Our laundry service." },
        { icon: <FaJenkins />, title: "Alzheimer's & Dementia Care", para: "Memory care services are focused firmly on the individual." },
        { icon: <FaJoomla />, title: "Entertainment Hub", para: "Enables the guest to connect to all entertainment features." }
      ]
    };
  }

  componentWillMount() {
    // client
    //   .getEntries({ content_type: "blog" })
    //   .then(entry => this.setState({ items: entry.items }))
    //   .catch(err => console.log(err));
  }

  render() {
    const { classes } = this.props;
    return (
      <section>
        <Grid container>
          <Grid item xs={12} className={classes.topBanner}>
            <Typography variant="h5" className="heading" align="center">
              <FaLeaf />
              {"\u00A0"}
              Our Amenities
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Container className={classes.myContainer}>
              <Paper elevation={4}>
                <Grid container spacing={2} justify="center" alignContent="center" alignItems="center">
                  {this.state.iconBox.map(d => (
                    <Grid item xs={12} key={d.title} md={6} lg={3}>
                      <Typography align="center" color="secondary" variant="h5">
                        {d.icon}
                      </Typography>
                      <Typography align="center" color="primary" variant="h6">
                        {d.title}
                      </Typography>
                      <Typography align="center" paragraph>
                        {d.para}
                      </Typography>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Container>
            {/* <Feather /> */}
          </Grid>
        </Grid>
        <Footer />
      </section>
    );
  }
}

Amenities.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Amenities);

// function Feather(props) {
//   return (
//     <section>
//       <Container maxWidth="xl">
//         <Grid container justify="center" alignContent="center" alignItems="center">
//           <Grid item xs={12} md={6} lg={3} className="myCard">
//             <Typography variant="h2">Hi</Typography>
//             <Typography variant="h3">Service One</Typography>
//             <Typography paragraph>
//               Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ipsum architecto animi magni impedit quisquam nemo deleniti dignissimos, quis delectus pariatur. Praesentium eligendi alias
//               pariatur nesciunt consequuntur aliquid? Quibusdam, iure explicabo.
//             </Typography>
//             <Button variant="outlined" color="secondary" className="card-btn">
//               Explore More
//             </Button>
//           </Grid>
//           <Grid item xs={12} md={6} lg={3}></Grid>
//           <Grid item xs={12} md={6} lg={3}></Grid>
//           <Grid item xs={12} md={6} lg={3}></Grid>
//         </Grid>
//       </Container>
//     </section>
//   );
// }
