const prefix = 'c'

/** @type {import('tailwindcss').Config} */
module.exports = {
  prefix: prefix + '-',
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  safelist: [
    {
      pattern: /(flex|block|inline|table)/
    },
    {
      pattern: /(justify|align|items|container)/
    },
    {
      pattern: /(static|fixed|relative|absolute|sticky|leading)/
    },
    {
      pattern: /^c-(top|left|bottom|right|z|p|m|w|h)/
    },
    {
      pattern: /^c-(font|rounded)/
    },
    {
      pattern: /^c-(text)/,
      variants: ['hover']
    },
    {
      pattern: /^c-(top|left|bottom|right|z|p|m|w|h)/
    },
    {
      pattern: /^c-space/
    },
    {
      pattern: /^c-bg-(red|green|blue|orange|black|white|gray)(-(100|200|300|400|500|600|700|800|900))?/,
      variants: ['hover']
    }
  ],
  theme: {
    height: {},
    extend: {}
  },
  corePlugins: {
    backdropFilter: false,
    preflight: false
  },
  plugins: ['postcss-import']
}
