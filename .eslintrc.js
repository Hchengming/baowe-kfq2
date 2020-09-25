module.exports = {
  env: {
    browser: true,
    es6: true
  },
  extends: ['eslint:recommended', 'plugin:vue/essential'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
    // process: true,
    // require: true
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    parser: 'babel-eslint'
  },
  plugins: ['vue'],
  rules: {
    'no-console': 'off' // 禁止console
    // 'no-undef': 'off', // 不能有未定义的变量,定义之前必须有var或者let
    // 'no-unused-vars': 'off', // 不能有声明后未被使用的变量
    // 'no-useless-escape': 'off' //转义字符串
  }
}
