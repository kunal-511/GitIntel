module.exports = {
  extends: ['next/core-web-vitals'],
  rules: {
    '@typescript-eslint/no-explicit-any': [
      'error',
      {
        ignoreRestArgs: true,
        fixToUnknown: false,
      },
    ],
  },
  overrides: [
    {
      files: ['src/lib/github.ts'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'warn', // Downgrade to warning for GitHub API file
      },
    },
    {
      files: ['src/components/charts/*.tsx'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'warn', // Downgrade to warning for chart components
      },
    },
  ],
}; 