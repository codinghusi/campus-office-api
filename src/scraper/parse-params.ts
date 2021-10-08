

export function parseParams(url: string) {
    const rawParams = url.slice(url.indexOf("?") + 1);
    const entries = rawParams.split("&").map(raw => raw.split("="));
    const params = Object.fromEntries(entries);
    return params;
}

export function objToParams(params: Record<string, string>) {
    return Object.entries(params).map(([key, value]) => `${key}=${value}`).join('&');
}