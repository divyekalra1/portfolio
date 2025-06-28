---
layout: blog-posts
title: "Exploring Topics"
date: 2025-06-22
entries_layout: list
collection: exploring‑topics
sidebar:
  nav: exploring_topics_nav
---

<html>
<body>
  <main>
    <div class="publications-container">
      {% if site.exploring-topics and site.exploring-topics.size > 0 %}
        <ul>
          {% assign sorted_posts = site.exploring-topics | sort: "date" | reverse %}
          {% for post in sorted_posts %}
            <li>
              <a href="{{ post.url }}">{{ post.title }}</a><br>
              <small>{{ post.date | date: "%B %d, %Y" }}</small>
            </li>
            <hr class="publication-separator">
          {% endfor %}
        </ul>
      {% else %}
        <p>No posts found.</p>
      {% endif %}
    </div>
  </main>
</body>
</html>