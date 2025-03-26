'use client'

import React, { useState } from 'react'
import { useQuery } from '@apollo/client'
import { GET_PROJECT_XP } from '@/lib/queries'

export default function ProjectXpList() {
    const { data, loading, error } = useQuery(GET_PROJECT_XP)
    const [showAll, setShowAll] = useState(false)
    const visibleCount = 5

    if (loading)
        return (
            <p className="text-center text-gray-400">
                Chargement de la liste...
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

    // On prend le premier utilisateur
    const transactions = data.user?.[0]?.transactions ?? []

    // Filtrer les transactions de type "project"
    const projectTransactions = transactions.filter(
        (tx: any) => tx.object?.type === 'project'
    )

    // Calculer le total XP gagné pour ces projets
    const totalProjectXp = projectTransactions.reduce(
        (sum: number, tx: any) => sum + tx.amount,
        0
    )

    // Déterminer les transactions à afficher
    const displayedTransactions = showAll
        ? projectTransactions
        : projectTransactions.slice(0, visibleCount)

    return (
        <div className="mt-8 p-4 bg-zinc-900 text-white rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-2">
                <p className="text-lg font-bold">XP : {totalProjectXp} XP</p>
                {projectTransactions.length > visibleCount && !showAll && (
                    <button
                        onClick={() => setShowAll(true)}
                        className="text-sm text-indigo-400 hover:underline flex items-center"
                    >
                        See more <span className="ml-1 text-xs">→</span>
                    </button>
                )}
            </div>
            {projectTransactions.length === 0 ? (
                <p className="text-center text-gray-500">Aucun projet trouvé.</p>
            ) : (
                <ul className="divide-y divide-zinc-800">
                    {displayedTransactions.map((tx: any, index: number) => (
                        <li
                            key={index}
                            className="py-2 flex justify-between items-center hover:bg-zinc-800 transition-colors rounded"
                        >
                            <div>
                                <p className="font-medium">{tx.object.name}</p>
                                <p className="text-sm text-gray-400">
                                    {new Date(tx.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            <p className="font-bold text-indigo-400">{tx.amount} XP</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
