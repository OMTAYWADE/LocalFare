export function getGeoapifyApiKey(): string {
    const key = process.env.GEOAPIFY_API_KEY;

    if (!key) {
        throw new Error(
            "GEOAPIFY_API_KEY is not configured.",
        );
    }

    return key;
}