import CookieBrowser from "js-cookie";

function easing(t) {
  return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
}

export function doScroll(target, duration, pos) {
  const targetClient = target;
  const offset = pos || 130;
  if (targetClient != null) {
    const client = targetClient.getBoundingClientRect().top;
    const elementY = window.pageYOffset + client;
    const startingY = window.pageYOffset;
    const diff = elementY - startingY - offset;
    let start;
    window.requestAnimationFrame(function step(timestamp) {
      if (!start) start = timestamp;
      const time = timestamp - start;
      let percent = Math.min(time / duration, 1);
      percent = easing(percent);
      window.scrollTo(0, startingY + diff * percent);
      if (time < duration) {
        window.requestAnimationFrame(step);
      }
    });
  }
}

export const isFunction = (varFunction) => {
  if (varFunction && typeof varFunction === "function") return true;
  return false;
};

export const scrollToTop = () => doScroll(document.body, 500, 100);

const setTime = (range) => {
  const rangeTime = parseInt(range, 10);
  const timeToday = new Date();
  const time = timeToday.getTime();
  timeToday.setTime(time + 3600 * 1000 * 24 * rangeTime);
  const expiredDate = timeToday;
  return expiredDate;
};

export const setCookie = (field, value, time = 365) => {
  const expiredDate = setTime(time);
  CookieBrowser.set(field, value, { expires: expiredDate });
};

export const getCookie = (field) => CookieBrowser.get(field);

export const delCookie = (field) => CookieBrowser.remove(field);

export const pushDataLayer = (data) => {
  if (window.dataLayer) return window.dataLayer.push(data);
  return console.log("DATALAYER NOTFOUND. . .", data);
};

export const formatNumber = (x = 0, formatted = false) => {
  const z = x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  let f = z;
  const parsed = formatted && parseInt(x, 10);
  if (parsed >= 1000) f = `${z.slice(0, 1)}K`;
  else if (parsed >= 1000000) f = `${z.slice(0, 1)}M`;
  return formatted ? f : z;
};

const getMonthName = (monthNumber) => {
  if (!monthNumber) return false;
  const num = parseInt(monthNumber, 10);
  const monthList = [
    { id: 1, name: "Jan" },
    { id: 2, name: "Feb" },
    { id: 3, name: "Mar" },
    { id: 4, name: "Apr" },
    { id: 5, name: "Mei" },
    { id: 6, name: "Juni" },
    { id: 7, name: "Juli" },
    { id: 8, name: "Ags" },
    { id: 9, name: "Sept" },
    { id: 10, name: "Okt" },
    { id: 11, name: "Nov" },
    { id: 12, name: "Des" },
  ];
  const filtered = monthList.filter(({ id }) => id === num);
  return filtered[0].name;
};

export const getFormattedDate = (dateData, format) => {
  if (!dateData) return false;
  const truncated = dateData.split("-");
  // const year = truncated[0];
  const month = truncated[1];
  const date = truncated[2];
  const monthName = getMonthName(month);
  return `${date} ${monthName}`;
};
