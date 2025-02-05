import express from 'express';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

const app = express();
const port = process.env.PORT || 3000;

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

app.use(express.json());

// Redirect shortened URLs to their original URLs
app.get('/:shortId', async (req, res) => {
  const { shortId } = req.params;

  try {
    const { data, error } = await supabase
      .from('urls')
      .select('long_url')
      .eq('short_id', shortId)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'URL not found' });
    }

    // Increment visit count
    await supabase
      .from('urls')
      .update({ visits: data.visits + 1 })
      .eq('short_id', shortId);

    res.redirect(data.long_url);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});