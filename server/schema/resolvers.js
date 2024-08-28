const { User, Turtle } = require('../models');
const { sign, verify } = require('jsonwebtoken');

const { GraphQLError } = require('graphql');

function createToken(user_id) {
  const token = sign({ user_id: user_id }, process.env.JWT_SECRET);

  return token;
}

const resolvers = {
  Query: {
    async getUser(_, args, context) {
      const token = context.req.cookies.token;

      if (!token) {
        throw new GraphQLError({
          message: 'Not Authorized'
        })
      }

      const { user_id } = verify(token, process.env.JWT_SECRET);

      const user = await User.findById(user_id);

      if (!user) {
        throw new GraphQLError({
          message: 'No User Found'
        })
      }

      return {
        message: 'User Found',
        user
      };
    },
    async getUserTurtle(_, args, context) {
      const token = context.req.cookies.token;

      if (!token) {
        throw new GraphQLError({
          message: 'Not Authorized'
        })
      }

      const { user_id } = verify(token, process.env.JWT_SECRET);

      const user = await User.findById(user_id).populate('turtles')

      return user.turtles;

    },

    async getAllTurtles(_, args, context) {
      

      const turtles = await Turtle.find().populate('user')

      return turtles;

    }
  },

  Mutation: {
    async registerUser(_, args, context) {
      try {
        const user = await User.create(args);

        // Create a cookie and attach a JWT token
        const token = createToken(user._id);

        context.res.cookie('token', token, {
          httpOnly: true
        });

        return {
          message: 'User registered successfully!',
          user
        }
      } catch (error) {
        console.log('register error', error);

        if (error.code === 11000) {
          throw new GraphQLError('A user with that email address or username already exists')
        }

        throw new GraphQLError(error.message.split(':')[2].trim())
      }
    },

    async loginUser(_, args, context) {
      const user = await User.findOne({
        email: args.email
      });

      if (!user) {
        throw new GraphQLError({
          error: true,
          message: 'No user found by that email address.'
        });
      }

      const valid_pass = await user.validatePassword(args.password);

      if (!valid_pass) {
        throw new GraphQLError({
          message: 'Password incorrect.'
        });
      }

      const token = createToken(user._id); // Create a JWT

      context.res.cookie('token', token, {
        httpOnly: true
      }); // Send a cookie with the JWT attached

      return {
        message: 'Logged in successfully!',
        user
      }
    },
    logoutUser(_, args, context) {
      context.res.clearCookie('token');

      return {
        message: 'Logged out successfully!'
      }
    },

    async addTurtle(_, args, context) {
      const token = context.req.cookies.token;

      if (!token) {
        throw new GraphQLError({
          message: 'You are not authorized to perfom that action'
        })
      }

      const { user_id } = verify(token, process.env.JWT_SECRET);

      const user = await User.findById(user_id);
      const turtle = await Turtle.create({
        ...args,
        user: user.id
      })

      user.turtles.push(turtle._id);
      await user.save();

      return {
        turtle
      }

    },

    async deleteTurtle(_, args, context) {
      const token = context.req.cookies.token;
      
      if (!token) {
        throw new GraphQLError({
          message: 'Not Authorized'
        })
      }

      const { user_id } = verify(token, process.env.JWT_SECRET);

      const user = await User.findById(user_id);

      if(!user.turtles.includes(args.turtle_id)) {
        throw new GraphQLError({
          message: 'You cannot delete a turtle you have not created'
        })
      }
        
       await Turtle.deleteOne({
        _id: args.turtle_id
       })

       user.turtles.pull(args.turtle_id);

       await user.save()

       return {
        message: 'Turtle deleted successfully'
       }
    }

  }
};

module.exports = resolvers;