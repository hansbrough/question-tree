---
layout: post
title:  "My First Post"
date:   2017-07-07 13:37:48 -0700
categories: jekyll update
---
You’ll find this post in your `_posts` directory. What should I talk about? A list of CKD intake questions perhaps:

<ul>
{% for question in site.data.questions %}
  <li>
      {{ question.title }}
  </li>
{% endfor %}
</ul>
