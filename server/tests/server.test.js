const request = require('supertest');
const { app } = require('../server');

const { User, Task } = require('../models');
const { users, populateUsers } = require('./seed');

const defaultUser = {
    email: 'tester@tester.com',
    name: 'Tester Guy',
    password: 'password'
};

const defaultTask = {
    start: 0,
    duration: 30,
    title: 'Eat breakfast'
};

beforeEach(populateUsers);

describe('POST /api/signup', () => {
    it('should create a new user if email is valid and available', (done) => {
        const { name, email, password } = defaultUser;
        request(app) 
            .post('/api/signup')
            .send({ email, name, password })
            .expect(200)
            .expect((res) => {
                const { success } = res.body;
                expect (success).toEqual(true);
            })
            .end((err, res) => {
                if (err) return done(err);

                User.findOne({ where: { email }})
                    .then((foundUser) => {
                        expect(foundUser).toBeDefined();
                        expect(foundUser.email).toEqual(email);
                        done();
                    })
                    .catch(err => done(err));
            });
    });

    it('should NOT create a new user if email is in use', (done) => {
        const email = users[0].email;
        const { name, password } = defaultUser;

        request(app)
            .post('/api/signup')
            .send({ name, email, password })
            .expect((res) => {
                const { success } = res.body;
                expect(success).toEqual(false);
            })
            .end(done);
    });

    it ('should store passwords as hash on database', (done) => {
        const { name, email, password } = defaultUser;
        request(app)
            .post('/api/signup')
            .send({ name, email, password })
            .expect(200)
            .expect((res) => {
                const { success } = res.body;
                expect(success).toEqual(true);
            })
            .end((err, res) => {
                if (err) return done(err);

                User.findOne({ where: { email }})
                    .then((foundUser) => {
                        expect(foundUser.password).not.toEqual(password);
                        done();
                    })
                    .catch((err) => done(err));
            });
    });
});

describe('POST /api/login', () => {
    it('should login user with right credentials', (done) => {
        const { email, password } = users[0];

        request(app)
            .post('/api/login')
            .send({ email, password })
            .expect(200)
            .expect((res) => {
                const { success, token } = res.body;
                expect(success).toEqual(true);
                expect(token).toBeDefined();
            })
            .end(done);
    });

    it('should NOT login user with invalid credentials', (done) => {
        const { email } = users[0];
        const password = 'ppppp';

        request(app)
            .post('/api/login')
            .send({ email, password })
            .expect(200)
            .expect((res) => {
                const { success, token } = res.body;
                expect(success).toEqual(false);
                expect(token).not.toBeDefined();
            })
            .end(done);
    });
});

describe('POST /api/tasks', () => {
    it('should NOT add task if user is not logged in', (done) => {
        const { start, duration, title } = defaultTask;
        
        request(app)
            .post('/api/tasks')
            .send({ start, duration, title })
            .expect((res) => {
                const { success } = res.body;
                expect(success).toEqual(false);
                done();
            });
    });
});
