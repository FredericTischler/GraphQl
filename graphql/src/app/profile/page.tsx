'use client'

import { useEffect, useState } from 'react'
import { ApolloProvider, useQuery } from '@apollo/client'
import { GET_USER_DATA } from '@/lib/queries'
import { createApolloClient } from '@/lib/apolloClient'
import { useRouter } from 'next/navigation'
import ProgressChart from '@/app/components/ProgressChart'
import ProjectXpList from '@/app/components/ProjectXpList'
import AuditRatioChart from '@/app/components/AuditRatioChart'

function ProfileContent() {
    const { data, loading, error } = useQuery(GET_USER_DATA)

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

    const user = data.user[0]

    return (
        <div className="mb-8">
            <h1 className="text-3xl font-bold">Bienvenue, {user.login}</h1>
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
