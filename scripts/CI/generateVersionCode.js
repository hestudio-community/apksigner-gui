const fs = require("node:fs");
const { execSync } = require("child_process");

function run(cmd) {
  return execSync(cmd, { encoding: "utf8" }).trim();
}
function getBranchName() {
  return run("git rev-parse --abbrev-ref HEAD");
}
function getShortCommitId() {
  return run("git rev-parse --short HEAD");
}
function getGitStatus() {
  const status = run("git status --porcelain")
    .replaceAll("M package.json", "")
    .trim();
  console.log(status);
  return status === "" ? null : "dirty";
}

const branchName = getBranchName();
const shortCommitId = getShortCommitId();
const gitStatus = getGitStatus();

const baseversion = String(
  JSON.parse(fs.readFileSync("package.json")).version,
).split("-")[0];
let appversion;

if (branchName === "main" || branchName === "HEAD") {
  appversion = baseversion;
} else {
  appversion = baseversion + `-${branchName}+${shortCommitId}`;
  if (gitStatus !== null) {
    appversion = appversion + ".dirty";
  }
}
const packagejson = JSON.parse(fs.readFileSync("package.json"));
packagejson.version = appversion;
fs.writeFileSync("package.json", JSON.stringify(packagejson));
