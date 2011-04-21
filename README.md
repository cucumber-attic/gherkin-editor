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

# Install and run

    npm link
    git submodule update --init --recursive
    node server.js

Now go to http://localhost:8000

# Hacking on Ace

    cd vendor/ace
    git submodule update --init --recursive
    ./Makefile.dryice.js

Make a feature branch for everything you do