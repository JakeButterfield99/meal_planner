const API_URL = String(import.meta.env.VITE_API_URL);
const IMG_URL = (API_URL.slice(-1) === "/") ? API_URL.slice(0, -1) : API_URL;

export function GetImage(path: string) {
    return `${IMG_URL}${path}`;
}