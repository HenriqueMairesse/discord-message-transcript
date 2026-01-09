let client = null;
export function getClient() {
    return client;
}
export function setClient(c) {
    if (!client) {
        client = c;
    }
}
