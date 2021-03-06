---
layout: post
title:  "Project Overview"
date:   2017-07-19 13:37:48 -0700
categories: building
---
<p>While I was working at CricketHealth the need arose for a survey mechanism that could be embedded into our nascent web app, re-purposed and customized. What I found really interesting about the project requirements was a feature that called for users to be conditionally routed though the survey based on their answers. This seemed pretty useful - get users to 'question content' best suited for them based on previous answers. On top of that it also seemed a fun challenge to create a json schema that allowed survey authors to express this conditionality + then consume the resulting json and turn it into a (hopefully... eventually) bug free interface.</p>

<p>
Fast forward to today and I'd like to accommodate quizzes as well. However survey's and quizzes are different beasts if only because a survey has no 'correct' answers; they are just a measurement of opinion. A quiz on the other hand does have a correct answer for each question set and so a judgement must be made - 'Did the user answer correctly or not?' This will mean some json schema and logic changes to support the differences between these two types. However as it's shaping up that is not the real challenge of this project.
</p>

<p>
The bigger challenge is supporting the freedom to define any path through a question graph. What at first seemed like simple bugs were actually unsupported use cases or more precisely use cases not even considered and accidentally triggered. The more complex the paths through a question graph the harder it becomes to determine the total number of questions and as a result a user's position within a graph. Further - if we don't know the user's current position it's tough to know when they've finished a quiz / completed the graph. To put it more colorfully it's like reading a 'choose your own path' style book that's been poorly written and as a result is not possible to complete.
</p>

<p>
Take a look at a [working version of a quiz](https://hansbrough.github.io/question-tree/survey) utilizing the project code (and test your plant knowledge!) This is just one example of how to use the DecisionTree logic - the UI / View logic is totally up to you.
</p>
