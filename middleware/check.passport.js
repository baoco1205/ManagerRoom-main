var JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;
const { KEY_TOKEN } = require("../const");
const passport = require("passport");
const userModel = require("../database/user");
const cookieExtractor = function (req) {
  var token = ExtractJwt.fromAuthHeaderAsBearerToken();
  // console.log(req.cookies["jwt"]);
  token =
    token(req) ||
    req.cookies["jwt"] ||
    req.headers["authorization"] ||
    req.cookies.token ||
    req.body.token ||
    req.query.token;
  return token;
};
let opts = {};

opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = KEY_TOKEN.keyToken;
const stragery = new JwtStrategy(opts, async function (jwt_payload, done) {
  try {
    const user = await userModel.findById(jwt_payload.id);
    if (user) return done(null, user);
    console.log();
    // else return done(null, false);
  } catch (err) {
    const error = new Error(err);
    error.statusCode = 400;
    throw error;
  }
});

passport.use(stragery);
var checkAuth = passport.authenticate("jwt", { session: false });
// (err, user, info) => {
//   if (err) {
//     return res.status(403).json("err");
//   }
//   if (!user) {
//     console.log("họ chưa login á m ơi");
//     return res.json("U NEED LOGIN TO GO !");
//   }
//   if (user) {
//     console.log("Pass check auth");
//     req.user = user;
//     next();
//   }
// })(req, res, next);

module.exports = checkAuth;

// };
// };
