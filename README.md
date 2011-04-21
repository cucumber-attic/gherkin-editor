# Gherkin Editor

This is a web based editor for Gherkin. It's based on [Ace]() and Node.js
Planned features include:

* [Code completion](https://github.com/aslakhellesoy/gherkin/wiki/Code-Completion)
* Syntax highlighting (partly implemented in a [fork of ace](https://github.com/cucumber/ace))
* Syntax checking based on Gherkin.js. More info about cucumber.js in [this thread](http://groups.google.com/group/cukes/browse_thread/thread/5a883a548c424398/95abc53b00683480)
* Integration with external storages, using [WebDav](https://github.com/mikedeboer/jsdav) or REST towards a dedicated server

The discussion about this editor started [here](http://groups.google.com/group/cukes/browse_thread/thread/90627ad8d4aafb93/d5b40a21cb5cc258)
The target audience is primarily non-programmers. The kind of people we want to write Cucumber features, but never had a tool to do it.

# What it looks like so far

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
    node server.js

Now go to http://localhost:8000

# Want to help?

Join the [Cucumber Mailing list](http://groups.google.com/group/cukes) and discuss!

# Hacking on Ace

    cd vendor/ace
    git submodule update --init --recursive
    ./Makefile.dryice.js

Make a feature branch for everything you do