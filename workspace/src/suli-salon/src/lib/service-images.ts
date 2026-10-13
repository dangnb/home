const DEFAULT_SERVICE_IMAGE = "/uploads/banner.png";

export function getServiceImageFallback(identifier = ""): string {
    const value = identifier.toLowerCase();

    if (value.includes("pedicure")) return "/uploads/pedicure.png";
    if (value.includes("nail-art") || value.includes("nail art") || value.includes("design")) return "/uploads/nails_art.png";
    if (value.includes("extension")) return "/uploads/team.png";
    if (value.includes("care") || value.includes("repair")) return "/uploads/pedicure.png";

    return DEFAULT_SERVICE_IMAGE;
}
