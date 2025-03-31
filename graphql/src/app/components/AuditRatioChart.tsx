'use client'

import React from 'react'
import { useQuery } from '@apollo/client'
import { queryProfile } from '@/lib/queries'
import clsx from 'clsx'

export default function AuditRatioChart() {
    const { data, loading, error } = useQuery(queryProfile)

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

    // Récupération du premier utilisateur
    const user = data.user?.[0]
    // Récupérer les XP données (up) et reçues (down) depuis la query globale
    const xpGiven = user?.totalUp ?? 0
    const xpReceived = user?.totalDown ?? 0
    // Récupérer le total XP depuis l'agrégation
    const totalXp = user?.xpTotal?.aggregate?.sum?.amount ?? 0

    const ratio = xpReceived > 0 ? xpGiven / xpReceived : 0
    const maxValue = Math.max(xpGiven, xpReceived)
    const xpGivenPercent = maxValue > 0 ? (xpGiven / maxValue) * 100 : 0
    const xpReceivedPercent = maxValue > 0 ? (xpReceived / maxValue) * 100 : 0

    // Couleur de la barre XP donnée (en hex) selon le ratio
    const computedRatioColor =
        ratio >= 1.1
            ? '#22c55e' // vert (bg-green-500)
            : ratio >= 0.9
                ? '#facc15' // jaune (bg-yellow-400)
                : '#ef4444' // rouge (bg-red-500)

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

            <div className="space-y-5 mt-4">
                {/* Barre XP donnée */}
                <div>
                    <div className="flex justify-between text-sm mb-1">
                        <span className="text-green-400 font-semibold">
                            Done : {xpGiven}
                        </span>
                    </div>
                    <svg width="100%" height="16" className="rounded-full block">
                        {/* Fond de la barre */}
                        <rect
                            x="0"
                            y="0"
                            width="100%"
                            height="16"
                            fill="#27272a"
                            rx="4"
                            ry="4"
                        />
                        {/* Barre remplie */}
                        <rect
                            x="0"
                            y="0"
                            width={`${xpGivenPercent}%`}
                            height="16"
                            fill={computedRatioColor}
                            rx="4"
                            ry="4"
                        />
                    </svg>
                </div>

                {/* Barre XP reçue */}
                <div>
                    <div className="flex justify-between text-sm mb-1">
                        <span className="text-blue-400 font-semibold">
                            Received : {xpReceived}
                        </span>
                    </div>
                    <svg width="100%" height="16" className="rounded-full block">
                        {/* Fond de la barre */}
                        <rect
                            x="0"
                            y="0"
                            width="100%"
                            height="16"
                            fill="#27272a"
                            rx="4"
                            ry="4"
                        />
                        {/* Barre remplie */}
                        <rect
                            x="0"
                            y="0"
                            width={`${xpReceivedPercent}%`}
                            height="16"
                            fill="#60a5fa"
                            rx="4"
                            ry="4"
                        />
                    </svg>
                </div>
            </div>
        </div>
    )
}
