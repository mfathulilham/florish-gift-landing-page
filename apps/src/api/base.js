import { ApiService, ApiTree } from "@apicase/services";
import fetch from "@apicase/adapter-fetch";
import Cookies from "js-cookie";
import apiList from "./list";

// VARIABLE LIST
// make sure match for your APP
const appBaseUrl = process.env.REACT_APP_BASE_URL;
const appEnvironment = process.env.REACT_APP_ENVIRONMENT;
const appName = process.env.REACT_APP_NAME;
const appSecretKey = process.env.REACT_APP_SECRET_KEY;
const appDeviceType = process.env.REACT_APP_DEVICE_TYPE;
const appTokenHeader = process.env.REACT_APP_TOKEN_HEADER;

const urlGetToken = "api/token/get";
const urlRefreshToken = "api/token/get";
// END OF VARIABLE LIST

// FUNCTION GROUP

// SET COOKIE
// function to set cookie with a few options
// name to cookie name, value to cookie value
// options is optional cookie
const setCookie = (name, value, options) => {
  let secure = false;
  if (appEnvironment === "production") secure = true;
  Cookies.set(name, value, { expires: 1, path: "/", secure, ...options });
};

// GENERATE RANDOM STRING
// function to generate random string
const generateRandomString = (length) => {
  const { floor, random } = Math;
  let text = "";
  const char = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < length; i += 1)
    text += char.charAt(floor(random() * char.length));
  return text;
};

// GET DEVICE ID
const getDeviceId = new Promise((resolve) => {
  const deviceId = generateRandomString(36);
  if (window.requestIdleCallback) requestIdleCallback(() => resolve(deviceId));
  else resolve(deviceId);
});

// SERVICE LOGGER
// this function to get event & result log
// only in local
const serviceLogger = (event, result) => {
  if (appEnvironment === "local")
    console.log("serviceLogger: ", { event }, { result });
  return null;
};

// END OF FUNCTION GROUP

const RootService = new ApiService({
  adapter: fetch,
  url: appBaseUrl,
  mode: "cors",
  headers: {
    "Content-Type": "application/json; charset=utf-8",
  },
  options: { timeout: 1000 },
});

// SERVICE LOGGER FOR API ACTIVITY & RESPONSE
RootService.on("done", (result) => serviceLogger("done", result));
RootService.on("fail", (result) => serviceLogger("fail", result));
RootService.on("finish", (result) => serviceLogger("finish", result));
RootService.on("start", (result) => serviceLogger("start", result));
RootService.on("cancel", (result) => serviceLogger("cancel", result));
RootService.on("error", (result) => serviceLogger("error", result));
// END of SERVICE LOGGER FOR API ACTIVITY & RESPONSE

// GET  TOKEN API & SERVICE
const TokenService = (url = urlGetToken) =>
  RootService.extend({
    url,
    method: "POST",
    body: {
      name: appName,
      secret_key: appSecretKey,
      device_type: appDeviceType,
      token: Cookies.get("token"),
      refresh_token: Cookies.get("refresh-token"),
    },
    hooks: {
      before({ payload, next }) {
        getDeviceId.then((result) => {
          const newPayload = { ...payload };
          newPayload.body = {
            ...payload.body,
            device_id: result,
          };
          next(newPayload);
        });
      },
    },
  }).on("done", (result) => {
    const {
      token: { token_code: tokenCode, refresh_token: refreshToken },
    } = result.body.data;
    setCookie("token", tokenCode);
    setCookie("refresh-token", refreshToken);
  });
// END OF GET TOKEN API & SERVICE

const GetToken = TokenService();
const RefreshToken = TokenService(urlRefreshToken);

//  HIT TOKEN ACTIVITY
const hitToken = async (payload, retry, next, urlToken = urlGetToken) => {
  let fn = GetToken;
  if (urlToken === urlRefreshToken) fn = RefreshToken;
  const { success, result } = await fn.doSingleRequest();
  if (success) {
    const {
      token: { token_code: tokenCode },
    } = result.body.data;
    const newPayload = { ...payload };
    newPayload.headers = { ...payload.headers, [appTokenHeader]: tokenCode };
    retry(newPayload);
    // next(result);
  }
};
// END OF HIT TOKEN ACTIVITY

// ADDITIONAL ERROR STATES
const do400 = () => {
  console.log("Code 400. Re-validate form / parameter");
};

const do401 = (passed) => {
  console.log("Code 401. Remove login status or something");
};

const do403 = () => {
  console.log("Code 403. Check user previlleges");
};

const do404 = () => {
  console.log("Code 404. Access Not found");
  // window.location = "/404";
};

const do500 = () => {
  console.log("Code 500. Internal server error");
};
// END OF ADDITIONAL ERROR STATES

// FAIL API ACTIVITY
const handleFailed = (errorCode, payload, retry, result, next) => {
  const reloadToken = () => hitToken(payload, retry, next);
  const refreshToken = () => hitToken(payload, retry, next, urlRefreshToken);
  let handleToken = "";

  if (errorCode === 400) {
    do400();
    handleToken = refreshToken();
  } else if (errorCode === 401) {
    do401();
    if (result.body.code === 100) handleToken = refreshToken();
    else handleToken = reloadToken();
  } else if (errorCode === 403) {
    do403();
  } else if (errorCode === 404) do404();
  else if (errorCode === 500) do500();

  return handleToken;
};
// END OF FAIL API ACTIVITY

const MainService = new ApiTree(RootService, [
  {
    url: "api",
    children: apiList,
    hooks: {
      before({ payload, next }) {
        const token = Cookies.get("token");
        const newPayload = { ...payload };
        newPayload.headers = {
          ...payload.headers,
          [appTokenHeader]: token,
        };
        next(newPayload);
      },
      async fail({ payload, retry, result, next }) {
        const errorCode = result.status;
        // console.log(`FAIL on: ${errorCode}`);
        await handleFailed(errorCode, payload, retry, result, next);
        next(result);
      },
      async done({ result, fail, next }) {
        next(result);
        return true;
      },
    },
  },
]);

export default MainService;
