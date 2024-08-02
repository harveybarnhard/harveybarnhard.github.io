---
layout: single
title: "Publications and Working Papers"
permalink: /publications/
author_profile: false
classes: wide
---

{% assign researchpapers = site.publications | where: 'include', 'yes' %}
{% for post in researchpapers reversed %}
  {% include archive-single.html %}
{% endfor %}
