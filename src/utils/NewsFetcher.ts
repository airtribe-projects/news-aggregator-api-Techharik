import axios from "axios";

const categoryNameCases = {
    sports: "sports",
    entertainment: "entertainment",
    comics: "entertainment",
    games: "sports",
    movies: "entertainment",
    business: "business",
    health: "health",
    technology: "technology",
    science: "science",
    general: "general",
} as const;

// --- Fetch single category ---
const fetchPostBasedOnPreference = async (preference: string) => {
    const url = `https://gnews.io/api/v4/top-headlines?category=${preference}&lang=en&max=20&apikey=00c41df59e3671ca98787dd518b439b8`;
    console.log(url)
    return axios.get(url);
};
// fetchPostBasedOnPreference('sports')
//  --- Fetch multiple preferences ---
const fetchPostOnPreferences = async (preferences: string[]) => {
    // Determine which categories to use
    let apiCategories: (string | undefined)[];

    if (preferences.length === 0) {
        apiCategories = ["general"];
    } else {
        apiCategories = preferences.map((pref) =>
            pref in categoryNameCases
                ? categoryNameCases[pref as keyof typeof categoryNameCases]
                : undefined
        )
    }
    const filteredCategory = Array.from(
        new Set(
            apiCategories.filter((cat): cat is string => Boolean(cat))
        )
    );

    // allow non dublicate Values
    console.log(filteredCategory)
    return filteredCategory

};
type Article = {
    id: string,
    title: string,
    descritpion?: string,
    content?: string,
    read: boolean,
    favorites: boolean
}
// InmemoryCache:
export const articleCahce: Map<string, Article[]> = new Map();


const fetchSequentially = async (optimizedPreferences: string[]) => {
    const articles: any[] = [];

    for (const cat of optimizedPreferences) {

        if (articleCahce.has(cat)) {
            articles.push(...articleCahce.get(cat) ?? []);
            console.log('✅ Cache Hit', cat)
            continue;
        }


        const url = `https://gnews.io/api/v4/top-headlines?category=${cat}&lang=en&max=20&apikey=${process.env.GNEWS_API_KEY}`;




        try {
            const result = await axios.get(url);
            // set cache:
            if (result.data?.articles) {
                articleCahce.set(cat, result.data.articles)
                articles.push(...result.data.articles); // combine all articles
            }
        } catch (err) {
            console.error(`Error fetching category ${cat}:`, err);
        }
    }

    return articles;
};



const fetchPostAsyc = async (optimizedPreferences: string[]) => {
    const articles = [];

    const requests = optimizedPreferences.map(cat => {
        const url = `https://gnews.io/api/v4/top-headlines?category=${cat}&lang=en&max=20&apikey=${process.env.GNEWS_API_KEY}`;
        return axios.get(url)
    })
    const results = await Promise.allSettled(requests);

    const allArticles = results
        .filter((r): r is PromiseFulfilledResult<any> => r.status === "fulfilled")
        .flatMap(r => r.value.data.articles ?? []);

    console.log(optimizedPreferences)
    // Log failed requests (optional)
    results
        .filter((r): r is PromiseRejectedResult => r.status === "rejected")
        .forEach(r => console.warn("Request failed:", r.reason.message));
    return allArticles;

}



export { fetchPostOnPreferences, fetchPostBasedOnPreference, fetchSequentially, fetchPostAsyc }


