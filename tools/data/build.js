const path = require("path");
const esbuild = require('esbuild');
const { nodeExternalsPlugin } = require('esbuild-node-externals');
const cwd = path.resolve(process.cwd(), '../..');
console.log('cwd', cwd)

// import esbuild from 'esbuild';
// import { nodeExternalsPlugin } from 'esbuild-node-externals';

esbuild.build({
  entryPoints: ['src/get.js'],
  outfile: './get.js',
  bundle: true,
  platform: 'node',
  preserveSymlinks: true,
  loader: { '.gql': 'text' },
  alias:{
    '@': path.resolve(cwd, 'src'),
    '@ips': path.resolve(cwd, 'src/@ips'),
  },
  plugins: [nodeExternalsPlugin(
    {
      allowList:[
        '@ips/app',
        '@ips/strapi',
      ]
    }
  )],
});

esbuild.build({
  entryPoints: ['src/getLocales.js'],
  outfile: './getLocales.js',
  bundle: true,
  platform: 'node',
  preserveSymlinks: true,
  loader: { '.gql': 'text' },
  plugins: [nodeExternalsPlugin(
    {
      allowList:[
        '@ips/app',
        '@ips/strapi',
      ]
    }
  )],
});

esbuild.build({
  entryPoints: ['src/cleanupData.js'],
  outfile: './cleanupData.js',
  bundle: true,
  platform: 'node',
  preserveSymlinks: true,
  //loader: { '.gql': 'text' },
  //plugins: [nodeExternalsPlugin(
  //  {
  //    allowList:[
  //      '@ips/app',
  //      '@ips/strapi',
  //    ]
  //  }
  //)],
});
