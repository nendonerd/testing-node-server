const createApp = require("./parseRequest.mjs");
// console.log(myapi)
const app = createApp();
const fs = require('fs')
const html = fs.readFileSync('./index.html', 'utf-8')

app.get("/", (req, res) => {
  // console.log(req.query)
  // const json = JSON.stringify(req.query)

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.writeHeader(200);
  res.end(html);
});
