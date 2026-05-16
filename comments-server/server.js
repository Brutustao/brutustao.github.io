const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { getComments, addComment } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// Trust proxy for rate limiting behind reverse proxies
app.set('trust proxy', 1);

app.use(cors({
  origin: true,
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(express.json({ limit: '10kb' }));

// Rate limiting
const commentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: { error: '评论频率过高，请稍后再试' }
});

// Validation middleware
function validateComment(req, res, next) {
  const { post, author, content } = req.body;
  if (!post || typeof post !== 'string' || post.length > 500) {
    return res.status(400).json({ error: '无效的文章路径' });
  }
  if (!author || typeof author !== 'string' || author.trim().length < 1 || author.length > 30) {
    return res.status(400).json({ error: '请填写昵称（1-30个字符）' });
  }
  if (!content || typeof content !== 'string' || content.trim().length < 1 || content.length > 2000) {
    return res.status(400).json({ error: '请填写评论内容（1-2000个字符）' });
  }
  if (req.body.email && (typeof req.body.email !== 'string' || req.body.email.length > 100)) {
    return res.status(400).json({ error: '邮箱地址过长' });
  }
  // Basic spam prevention: reject if content contains links (common spam pattern)
  if (/https?:\/\/\S+/i.test(content) && !/https?:\/\/brutustao\.github\.io/i.test(content)) {
    return res.status(400).json({ error: '评论中不允许包含外部链接' });
  }
  next();
}

// GET /api/comments?post=/path/to/post
app.get('/api/comments', (req, res) => {
  const postPath = req.query.post;
  if (!postPath) {
    return res.status(400).json({ error: 'Missing post parameter' });
  }
  const comments = getComments(postPath);
  res.json({ comments });
});

// POST /api/comments
app.post('/api/comments', commentLimiter, validateComment, (req, res) => {
  const { post, author, email, content, parent_id } = req.body;
  const comment = addComment({
    postPath: post,
    author: author.trim(),
    email: (email || '').trim(),
    content: content.trim(),
    parentId: parent_id || null
  });
  res.status(201).json({ comment });
});

// Health check
app.get('/api/health', (_, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Comment server running at http://localhost:${PORT}`);
});
