import antfu from '@antfu/eslint-config'

export default antfu({
  css: true,
  html: true,
  ignores: [
    'core',
    'coverage',
    'dist',
  ],
})
