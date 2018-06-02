const bcrypt = require('bcrypt-nodejs');
const { User, Task } = require('../../models');

const users = [
    {
        email: 'fernan@fernan.com',
        password: 'pass123',
        name: 'Fernan de Dios'
    },
    {
        email: 'elsa@elsa.com',
        password: 'pass456',
        name: 'Elsa de Dios'
    }
];

const populateUsers = (done) => {
    jest.setTimeout(8000);

    User.destroy({ truncate: { cascade: true } })
    .then(() => {
        const userOne = User.build({ 
            name: users[0].name,
            email: users[0].email,
            password: bcrypt.hashSync(users[0].password, null)
        }).save();

        const userTwo = User.build({ 
            name: users[1].name,
            email: users[1].email,
            password: bcrypt.hashSync(users[1].password, null)
        }).save();

        return Promise.all([userOne, userTwo]);
    })
    .then(() => {
        done();
    });
};

module.exports = { users, populateUsers };
