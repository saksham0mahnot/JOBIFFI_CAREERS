const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const Candidate = require('../models/Candidate');

module.exports = function (passport) {
    // Google Strategy
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID || 'PROMPT_FOR_CLIENT_ID',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'PROMPT_FOR_CLIENT_SECRET',
        callbackURL: `${process.env.BACKEND_URL}/api/auth/google/callback`
    },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Check if user already exists
                let user = await Candidate.findOne({ googleId: profile.id });

                if (user) {
                    return done(null, user);
                }

                // If not, check if user exists with the same email
                user = await Candidate.findOne({ email: profile.emails[0].value });

                if (user) {
                    // Link Google account to existing manual account
                    user.googleId = profile.id;
                    user.avatar = profile.photos[0].value;
                    await user.save();
                    return done(null, user);
                }

                // Create new social user
                const newUser = {
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    googleId: profile.id,
                    avatar: profile.photos[0].value
                };

                user = await Candidate.create(newUser);
                done(null, user);
            } catch (err) {
                console.error(err);
                done(err, null);
            }
        }));

    // LinkedIn Strategy
    passport.use(new LinkedInStrategy({
        clientID: process.env.LINKEDIN_CLIENT_ID || 'PROMPT_FOR_CLIENT_ID',
        clientSecret: process.env.LINKEDIN_CLIENT_SECRET || 'PROMPT_FOR_CLIENT_SECRET',
        callbackURL: `${process.env.BACKEND_URL}/api/auth/linkedin/callback`,
        scope: ['r_emailaddress', 'r_liteprofile'],
    },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Check if user already exists
                let user = await Candidate.findOne({ linkedinId: profile.id });

                if (user) {
                    return done(null, user);
                }

                // Check email match
                const email = profile.emails[0].value;
                user = await Candidate.findOne({ email });

                if (user) {
                    user.linkedinId = profile.id;
                    user.avatar = profile.photos[0]?.value || '';
                    await user.save();
                    return done(null, user);
                }

                // Create new social user
                const newUser = {
                    name: profile.displayName,
                    email: email,
                    linkedinId: profile.id,
                    avatar: profile.photos[0]?.value || ''
                };

                user = await Candidate.create(newUser);
                done(null, user);
            } catch (err) {
                console.error(err);
                done(err, null);
            }
        }));

    // Required for sessions (even if using JWT, Passport requires these)
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await Candidate.findById(id);
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    });
};
