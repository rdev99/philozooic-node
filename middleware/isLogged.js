const JWT = require("jsonwebtoken");
const envData = process.env;

module.exports = (req, res, next) => {
  try {
    if (!req.body.token) {
      console.error("No token was sent for verification.");
      return res.status(403).send("Invalid token.");
    }
    const decoded = JWT.verify(req.body.token, envData.JWT_KEY);
    console.info("Token was successfully verified.");
    req.userData = decoded;
    next();
  } catch (error) {
    console.error("Could not verify the incoming token.", error);
    return res.status(401).send(error);
  }
};
