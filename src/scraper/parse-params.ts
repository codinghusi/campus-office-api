

export default function parseParams(url: string) {
    const rawParams = url.slice(url.indexOf("?") + 1);
    const entries = rawParams.split("&").map(raw => raw.split("="));
    const params = Object.fromEntries(entries);
    return params;
}