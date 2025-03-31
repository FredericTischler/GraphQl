// src/lib/queries.ts
import { gql } from '@apollo/client'

export const queryProfile = gql`
    query {
        user {
            id
            login
            firstName
            lastName
            email
            campus
            auditRatio
            totalUp
            totalDown
            xpTotal: transactions_aggregate(where: {type:  {_eq: "xp"}, eventId:{_eq: 303}}){
                aggregate{
                sum {
                    amount
                }
            }
        }
        skills: transactions(
            order_by: {type: asc, amount: desc}
        distinct_on: [type]
        where: {eventId: {_eq: 303}, _and: {type: {_like: "skill%"}}}
        ) {
            type
                amount
        }
        events(where: {eventId: {_eq: 303}}) {
            level
        }
        xp: transactions(
            order_by: {createdAt: asc}
        where: {type: {_eq: "xp"}, eventId: {_eq: 303}}
        ) {
            createdAt
            amount
            path
        }
        finished_projects: groups(where: {group: {status: {_eq: finished}}}) {
            group {
                path
                status
                createdAt
            }
        }
        }
    }
`
