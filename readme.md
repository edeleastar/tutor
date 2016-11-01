tutors
=====

## Introduction

A static web site generator for producing course web sites from largely markdown content. For example this site here is generated using this tool:

 - <http://edeleastar.github.io/tutor-example-site>

The above course web is produced automatically from this `source` repository:

 - <https://github.com/edeleastar/tutor-example-course>

The structure of the site follows a set of filename and folder nested conventions to layout topics, labs and talks:

~~~
├── course.md
├── credits
├── mbignore
├── topic01
│   ├── topic.md
│   ├── topic.png
│   ├── book-01
│   │   ├── 00.Lab-01.md
│   │   ├── 01.01.md
│   │   ├── 02.02.md
│   │   ├── 03.03.md
│   │   ├── 04.04.md
│   │   ├── 05.Exercises.md
│   │   ├── archives
│   │   │   └── archive.zip
│   │   └── img
│   │       ├── 01.png
│   │       ├── 02.png
│   │       └── 03.png
│   └── talk-01
│       ├── talkname.pdf
│       ├── talkname.md
│       └── talkname.png
├── topic02
│   ├── topic.md
│   ...
~~~

Labs are step by step instructions focused on a specific task. Talks are simple pdf presentations. Topics are collections of talks and labs.

## Installation

First install the latest node.js:

- <https://nodejs.org>

Then, clone this repo:

~~~
git clone https://github.com/edeleastar/tutor.git
~~~

Finally, from inside the folder you just cloned, enter the following command:

~~~

npm install
npm install -g --no-optional
~~~

## Commands

The above will install `tutor` as a command. To test it out, clone a sample course web:

~~~
git clone https://github.com/edeleastar/tutor-example-course.git
~~~

Change into the folder containing the cloned repo and run `tutor`:

~~~
cd tutor-example-course
tutor
~~~

If all goes smoothly, you should see on the console a list of the topics as they are generated for the sample course:

~~~
Introducing HTML
 Talks:
  -->The Nature of the Web
  -->HTML Basics
 Labs:
  -->Lab-00
  -->Lab-01
Introducing CSS
 Talks:
  -->HTML Elements
  -->CSS Fundamentals
  -->CSS Selectors
 Labs:
  -->Lab-02
Box Model
 Talks:
  -->The Evolution of the Web
  -->Box Fundamentals
  -->Multicolumn Layout
  -->Project 1 Specification
 Labs:
  -->Lab-03a
  -->Lab-03b
    ...
    ....
  ~~~

The site will be generated into a folder called `public-site` in the same folder. If you open `index.html` in there you should see this site, generated locally:

 - <http://edeleastar.github.io/tutor-example-site>

The `tutor` command is context sensetive, so will build the complete course if run from the top level, a single topic (with all its talks and labs) if run from within a topic folder, and it will build a single book/lab if run from in a book folder.

##Course Web Source File Structure

In the root folder of a course web, there are a few general files:

~~~
├── course.md: high level summary of course
├── credits: list of contributors
├── mbignore: list topics to include from the course web
~~~

The remainder is the `topics` folders:

~~~
├── topic-01
├── topic-02
├── topic-03
│   etc ...
~~~

Each topic consists of:

~~~
├── topic-01
│   ├── topic.md: topic title + summary
│   ├── topic.png: Image file for topic
~~~

+ a list of `talks` and `labs`:

~~~
    ├── talk-01: the first slide deck
    ├── talk-02: the second slide deck
    ├── book-01: the first lab
    └── book-02: the second lab
~~~

Each talks consists of:

~~~
    └── talk-XX
        ├── talkname.pdf: the slide deck
        ├── talkname.md: a summary of the talk
        └── talkname.png: an image to represent the talk on the course web
~~~

Each lab contains a series of steps each encoded in markdown. They are numbered as  `XX.Title.md`, where number is typically two digits starting with `00`:

~~~
    └── book-01
        ├── 00.Lab-01.md
        ├── 01.01.md
        ├── 02.02.md
        ├── 03.03.md
        ├── 04.04.md
        ├── 05.Exercises.md
        ├── archives
        │   └── archive.zip
        └── img
            ├── 01.png
            ├── 02.png
            └── 03.png
~~~

Each step can use the full range of conventional markdown - including support for github flavoured markdown, fenced code blocks etc. For more details see:

- <https://help.github.com/articles/basic-writing-and-formatting-syntax/>
- <https://help.github.com/articles/organizing-information-with-tables/>

Also included is syntax highlighting via bundled [highlight.js](https://highlightjs.org/). 

In labs only, subfolders can be included, and they will be published with their contents in full. This can be useful store images in an `img` folder, archives for download in an `archives` folder etc... 

An example of syntax highlighting:

- <http://edeleastar.github.io/tutor-example-site/topic08/book/index.html#/05>

Images:

- <http://edeleastar.github.io/tutor-example-site/topic03/book-a/index.html#/06>

Archives:

- <http://edeleastar.github.io/tutor-example-site/topic03/book-a/index.html#/Exercises>

## Embedding Topics in Moodle (or elsewhere)

In addition to a `index.html` file generated for each topic, two companion files are also generated:

- indexmoodle.html
- ajaxlabel.html

These work in tandem to facilitate content embedding. `indexmoodle.html` is a paired down version of the topic, with protocol neutral headers and absolute urls to contained talks + labs. `ajaxlabel.html` is a page fragment which fetches indexmoodle via an ajax call, and renders it in a bootstrap container (for moodle). Typically, this is pasted into a `topic` resource in moodle, and will serve the topic seamlessly in place.

The above mechanism requires you to provide the url of the hosted course web - as the url is stitched into both files by tutor. You provide this in a file called 'courseurl' in the root folder of the course. See the example above for this procedure in action.



