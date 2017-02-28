[![Build Status](https://travis-ci.org/jameslong/memo.svg?branch=master)](https://travis-ci.org/jameslong/memo)

# Memo

Memo is a collection of tools and source code to create email-based interactive fiction. This repo contains a content editor, browser/desktop clients for offline play, and a server for online play via email. Memo was used to create [Top Secret](https://playtopsecret.com), a video game about the Snowden leaks played by email.

![Memo editor](/img/editorscreenshot.png?raw=true)
*Create branching/concurrent narratives in the visual editor.*

![Memo offline Version](/img/gamescreenshot.png?raw=true)
*Play by email or offline using the desktop app.*

## Dependencies

- [Node.js](https://nodejs.org/en/) v4.3.1 or above
- [Grunt CLI](http://gruntjs.com/) v0.1.13 or above

## Installing

```
npm install
```

## Building

```
grunt
```

## Usage

#### Server

1. Run the following in the *server* directory: `node build/server/src/main.js`

#### Editor

1. Run the server (see above)
2. Open *editor/build/index.html*

#### Browser

1. Run the server (see above)
2. Open *browser/build/index.html*

#### Desktop app (Linux/Mac/Win)

See `app/packaged_apps` for for the platform specific packages.
