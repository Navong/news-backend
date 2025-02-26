const axios = require("axios");
require("dotenv").config();
const supabase = require("../config/supabaseClient");

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
    // You can also store the API key in your .env file for security
    const apiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY;
    const { data } = await axios.get(
        `https://newsapi.org/v2/top-headlines?category=${category}&apiKey=${apiKey}`
    );

    // console.log(data);

    if (data.status !== "ok") throw new Error("Failed to fetch news.");
    return data;
}

async function seed() {
    try {
        const categoryPromise = categories.map(async (category) => {
            console.log(`Fetching ${category} news...`);
            const newsData = await fetchNews(category);

            if (!newsData || newsData.length === 0) {
                console.log(`No news found for ${category}`);
                return;
            }

            const articles = newsData.articles.map((article) => ({
                title: article.title,
                description: article.description || null,
                url: article.url,
                url_to_image: article.urlToImage || null,
                published_at: new Date(article.publishedAt),
                category: category,
            }));

            const upsertPromises = articles.map(async (article) => {
                const { data, error } = await supabase
                    .from("articles")
                    .upsert(article, { onConflict: "url" });
                
                const results = await Promise.all(upsertPromises);
                
                results.forEach((result) => {
                    if (result.error) {
                        console.error("Error inserting/updating article:", result.error);
                    } else {
                        console.log("Article inserted/updated successfully:", result.data);
                    }
                });
            });
        })
    } catch (error) {
        console.error("Error seeding news:", error);
    }
}

seed();
