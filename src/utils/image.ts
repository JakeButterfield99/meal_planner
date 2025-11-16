const IMG_URL = "http://localhost:3000";

export function GetImage(path: string) {
    return `${IMG_URL}${path}`;
}