import path from 'path';
import { argv } from 'yargs';

const config = {
  env: process.env.NODE_ENV,

  server_host: '0.0.0.0',
  server_port: process.env.PORT || 3001,

  path_base: path.resolve(__dirname, '../'),
  dir_dist: 'dist'
};

config.globals = {
  'process.env': {
    'NODE_ENV': JSON.stringify(config.env)
  },
  'NODE_ENV': config.env,
  '__DEV__': config.env === 'development',
  '__PROD__': config.env === 'production',
  '__DEBUG__': config.env === 'development' && !argv.no_debug
};

config.utils_paths = (() => {
  const resolve = path.resolve;

  const base = (...args) =>
    resolve.apply(resolve, [config.path_base, ...args]);

  return {
    base: base,
    dist: base.bind(null, config.dir_dist)
  };
})();

export default config;
