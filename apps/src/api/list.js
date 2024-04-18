const apiList = [
  {
    url: "token",
    children: [
      {
        name: "getToken",
        url: "get",
        method: "POST",
      },
    ],
  },
  {
    url: "article",
    name: "createArticle",
    method: "POST",
    children: [
      {
        name: "getArticleList",
        url: "list",
        method: "POST",
      },
      {
        name: "getArticleDetail",
        url: "detail",
        method: "POST",
      },
    ],
  },
];

export default apiList;
