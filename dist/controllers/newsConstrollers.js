import User from "../modal/userModal.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { fetchPostOnPreferences, fetchSequentially } from "../utils/NewsFetcher.js";
const getNewsPreferences = asyncHandler(async (req, res) => {
    const userId = req.userId;
    if (!userId) {
        return res.status(401).json({ success: false, message: 'Give user id not found' });
    }
    const user = await User.findOne({ _id: userId });
    if (!user) {
        return res.status(401).json({
            success: false,
            message: 'User is not found in the record'
        });
    }
    const optimizedPreferences = await fetchPostOnPreferences(user.preferences);
    const articles = await fetchSequentially(optimizedPreferences);
    return res.status(200).json({
        success: true,
        news: articles
    });
});
export { getNewsPreferences };
