export function clearSession() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
}

export function isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
        const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(atob(base64));

        if (payload.exp * 1000 < Date.now()) {
            clearSession();
            return false;
        }

        return true;
    } catch {
        clearSession();
        return false;
    }
}