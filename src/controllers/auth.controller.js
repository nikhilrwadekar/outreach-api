// Get the User Model
const User = require("../models/user.model");

// Token Model
const Token = require("../models/refresh-token.model");

// Bcrypt
const Bcrypt = require("bcrypt");

// HTTP Status - Handling HTTP Status Codes Made Easier
const httpStatus = require("http-status");

// JWT
const jwt = require("jsonwebtoken");

// Generate Token Function
const generateAccessToken = data =>
  jwt.sign(data, process.env.ACCESS_TOKEN_SECRET);

exports.authenticateToken = (req, res, next) => {
  // Get Auth Header
  const authHeader = req.headers["authorization"];

  // Extract the Token
  const token = authHeader && authHeader.split(" ")[1];

  // If no token.. Forbidden!
  if (token == null) return res.sendStatus(httpStatus.FORBIDDEN);

  // Otherwise verify token
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, email) => {
    // If token couldn't be verified.. forbidden!
    if (err) return res.sendStatus(httpStatus.FORBIDDEN);

    // Otherwise pass on user email by attaching it to the REQ sent forward into next()
    req.email = email;

    // Move to the actual function
    next();
  });
};

exports.generateAccessTokenWithRefreshToken = async (req, res) => {
  const refreshTokenFromRequest = req.body.token;

  if (refreshTokenFromRequest == null) return res.sendStatus(401);

  // ####################
  // Check if refreshTokenFromRequest is in the DB -- send 403 if it isnt!
  // ####################
  await Token.findOne(
    { token: refreshTokenFromRequest },
    (tokenNotFound, tokenFoundInDB) => {
      if (tokenNotFound) {
        res.sendStatus(httpStatus.UNAUTHORIZED);
      }

      // If all good, proceed to verify and send a new access tokenFoundInDB back!
      if (tokenFoundInDB) {
        jwt.verify(
          tokenFoundInDB.token,
          process.env.REFRESH_TOKEN_SECRET,
          (err, user) => {
            if (err) return res.sendStatus(403);

            const accessToken = generateAccessToken(user);

            // Send the Access Token
            res.json({ accessToken: accessToken });
          }
        );
      }
    }
  );

  res.sendStatus(403);
};

exports.login = async (req, res) => {
  // Get Email & Password from Request
  const { email, password } = req.body;

  try {
    // Find the user with the Email provided in DB
    var userInDB = await User.findOne({ email: email });

    // If User isn't found, return with 400
    if (!userInDB) {
      return res.status(400).send({ message: "The email does not exist" });
    }

    // If password doesn't match, return with 400
    else if (!Bcrypt.compareSync(password, userInDB.password)) {
      return res.status(400).send({ message: "The password is invalid" });
    }

    // If User email and Password match, continue to provide the Access Token!
    else {
      // Make the User Object
      const user = { email: email, password: password };
      const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET); //Generate Access Token
      const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET); //Generate Refresh Token

      // Save the refresh token in the Token collection along with the user's Email
      const newToken = new Token({
        token: refreshToken,
        email: email
      });

      const refreshTokenInDB = await newToken.save();

      if (!!accessToken && !!refreshTokenInDB)
        res.status(200).json({
          accessToken: accessToken,
          refreshToken: refreshTokenInDB.token,
          message: "Successfully signed in!"
        });
    }
  } catch (error) {
    res
      .status(500)
      .send({ message: "Sorry, something went wrong", error: error });
  }
};
