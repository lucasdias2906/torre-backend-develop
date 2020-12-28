module.exports = {
  env: {
      commonjs: true,
      es6: true,
      node: true,
      jest: true,
  },
  extends: ['airbnb-base'],
  //plugins: ['prettier'],
  globals: {
      Atomics: 'readonly',
      SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
      ecmaVersion: 2018,
  },
  rules: {
      'max-len': [2, {'code': 200}],
      'linebreak-style': ["error", "windows"],
      'class-methods-use-this': 'off',
      'no-param-reassign': 'off',
      camelcase: 'off',
      'no-unused-vars': ['error', { args: 'after-used' }],
      "semi": [ "error", "never" ],
      "no-underscore-dangle": ["error", { "allow": ["_id"] }]
     // "space-before-function-paren": ["error", {
    //    "anonymous": "always",
    //    "named": "always",
   //     "asyncArrow": "always"
   // }],
  },
};
