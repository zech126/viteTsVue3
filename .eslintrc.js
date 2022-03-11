module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
    node: true
  },
  extends: ['plugin:vue/vue3-essential'],
  globals: {},
  // parser: 'babel-eslint',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
    // 'codeFrame': true
    ecmaFeatures: {
      'jsx': true
    }
  },
  // 需要配置的插件
  plugins: ['vue'],
  rules: {
    'block-spacing': ['error', 'never'], // 单行代码块中紧贴括号部分不允许包含空格
    'no-multiple-empty-lines': 'error', // 不允许多个空行
    'no-nested-ternary': 'off',//禁止使用嵌套的三目运算
    'generator-star-spacing': 'off', // // 强制 generator 函数中 * 号周围使用一致的空格
    'eqeqeq': 'off', // 关闭全等检测
    'semi': 0, // 结尾不检查分号
    'no-tabs': 'off', // 禁用 tab
    "camelcase": [2, {properties: 'always'}], // 是否强制使用驼峰
    'lines-between-class-members': 'off', // 要求或禁止类成员之间出现空行
    'no-template-curly-in-string': 'off', // 禁止在常规字符串中出现模板字面量占位符语法
    'no-mixed-spaces-and-tabs': 'off', // 禁止空格和 tab 的混合缩进
    'no-inner-declarations': 'off', // // 禁止 RegExp 构造函数中无效的正则表达式字符串
    'vue/no-parsing-error': [2, { 'x-invalid-end-tag': false }], // 有些便签自闭合
    // 忽略方法参数未使用
    'no-unused-vars': [
      // 'error', { 'vars': 'all', 'args': 'after-used', 'ignoreRestSiblings': false }
      'error', { 'vars': 'all', 'args': 'none', 'ignoreRestSiblings': false }
    ],
    // 是否可调试
    // 'no-debugger': 'off',
    // 'no-debugger': import.meta.env.MODE === 'prod' ? 'error' : 'off',
    // 'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    // 是否可使用控制台
    // 'no-console': 'off',
    // 'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'space-before-function-paren': 'off',
    'vue/no-multiple-template-root': 'off',
    'vue/multi-word-component-names': 'off'
  }
}
