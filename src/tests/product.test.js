const request = require('supertest');
const app = require('../app');
const Product = require('../models/product');

describe('Product API', () => {
  beforeAll(async () => {
    await Product.sync({ force: true });
  });

  it('should create a product', async () => {
    const res = await request(app)
      .post('/api/products')
      .field('name', 'Test Product')
      .field('price', 100)
      .attach('image', 'path/to/image.jpg');

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('name', 'Test Product');
  });

  it('should get all products', async () => {
    const res = await request(app).get('/api/products');
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it('should get a product by ID', async () => {
    // First create a product to retrieve later
    const newProduct = await Product.create({ name: 'Product to Retrieve', price: 150, imageUrl: 'path/to/image.jpg' });

    const res = await request(app).get(`/api/products/${newProduct.id}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('name', 'Product to Retrieve');
  });

  it('should update a product', async () => {
    // First create a product to update later
    const newProduct = await Product.create({ name: 'Product to Update', price: 200, imageUrl: 'path/to/image.jpg' });

    const res = await request(app)
      .put(`/api/products/${newProduct.id}`)
      .field('name', 'Updated Product')
      .field('price', 250);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('name', 'Updated Product');
  });

  it('should delete a product', async () => {
    // First create a product to delete later
    const newProduct = await Product.create({ name: 'Product to Delete', price: 300, imageUrl: 'path/to/image.jpg' });

    const res = await request(app).delete(`/api/products/${newProduct.id}`);

    expect(res.statusCode).toEqual(204);

    // Verify the product is deleted
    const checkRes = await request(app).get(`/api/products/${newProduct.id}`);
    expect(checkRes.statusCode).toEqual(404);
  });

  // Add more tests as needed
});
