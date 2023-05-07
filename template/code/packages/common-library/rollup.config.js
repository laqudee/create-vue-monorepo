export default {
  input: 'src/index.js',
  output: [
    { file: 'dist/index.js', format: 'cjs' },
    { file: 'dist/index.es.js', format: 'es' }
  ],
  plugins: []
}
