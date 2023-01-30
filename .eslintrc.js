module.exports = {
    extends: ['airbnb', 'airbnb-typescript'],
    rules: {
        "indent": ["error", 4],
        '@typescript-eslint/indent': ["error", 4],
        'react/jsx-indent': ["error", 4],
        'react/jsx-indent-props': ["error", 4],
    },
    parserOptions: {
        project: './tsconfig.json',
    },
};
