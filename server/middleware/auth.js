const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const passport = require("passport");
const db = require("../services/service");

const User = db.User

passport.use(
  new LocalStrategy((username, password, next) => {
    User.findOne({ username: username }, (error, user) => {
      if (error) {
        next(error);
      }
      if (!user) return next(null, false);
      user.comparePassword(password, next); //req.user;
    });
  }),
);

passport.use(
  new JwtStrategy(
    {
      secretOrKey: process.env.SECRET_KEY,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    },
    async (payload, next) => {
      try {
        let user = await User.findById(payload.subject)
        if (user) {
          return next(null, user);
        }
        return next(null, false);
      } catch (error) {
        console.log(error);
        return next(error, false);
      }
    },
  ),
);