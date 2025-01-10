/**
 * @swagger
 * /api/news/{category}:
 *   get:
 *     summary: Fetch articles by category
 *     description: >
 *       Available categories: "technology", "science", "health", "sports", "business", "entertainment".
 *     parameters:
 *       - in: path
 *         name: category
 *         schema:
 *           type: string
 *         required: true
 *         description: The category of articles to fetch.
 *         enum:
 *           - technology
 *           - health
 *           - sports
 *           - business
 *     responses:
 *       200:
 *         description: Successfully fetched articles.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 articles:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       title:
 *                         type: string
 *                       category:
 *                         type: string
 *                       publishedAt:
 *                         type: string
 *                         format: date-time
 *       400:
 *         description: Category is required.
 *       404:
 *         description: No articles found for the specified category.
 *       500:
 *         description: Failed to fetch news articles.
 */

const express = require('express');
const { PrismaClient } = require('@prisma/client');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./swaggerConfig'); // Import the configuration

const prisma = new PrismaClient();
const app = express();
const port = 4000; // You can change this to any available port
const cors = require('cors');


// Middleware to parse JSON body
app.use(express.json());

//cors
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Set up Swagger UI
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Route to fetch articles by category
app.get('/api/news/:category', async (req, res) => {
  const { category } = req.params;

  if (!category) {
    return res.status(400).json({ error: 'Category is required.' });
  }

  try {
    // Fetch articles from the database by category
    const articles = await prisma.article.findMany({
      where: {
        category: {
          contains: category, // Adjust this based on how you associate articles with categories
          mode: 'insensitive', // Case-insensitive match
        },
      },
      orderBy: {
        publishedAt: 'desc', // Order by newest first
      },
    });

    if (articles.length === 0) {
      return res.status(404).json({ message: `No articles found for category: ${category}` });
    }

    return res.status(200).json({ articles });
  } catch (error) {
    console.error('Error fetching news:', error);
    return res.status(500).json({ error: 'Failed to fetch news articles.' });
  } finally {
    await prisma.$disconnect();
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
