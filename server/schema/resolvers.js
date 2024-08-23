//then inserted here into actual query---so it just queries existing data and does NOT change it -----BUT WE CAN PASS ARGUMENTS (get user by id for example)

const {User, Turtle} = require('../models')
const {sign, verify} = require('jsonwebtoken')

function createToken(user_id) {
    const token = sign({user_id : user_id}, process.env.JWT_SECRET);

    return token;
}
 
const resolvers = {
    // getUser(_, args, context),
    Query: {
        getUser() {
            return  {
            name: 'EF',
            age: 27
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
        }
    }
    
};

module.exports = resolvers;




