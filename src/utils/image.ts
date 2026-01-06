const API_URL = import.meta.env.VITE_API_URL;

export function GetImage(path: string) {
    return `${API_URL}${path}`;
}