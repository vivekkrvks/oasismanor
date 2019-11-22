import React from "react";
import { makeStyles, Grid, Container, Typography, Divider, Button } from "@material-ui/core";
import footerSvg from "../svg/footer.svg";
import fb from "../svg/facebook.svg";
import wh from "../svg/whatsapp.svg";
import tw from "../svg/twitter.svg";
import ins from "../svg/instagram.svg";
import { FaMapMarkerAlt, FaMobileAlt } from "react-icons/fa";
import "../App.css";
import { Link } from "react-router-dom";
const useStyles = makeStyles(theme => ({
  footer: {
    paddingTop: 20,
    marginBottom: 0,
    minHeight: "30vh",
    backgroundImage: `url("${footerSvg}")`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center"
  },
  btn: {
    margin: theme.spacing(1)
  },
  link: {
    textDecoration: "none"
  },
  copyright: {
    background: "radial-gradient(circle, rgba(248,252,250,0.7794468129048494) 18%, rgba(110,234,159,0.8018557764902836) 76%)",
    padding: theme.spacing(0.5),
    bottom: 0
  }
}));

export default function ButtonAppBar() {
  const classes = useStyles();

  return (
    <>
      <footer className={classes.footer}>
        <Container>
          <Grid container>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="body1" align="center" color="secondary">
                Oasis - At a Glance
              </Typography>
              <br />
              <center>
                <Typography variant="caption" align="center">
                  At Oasis Manor, our experienced team takes your care personally. We take the time to get to know you, your needs, and your preferences.{" "}
                </Typography>
                <Divider />
                <br />
                <Typography variant="body2" color="secondary">
                  <FaMapMarkerAlt /> {"\u00A0"}
                  15116 Roxford Street Sylmar, CA 91342
                </Typography>
                <Link to="Tel: +1 310-9954859" style={{ textDecoration: "none" }}>
                  <Typography variant="body2" color="secondary">
                    <FaMobileAlt /> {"\u00A0"}
                    +1 310-9954859
                  </Typography>
                </Link>
              </center>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="body1" align="center" color="secondary">
                Useful Links
              </Typography>
              <ul className="list">
                <li>
                  <Link to="/pricing" className={classes.link}>
                    Pricing{" "}
                  </Link>
                </li>
                <li>
                  <Link to="/blog" className={classes.link}>
                    Blog
                  </Link>
                </li>
                <li>
                  <Link to="/about" className={classes.link}>
                    Mission & Ethics
                  </Link>
                </li>
                <li>
                  <Link to="/about" className={classes.link}>
                    Terms of service
                  </Link>
                </li>
                <li>
                  <Link to="/sitemap" className={classes.link}>
                    Site Map
                  </Link>
                </li>
              </ul>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="body1" align="center" color="secondary">
                Care & Services
              </Typography>
              <ul className="list2">
                <li>Independent Living</li>
                <li>Memory & Respite Care</li>
                <li>Elder Health & Wellness</li>
                <li>Video Library</li>
                <li>Yoga & Fitness camp</li>
              </ul>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="body1" align="center" color="secondary">
                Connect Us
              </Typography>
              <div className="social">
                <center>
                  <Link to="//https://wa.me/+13109954859?text=I'm%20interested%20in%20Oasis%20Manor.%20Please%20contact%20me." target="_blank">
                    <img src={wh} alt="whatsapp" />
                  </Link>
                  <Link to="//facebook.com" target="_blank">
                    <img src={fb} alt="facebook" />
                  </Link>
                  <Link to="//twitter.com">
                    <img src={tw} alt="twitter" target="_blank" />
                  </Link>
                  <Link to="//insta.com">
                    <img src={ins} alt="insta" target="_blank" />
                  </Link>
                </center>
              </div>
              <Divider />
              <center>
                <Link to="/contact" className={classes.link}>
                  <Button variant="outlined" color="secondary" className={classes.btn}>
                    Join Our Team
                  </Button>
                </Link>
              </center>
            </Grid>
          </Grid>
        </Container>
      </footer>
      <center className={classes.copyright}>
        <Typography variant="body2" align="center" color="primary">
          © 2019 Oasis Manor Inc
        </Typography>
        <Typography variant="caption" align="center" color="primary">
          Technology Partner -
          <Link to="//http://softechinfra.com" target="_blank">
            Softechinfra
          </Link>
        </Typography>
      </center>
    </>
  );
}
