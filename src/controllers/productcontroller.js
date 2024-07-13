const Product = require('../models/product');
const Sequelize = require('sequelize');


exports.createProduct = async (req, res) => {
  try {
    console.log(req.file, '<==== Uploaded File');
    const { name, price } = req.body;
    let imageUrl = null;

    // Check if req.file exists and set imageUrl accordingly
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    // Check if a product with the same name and price already exists
    const existingProduct = await Product.findOne({ where: { name, price } });

    if (existingProduct) {
      return res.status(400).json({ error: 'Product with the same name and price already exists.' });
    }

    // Create new product with Sequelize
    const product = await Product.create({ name, image: imageUrl, price });

    // Respond with created product details
    res.status(201).json({
      id: product.id,
      name: product.name,
      image: imageUrl,
      price: product.price
    });
  } catch (error) {
    // Handle validation errors or other errors
    console.error('Error creating product:', error);
    res.status(400).json({ error: error.message });
  }
};



exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price } = req.body;
    let imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    product.name = name;
    product.price = price;
    if (imageUrl) product.image = imageUrl;
    await product.save();

    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const { name, startDate, endDate, sortBy, order, page, pageSize } = req.query;
    const where = {};
    const limit = parseInt(pageSize) || 10; // Default limit to 10 if not provided
    const offset = page ? (parseInt(page) - 1) * limit : 0; // Calculate offset based on page number

    if (name) where.name = { [Sequelize.Op.like]: `%${name}%` };
    if (startDate && endDate) where.createdAt = { [Sequelize.Op.between]: [new Date(startDate), new Date(endDate)] };

    const products = await Product.findAndCountAll({
      where,
      order: [[sortBy || 'createdAt', order || 'ASC']],
      limit,
      offset
    });

    res.status(200).json({
      rows: products.rows.map(product => ({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image, // Ensure the image field is included
        createdAt: product.createdAt,
        updatedAt: product.updatedAt
      })),
      count: products.count
    });
  } catch (error) {
    console.error('Error fetching products:', error); // Improved error logging
    res.status(400).json({ error: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
