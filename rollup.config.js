// Default Plugins
import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import replace from '@rollup/plugin-replace';
import auto from '@rollup/plugin-auto-install';

// Production Plugins
import { terser } from 'rollup-plugin-terser';
import { generateSW } from 'rollup-plugin-workbox';
import obfuscatorPlugin from 'rollup-plugin-javascript-obfuscator';

// Development Plugins
import livereload from 'rollup-plugin-livereload';

const workboxConfig = require('./workbox-config');

const production = !process.env.ROLLUP_WATCH;

const productionPlugins = [
  generateSW(workboxConfig),
  terser(),
  obfuscatorPlugin({
    compact: true
  })
];

const devPlugins = [serve(), livereload('public')];

const plugins = [
  replace({
    'process.env.NODE_ENV': JSON.stringify(
      production ? 'production' : 'development'
    )
  }),
  auto(),
  json(),
  svelte({
    // enable run-time checks when not in production
    dev: !production,
    // we'll extract any component CSS out into
    // a separate file - better for performance
    css: css => {
      css.write('public/bundle.css');
    }
  }),
  resolve({
    browser: true,
    dedupe: ['svelte']
  }),
  commonjs({
    namedExports: {
      case: ['pascal', 'camel', 'capital']
    }
  }),
  ...(production ? productionPlugins : devPlugins)
];
export default {
  input: 'src/index.js',
  output: {
    sourcemap: true,
    format: 'iife',
    name: 'app',
    file: 'public/bundle.js'
  },
  plugins,
  watch: {
    clearScreen: false
  }
};

function serve() {
  let started = false;

  return {
    writeBundle() {
      if (!started) {
        started = true;
        require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
          stdio: ['ignore', 'inherit', 'inherit'],
          shell: true
        });
      }
    }
  };
}
