const passport = require('passport');
const LocalStrategy = require('passport-local');
const UserModel = require('./../database/models/user_model');

passport.use(new LocalStrategy({
    usernameField: 'email'
}, async (email, password, done) => {
    const user = await UserModel.findOne({ email })
        .catch(done);

    if (!user || !user.verifyPasswordSync(password)) {
        return done(null, false);
    }

    return done(null, user);
}));

module.exports = passport;