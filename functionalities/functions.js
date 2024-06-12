
const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) {
            console.error('User already exists');
            return res.json({ msg: 'User exists' });
        }

        user = new User({ name, email, password });
        await user.save();
        console.log('User registered successfully');
        res.status(201).send('User registered');
    } catch (err) {
        console.error('Error registering user:', err.message);
        res.status(500).send('Server error');
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user || user.password !== password) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        if (!user.isActive) {
            return res.json({ msg: 'Account is deactivated' });
        }

        const payload = { user: { id: user.id } };
        jwt.sign(payload, 'secretToken', { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};


exports.getUserDetails = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            console.error('User not found');
            return res.status(404).json({ msg: 'User not found' });
        }

        if (!user.isActive) {
            return res.status(403).json({ msg: 'Account is deactivated' });
        }
        console.log('User details fetched successfully');

        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.deactivateUser = async (req,res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        user.isActive = false;
        await user.save();
        res.send('User deactivated');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
