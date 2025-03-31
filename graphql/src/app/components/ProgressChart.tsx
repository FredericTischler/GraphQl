'use client'

import React from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { useQuery } from '@apollo/client'
import { queryProfile } from '@/lib/queries'

export default function ProgressChart() {
    const { data, loading, error } = useQuery(queryProfile)

    if (loading)
        return <p className="text-center text-gray-400">Chargement du graphique...</p>
    if (error) {
        console.error('[GRAPHQL ERROR]', error)
        return <p className="text-center text-red-500">Erreur lors du chargement des données</p>
    }

    // On prend le premier utilisateur car "user" est retourné sous forme de tableau
    const transactions = data.user?.[0]?.xp ?? []

    // Trier les transactions par date croissante
    const sortedTransactions = transactions.slice().sort(
        (a: { createdAt: string | number | Date }, b: { createdAt: string | number | Date }) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    )

    // Calculer le cumul de XP au fil du temps
    const formattedData = sortedTransactions.reduce((acc: any[], tx: any) => {
        const cumulativeXp = (acc.length > 0 ? acc[acc.length - 1].xp : 0) + tx.amount
        acc.push({
            xp: cumulativeXp,
            date: new Date(tx.createdAt).toLocaleDateString()
        })
        return acc
    }, [])

    return (
        <div className="mt-8 p-6 bg-zinc-900 text-white rounded-lg shadow-xl">
            <h2 className="text-2xl font-bold mb-4 text-center">
                XP progression
            </h2>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={formattedData}>
                    <CartesianGrid stroke="#374151" strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fill: '#9CA3AF' }} />
                    <YAxis tick={{ fill: '#9CA3AF' }} />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#1F2937',
                            border: 'none',
                            color: '#fff'
                        }}
                    />
                    <Line
                        type="monotone"
                        dataKey="xp"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}
