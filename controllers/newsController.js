const supabase = require("../config/supabaseClient");


exports.getArticlesByCategory = async (req, res) => {
    const { category } = req.params;


    if (!category) {
        return res.status(400).json({ error: 'Category is required.' });
    }

    try {
        const {data: article, error} = await supabase
            .from('articles')
            .select('*')
            .ilike('category', `%${category}%`)
            .order('published_at', { ascending: false });
        
        if (error) {
            console.error('Error fetching news:', error);
            return res.status(500).json({ error: 'Failed to fetch news articles.' });
        }

        if(!article || article.length === 0) {
            return res.status(404).json({ message: `No articles found for category: ${category}` });
        }

        return res.status(200).json({ articles: article });

    } catch (error) {
        console.error('Error fetching news:', error);
        return res.status(500).json({ error: 'Failed to fetch news articles.' });
    }
}