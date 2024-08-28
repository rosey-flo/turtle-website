import { gql } from '@apollo/client'

export const GET_USER = gql`
    query GetUser {
    getUser {
        message
        user {
        _id
        username
        }
    }
}
`

export const GET_USER_TURTLE = gql`
    query GetUserTurtle {
    getUserTurtle {
        _id
        headbandColor
        name
        weapon
  }
}
`

export const GET_ALL_TURTLES = gql`
   query GetAllTurtles {
    getAllTurtles {
        _id
        headbandColor
        name
        user {
        username
        }
        weapon
  }
}

`