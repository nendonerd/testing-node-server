const http = require("http");
const url = require("url");
const { StringDecoder } = require("string_decoder");
const config = require('./config')(process.env.NODE_ENV)
// read the request data stream

const routers = {
  GET: {
    notFound: (req, res) => {
      res.end("not found " + JSON.stringify(req.query));
    }
  },
  POST: {
    notFound: (req, res) => {
      res.end("not found " + JSON.stringify(req.query));
    }
  }
};

const server = http.createServer((req, res) => {
  const { pathname, query } = url.parse(req.url, true);
  // if true, the query prop will be parsed to an obj instead of str
  const { method, headers } = req;

  const trimmedPath = "/" + pathname.replace(/^\/+|\/+$/g, "");

  // for getting data from post request
  const decoder = new StringDecoder("utf-8");
  let buffer = ""; // for adding stream data together

  req.on("data", data => (buffer += decoder.write(data)));
  req.on("end", () => {
    buffer += decoder.end();
    // console.log("payload: ", buffer);
  });

  // ROUTING

  const data = { method, trimmedPath, query, headers };

  // console.log(trimmedPath);
  // console.log(Object.keys(routers[method]));

  function match(path, routers) {
    for (route of Object.keys(routers[method])) {
      if (path.includes(route)) {
        return route;
      }
    }
    return undefined
  }

  let matchedPath = match(trimmedPath, routers);
  // console.log(matchedPath);
  // if (routers[method][trimmedPath]) {        // have the exact path
  if (matchedPath !== undefined) {
    routers[method][matchedPath](data, res);
  } else {
    routers[method].notFound(data, res);
  }

  // log([
  //   '', 'LOGGING RESULTS: ', '',
  //   'trimmedPath: ', trimmedPath, '',
  //   'query: ', query, '',
  //   'method: ', method, '',
  //   'headers: ', headers, ''
  // ]);

  // res.end("Fuckinng end!\n");
});

server.listen(config.http.port, () => {
  console.log("server running on port " + config.http.port);
});

// function log(args) {
//   args.forEach(arg => console.log(arg));
// }

const app = {
  get: (path, handler) => {
    routers.GET[path] = handler;
  },
  post: (path, handler) => {
    routers.POST[path] = handler;
  }
};

module.exports = () => app;

// USAGE:
// const app = require(...)()
// app.get("fetch", (req, res) => {
//   console.log(req.query);
//   const json = JSON.stringify(req.query);

//   res.setHeader("Content-Type", "application/json");
//   res.writeHeader(200);
//   res.end(json);
// });
