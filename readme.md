tutor
=====

A static web site generator for producing course web sites from largely markedown content. For example this site here is generated using this tool:

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

First install node.js:

- <https://nodejs.org>

Select the `LTS` version.

Then, clone this repo:

~~~
git clone https://github.com/edeleastar/tutor.git
~~~

Finally, from inside the folder you just cloned, enter the following command:

~~~
npm install -g
~~~

Thats it. To test it out, clone a sample course web:

~~~
git clone https://github.com/edeleastar/tutor-example-course.git
~~~

Change into the folder containing the cloned repo and run `tutor`:

~~~
cd tutor-example-course
tutor
~~~

If all goes smoothly, you should see on the console a list of the topics as they are generated:

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

##Course Web Source File Structure

In the root folder of a course web, there are a few general files:

- course.md: high level summary of course
- credits: list of contributors
- mbignore: list of topics which are to be excluded from the course when published publish (optional)

The remainder is a list of `topics` folders:

- topic-01
- topic-02
- topic-03
- etc ...

Each topic consists of:

- topic.md: Topic title + summary
- topic.png: Image file for topic

+ a list of `talks` and `labs`:

- talk-01: the first slide deck
- talk-01: the second slide deck
- book-01: the first lab
- book-01: the second lab
- etc...

Each talks consists of:

- talk-0x.pdf: the slide deck
- talk-0x.md: a summary of the talk
- talk-0x.png: an image represent the talk on the web

Each lab contains a series of steps each encoded in markdown. They are numbered as  `XX.Title.md`, where number is typically two digits starting with `00`. Eg:

- 00.Lab-01.md
- 01.01.md
- 02.02.md
- 03.03.md
- 04.04.md
- 05.05.md
- 06.Exercises.md
- img
    - main.png: image used for the lab
    - 01.png
    - 02.png
- archives
    -archive.zip

Each step can use the full range of conventional markdown - including support for github flavoured markdown, including fenced code blocks. Also included is syntax highlighting via bundled highlight.js. Additionally, subfolders can be linked to from the lab steps, and they will be published with their contents. It can be useful store images in an `img` folder, archives for download in an `archives` folder.

