const {
    fetchUsers,
    fetchUserPosts,
    fetchPostComments
} = require('../services/apiservices');

async function getTopUsers() {
    const users = await fetchUsers();
    const userCommentsMap = {};

    for (const user of users) {
        const posts = await fetchUserPosts(user.id);
        let totalComments = 0;

        for (const post of posts) {
            const comments = await fetchPostComments(post.id);
            totalComments += comments.length;
        }

        userCommentsMap[user.id] = {
            id: user.id,
            name: user.name,
            totalComments
        };
    }

    const sortedUsers = Object.values(userCommentsMap)
        .sort((a, b) => b.totalComments - a.totalComments)
        .slice(0, 5);

    return sortedUsers;
}

async function getPostsByType(type) {
    const users = await fetchUsers();
    let allPosts = [];

    for (const user of users) {
        const posts = await fetchUserPosts(user.id);
        allPosts.push(...posts);
    }

    for (const post of allPosts) {
        const comments = await fetchPostComments(post.id);
        post.commentCount = comments.length;
    }

    if (type === 'popular') {
        return allPosts
            .sort((a, b) => b.commentCount - a.commentCount)
            .slice(0, 5);
    } else {
        return allPosts
            .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
            .slice(0, 5);
    }
}

module.exports = {
    getTopUsers,
    getPostsByType
};