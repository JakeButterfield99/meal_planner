import api from "./axios";

async function GenerateImage(foodId: number): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
        try {
            const response = await api.get('/image', {
                params: { foodId }
            });

            if (!response.data.imageUrl)
                return reject("NO IMAGE SUPPLIED");

            return resolve(response.data.imageUrl);
        }
        catch (err) {
            reject(err);
        }
    });
}

export default {
    GenerateImage
}