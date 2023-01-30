module.exports = {
    extends: ['airbnb', 'airbnb-typescript'],
    rules: {
        "indent": ["error", 4],
        '@typescript-eslint/indent': ["error", 4],
        'react/jsx-indent': ["error", 4],
        'react/jsx-indent-props': ["error", 4],
        'react/function-component-definition': [2, { "namedComponents": "arrow-function" }],
        'import/no-cycle': 'off'
},
    parserOptions: {
        project: './tsconfig.json',
    },
};
