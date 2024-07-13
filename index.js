const express = require('express');
const bodyParser = require('body-parser');
const productRoutes = require('./src/routes/productRoutes');
const sequelize = require('./src/config/database');

const app = express();
const cors = require('cors');

app.use(cors());
app.use(bodyParser.json());
app.use('/api', productRoutes);
app.use('/uploads', express.static('src/uploads'));

sequelize.sync()
  .then(() => {
    app.listen(5000, () => {
      console.log('Server is running on port 5000');
    });
  })
  .catch(err => {
    console.log(err);
  });

module.exports = app;
