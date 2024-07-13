const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  creationDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
},
{
  // Define the schema name here
  schema: 'Product',
});

module.exports = Product;
