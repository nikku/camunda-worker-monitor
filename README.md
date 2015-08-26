# camunda-worker-monitor

This is an external task / worker monitor the [Camunda BPM](http://camunda.org) process engine.

![Monitor Screenshot](https://raw.githubusercontent.com/nikku/camunda-worker-monitor/master/docs/screenshot.png)


The monitor visualizes external the worker state on a BPMN diagram and provides a holistic view on whether or not applications running your processes are available or not.


## Develop

Install dependencies and build the client

```
npm install
ǹpm run build:watch
```

This will spawn the app at [http://localhost:8080](http://localhost:8080).


## Deploy

Build via

```
npm run build
```

Then serve the `public` folder via a web server.



## License

MIT