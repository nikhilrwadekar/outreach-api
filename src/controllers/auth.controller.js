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

// Axios
const axios = require("axios");

// Generate Token Function
const generateAccessToken = (data) =>
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

// No longer used
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
        email: email,
      });

      const refreshTokenInDB = await newToken.save();

      if (!!accessToken && !!refreshTokenInDB)
        res.status(200).json({
          accessToken: accessToken,
          refreshToken: refreshTokenInDB.token,
          message: "Successfully signed in!",
        });
    }
  } catch (error) {
    res
      .status(500)
      .send({ message: "Sorry, something went wrong", error: error });
  }
};

exports.verifyGoogleAccessToken = async (req, res) => {
  try {
    const { token } = req.body;

    axios
      .get("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => response.data)
      .then(async (googleUserInfo) => {
        // Find the user email in DB
        const user = await User.findOne({ email: googleUserInfo.email }).select(
          "-password"
        );

        // If found, send the data (+ Access Token + Refresh Token)
        if (user) {
          const { name, role } = user;

          // Generate Access token
          const newAccessToken = generateAccessToken({
            iss: "outreach",
            name: name,
            admin: role == "admin",
          });

          res.send({
            address: user.address,
            availability: user.availability,
            type: user.type,
            profile_picture_url: user.profile_picture_url,
            preferences: user.preferences,
            role: user.role,
            _id: user._id,
            name: user.name,
            email: user.email,
            contact_number: user.contact_number,
            accessToken: newAccessToken,
          });
        } else {
          // If not found..
          res.send({ userExists: false, message: "User Not Found" });
        }
      })
      .catch((err) =>
        res.status(403).send({ message: "Invalid Google Access Token" })
      );
  } catch (error) {
    // res.send(error);
  }
};

exports.verifyFacebookAccessToken = async (req, res) => {
  try {
    const { token } = req.body;

    // Get ID, Name, and Email!
    const meResponse = await axios.get(
      `https://graph.facebook.com/me?fields=id,name,email&access_token=${token}`
    );

    // Find the user email in DB
    const user = await User.findOne({ email: meResponse.data.email }).select(
      "-password"
    );

    // If found, send the data (+ Access Token + Refresh Token)
    if (user) {
      const { name, role } = user;

      // Generate Access token
      const newAccessToken = generateAccessToken({
        iss: "outreach",
        name: name,
        admin: role == "admin",
      });

      res.send({
        address: user.address,
        availability: user.availability,
        type: user.type,
        profile_picture_url: user.profile_picture_url,
        preferences: user.preferences,
        role: user.role,
        _id: user._id,
        name: user.name,
        email: user.email,
        contact_number: user.contact_number,
        accessToken: newAccessToken,
      });
    } else {
      // If not found..
      res.send({ userExists: false, message: "User Not Found" });
    }
  } catch (error) {
    res.status(403).send({ message: "Invalid Facebook Access Token" });
  }
};
