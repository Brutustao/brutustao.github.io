const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'comments.json');

function readDb() {
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return { comments: [], nextId: 1 };
  }
}

function writeDb(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

function getComments(postPath) {
  const db = readDb();
  const rows = db.comments
    .filter(c => c.post_path === postPath && c.approved)
    .sort((a, b) => a.created_at.localeCompare(b.created_at));

  // Build nested structure
  const map = {};
  const roots = [];
  for (const row of rows) {
    map[row.id] = { ...row, replies: [] };
  }
  for (const row of rows) {
    if (row.parent_id && map[row.parent_id]) {
      map[row.parent_id].replies.push(map[row.id]);
    } else {
      roots.push(map[row.id]);
    }
  }
  return roots;
}

function addComment({ postPath, author, email, content, parentId }) {
  const db = readDb();
  const comment = {
    id: db.nextId++,
    post_path: postPath,
    author,
    email: email || '',
    content,
    parent_id: parentId || null,
    approved: 1,
    created_at: new Date().toISOString().replace('T', ' ').split('.')[0]
  };
  db.comments.push(comment);
  writeDb(db);
  return {
    id: comment.id,
    author: comment.author,
    email: comment.email,
    content: comment.content,
    parent_id: comment.parent_id,
    created_at: comment.created_at,
    replies: []
  };
}

module.exports = { getComments, addComment };
