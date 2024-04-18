/* eslint-disable */
const puppeteer = require("puppeteer");
const url = require("url");
const isbot = require("isbot");

const RENDER_CACHE = new Map();
let browserWSEndpoint = null;

// Switch logic using isbot package
// const crawlerUserAgents = [
//   "googlebot",
//   "Yahoo! Slurp",
//   "bingbot",
//   "yandex",
//   "baiduspider",
//   "facebookexternalhit",
//   "twitterbot",
//   "rogerbot",
//   "linkedinbot",
//   "embedly",
//   "quora link preview",
//   "showyoubot",
//   "outbrain",
//   "pinterest/0.",
//   "developers.google.com/+/web/snippet",
//   "slackbot",
//   "vkShare",
//   "W3C_Validator",
//   "redditbot",
//   "Applebot",
//   "WhatsApp",
//   "flipboard",
//   "tumblr",
//   "bitlybot",
//   "SkypeUriPreview",
//   "nuzzel",
//   "Discordbot",
//   "Google Page Speed",
//   "Qwantify",
//   "pinterestbot",
//   "Bitrix link preview",
//   "XING-contenttabreceiver",
//   "Chrome-Lighthouse",
//   "Screaming Frog SEO Spider",
// ];

const extensionsToIgnore = [
  ".js",
  ".css",
  ".xml",
  ".less",
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".pdf",
  ".doc",
  ".txt",
  ".ico",
  ".rss",
  ".zip",
  ".mp3",
  ".rar",
  ".exe",
  ".wmv",
  ".doc",
  ".avi",
  ".ppt",
  ".mpg",
  ".mpeg",
  ".tif",
  ".wav",
  ".mov",
  ".psd",
  ".ai",
  ".xls",
  ".mp4",
  ".m4a",
  ".swf",
  ".dat",
  ".dmg",
  ".iso",
  ".flv",
  ".m4v",
  ".torrent",
  ".woff",
  ".ttf",
  ".svg",
  ".webmanifest",
];

const port = process.env.PORT || 8000;
const isPrerender = !!process.env.PRERENDER_PAGE;

const whitelist = "";
const blacklist = "";

// const whitelisted = function(whitelist) {
//   whitelist = typeof whitelist === "string" ? [whitelist] : whitelist;
// };

// const blacklisted = function(blacklist) {
//   blacklist = typeof blacklist === "string" ? [blacklist] : blacklist;
// };

module.exports = {
  RENDER_CACHE: RENDER_CACHE,
  browserWSEndpoint: browserWSEndpoint,
  shouldShowPrerenderedPage: function (req) {
    let userAgent = req.headers["user-agent"],
      bufferAgent = req.headers["x-bufferbot"],
      isRequestingPrerenderedPage = false;

    if (!isPrerender) return false;
    if (!userAgent) return false;
    if (req.method != "GET" && req.method != "HEAD") return false;
    if (req.headers && req.headers["x-prerender"]) return false;

    //if it contains _escaped_fragment_, show prerendered page
    let parsedQuery = url.parse(req.url, true).query;
    if (parsedQuery && parsedQuery["_escaped_fragment_"] !== undefined)
      isRequestingPrerenderedPage = true;

    //if it is a bot...show prerendered page
    if (userAgent.toLowerCase().indexOf("headless") === -1 && isbot(userAgent))
      isRequestingPrerenderedPage = true;

    //if it is BufferBot...show prerendered page
    if (bufferAgent) isRequestingPrerenderedPage = true;

    //if it is a bot and is requesting a resource...dont prerender
    if (
      extensionsToIgnore.some(
        (extension) => req.url.toLowerCase().indexOf(extension) !== -1
      )
    )
      return false;

    //if it is a bot and not requesting a resource and is not whitelisted...dont prerender
    if (
      Array.isArray(whitelist) &&
      whitelist.every(
        (whitelisted) => new RegExp(whitelisted).test(req.url) === false
      )
    )
      return false;

    //if it is a bot and not requesting a resource and is not blacklisted(url or referer)...dont prerender
    if (
      Array.isArray(blacklist) &&
      blacklist.some((blacklisted) => {
        let blacklistedUrl = false,
          blacklistedReferer = false,
          regex = new RegExp(blacklisted);

        blacklistedUrl = regex.test(req.url) === true;
        if (req.headers["referer"])
          blacklistedReferer = regex.test(req.headers["referer"]) === true;

        return blacklistedUrl || blacklistedReferer;
      })
    )
      return false;

    return isRequestingPrerenderedPage;
  },
  // Function to render the content using puppeteer to mimic the user
  prerenderPage: async (req, res) => {
    const localURL = "http://localhost:" + port + req.originalUrl;
    if (RENDER_CACHE.has(localURL)) {
      const { html, lastRenderAt } = RENDER_CACHE.get(localURL);
      const now = Date.now();

      //If this page has been cached for more than one day
      if (now - lastRenderAt < 24 * 60 * 60 * 1000) {
        res.send(html);
        return;
      }
    }

    if (!browserWSEndpoint) {
      const browser = await puppeteer.launch({
        ignoreDefaultArgs: ["--disable-extensions"],
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-web-security",
          "--single-process",
          "--no-zygote",
        ],
      });
      browserWSEndpoint = await browser.wsEndpoint();
    }

    const currentBrowser = await puppeteer.connect({ browserWSEndpoint });
    const page = await currentBrowser.newPage();

    try {
      // Block unimportant Request, such as Image, Media, Stylesheet
      await page.setRequestInterception(true);
      page.on("request", (req) => {
        const allowlist = ["document", "script", "xhr", "fetch", "stylesheet"];
        if (!allowlist.includes(req.resourceType())) {
          return req.abort();
        }
        req.continue();
      });

      // Error Log if failed
      page.on("error", (err) => {
        console.log("error happen at the page: ", err);
      });

      // page.on("pageerror", (pageerr) => {
      // console.log("pageerror occurred: ", pageerr);
      // });

      // page.on("requestfailed", (request) => {
      // console.log(
      //   `url: ${request.url()}, errText: ${JSON.stringify(
      //     request.failure()
      //   )}, method: ${request.method()}`
      // )
      // });

      await page.goto(localURL, {
        waitUntil: "networkidle0",
      });

      const html = await page.evaluate(() => {
        function removeDOM(removeSelector) {
          const thingToRemove = document.querySelectorAll(removeSelector);
          for (let i = 0; i < thingToRemove.length; i++) {
            thingToRemove[i].parentNode.removeChild(thingToRemove[i]);
          }
        }

        //Delete Cookies Notice
        const optanonAlert = ".optanon-alert-box-wrapper";
        removeDOM(optanonAlert);

        const optanonID = "#optanon";
        removeDOM(optanonID);

        return document.documentElement.innerHTML;
      });

      const lastRenderAt = Date.now();
      RENDER_CACHE.set(localURL, { html, lastRenderAt }); // cache rendered page.
      res.send(html);
      // await page.close();
    } catch (e) {
      console.log(e);
      // await page.close();
    } finally {
      await page.close();
      await currentBrowser.disconnect();
    }
  },
};
