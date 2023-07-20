
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin'

const config = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/preset-create-react-app',
    '@storybook/addon-onboarding',
    '@storybook/addon-interactions',
    '@chakra-ui/storybook-addon',
    'storybook-addon-module-mock',
  ],
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  staticDirs: ['../public'],
  typescript: {
    reactDocgenTypescriptOptions: {
      compilerOptions: {
        rootDir: './src',
      },
    },
  },
  webpackFinal: async (config, { configType }) => {
    if (config.resolve){
      config.resolve.plugins = [new TsconfigPathsPlugin()]
      config.resolve.alias['@emotion/core'] = '@emotion/react'
      config.resolve.alias['emotion-theming'] = '@emotion/react'
    }
    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: 'javascript/auto',
    })
    return config
  },
  features:{
    emotionAlias: false
  }
}
export default config
