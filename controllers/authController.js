const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const users = require('../models/userModel');
const { validateRegistration, validateLogin } = require('../utils/validation');

exports.register = async (req, res, next) => {
    try {
        const { error } = validateRegistration(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const userExists = users.find(user => user.email === req.body.email);
        if (userExists) return res.status(400).send('User already exists.');

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const user = {
            id: users.length + 1,
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            preferences: req.body.preferences || []
        };

        users.push(user);
        res.send('User registered successfully.');
    } catch (err) {
        next(err);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { error } = validateLogin(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const user = users.find(user => user.email === req.body.email);
        if (!user) return res.status(400).send('Invalid email or password.');

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) return res.status(401).send('Invalid email or password.');

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
        res.send({ token });
    } catch (err) {
        next(err);
    }
};
