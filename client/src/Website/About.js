import React, { Fragment, useState } from "react";
import { makeStyles, Grid, Card, CardMedia, Typography, Fab, Container, Paper } from "@material-ui/core";
import { FaAsymmetrik, FaRegHandshake, FaTorah } from "react-icons/fa";
import Footer from "../Components/Footer";
import { Link } from "react-router-dom";
import topBanner from "../svg/banner-assisted-living.jpg";
import bgBanner from "../svg/bgBanner.jpg";
import wh from "../svg/whatsapp.svg";
import fb from "../svg/facebook.svg";
import tw from "../svg/twitter.svg";
const useStyles = makeStyles({
  topBanner: {
    top: "0%",
    height: "40vh",
    backgroundImage: `url("${topBanner}")`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center"
  },
  myContainer: {
    zIndex: 2,
    marginTop: "-40px",
    marginBottom: "30px"
  },
  para: {
    padding: 10
  },
  img1: {
    width: 280,
    height: 180,
    padding: 10,
    border: "3px solid green",
    borderRadius: "10px",
    backgroundPosition: "center"
  },
  teamSection: {
    minHeight: "50vh",
    width: "100vw",
    backgroundImage: `url("${bgBanner}")`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
    paddingTop: 30,
    paddingBottom: 30
  },
  card: {
    height: "310px"
  },
  cardImg: {
    height: "270px",
    width: "100%",
    borderBottom: "2px rgb(43, 231, 50) solid"
  },
  socalIcons: {
    float: "right",
    zIndex: 2,
    padding: 3
  }
});

const About = () => {
  const classes = useStyles();
  const [state] = useState({
    team: [
      {
        name: "Mr. David Smith",
        designation: "Manager",
        img: "https://i.ibb.co/bF16zzg/member-1.jpg",
        whatsapp: "https://wa.me/+13109954859?text=I'm%20interested%20in%20Oasis%20Manor.%20Please%20contact%20me.",
        facebook: "facebook.com",
        twitter: "twitter.com"
      },
      {
        name: "Miss. Patricia",
        designation: "Caretaker",
        img: "https://i.ibb.co/R7PHjnP/member-3.jpg",
        whatsapp: "https://wa.me/+13109954859?text=I'm%20interested%20in%20Oasis%20Manor.%20Please%20contact%20me.",
        facebook: "facebook.com",
        twitter: "twitter.com"
      },
      {
        name: "John Smith",
        designation: "Accountant",
        img: "https://i.ibb.co/80ZvkpD/member-2.jpg",
        whatsapp: "https://wa.me/+13109954859?text=I'm%20interested%20in%20Oasis%20Manor.%20Please%20contact%20me.",
        facebook: "facebook.com",
        twitter: "twitter.com"
      }
    ]
  });
  return (
    <Fragment>
      <Grid container>
        <Grid item xs={12} className={classes.topBanner}>
          <Typography variant="h5" className="heading" align="center">
            <FaAsymmetrik />
            {"\u00A0"}
            Incredible ~ "Oasis"
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Container className={classes.myContainer}>
            <Paper elevation={4}>
              <Grid container spacing={2} justify="center" alignContent="center" alignItems="center">
                <Grid item xs={12}>
                  <Typography align="center" color="primary" gutterBottom variant="h6">
                    <Fab color="primary" size="medium" aria-label="team">
                      <FaTorah style={{ width: "1.3rem", height: "1.3rem", color: "#fff" }} />
                    </Fab>
                    <br />A new concept in senior citizens' community living
                  </Typography>
                  <br />
                  <Grid container justify="center" alignContent="center" alignItems="center">
                    <Grid item xs={12} sm={6}>
                      <center>
                        <img src="https://i.ibb.co/yBP6Y45/about-Img.jpg" alt="oasis2" className={classes.img1} />
                      </center>
                    </Grid>
                    <Grid item xs={12} sm={6} className={classes.para}>
                      <Typography align="center" variant="body1">
                        <b>Welcome To Oasis Manors Inc.</b> It is time to bid good bye to the conventional community retirement living concepts. And, it's time to think beyond the usual multi-storeyed
                        buildings, single rooms, gloomy ambience and lot many inconveniences. Because, here's Oasis Manors, the most comfortable retirement homes including apartments and villas
                        located at "Roxford Street Sylmar, CA - 91342".
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} className={classes.para}>
                      <Typography align="center" variant="body1">
                        <b>Oasis Manor</b> is Conceived and created on over more then 1700 square feet of beautifully green, landscaped area, Graceland reflects your fine taste and preferences. Here,
                        you'll enjoy an aesthetic ambience, choicest luxuries, amenities as well as 24 hour care and safety. It was conceived to be the most comfortable, joyful, safe and caring
                        resort-type community living in the country specially designed for senior citizens.
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <center>
                        <img src="https://i.ibb.co/Nxwxm4f/Doctor-1.jpg" alt="Doctor-1" className={classes.img1} />
                      </center>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </Container>
        </Grid>

        <Grid id="team" className={classes.teamSection}>
          <Container maxWidth="md">
            <Typography color="primary" align="center">
              <Fab color="primary" size="medium" aria-label="team">
                <FaRegHandshake style={{ width: "2rem", height: "2rem", color: "#fff" }} />
              </Fab>
              <br />
              Our Dedicated Team
            </Typography>
            <br />
            <Grid container spacing={2}>
              {state.team.map(t => (
                <Grid item xs={12} md={4} key={t.name}>
                  <Card className={classes.card}>
                    <CardMedia className={classes.cardImg} image={t.img} title={t.name}>
                      <span className={classes.socalIcons}>
                        <Link to={`//${t.whatsapp}`} target="_blank">
                          <img src={wh} alt="whatsapp" />
                        </Link>
                        {"\u00A0"}
                        <Link to={`//${t.facebook}`} target="_blank">
                          <img src={fb} alt="facebook" />
                        </Link>
                        {"\u00A0"}
                        <Link to={`//${t.twitter}`}>
                          <img src={tw} alt="twitter" target="_blank" />
                        </Link>
                      </span>
                    </CardMedia>
                    <Typography color="secondary" align="center">
                      `{t.name}, {t.designation}`
                    </Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Grid>
        <Grid item xs={12}>
          <Footer />
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default About;
