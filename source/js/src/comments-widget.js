/**
 * Custom comment widget for Hexo + NexT blog
 * Backend API server at COMMENTS_API_URL
 */
(function () {
  'use strict';

  // --- Configuration ---
  // Change this to your deployed comment server URL
  var COMMENTS_API_URL = 'http://localhost:3000';
  // Notify the user if config still has placeholder
  if (COMMENTS_API_URL === 'http://localhost:3000') {
    console.info('[Comments] Using localhost — change COMMENTS_API_URL in js/src/comments-widget.js for production');
  }

  // --- State ---
  var postPath = window.location.pathname.replace(/\/$/, '') || '/';
  var container = null;
  var commentsCache = null;

  // --- Utilities ---
  function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  function formatDate(dateStr) {
    try {
      return dateStr.split(' ')[0]; // "2026-05-16 07:12:24" -> "2026-05-16"
    } catch (e) {
      return dateStr;
    }
  }

  function fetchUrl(path) {
    return COMMENTS_API_URL + '/api/comments?post=' + encodeURIComponent(postPath);
  }

  function submitUrl() {
    return COMMENTS_API_URL + '/api/comments';
  }

  function showError(msg) {
    var el = container && container.querySelector('.comments-error');
    if (el) {
      el.textContent = '❌ ' + msg;
      el.style.display = 'block';
    }
  }

  function clearError() {
    var el = container && container.querySelector('.comments-error');
    if (el) el.style.display = 'none';
  }

  // --- API ---
  function fetchComments(callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', fetchUrl(), true);
    xhr.onload = function () {
      if (xhr.status === 200) {
        try {
          var data = JSON.parse(xhr.responseText);
          commentsCache = data.comments || [];
          callback(null, commentsCache);
        } catch (e) {
          callback(new Error('Parse error'));
        }
      } else {
        callback(new Error('HTTP ' + xhr.status));
      }
    };
    xhr.onerror = function () { callback(new Error('Network error')); };
    xhr.send();
  }

  function submitComment(formData, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', submitUrl(), true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function () {
      if (xhr.status === 201) {
        try {
          var data = JSON.parse(xhr.responseText);
          callback(null, data.comment);
        } catch (e) {
          callback(new Error('Parse error'));
        }
      } else {
        try {
          var err = JSON.parse(xhr.responseText);
          callback(new Error(err.error || 'Submit failed'));
        } catch (e) {
          callback(new Error('HTTP ' + xhr.status));
        }
      }
    };
    xhr.onerror = function () { callback(new Error('Network error')); };
    xhr.send(JSON.stringify({
      post: postPath,
      author: formData.author,
      email: formData.email || '',
      content: formData.content,
      parent_id: formData.parent_id || null
    }));
  }

  // --- Render ---
  function renderComment(comment, depth) {
    depth = depth || 0;
    var margin = Math.min(depth * 24, 72);
    return (
      '<div class="comment-item" style="margin-left:' + margin + 'px">' +
        '<div class="comment-avatar">' +
          '<span class="comment-author-icon">' + escapeHtml(comment.author.charAt(0).toUpperCase()) + '</span>' +
        '</div>' +
        '<div class="comment-body">' +
          '<div class="comment-meta">' +
            '<span class="comment-author">' + escapeHtml(comment.author) + '</span>' +
            '<span class="comment-date">' + formatDate(comment.created_at) + '</span>' +
          '</div>' +
          '<div class="comment-content">' + escapeHtml(comment.content).replace(/\n/g, '<br>') + '</div>' +
          '<div class="comment-actions">' +
            '<a href="#" class="comment-reply-btn" data-id="' + comment.id + '">回复</a>' +
          '</div>' +
        '</div>' +
      '</div>'
    );
  }

  function renderComments(comments) {
    if (!comments || comments.length === 0) {
      return '<p class="comments-empty">暂无评论，欢迎发表意见</p>';
    }
    var html = '';
    for (var i = 0; i < comments.length; i++) {
      html += renderComment(comments[i], 0);
      if (comments[i].replies && comments[i].replies.length > 0) {
        for (var j = 0; j < comments[i].replies.length; j++) {
          html += renderComment(comments[i].replies[j], 1);
        }
      }
    }
    return html;
  }

  function renderForm(parentId) {
    parentId = parentId || null;
    var replyNotice = parentId ? '<p class="comment-reply-notice">回复中，点击 <a href="#" class="cancel-reply">取消回复</a></p>' : '';
    return (
      '<div class="comment-form-wrapper">' +
        replyNotice +
        '<h3 class="comment-form-title">' + (parentId ? '写回复' : '发表评论') + '</h3>' +
        '<form class="comment-form" data-parent="' + parentId + '">' +
          '<div class="comment-form-row">' +
            '<input type="text" class="comment-input" name="author" placeholder="昵称 *" required maxlength="30">' +
            '<input type="email" class="comment-input" name="email" placeholder="邮箱（可选）" maxlength="100">' +
          '</div>' +
          '<textarea class="comment-textarea" name="content" placeholder="写下你的评论..." required maxlength="2000" rows="4"></textarea>' +
          '<div class="comment-form-actions">' +
            '<span class="comment-hint">支持 Markdown 格式</span>' +
            '<button type="submit" class="comment-submit">发布评论</button>' +
          '</div>' +
          '<p class="comments-error" style="display:none"></p>' +
        '</form>' +
      '</div>'
    );
  }

  // --- Init ---
  function initWidget() {
    if (!postPath || postPath === '/') return; // Don't show on homepage

    var postContainer = document.querySelector('.post-block');
    if (!postContainer) return;

    // Check front-matter comments flag
    // Hexo/NexT renders page.comments as data-attribute on body
    var bodyEl = document.body;
    if (bodyEl.getAttribute('data-comments') === 'false') return;

    // Create container
    container = document.createElement('div');
    container.className = 'comments-widget';
    container.id = 'comments';

    // Insert after post-block
    postContainer.parentNode.insertBefore(container, postContainer.nextSibling);

    // Render initial state
    container.innerHTML =
      '<h2 class="comments-title">评论</h2>' +
      '<div class="comments-loading">加载中...</div>' +
      '<div class="comments-list"></div>' +
      '<div class="comments-form-placeholder"></div>';

    // Load comments
    fetchComments(function (err, comments) {
      var listEl = container.querySelector('.comments-list');
      var loadingEl = container.querySelector('.comments-loading');
      if (loadingEl) loadingEl.style.display = 'none';

      if (err) {
        listEl.innerHTML = '<p class="comments-empty">评论加载失败，请刷新重试</p>';
        return;
      }

      listEl.innerHTML = renderComments(comments);
    });

    // Render form
    var formPlaceholder = container.querySelector('.comments-form-placeholder');
    if (formPlaceholder) {
      formPlaceholder.innerHTML = renderForm(null);

      // Form submit handler
      var form = formPlaceholder.querySelector('.comment-form');
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        handleSubmit(form);
      });
    }

    // Delegate reply click
    container.addEventListener('click', function (e) {
      var replyBtn = e.target.closest('.comment-reply-btn');
      if (replyBtn) {
        e.preventDefault();
        var parentId = replyBtn.getAttribute('data-id');
        showReplyForm(parentId);
      }
      var cancelBtn = e.target.closest('.cancel-reply');
      if (cancelBtn) {
        e.preventDefault();
        cancelReply();
      }
    });
  }

  function showReplyForm(parentId) {
    var existing = container.querySelector('.comment-form-wrapper');
    if (existing) {
      var oldParent = existing.querySelector('.comment-form');
      if (oldParent && oldParent.getAttribute('data-parent') === parentId) {
        cancelReply();
        return;
      }
      existing.remove();
    }
    var listEl = container.querySelector('.comments-list');
    var formHTML = renderForm(parentId);
    var wrapper = document.createElement('div');
    wrapper.innerHTML = formHTML;
    var formWrapper = wrapper.firstElementChild;

    listEl.parentNode.insertBefore(formWrapper, listEl.nextSibling);

    var form = formWrapper.querySelector('.comment-form');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      handleSubmit(form);
    });
  }

  function cancelReply() {
    var wrapper = container.querySelector('.comment-form-wrapper');
    if (wrapper) wrapper.remove();
    var placeholder = container.querySelector('.comments-form-placeholder');
    if (placeholder && !placeholder.innerHTML) {
      placeholder.innerHTML = renderForm(null);
      var form = placeholder.querySelector('.comment-form');
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        handleSubmit(form);
      });
    }
  }

  function handleSubmit(form) {
    var author = form.querySelector('[name="author"]').value.trim();
    var email = form.querySelector('[name="email"]').value.trim();
    var content = form.querySelector('[name="content"]').value.trim();
    var parentId = form.getAttribute('data-parent');
    if (parentId === 'null' || parentId === '') parentId = null;

    if (!author) {
      showError('请填写昵称');
      return;
    }
    if (!content) {
      showError('请填写评论内容');
      return;
    }

    var submitBtn = form.querySelector('.comment-submit');
    submitBtn.disabled = true;
    submitBtn.textContent = '发布中...';
    clearError();

    submitComment({ author: author, email: email, content: content, parent_id: parentId }, function (err, comment) {
      submitBtn.disabled = false;
      submitBtn.textContent = '发布评论';

      if (err) {
        showError(err.message);
        return;
      }

      // Clear form
      form.querySelector('[name="content"]').value = '';
      if (!parentId) {
        form.querySelector('[name="author"]').value = '';
        form.querySelector('[name="email"]').value = '';
      }

      // Reload comments
      var listEl = container.querySelector('.comments-list');
      fetchComments(function (err, comments) {
        if (!err && listEl) {
          listEl.innerHTML = renderComments(comments);
        }
      });

      // Reset reply form if needed
      cancelReply();
    });
  }

  // Wait for DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWidget);
  } else {
    initWidget();
  }
})();
