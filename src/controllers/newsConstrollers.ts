import { success } from "zod";
import User from "../modal/userModal.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { articleCahce, fetchPostAsyc, fetchPostOnPreferences, fetchSequentially } from "../utils/NewsFetcher.js";
import { Response, Request } from "express";

// inmemoryCache: 

// "preference": [{id},{id}]




const getNewsPreferences = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.userId;
    if (!userId) {
        return res.status(401).json({ success: false, message: 'Give user id not found' });
    }

    const user = await User.findOne({ _id: userId });

    if (!user) {
        return res.status(401).json({
            success: false,
            message: 'User is not found in the record'
        })
    }

    const optimizedPreferences = await fetchPostOnPreferences(user.preferences);

    // Data is fetched Sequentionally because External News app not allows current request at once:
    const articles = await fetchSequentially(optimizedPreferences);

    // For get Post Async Note the extral api throw a error;
    // const articles = await fetchPostAsyc(optimizedPreferences)
    return res.status(200).json({
        success: true,
        news: articles
    })

})

const postNewsRead = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;

    let found = false;

    for (const cache of articleCahce.values()) {
        const article = cache.find((a) => a.id === id);
        if (article) {
            article.read = true;
            console.log('Marked as Read', article.title);
            found = true
            break;
        }
    }
    if (!found) {
        return res.status(401).json({
            sucess: false,
            message: 'Article Id is not found in the records'
        })
    }

    return res.status(200).json({
        success: true,
        message: 'Article marked as Read'
    })

})
const postNewsFavourite = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;

    let found = false;

    for (const cache of articleCahce.values()) {
        const article = cache.find((a) => a.id === id);
        if (article) {
            article.favorites = true;
            console.log('Marked as favourites', article.title);
            found = true
            break;
        }
    }
    if (!found) {
        return res.status(401).json({
            sucess: false,
            message: 'Article Id is not found in the records'
        })
    }

    return res.status(200).json({
        success: true,
        message: 'Article marked as Favourite'
    })

})
const getRead = asyncHandler(async (req: Request, res: Response) => {


    const readArticles = []
    for (const cache of articleCahce.values()) {
        const article = cache.filter((a) => a.read === true)
        readArticles.push(...article)
    }


    return res.status(200).json({
        success: true,
        article: readArticles,
        message: 'Article marked as Favourite'
    })

})
const getFavourite = asyncHandler(async (req: Request, res: Response) => {


    const getFavourite = []
    for (const cache of articleCahce.values()) {
        const article = cache.filter((a) => a.favorites === true)
        getFavourite.push(...article)
    }


    return res.status(200).json({
        success: true,
        article: getFavourite,
        message: 'Article marked as Favourite'
    })

})

const getSearch = asyncHandler(async (req: Request, res: Response) => {
    const keyword = req.params.keyword;
    console.log(keyword, '--key')
    const searchArticles = []
    for (const cache of articleCahce.values()) {
        const article = cache.filter((a) => a.title.includes(keyword))
        searchArticles.push(...article)
    }


    return res.status(200).json({
        success: true,
        article: searchArticles,
        message: 'Article marked as Favourite'
    })

})


export { getNewsPreferences, postNewsRead, postNewsFavourite, getRead, getFavourite, getSearch }