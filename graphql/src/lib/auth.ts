const API_URL = 'https://zone01normandie.org/api/auth/signin' // remplace ((DOMAIN)) par le vrai domaine

// 🔐 Encode login:password en Base64
function encodeCredentials(login: string, password: string): string {
    return btoa(`${login}:${password}`)
}

// 🚪 Login : retourne un JWT ou lève une erreur
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


// 🚪 Logout : supprime le token
export function logout() {
    localStorage.removeItem('token')
}

// 📥 Récupère le token actuel
export function getToken(): string | null {
    return localStorage.getItem('token')
}

// 🧠 Décoder le payload d’un JWT
function parseJwt(token: string): any {
    try {
        const payload = token.split('.')[1]
        return JSON.parse(atob(payload))
    } catch (e) {
        return null
    }
}

// 🆔 Récupérer l’ID utilisateur à partir du token
export function getUserIdFromToken(): string | null {
    const token = getToken()
    if (!token) return null

    const decoded = parseJwt(token)
    return decoded?.id || decoded?.user_id || null
}
