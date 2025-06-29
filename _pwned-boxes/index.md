---
title: pwned boxes
layout: collection
collection: pwned-boxes
permalink: /blogs/htb-cpts/pwned-boxes
entries_layout: list
sidebar:
  nav: pwned-boxes
hidden: true

---
<html>
<body>
    <main>
        <div class="publications-container">

            {% assign htb_posts = site.pwned-boxes %}
            {% if htb_posts %}
            <ol>
                {% for post in htb_posts %}
                <div class="publication">
                    <li>
                    <h2 class="publication-title">
                        <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
                    </h2>
                    </li>
                    {% if post.date %}
                    <p class="publication-date">{{ post.date | date: "%d %B, %Y" }}</p>
                    {% endif %}
                </div>
                <hr class="publication-separator">
                {% endfor %}
            </ol>
            {% else %}
            <p>No HTB-CPTS posts found.</p>
            {% endif %}

        </div>
    </main>


</body>


</html>