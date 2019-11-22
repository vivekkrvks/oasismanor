import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles, Grid, Typography, Fab, Container, Avatar, Divider } from "@material-ui/core";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Availability from "../Components/Availability";
import Footer from "../Components/Footer";
import { Carousel } from "react-responsive-carousel";
import { Link } from "react-router-dom";
import { FaPlay } from "react-icons/fa";
import NavigationIcon from "@material-ui/icons/Navigation";
import "../App.css";
const styles = theme => ({
  root: {
    flexGrow: 1,
    overflowX: "hidden",
    width: "100%"
  },
  icons: {
    fontSize: theme.spacing(6),
    [theme.breakpoints.down("md")]: {
      fontSize: theme.spacing(5)
    },
    color: "#e52020",
    lineHeight: 1
  },
  extendedIcon: {
    marginRight: theme.spacing(1)
  },
  iconBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  topPara: {
    [theme.breakpoints.up("md")]: {
      marginTop: theme.spacing(6)
    }
  },
  featureBox: {
    textAlign: "center",
    [theme.breakpoints.down("md")]: {
      textAlign: "left"
    }
  },

  paragraph: {
    color: "#fff",
    fontSize: "13px"
  },
  button: {
    margin: theme.spacing()
  },
  rightIcon: {
    marginLeft: theme.spacing()
  }
});

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      carousel: true,
      feathers: [
        {
          img: "https://i.ibb.co/1zpwBSJ/card-5.jpg",
          label: "Assisted Living",
          line: "Oasis manor is a world-class, refreshingly-new concept in senior citizens' community living, for all kind of older adults who need a short-term or permanent stay.",
          title: "Explore Living Stander"
        },
        {
          img: "https://i.ibb.co/z8BfF3V/card-2.jpg",
          label: "Alzheimer's & Memory Care",
          line: "Diagnosis of Alzheimer disease requires both the the presence of dementia and regular doctor checkup that we offer on demand at very affordable price.",
          title: "Read Blogs & articles"
        },
        {
          img: "https://i.ibb.co/1QdNZyT/card-3.jpg",
          label: "Healthy & Hygienic food",
          line: "In Oasis Manor, we believe that healthy & hygienic meal is the primary need for each person, hence we serve you fruits & green vegetables on regular basis.",
          title: "See Weekly Meal Plan"
        },
        {
          img: "https://i.ibb.co/Ybyg8Zt/card-4.jpg",
          label: "Respite Care",
          line: "A safe, familiar, and stimulating environment designed for seniors living with complete care. Oasis Manor is dedicated to Respite care of our all guest personally.",
          title: "All Amenities"
        },
        {
          img: "https://i.ibb.co/JRHcMVG/card-7.jpg",
          label: "Yoga and meditation Camps",
          line: 'Professional yoga & meditation camps in "Oasis Manor" helps you in balancing the relationship between body and mind. Online training series is also available for our guest.',
          title: "Watch Yoga Online"
        },
        {
          img: "https://i.ibb.co/8c0QFSk/card-6.jpg",
          label: "24 hour medical support",
          line: "Keeping you physically healthy and fit is our prime goal, so we regularly do the necessary medical tests and arrange appropriate doctor 24 * 7 (if needed).",
          title: "Explore Medical services"
        }
      ],
      testimonials: [
        {
          img: "https://avada.theme-fusion.com/wp-content/uploads/2019/07/man_testimonial_1.png",
          message:
            "Curabitur non tristique tortor. Vestibulum aliquet suscipit ipsum in volutpat. Donec vel lacinia sem, vitae semper nulla. In hac habitasse platea dictumst. Mauris consectetur est et nibh sadip hendrerit biben",
          name: "William Genske",
          company: "Google Inc"
        },
        {
          img: "https://avada.theme-fusion.com/wp-content/uploads/2019/07/woman_testimonial_4.jpg",
          message:
            "Curabitur non tristique tortor. Vestibulum aliquet suscipit ipsum in volutpat. Donec vel lacinia sem, vitae semper nulla. In hac habitasse platea dictumst. Mauris consectetur est et nibh sadip hendrerit biben",
          name: "Lisa Smith",
          company: "Facebook Inc"
        },
        {
          img: "https://avada.theme-fusion.com/wp-content/uploads/2019/07/man_testimonial_3.jpg",
          message:
            "Curabitur non tristique tortor. Vestibulum aliquet suscipit ipsum in volutpat. Donec vel lacinia sem, vitae semper nulla. In hac habitasse platea dictumst. Mauris consectetur est et nibh sadip hendrerit biben",
          name: "William Genske",
          company: "Apple Inc"
        }
      ]
    };
  }
  render() {
    const { classes } = this.props;
    return (
      <section className={classes.root}>
        <Carousel showThumbs={false} infiniteLoop useKeyboardArrows autoPlay>
          <div>
            <img src="https://i.ibb.co/SK6pMVz/home-banner-desktop.jpg" alt="home-banner-desktop" border="0" />
          </div>
          <div>
            <img src="https://i.ibb.co/PtncCDd/home-banner-MC-desktop.jpg" alt="home-banner-MC-desktop" border="0"></img>
          </div>
          <div>
            <img src="https://i.ibb.co/SnZkZbW/oasis-baner-4.jpg" alt="care-services-banner-desktop" border="0" />
          </div>
          <div>
            <img src="https://i.ibb.co/vD8WJWS/oasis-banner-3.jpg" alt="banner-personal-care" border="0"></img>
          </div>
        </Carousel>
        <Grid className="bgArea">
          <Container>
            <Typography align="center" color="secondary" variant="h6">
              Services at your fingertips
            </Typography>
            <Typography align="center" gutterBottom variant="body1">
              Highly interactive & user-friendly interface
            </Typography>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={6}>
                <Link to="/">
                  <img style={{ float: "right" }} src="https://i.ibb.co/wYDCPCh/oasis-manor.png" alt="oasis-Dashboard" border="0" />
                </Link>
              </Grid>
              <Grid item xs={12} sm={6} className={classes.topPara}>
                <Typography gutterBottom variant="h6">
                  Get all live updates online
                </Typography>
                <Typography gutterBottom variant="body1">
                  You can place online requests for all activities and services in the Oasis Manor web portal, which can also be visible to your relatives also.
                </Typography>
                <Fab onClick={() => this.child.handleAppear()} variant="extended" size="medium" color="secondary" aria-label="add" className="fab">
                  <NavigationIcon className={classes.extendedIcon} />
                  Get Quotation
                </Fab>
              </Grid>
            </Grid>
          </Container>
          <Availability onRef={ref => (this.child = ref)} />
        </Grid>

        <Grid className="feathers">
          <Typography align="center" color="secondary" variant="h6">
            Comfortable Retirement Home
          </Typography>
          <Typography align="center" gutterBottom variant="body1">
            We provide the care you need so you can live the life you want.
          </Typography>
          <Container>
            <center>
              <Grid container alignContent="center">
                {this.state.feathers.map(d => (
                  <Grid item xs={12} md={6} lg={4} key={d.label}>
                    <Grid className="card">
                      <img src={d.img} alt="Card-1" className="card-img" />
                      <Typography align="center" color="secondary" variant="h6" gutterBottom>
                        {d.label}
                      </Typography>
                      <Typography align="center" color="inherit" variant="body2" gutterBottom>
                        {d.line}
                      </Typography>
                      <h4 className="card-down">{d.title}</h4>
                    </Grid>
                  </Grid>
                ))}
              </Grid>
              <br />
              <Divider variant="middle" light />
              <br />

              <Link to="/amenities" className="link">
                <Fab variant="extended" size="medium" color="secondary" aria-label="add" className="fab">
                  See All Amenities
                </Fab>
              </Link>
            </center>
          </Container>
        </Grid>

        <div className="vdo">
          <Link to="//https://www.youtube.com/watch?v=vzTQRUx0fZY" target="_blank">
            <FaPlay id="playBtn" />
          </Link>
        </div>

        <Grid id="testimonial">
          <Typography variant="h6" color="primary" align="center" gutterBottom>
            Your Love that pleased us...
          </Typography>
          <Container>
            <Carousel showThumbs={false} infiniteLoop interval={5000} autoPlay>
              {this.state.testimonials.map(t => (
                <div key={t.name} style={{ background: "#fff" }}>
                  <center>
                    <Avatar alt={t.name} src={t.img} className={classes.chip} style={{ width: 120, height: 120, border: "2px solid #2196F3" }} />
                    <br />
                    <Typography variant="body2" gutterBottom>
                      {t.message}
                    </Typography>
                    <Typography variant="h5" color="primary">
                      {t.name}
                    </Typography>
                    <Typography variant="h6" color="secondary">
                      {t.company}
                    </Typography>
                    <br />
                    <Divider />
                  </center>
                </div>
              ))}
            </Carousel>
          </Container>
        </Grid>
        <Footer />
      </section>
    );
  }
}

Home.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Home);
