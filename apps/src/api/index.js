import MainService from "./base";

const convertToFormData = (formData, data, previousKey) => {
  if (data instanceof Object) {
    Object.keys(data).forEach(key => {
      const value = data[key];
      if (value instanceof Blob && !Array.isArray(value)) {
        formData.append(key, value, getFilename(value.name));
      }

      if (value instanceof Object && !Array.isArray(value)) {
        return convertToFormData(formData, value, key);
      }
      if (previousKey) {
        key = `${previousKey}[${key}]`;
      }
      if (Array.isArray(value)) {
        value.forEach(val => {
          formData.append(`${key}[]`, val);
        });
      } else {
        formData.append(key, value);
      }
    });
  }
}

const handleGeneralError = (error) => console.log("General Error", error);
const handleGETRequest = async (api, { ...body }) => {
  const {
    result: {
      body: { data, error, code },
    },
  } = await MainService(api)
    .doRequest({ body: { ...body } })
    .then((result) => result)
    .catch((errorGeneral) => {
      handleGeneralError(errorGeneral);
      return {
        result: {
          body: { data: null, error: null },
        },
        errorJS: errorGeneral,
      };
    });

  return {
    code,
    data,
    error,
  };
};

const handlePOSTRequest = async (api, body, asFormData = false) => {
  const formData = new FormData();
  let actualBody = { ...body };

  if (asFormData) {
    // https://stackoverflow.com/a/43101878
    convertToFormData(formData, body);
    actualBody = formData;
  }

  const {
    result: {
      body: { data, error, code },
    },
  } = await MainService(api)
    .doRequest({
      body: actualBody,
      hooks: {
        before({ payload, next }) {
          const newPayload = { ...payload };
          if (asFormData) delete newPayload.headers["Content-Type"];
          next(newPayload);
        },
      },
    })
    .then((result) => result)
    .catch((errorGeneral) => {
      handleGeneralError(errorGeneral);
      return {
        result: {
          body: { data: null, error: null },
        },
        errorJS: errorGeneral,
      };
    });

  if (error) console.log(error);

  return {
    code,
    data,
    error,
  };
};

/** Edit this part */
export const getArticleList = (data) =>
  handlePOSTRequest("getArticleList", data);

export const getArticleDetail = (id) =>
  handlePOSTRequest("getArticleDetail", { id });

export const createArticle = (data) => handlePOSTRequest("createArticle", data);

export const getToken = (data) => handlePOSTRequest("getToken", data);
