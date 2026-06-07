const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = 'https://ispysitqmncmyxxguqdj.supabase.co';
const supabaseKey = 'sb_publishable_cfioSf_V07QAOKLTlNeqlg_sv5ex8m4';
const supabase = createClient(supabaseUrl, supabaseKey);

async function pushData() {
  // Push blogs
  let blogsRaw = fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'blogs.json'), 'utf8');
  if (blogsRaw.charCodeAt(0) === 0xFEFF) blogsRaw = blogsRaw.slice(1);
  const blogs = JSON.parse(blogsRaw);
  console.log(`Pushing ${blogs.length} blog posts...`);

  // Convert tags arrays to JSON strings for Supabase
  const blogsClean = blogs.map(b => ({
    ...b,
    tags: Array.isArray(b.tags) ? b.tags : [b.tags],
    related_ids: Array.isArray(b.related_ids) ? b.related_ids : [],
    previous_coverage: b.previous_coverage || null
  }));

  const { error: blogsError } = await supabase.from('blogs').upsert(blogsClean, { onConflict: 'id' });
  if (blogsError) {
    console.error('Blogs error:', blogsError);
  } else {
    console.log(`✓ Pushed ${blogs.length} blog posts`);
  }

  // Push news
  let newsRaw = fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'news.json'), 'utf8');
  if (newsRaw.charCodeAt(0) === 0xFEFF) newsRaw = newsRaw.slice(1);
  const news = JSON.parse(newsRaw);
  console.log(`Pushing ${news.length} news items...`);

  const newsClean = news.map(n => ({
    ...n,
    tags: Array.isArray(n.tags) ? n.tags : [n.tags],
    related_ids: Array.isArray(n.related_ids) ? n.related_ids : [],
    previous_coverage: n.previous_coverage || null
  }));

  const { error: newsError } = await supabase.from('news').upsert(newsClean, { onConflict: 'id' });
  if (newsError) {
    console.error('News error:', newsError);
  } else {
    console.log(`✓ Pushed ${news.length} news items`);
  }

  // Verify
  const { count: blogCount } = await supabase.from('blogs').select('*', { count: 'exact', head: true });
  const { count: newsCount } = await supabase.from('news').select('*', { count: 'exact', head: true });
  console.log(`\nVerification: ${blogCount} blogs, ${newsCount} news in Supabase`);
}

pushData().catch(console.error);
