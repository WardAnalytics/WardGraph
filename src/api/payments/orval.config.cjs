module.exports = {
  "ward-analytics-payments-api": {
    input: {
      target: "./ward-analytics-payments-api.yml",
    },
    output: {
      client: "react-query",
      mock: false,
      mode: "tags-split",
      target: ".",
      schemas: "./model",
      override: {
        mutator: {
          path: "./instance.ts",
          name: "instance",
        },
      },
    },
  },
};
