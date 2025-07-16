const { execSync } = require("child_process");

// Map short browser names to full names
const browserNames = {
  and_chr: "Chrome (Android)",
  and_ff: "Firefox (Android)",
  and_qq: "QQ Browser (Android)",
  and_uc: "UC Browser (Android)",
  android: "Android WebView",
  chrome: "Chrome",
  edge: "Edge",
  firefox: "Firefox",
  ios_saf: "Safari (iOS)",
  op_mob: "Opera Mobile",
  safari: "Safari (macOS)",
  samsung: "Samsung Internet",
};

const rawOutput = execSync("npx browserslist", { encoding: "utf8" });
const lines = rawOutput.trim().split("\n");

const browserMap = {};

lines.forEach((line) => {
  const [browser, version] = line.trim().split(" ");
  const name = browserNames[browser] || browser;
  if (!browserMap[name]) {
    browserMap[name] = [];
  }
  browserMap[name].push(version);
});

// Pretty table output
console.log(
  "| Browsers             | Version                                                       |"
);
console.log(
  "| -------------------- | ------------------------------------------------------------- |"
);

Object.entries(browserMap)
  .sort(([a], [b]) => a.localeCompare(b))
  .forEach(([browser, versions]) => {
    console.log(`| ${browser.padEnd(20)} | ${versions.join(", ")} |`);
  });
