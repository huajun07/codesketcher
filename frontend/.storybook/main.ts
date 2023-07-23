import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin'

module.exports = {
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/preset-create-react-app',
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
    }
    return config
  },
  features:{
    emotionAlias: false
  }
}
