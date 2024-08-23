//then inserted here into actual query---so it just queries existing data and does NOT change it -----BUT WE CAN PASS ARGUMENTS (get user by id for example)

const { User, Turtle } = require('../models')
const { sign, verify } = require('jsonwebtoken')

function createToken(user_id) {
    const token = sign({ user_id: user_id }, process.env.JWT_SECRET);

    return token;
}

const resolvers = {
    // getUser(_, args, context),
    Query: {
        async getUser(_, args, context) {
            const token = context.req.cookies.token;

            if (!token) {
                return {
                    message: 'Not Authorized'
                }
            }

            const{user_id} = verify(token, process.env.JWT_SECRET);

            const user = await User.findById(user_id)

            if(!user) {
                return {
                    message:'No User found!'
                }
            }

            return {
                user
            }
        }
    },
    Mutation: {
        async registerUser(_, args, context) {
            try {
                const user = await User.create(args);

                //send a cookie with a JWT attatched - _ID FROM MONGOOSE
                const token = createToken(user._id)

                context.res.cookie('token', token, {
                    httpOnly: true
                })

                return {
                    message: 'User registered successfully!',
                    user
                }

            } catch (error) {
                console.log('register error', error)
                return {
                    message: 'Register error'
                }
            }
        },
        async loginUser(_, args, context) {
            //first we will find exisiting user by their email
            const user = await User.findOne({
                email: args.email
            })

            if(!user) {
                return {
                    message: 'No User found by that email address'
                }
            }

            //if found we verify their password next
            const valid_pass = await user.validatePassword(args.password);

            if(!valid_pass) {
                return {
                    message: 'Invalid Password'
                }
            }

            //create a JWT token with user _id from mongoose
            const token = createToken(user._id)
            //Sends cookie with JWT attatched
            context.res.cookie('token', token, {
                httpOnly: true
            })

            return {
                user
            }
        }
    }

};

module.exports = resolvers;




