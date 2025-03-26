// src/lib/queries.ts
import { gql } from '@apollo/client'

export const GET_USER_DATA = gql`
  query {
    user {
      id
      login
      transactions(where: { type: { _eq: "xp" } }) {
        amount
        createdAt
      }
    }
  }
`

export const GET_PROGRESS = gql`
  query {
    user {
      id
      login
      progresses {
        grade
        createdAt
        path
      }
    }
  }
`

export const GET_RESULTS = gql`
  query GetResults {
    result {
      type
      grade
    }
  }
`

export const GET_XP = gql`
  query {
    user {
      transactions(where: { type: { _eq: "xp" } }) {
        amount
        createdAt
      }
    }
  }
`

export const GET_PROJECT_XP = gql`
  query {
    user {
      transactions(where: { type: { _eq: "xp" } }) {
        amount
        createdAt
        object {
          id
          name
          type
        }
      }
    }
  }
`

export const GET_AUDIT_RATIO = gql`
  query {
    user {
      transactions(where: { type: { _in: ["down", "up"] } }) {
        type
        amount
      }
    }
  }
`
