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
};
// --- Fetch single category ---
const fetchPostBasedOnPreference = async (preference) => {
    const url = `https://gnews.io/api/v4/top-headlines?category=${preference}&lang=en&max=20&apikey=00c41df59e3671ca98787dd518b439b8`;
    console.log(url);
    return axios.get(url);
};
// fetchPostBasedOnPreference('sports')
//  --- Fetch multiple preferences ---
const fetchPostOnPreferences = async (preferences) => {
    // Determine which categories to use
    let apiCategories;
    if (preferences.length === 0) {
        apiCategories = ["general"];
    }
    else {
        apiCategories = preferences.map((pref) => pref in categoryNameCases
            ? categoryNameCases[pref]
            : undefined);
    }
    const filteredCategory = Array.from(new Set(apiCategories.filter((cat) => Boolean(cat))));
    // allow non dublicate Values
    console.log(filteredCategory);
    return filteredCategory;
};
const fetchSequentially = async (optimizedPreferences) => {
    const articles = [];
    for (const cat of optimizedPreferences) {
        const url = `https://gnews.io/api/v4/top-headlines?category=${cat}&lang=en&max=20&apikey=${process.env.GNEWS_API_KEY}`;
        try {
            const result = await axios.get(url);
            if (result.data?.articles) {
                articles.push(...result.data.articles); // combine all articles
            }
        }
        catch (err) {
            console.error(`Error fetching category ${cat}:`, err);
        }
    }
    return articles;
};
export { fetchPostOnPreferences, fetchPostBasedOnPreference, fetchSequentially };
// const getPostAsync = () => {
// //     // Make multiple requests (one per category)
// //     const responses = await Promise.allSettled(
// //         filteredCategory.map((cat) => fetchPostBasedOnPreference(cat))
// //     )
// //     // console.log(responses, 'res')
// //     // // Combine all successful results
// //     const articles = responses
// //         .filter((r) => r.status === "fulfilled")
// //         .flatMap((r) => r.value.data.articles);
// //     console.log(articles, 'articles')
// //     return {
// //         categories: filteredCategory,
// //         totalArticles: articles.length,
// //         articles,
// //     };
// }
