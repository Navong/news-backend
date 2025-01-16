const axios = require("axios");
const { PrismaClient } = require("@prisma/client");
require("dotenv").config();

const prisma = new PrismaClient();

const categories = [
    "general",
    "business",
    "entertainment",
    "health",
    "science",
    "sports",
    "technology",
];

async function fetchNews(category) {
    const apiKey = "39a33a2d3e514b68b3828b51924888dc";
    const { data } = await axios.get(
        `https://newsapi.org/v2/top-headlines?category=${category}&apiKey=${apiKey}`
    );

    if (data.status !== "ok") throw new Error("Failed to fetch news.");
    return data;
}

async function seed() {
    try {
        console.log("Seeding data...");
        for (const category of categories) {
            console.log(`Fetching articles for category: ${category}`);
            const newsData = await fetchNews(category);

            if (!newsData.articles || newsData.articles.length === 0) {
                console.log(`No articles found for category: ${category}`);
                continue;
            }

            const articles = newsData.articles.map((article) => ({
                title: article.title,
                description: article.description || null,
                url: article.url,
                urlToImage: article.urlToImage || null,
                publishedAt: new Date(article.publishedAt),
                category: category,
            }));

            for (const article of articles) {
                await prisma.article.upsert({
                    where: { url: article.url },
                    update: article,
                    create: article,
                });
            }
            console.log(`Seeded ${articles.length} articles for category: ${category}`);
        }
        console.log("Seeding completed successfully.");
    } catch (error) {
        console.error("Error seeding data:", error);
    } finally {
        await prisma.$disconnect();
    }
}

seed();


