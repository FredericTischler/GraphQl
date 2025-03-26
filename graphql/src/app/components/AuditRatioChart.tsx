'use client'

import React from 'react'
import { useQuery } from '@apollo/client'
import { GET_AUDIT_RATIO } from '@/lib/queries'
import clsx from 'clsx'

export default function AuditRatioChart() {
    const { data, loading, error } = useQuery(GET_AUDIT_RATIO)

    if (loading)
        return (
            <p className="text-center text-gray-400">
                Chargement des audits...
            </p>
        )
    if (error) {
        console.error('[GRAPHQL ERROR]', error)
        return (
            <p className="text-center text-red-500">
                Erreur lors du chargement des données
            </p>
        )
    }

    const transactions = data.user?.[0]?.transactions ?? []

    const xpReceived = transactions
        .filter((tx: any) => tx.type === 'down')
        .reduce((sum: number, tx: any) => sum + tx.amount, 0)

    const xpGiven = transactions
        .filter((tx: any) => tx.type === 'up')
        .reduce((sum: number, tx: any) => sum + tx.amount, 0)

    const ratio = xpGiven / xpReceived || 0
    const maxValue = Math.max(xpGiven, xpReceived)

    // Définition d'une couleur selon le ratio
    const ratioColor =
        ratio >= 1.1
            ? 'bg-green-500'
            : ratio >= 0.9
                ? 'bg-yellow-400'
                : 'bg-red-500'

    return (
        <div className="mt-8 p-6 bg-zinc-900 text-white rounded-lg shadow-xl">
            <h2 className="text-2xl font-bold mb-3 text-center">Audit Ratio</h2>
            <div className="mt-6 text-center text-sm">
                Ratio :{' '}
                <span
                    className={clsx(
                        'font-bold',
                        ratio >= 1 ? 'text-green-400' : 'text-red-400'
                    )}
                >
          {ratio.toFixed(2)}
        </span>
            </div>

            <div className="space-y-5">
                {/* XP donnée */}
                <div>
                    <div className="flex justify-between text-sm mb-1">
            <span className="text-green-400 font-semibold">
              Done : {xpGiven}
            </span>
                    </div>
                    <div className="w-full bg-zinc-800 h-4 rounded-full">
                        <div
                            className={clsx('h-4 rounded-full', ratioColor)}
                            style={{ width: `${(xpGiven / maxValue) * 100}%` }}
                        />
                    </div>
                </div>

                {/* XP reçue */}
                <div>
                    <div className="flex justify-between text-sm mb-1">
            <span className="text-blue-400 font-semibold">
              Received : {xpReceived}
            </span>
                    </div>
                    <div className="w-full bg-zinc-800 h-4 rounded-full">
                        <div
                            className="bg-blue-400 h-4 rounded-full"
                            style={{ width: `${(xpReceived / maxValue) * 100}%` }}
                        />
                    </div>
                </div>
            </div>


        </div>
    )
}
