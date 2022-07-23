module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ['plugin:vue/essential', '@vue/standard'],
  parserOptions: {
    parser: '@babel/eslint-parser',
    requireConfigFile: false
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'vue/multi-word-component-names': 'off',
    'space-before-function-paren': 'off',
    'vue/no-side-effects-in-computed-properties': 'off',
    'no-irregular-whitespace': 'off',
    'no-unused-vars': 'off',
    'vue/no-mutating-props': 'off',
    'import/no-absolute-path': 'off',
    'vue/no-duplicate-attributes': 'off'
  }
}
