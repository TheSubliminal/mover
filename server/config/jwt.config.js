const  { ExtractJwt } = require('passport-jwt');

const secret = process.env.SECRET_KEY;
const expiresIn = '24h';

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET_KEY
};

module.exports = {
  secret,
  expiresIn,
  jwtOptions
};

