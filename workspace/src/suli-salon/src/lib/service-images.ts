const DEFAULT_SERVICE_IMAGE = "https://res.cloudinary.com/jawkxked/image/upload/v1791910439/moc-salon/pczutt3rlztnazddlwey.jpg";

export function getServiceImageFallback(identifier = ""): string {
    const value = identifier.toLowerCase();

    if (value.includes("pedicure")) return "https://res.cloudinary.com/jawkxked/image/upload/v1791910444/moc-salon/xeq1btt5gvpkzdsdjqir.jpg";
    if (value.includes("nail-art") || value.includes("nail art") || value.includes("design")) return "https://res.cloudinary.com/jawkxked/image/upload/v1791910442/moc-salon/intphywxofrojkd1eix7.jpg";
    if (value.includes("extension")) return "https://res.cloudinary.com/jawkxked/image/upload/v1791910446/moc-salon/hrzz84u08aqrlvhimgzk.jpg";
    if (value.includes("care") || value.includes("repair")) return "https://res.cloudinary.com/jawkxked/image/upload/v1791910444/moc-salon/xeq1btt5gvpkzdsdjqir.jpg";

    return DEFAULT_SERVICE_IMAGE;
}
