'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { login } from '@/lib/auth'

export default function LoginPage() {
    const router = useRouter()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const token = await login(username, password)
            localStorage.setItem('token', token)
            router.push('/profile')
        } catch  {
            setError('Identifiants invalides')
        }
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-zinc-900 text-zinc-100 px-4">
            <form
                onSubmit={handleSubmit}
                className="bg-zinc-800 p-8 rounded-xl shadow-xl w-full max-w-md flex flex-col gap-5"
            >
                <h1 className="text-2xl font-bold text-center text-white">Connexion</h1>
                {error && <p className="text-red-400 text-center">{error}</p>}

                <input
                    type="text"
                    placeholder="Username or email"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="bg-zinc-700 text-white border border-zinc-600 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-zinc-700 text-white border border-zinc-600 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <button
                    type="submit"
                    className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded"
                >
                    Sign in
                </button>
            </form>
        </main>
    )
}
