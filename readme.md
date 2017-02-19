tutors
=====

## Introduction

A static web site generator for producing course web sites from largely markdown content. For example this site here is generated using this tool.

 - <http://edeleastar.github.io/tutor-example-site>

Here is a portfolio of courses:

- <https://wit-tutors.github.io/modules>

Here is a course on using tutors:

- <https://wit-tutors.github.io/tutors-course>

This course was developed using tutors - the course 'source' is here:

- <https://github.com/wit-tutors/tutors-course-src>

## Quick Start

Make sure you have node.js installed. 

- <https://nodejs.org/en/>

Normally the LTS version would be the most suitable. You should also have git installed:

- <https://git-scm.com/>

On windows, it is often easier to make sure git is integrated into the standard command prompt (an option when installing git on windows).

Once these are installed, enter this command:

~~~
npm install tutors -g
~~~

This will install the tutors command globally on your workstation. Now, to create a starter template course, enter this command:

~~~
tutors new
~~~

This will create a new course, populated with some template talks, resources and labs. To build the course, enter the following:

~~~
cd tutors-starter-0

tutors
~~~

A folder called './public-site' will be generated containing a html site of the course.

## More Detail...

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

## Commands

To explore some of the options, clone this course first:

~~~
git clone https://github.com/wit-tutors/tutors-course-src.git
~~~

Change into the folder containing the cloned repo and run `tutor`:

~~~
cd tutors-course-src
tutors
~~~

If all goes smoothly, you should see on the console a list of the topics as they are generated for the sample course:

~~~
tutors course web generator: 1.4.1
 Setup
 Talks:
  -->Introducing Tutors
  -->Tutors Course Structure
 Labs:
  -->Lab-01-Setup
 Composition
 Talks:
  -->Composing Labs
 Labs:
  -->Lab-02-Composition
 Publishing
 Talks:
  -->Publishing to Github & Moodle
 Labs:
  -->Lab-03-Publish
  -->Lab-04-Moodle
 Portfolios
 Talks:
  -->Portfolios
 Labs:
  -->Lab-05-Portfolio
 Git
 Labs:
  -->Lab-06-Git Introduction
  -->Lab-07-Branching and Merging
~~~

The site will be generated into a folder called `public-site` in the same folder. If you open `index.html` in there you should see this site, generated locally:

- <https://wit-tutors.github.io/tutors-course>

The `tutors` command is context sensetive, so will build the complete course if run from the top level, a single topic (with all its talks and labs) if run from within a topic folder, and it will build a single book/lab if run from in a book folder.

##Course Web Source File Structure

In the root folder of a course web, there are a few general files:

~~~
├── course.md: high level summary of course
├── credits: list of contributors
├── mbignore: list topics to exclude from the course web
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

## Options

The mbignore file can contain a list of topics that you wish to **exclude** from the course web. For instance, you may be rolling over a course from a previous run. This enables you to leave the course source intact, and selectively generate topics week by week.

### Private

~~~
tutors -p
~~~

This will generate the course web to a `private-site` folder as well as `public-site`. The private version does not process the mbignore file, and will alsways generate the complete course. This can be useful if you are selectivtly publishing a course (to public-site), but want to keep a full version locally.

### Standalone

~~~
tutors -s
~~~

This will generate the course web to a `standalone-site` folder as well as `public-site`. This version includes the full CSS + font assets. These are loaded from CDNs by the public version. This can be useful if you want to distrubute a course to be browsed on a device completely offline.


