'use client'

import React, { useState } from 'react'
import { useQuery } from '@apollo/client'
import { queryProfile } from '@/lib/queries'

interface FinishedProject {
    group: {
        path: string
        createdAt: string
    }
}

interface Transaction {
    path: string
    amount: number
    createdAt: string
}

export default function ProjectXpList() {
    const { data, loading, error } = useQuery(queryProfile)
    const [showAll, setShowAll] = useState<boolean>(false)
    const visibleCount: number = 5

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

    // On récupère le premier utilisateur et on force le typage
    const finishedProjects = (data.user?.[0]?.finished_projects ?? []) as FinishedProject[]
    const totalXp: number = data.user?.[0]?.xpTotal?.aggregate?.sum?.amount ?? 0
    // On récupère la liste des transactions XP
    const xpTransactions = (data.user?.[0]?.xp ?? []) as Transaction[]

    // Trier les projets du plus récent au plus ancien selon la date de création
    const sortedProjects: FinishedProject[] = finishedProjects.slice().sort(
        (a, b) =>
            new Date(b.group.createdAt).getTime() - new Date(a.group.createdAt).getTime()
    )

    // Déterminer les projets à afficher
    const displayedProjects: FinishedProject[] = showAll
        ? sortedProjects
        : sortedProjects.slice(0, visibleCount)

    return (
        <div className="mt-8 p-4 bg-zinc-900 text-white rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-2">
                <p className="text-lg font-bold">
                    Total XP : {totalXp} XP
                </p>
                {finishedProjects.length > visibleCount && (
                    <button
                        onClick={() => setShowAll(!showAll)}
                        className="text-sm text-indigo-400 hover:underline flex items-center"
                    >
                        {showAll ? "See less" : "See more"}
                        <span className="ml-1 text-xs">{showAll ? "←" : "→"}</span>
                    </button>
                )}
            </div>
            {finishedProjects.length === 0 ? (
                <p className="text-center text-gray-500">Aucun projet trouvé.</p>
            ) : (
                <ul className="divide-y divide-zinc-800">
                    {displayedProjects.map((proj: FinishedProject, index: number) => {
                        // Pour chaque projet, filtrer les transactions XP dont le "path" correspond au projet
                        const projectXp = xpTransactions
                            .filter((tx: Transaction) => tx.path === proj.group.path)
                            .reduce((sum: number, tx: Transaction) => sum + tx.amount, 0)
                        return (
                            <li
                                key={index}
                                className="py-2 flex justify-between items-center hover:bg-zinc-800 transition-colors rounded"
                            >
                                <div>
                                    <p className="font-medium">
                                        {proj.group.path.split('/').pop()}
                                    </p>
                                    <p className="text-sm text-gray-400">
                                        {new Date(proj.group.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <p className="font-bold text-indigo-400">
                                    {projectXp} XP
                                </p>
                            </li>
                        )
                    })}
                </ul>
            )}
        </div>
    )
}
