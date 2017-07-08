---
layout: post
title:  "Project Overview"
date:   2017-07-07 13:37:48 -0700
categories: jekyll update
---
<p>While I was working at CricketHealth the need arose for a survey mechanism that could be embedded into our nascent web app, re-purposed, customized. What I found really interesting was a feature that called for users to be conditionally routed though the survey based on their answers. This seemed pretty useful - get users to question content best suited for them based on demonstrated knowledge. On top that it also seemed a fun challenge to create a json schema that allowed survey authors to express this conditionality + then consume the resulting json and turn it into a (hopefully... eventually) bug free interface.</p>

<ul>
{% for question in site.data.questions %}
  <li>
      {{ question.title }}
  </li>
{% endfor %}
</ul>
