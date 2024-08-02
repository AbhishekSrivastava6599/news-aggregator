const users = require('../models/userModel');

exports.getPreferences = (req, res, next) => {
    try {
        const user = users.find(user => user.id === req.user.id);
        if (!user) return res.status(404).send('User not found.');
        res.send({ preferences: user.preferences });
    } catch (err) {
        next(err);
    }
};

exports.updatePreferences = (req, res, next) => {
    try {
        const user = users.find(user => user.id === req.user.id);
        if (!user) return res.status(404).send('User not found.');
        user.preferences = req.body.preferences;
        res.send('Preferences updated successfully.');
    } catch (err) {
        next(err);
    }
};
