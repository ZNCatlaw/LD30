Getting Started
---------------

This project has .ruby-version and .ruby-gemset files in the project root.
If you use RVM you can just `cd LD30` and `bundle` to get started.

This project uses Puma at 2.9.1, some OSX users may experience difficulty
with `gem install`. The issue is with missing library (openssl). This can
be resolved as follows:

```
brew install openssl
gem install puma -v '2.9.1' -- --with-opt-include="/usr/local/opt/openssl/include"
```

The project is built with some old version of middleman, probably.
To start the server, run `middleman`. To build the website so as to
publish it somewhere, use `middleman build`.
