export function decodeJWT(token: string) {
    const [header, payload, signature] = token.split('.')

    const padToken = (base64String: string) => {
        const block = base64String.replace(/-/g, '+').replace(/_/g, '/')
        return block.padEnd(block.length + (4 - block.length % 4) % 4, '=')
    }
    try {
        const decodedHeader = JSON.parse(atob(padToken(header)))
        const decodedPayload = JSON.parse(atob(padToken(payload)))
        return { header: decodedHeader, payload: decodedPayload, signature };
    } catch (e) {
        console.error((e as Error).message)
        return null;
    }
}

export function isTokenExpired(token: string): boolean {
    const decodedToken = decodeJWT(token);
    if (!decodedToken) {
        return true;
    }

    const { payload } = decodedToken;
    if (!payload.exp) {
        return false;
    }

    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
}