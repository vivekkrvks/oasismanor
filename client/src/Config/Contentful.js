const contentful = require("contentful");
const client = contentful.createClient({
  // This is the space ID. A space is like a project folder in Contentful terms
  space: "wvni3erzl5ti",
  // This is the access token for this space. Normally you get both ID and the token in the Contentful web app
  accessToken: "Wu159PEIhEHCGpZWLCDcPAtiFEAhJQ3Pn3d4ysNO6HY"
});

export default client;
