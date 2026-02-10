import { imageUrlResolver } from "./imageUrlResolver.js";
import { urlResolver } from "./urlResolver.js";
export async function authorUrlResolver(authors, options, cdnOptions, urlCache) {
    return await Promise.all(Array.from(authors.values()).map(async (author) => {
        return {
            ...author,
            avatarURL: await urlResolver((await imageUrlResolver(author.avatarURL, options, false)), options, cdnOptions, urlCache),
        };
    }));
}
