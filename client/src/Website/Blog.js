import React, { Component } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { Link } from "react-router-dom";
import { withStyles, Grid, Typography, Paper, Card, CardHeader, Avatar, CardMedia, CardContent, CardActions, IconButton, Breadcrumbs, Container } from "@material-ui/core";
import { Home, Create } from "@material-ui/icons";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ShareIcon from "@material-ui/icons/Share";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Footer from "../Components/Footer";
import client from "../Config/Contentful";
import "../App.css";

const styles = theme => ({
  card: {
    maxWidth: 345,
    maxHeight: 528
  },
  media: {
    height: 0,
    paddingTop: "56.25%" // 16:9
  },
  avtar: {
    margin: 10,
    width: 60,
    height: 60
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest
    })
  },
  expandOpen: {
    transform: "rotate(180deg)"
  },
  bread: {
    padding: theme.spacing(1, 2),
    zIndex: 2,
    marginRight: "auto",
    marginLeft: "auto",
    marginTop: "1%",
    maxWidth: 230
  },
  link: {
    display: "flex",
    textDecoration: "none"
  },
  icon: {
    marginRight: theme.spacing(0.5),
    width: 20,
    height: 20
  },
  myContainer: {
    zIndex: 2,
    marginTop: "-50px",
    marginBottom: "30px"
  }
});

class Blog extends Component {
  constructor(props) {
    super(props);

    this.state = {
      expanded: false,
      items: []
    };
  }

  componentWillMount() {
    client
      .getEntries({ content_type: "blog" })
      .then(entry => this.setState({ items: entry.items }))
      .catch(err => console.log(err));
  }

  render() {
    const { classes } = this.props;
    return (
      <section>
        <Grid container>
          <Grid item xs={12} className="top-look">
            <Paper elevation={0} className={classes.bread}>
              <Breadcrumbs aria-label="breadcrumb">
                <Link color="inherit" to="/" className={classes.link}>
                  <Home className={classes.icon} />
                  Home
                </Link>
                <Typography color="textPrimary" className={classes.link}>
                  <Create className={classes.icon} />
                  Blog
                </Typography>
              </Breadcrumbs>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Container className={classes.myContainer}>
              <Grid container spacing={2} justify="center" alignContent="center" alignItems="center">
                {this.state.items.map(d => (
                  <Grid item xs={12} md={6} lg={4} key={d.fields.title}>
                    <Card className={classes.card}>
                      <CardHeader
                        avatar={<Avatar alt={d.fields.authorImg.title} src={d.fields.authorImg.fields.file.url} className={classes.avtar} />}
                        action={
                          <IconButton aria-label="settings">
                            <MoreVertIcon />
                          </IconButton>
                        }
                        title={d.fields.title}
                        subheader={d.sys.createdAt.slice(0, 10)}
                      />
                      <CardMedia className={classes.media} image={d.fields.blogImg.fields.file.url} title={d.fields.blogImg.title} />
                      <CardContent>
                        <Typography variant="body2" color="textSecondary" component="p">
                          {d.fields.description}
                        </Typography>
                      </CardContent>
                      <CardActions disableSpacing>
                        <IconButton aria-label="add to favorites">
                          <FavoriteIcon />
                        </IconButton>
                        <IconButton aria-label="share">
                          <ShareIcon />
                        </IconButton>
                        <Typography noWrap variant="caption" color="secondary" className={classes.expand}>
                          By : {d.fields.author}
                        </Typography>

                        <IconButton
                          className={clsx(classes.expand, {
                            [classes.expandOpen]: this.state.expanded
                          })}
                          // onClick={handleExpandClick}
                          aria-expanded={this.state.expanded}
                          aria-label="show more">
                          <ExpandMoreIcon />
                        </IconButton>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Container>
          </Grid>
        </Grid>
        <Footer />
      </section>
    );
  }
}

Blog.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Blog);
