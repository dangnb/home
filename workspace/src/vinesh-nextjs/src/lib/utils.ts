/**
 * Safely parse translation JSON and extract the value for a given language code and field.
 */
export function getTranslation(jsonString: string | null | undefined, langCode: string, field: string = 'title'): string {
    if (!jsonString) return "";
    try {
        const parsed = JSON.parse(jsonString);
        return parsed[langCode]?.[field] || parsed['vi']?.[field] || "";
    } catch {
        return "";
    }
}
