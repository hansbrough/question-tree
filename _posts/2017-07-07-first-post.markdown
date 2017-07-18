---
layout: post
title:  "Project Overview"
date:   2017-07-15 13:37:48 -0700
categories: jekyll update
---
<p>While I was working at CricketHealth the need arose for a survey mechanism that could be embedded into our nascent web app, re-purposed, customized. What I found really interesting was a feature that called for users to be conditionally routed though the survey based on their answers. This seemed pretty useful - get users to question content best suited for them based on previous answers. On top that it also seemed a fun challenge to create a json schema that allowed survey authors to express this conditionality + then consume the resulting json and turn it into a (hopefully... eventually) bug free interface.</p>

<p>
Now I'd like to accommodate quizzes as well. However survey's and quizzes are different beasts if only because a survey has no 'correct' answers; they are just a measurement of opinion. A quiz on the other hand does have a correct answer for each question set and so a judgement must be made - 'Did the user answer correctly or not?'
</p>

<ul>
{% for question in site.data.questions %}
  <li>
      {{ question.title }}
  </li>
{% endfor %}
</ul>
