require('dotenv/config')

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');

const { isAuthenticated } = require('./middlewares/jwt.middleware');

mongoose.connect('mongodb://localhost:27017/cookout')
    .then(connectObject => {
        console.log(`connected to db ${connectObject.connections[0].name}`);
    })
    .catch(err => console.log(err));

    
const app = express();

app.use(express.json());
app.use(morgan('dev'));


app.use(cors({
    origin: [
      'http://localhost:3000'
    ]
}))

const authRoutes = require('./routes/auth.routes');
app.use('/auth', authRoutes);

const recipeRoutes = require('./routes/recipe.routes')
app.use('/api', isAuthenticated, recipeRoutes)

const eventRoutes = require('./routes/event.routes')
app.use('/api', eventRoutes)

app.listen('3001', () => {
    console.log('>> listening on port 3001 <<')
  });