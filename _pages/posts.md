---
title: "Blog Posts"
permalink: /posts/
layout: single
author_profile: true
---

{% for post in site.posts %}
  {% include archive-single.html %}
{% endfor %}