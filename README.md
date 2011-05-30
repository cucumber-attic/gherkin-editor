# Gherkin Editor

This is a web based editor for [Gherkin](https://github.com/aslakhellesoy/gherkin) - the language Cucumber features are written in. It's based on [Ace](http://ace.ajax.org/) in the browser and [Node.js](http://nodejs.org/) on the server. It currently supports:

* [Code completion](https://github.com/aslakhellesoy/gherkin/wiki/Code-Completion)
* Syntax highlighting (partly implemented in a [fork of ace](https://github.com/cucumber/ace))
* Syntax checking based on Gherkin.js. More info about that in [this thread](http://groups.google.com/group/cukes/browse_thread/thread/5a883a548c424398/95abc53b00683480)

Planned features
* Simple refactorings, like renaming a step and having all other related steps in the project be renamed too. Related steps would be found using stepdef regexps.

Features that would be nice, but shouldn't go into this project
* Integration with external file systems, using [WebDav](https://github.com/mikedeboer/jsdav) or REST towards a dedicated git-enabled server.

# What it looks like so far

![Syntax error](https://github.com/cucumber/gherkin-editor/raw/master/public/images/screenshots/autocomplete.png "The editor is suggesting steps")

![Syntax error](https://github.com/cucumber/gherkin-editor/raw/master/public/images/screenshots/syntax_error.png "The editor has detected a syntax error")

# Ace branches

Achieving the goals listed above will require several changes to Ace. So far there are a few branches with different features on cucumber's ace fork. There may be more. And some may go away if the Ace project accepts them. Rejected Ace pull requests will likely move into this project so we don't have to depend on a forked ace long term.

## gherkin-mode

This is the syntax highlighting support for gherkin. Currently there is no i18n. We should generate the highlighter from a template using the technique described [here](https://github.com/aslakhellesoy/gherkin/wiki/Tool-Support). The Ace gherkin-mode is likely to move into this project instead of living in Ace.

## ace-connect

This is a small patch to make it easier to serve ace from node, as explained in [this pull request](https://github.com/ajaxorg/ace/pull/217)

## gherkin-editor

This branch contains the changes on the other branches so that all our fixes can be used in this project

# Install and run

    npm link
    git submodule update --init --recursive
    make
    node server.js

Now go to http://localhost:8000

# Tests
(These are currently broken after a major rewrite of the autocomplete widget)

    node_modules/.bin/jasmine-node spec

# Want to help?

Join the [Cucumber Mailing list](http://groups.google.com/group/cukes) and discuss!

# Hacking on Ace

Only edit files under `lib` - not under `build` - they are generated. To regenerate after hacking: 

    cd vendor/ace
    git submodule update --init --recursive
    ./Makefile.dryice.js normal

Make a feature branch for everything you do

# TODO

* Gherkin-editor users won't understand regexp anchors. Display a '*', '?' or '-' instead.
* Move autocomplete widget to ace-autocomplete project once it matures? May improve quality long term (more contributors).
* Fix 404 for jquery-ui png images. Ideally generate jquery-ui css files from current theme.
* Figure out how require-js works so we don't need to require so many files in our HTML.