module.exports = {
  'ward-analytics-api': {
    input: {
      target: './ward-analytics-api.yml',
    },
    output: {
      client: 'react-query',
      mock: false,
      mode: 'tags-split',
      target: '.',
      schemas: './model',
      override: {
        mutator: {
          path: './instance.ts',
          name: 'instance',
        },
      },
    },
  },
}
