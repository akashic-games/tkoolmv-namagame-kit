const path = require("path");
const execCommand = require("./util/execCommand");

const converterPath = path.resolve(__dirname, "..", "module", "tkoolmv-namagame-converter");
execCommand(`cd ${converterPath} && git checkout main && git pull origin`);
execCommand("git add module/tkoolmv-namagame-converter");
execCommand("git commit -m \"update tkoolmv-namagame-converter\"");
