module.exports = {
  navigateFallback: '/index.html',
  stripPrefix: 'dist',
  root: 'dist/',
  staticFileGlobs: ['dist/**/*.*'],
  maximumFileSizeToCacheInBytes: 15000000,
  runtimeCaching: [
    // shouldn't be needed if app-cache is used cause in this case we use local fonts
    {
      urlPattern: /^https:\/\/fonts\.gstatic\.com(.+)/,
      handler: 'cacheFirst'
    },
    {
      urlPattern: /^https:\/\/fonts\.googleapis\.com(.+)/,
      handler: 'cacheFirst'
    }
  ]
};
