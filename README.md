MEAN Example
============

[![Build Status](https://travis-ci.org/johnhof/MEAN-example.svg?branch=master)](https://travis-ci.org/johnhof/MEAN-example)

```bash
├── api
│   ├── components  //  endpoint and model scripts
│   │   └── example
│   │       ├── example
│   │       │   └── example_ctrl.js  // Controller
│   │       ├── example_ctrl.js   // Controller
│   │       └── example_model.js  // Model
│   ├── lib
│   │   └── error.js  //  express error handler
│   └── routes.js  //  API routing
├── app
│   ├── assets
│   │   ├── directives
│   │   │   └── example_directive
│   │   │       ├── example_directive.html  //  Template
│   │   │       ├── example_directive.js    //  Definition
│   │   │       └── example_directive.scss  //  Styling
│   │   ├── images
│   │   ├── services
│   │   └── styles
│   │       ├── main.scss       //  Universal Styling
│   │       └── variables.scss  //  Variables for consistency
│   ├── components
│   │   └── example
│   │       ├── example.html  //  View
│   │       ├── example.js    //  Controller
│   │       └── example.scss  //  Styling
│   └── core
│       ├── app.js      //  Angular app init
│       ├── index.html  //  Template which wraps views
│       └── router.js   //  Clientside angular routing
├── test          //  Mocha tests
├── bower.json    //  App dependencies
├── config.json   //  Server configuration
├── Gruntfile.js  //  Task runner
├── package.json  //  API dependencies
└── server.js     //  sets up API, delivers App
```
