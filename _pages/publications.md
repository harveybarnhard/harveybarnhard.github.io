---
layout: single
title: "Publications"
permalink: /publications/
author_profile: false
classes: wide
---

{% for post in site.publications reversed %}
  {% include archive-single.html %}
{% endfor %}
