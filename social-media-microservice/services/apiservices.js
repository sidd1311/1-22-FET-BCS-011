const axios = require('axios');
require('dotenv').config();

const BASE_URL = 'http://20.244.56.144/evaluation-service';
// const AUTH_TOKEN = process.env.API_TOKEN;


const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Authorization': `Bearer ${AUTH_TOKEN}`,
        'Content-Type': 'application/json'
    }
});

api.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
            console.error('Token expired or invalid', error.response);
        }
        return Promise.reject(error);
    }
);

async function fetchUsers() {
    try {
        const res = await api.get('/users');
        return Object.entries(res.data.users).map(([id, name]) => ({ id, name }));
    } catch (error) {
        console.error('Error fetching users:', error.message);
        throw error;
    }
}

async function fetchUserPosts(userId) {
    try {
        const res = await api.get(`/users/${userId}/posts`);
        return res.data.posts || [];
    } catch (error) {
        console.error(`Error fetching posts for user ${userId}:`, error.message);
        throw error;
    }
}

async function fetchPostComments(postId) {
    try {
        const res = await api.get(`/posts/${postId}/comments`);
        return res.data.comments || [];
    } catch (error) {
        console.error(`Error fetching comments for post ${postId}:`, error.message);
        throw error;
    }
}

module.exports = {
    fetchUsers,
    fetchUserPosts,
    fetchPostComments
};
