---
layout: post
title:  "Project Overview"
date:   2017-07-19 13:37:48 -0700
categories: jekyll update
---
<p>While I was working at CricketHealth the need arose for a survey mechanism that could be embedded into our nascent web app, re-purposed, customized. What I found really interesting was a feature that called for users to be conditionally routed though the survey based on their answers. This seemed pretty useful - get users to question content best suited for them based on previous answers. On top that it also seemed a fun challenge to create a json schema that allowed survey authors to express this conditionality + then consume the resulting json and turn it into a (hopefully... eventually) bug free interface.</p>

<p>
Now I'd like to accommodate quizzes as well. However survey's and quizzes are different beasts if only because a survey has no 'correct' answers; they are just a measurement of opinion. A quiz on the other hand does have a correct answer for each question set and so a judgement must be made - 'Did the user answer correctly or not?' This will mean some json schema and logic changes to support the differences between these two types. However as it's shaping up that is not the real challenge of this project.
</p>

<p>
The bigger challenge is supporting the freedom to define any path through a question graph. What at first seemed like simple bugs were actually unsupported use cases or more precisely use cases not even considered and accidentally triggered. The more complex the paths through a question graph the harder it becomes to determine the total number of questions and as a result a user's position within a graph. Further - if we don't know the user's current position it's tough to know when they've finished quiz / completed the graph. Imagine reading a 'choose your own path' style book that's been poorly written and as a result is not possible to complete. That's what it feels like a survey with the unsupported use cases mentioned above.
</p>
