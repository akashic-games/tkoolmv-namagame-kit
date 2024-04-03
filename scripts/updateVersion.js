const path = require("path");
const { execCommand } = require("./execCommand");

const target = process.argv.length >= 2 ? process.argv[2] : "patch";

execCommand("git checkout .");
execCommand("git checkout main");
execCommand(`npm version ${target}`);
execCommand("npm i");
execCommand("git add .");
const packageJson = require(path.resolve(__dirname, "..", "package.json"));
const version = packageJson["version"];
execCommand(`git commit -m "Update Kit to v${version}"`);
execCommand("git push origin main");
