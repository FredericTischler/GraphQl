const API_URL = 'https://zone01normandie.org/api/auth/signin' // remplace ((DOMAIN)) par le vrai domaine

function encodeCredentials(login: string, password: string): string {
    return btoa(`${login}:${password}`)
}

export async function login(loginOrEmail: string, password: string): Promise<string> {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            Authorization: `Basic ${encodeCredentials(loginOrEmail, password)}`
        }
    })

    const token = await response.text()

    if (!response.ok) {
        throw new Error('Identifiants invalides')
    }

    // ✅ Si la réponse est OK, mais le token ne ressemble pas à un JWT (très rare), on vérifie quand même
    if (!token) {
        throw new Error('Token invalide')
    }

    localStorage.setItem('token', token)
    return token
}


export function logout() {
    localStorage.removeItem('token')
}

export function getToken(): string | null {
    return localStorage.getItem('token')
}

function parseJwt(token: string): any {
    try {
        const payload = token.split('.')[1]
        return JSON.parse(atob(payload))
    } catch (e) {
        return null
    }
}

export function getUserIdFromToken(): string | null {
    const token = getToken()
    if (!token) return null

    const decoded = parseJwt(token)
    return decoded?.id || decoded?.user_id || null
}
