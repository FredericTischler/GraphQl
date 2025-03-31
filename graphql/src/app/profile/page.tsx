'use client'

import { useEffect, useState } from 'react'
import { ApolloProvider, useQuery } from '@apollo/client'
import { queryProfile } from '@/lib/queries'
import { createApolloClient } from '@/lib/apolloClient'
import { useRouter } from 'next/navigation'
import { logout } from '@/lib/auth' // Assurez-vous que le chemin est correct
import ProgressChart from '@/app/components/ProgressChart'
import ProjectXpList from '@/app/components/ProjectXpList'
import AuditRatioChart from '@/app/components/AuditRatioChart'

function ProfileContent() {
    const { data, loading, error } = useQuery(queryProfile)
    const router = useRouter()

    if (loading)
        return <p className="text-center text-gray-400">Chargement...</p>
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
    const xpTotal = user?.xpTotal?.aggregate?.sum?.amount ?? 0

    const handleLogout = () => {
        logout()
        router.push('/login')
    }

    return (
        <div className="mb-8 space-y-6">
            {/* Carte d'accueil avec bouton Sign out */}
            <div className="bg-zinc-900 rounded-xl shadow-lg p-6 flex flex-col md:flex-row items-center justify-between">
                <div className="flex items-center">
                    <div className="w-24 h-24 bg-gray-700 rounded-full flex-shrink-0 flex items-center justify-center text-3xl font-bold text-white">
                        {user.firstName?.[0]}{user.lastName?.[0]}
                    </div>
                    <div className="mt-4 md:mt-0 md:ml-6">
                        <h1 className="text-3xl font-extrabold text-white">
                            Welcome, {user.login}
                        </h1>
                        <p className="text-md text-gray-400 mt-1">
                            <strong>Name :</strong> {user.firstName} {user.lastName}
                        </p>
                        <p className="text-md text-gray-400 mt-1">
                            <strong>Email :</strong> {user.email}
                        </p>
                        <p className="text-md text-gray-400 mt-1">
                            <strong>Campus :</strong> {user.campus}
                        </p>
                    </div>
                </div>
                <div className="mt-4 md:mt-0">
                    <button
                        onClick={handleLogout}
                        className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded"
                    >
                        Sign out
                    </button>
                </div>
            </div>
        </div>
    )
}

export default function ProfilePage() {
    const router = useRouter()
    const [client, setClient] = useState<any>(null)

    useEffect(() => {
        const rawToken = localStorage.getItem('token')
        if (!rawToken) {
            router.push('/login')
            return
        }
        const token = rawToken.trim().replace(/^"|"$/g, '')
        setClient(createApolloClient(token))
    }, [router])

    if (!client) return <p>Initialisation du profil...</p>

    return (
        <ApolloProvider client={client}>
            <div className="p-8 bg-zinc-800 min-h-screen text-white">
                <ProfileContent />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Colonne de gauche : graphiques */}
                    <div className="flex flex-col gap-8">
                        <AuditRatioChart />
                        <ProgressChart />
                    </div>
                    {/* Colonne de droite : liste XP par projet */}
                    <div>
                        <ProjectXpList />
                    </div>
                </div>
            </div>
        </ApolloProvider>
    )
}
