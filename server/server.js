const express = require('express');
const Sequelize = require('sequelize');
const bodyParser = require('body-parser');
const cors = require('cors');

const { port, database } = require('./keys');
const mainRoutes = require('./routes/main');

const app = express();
const sequelize = new Sequelize(database);

sequelize.authenticate()
    .then(() => console.log('DB connection successful'))
    .catch(err => console.log(err));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.use('/api', mainRoutes);

app.listen(port, (err) => {
    if (err) console.log(err);
    console.log(`Server started at port ${port}`);
}) ;

module.exports = { app };
