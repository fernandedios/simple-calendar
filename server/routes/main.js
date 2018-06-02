const router = require('express').Router();
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt-nodejs');

const { secretKey } = require('../keys');
const { User, Task } = require('../models');
const checkToken = require('../middlewares/checkToken');

router.post('/signup', async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const hashed = bcrypt.hashSync(password, null);
        const user = User.build({ name, email, password: hashed });
        const existingUser = await User.findOne({ where: { email }});

        if (existingUser) {
            res.json({
                success: false,
                message: 'Account with that email already exists'
            });
        }
        else {
            const token = jwt.sign({ user }, secretKey, { expiresIn: '2d' });
            await user.save();
            res.json({
                success: true,
                message: 'Signup successful',
                token
            })
        }
    }
    catch (err) {
        next(err);
    }
});

router.post('/login', async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email }});
        if (!user) {
            res.json({
                success: false,
                message: 'User not found'
            });
        }
        else {
            const valid = bcrypt.compareSync(password, user.password);
            if (!valid) {
                res.json({
                    success: false,
                    message: 'Invalid user credentials'
                });
            }
            else {
                const token = jwt.sign({ user }, secretKey, { expiresIn: '2d' });
                res.json({
                    success: true,
                    message: 'Login successful',
                    token
                });
            }
        }
    }
    catch (err) {
        next(err);
    }
});

router.route('/tasks')
    .get(checkToken, async (req, res, next) => {
        try {
            const tasks = await Task.findAll({ where: { userID: req.decoded.user.id } });
            res.json({
                success: true,
                message: 'Tasks fetched successfully',
                tasks
            });
        }
        catch (err) {
            next(err);
        }
    })
    .post(checkToken, async (req, res, next) => {
        const { start, duration, title } = req.body;
        try {
            const task = Task.build({
                start, duration, title, userID: req.decoded.user.id
            });

            await task.save();
            res.json({
                success: true,
                message: 'Task added successfully',
                task
            });
        }
        catch(err) {
            next(err);
        }
    });

router.route('/tasks/:id')
    .put(checkToken, async (req, res, next) => {
        const { start, duration, title } = req.body;
        try {
            const task = await Task.update({ start, duration, title }, { where: { id: req.params.id }});
            res.json({
                success: true,
                message: 'Task successfully updated',
                task
            });
        }
        catch (err) {
            next(err);
        }
    })
    .delete(checkToken, async (req, res, next) => {
        try {
            await Task.destroy({ where: { id: req.params.id }});
            res.json({
                success: true,
                message: 'Task successfully deleted'
            });
        }
        catch (err) {
            next(err);
        }
    });

    

module.exports = router;
