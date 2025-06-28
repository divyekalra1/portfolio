---
title: "HTB-CPTS"
layout: blog-posts
date: 2025-06-22
---

<html>
<body>
  <main>
    <div class="publications-container">
      {% if site.htb-cpts and site.htb-cpts.size > 0 %}
        <ul>
          {% assign sorted_posts = site.htb-cpts | sort: "date" | reverse %}
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
