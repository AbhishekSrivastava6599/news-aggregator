const axios = require('axios');
const users = require('../models/userModel');

exports.getNews = async (req, res, next) => {
    try {
        const user = users.find(user => user.id === req.user.id);
        if (!user) return res.status(404).send('User not found.');

        const preferences = user.preferences.join(',');
        const response = await axios.get(`https://newsapi.org/v2/everything?q=${preferences}&apiKey=${process.env.NEWS_API_KEY}`);
        res.send({ news: response.data.articles });
    } catch (error) {
        next(error);
    }
};
