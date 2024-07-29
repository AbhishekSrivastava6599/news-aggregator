const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const users = [];

// Routes
app.post('/register', (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    users.push({ username, email, password: hashedPassword });

    res.status(201).json({ message: 'User registered successfully' });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const user = users.find((u) => u.username === username);
    if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, 'your-secret-key', { expiresIn: '1h' });

    res.status(200).json({ token });
});

app.get('/preferences', (req, res) => {
    const userId = req.user.id;

    const userPreferences = getUserPreferences(userId);

    if (!userPreferences) {
        return res.status(404).json({ error: 'User preferences not found' });
    }

    res.status(200).json({ preferences: userPreferences });
});

function getUserPreferences(userId) {
    const user = users.find((u) => u.id === userId);
    return user ? user.preferences : null;
}

app.put('/preferences', (req, res) => {
    const userId = req.user.id;

    const user = users.find((u) => u.id === userId);

    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    const updatedPreferences = req.body.preferences;

    user.preferences = updatedPreferences;

    res.status(200).json({ message: 'Preferences updated successfully' });
});

app.get('/news', async (req, res) => {
    try {
        const userId = req.user.id;

        const userPreferences = getUserPreferences(userId);

        if (!userPreferences) {
            return res.status(404).json({ error: 'User preferences not found' });
        }

        const newsArticles = await fetchNewsBasedOnPreferences(userPreferences);

        res.status(200).json({ news: newsArticles });

    } catch (error) {
        console.error('Error fetching news:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

function getUserPreferences(userId) {
    const user = users.find((u) => u.id === userId);
    return user ? user.preferences : null;
}

async function fetchNewsBasedOnPreferences(preferences) {

    return [
        {
            title: 'Breaking News: Something Exciting Happened!',
            description: 'Read all about it!',
            source: 'Awesome News Network',
            url: 'https://example.com/article123',
        },
    ];
}

app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});



module.exports = app;