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
        console.error(e)
        return null;
    }
}
