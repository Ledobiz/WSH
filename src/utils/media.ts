// Cloudinary delivery helpers for the public website. Only URLs hosted on
// res.cloudinary.com are transformed; anything else is returned unchanged.

const CLOUDINARY = /^https:\/\/res\.cloudinary\.com\/[^/]+\/(image|video)\/upload\//;

const insertTransform = (url: string, transform: string) =>
    url.replace(CLOUDINARY, (match) => `${match}${transform}/`);

/** Small, compressed, square-cropped image for grids and thumbnails. */
export const imageThumb = (url: string, size = 480) =>
    CLOUDINARY.test(url) && url.includes("/image/upload/")
        ? insertTransform(url, `c_fill,g_auto,w_${size},h_${size},q_auto,f_auto`)
        : url;

/** Full-screen image, capped in width and auto-compressed. */
export const imageLarge = (url: string, width = 1600) =>
    CLOUDINARY.test(url) && url.includes("/image/upload/")
        ? insertTransform(url, `c_limit,w_${width},q_auto,f_auto`)
        : url;

/** First frame of a Cloudinary video as a compressed JPEG poster. */
export const videoPoster = (url: string, size = 480) => {
    if (!CLOUDINARY.test(url) || !url.includes("/video/upload/")) return undefined;
    return insertTransform(url, `so_0,c_fill,w_${size},h_${size},q_auto`).replace(/\.[a-z0-9]+(\?.*)?$/i, ".jpg");
};

export const initials = (name?: string | null) =>
    (name ?? "")
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? "")
        .join("") || "S";
