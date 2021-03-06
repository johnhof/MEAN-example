MEAN Example
============

[Written from scratch for this MEAN guide](https://johnhofrichter.wordpress.com/2015/03/15/building-a-mean-stack-from-the-ground-up/)


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
