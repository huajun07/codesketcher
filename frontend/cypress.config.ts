import {addMatchImageSnapshotPlugin} from '@simonsmith/cypress-image-snapshot/plugin'
import { defineConfig } from 'cypress'

export default defineConfig({
  viewportWidth: 1640,
  viewportHeight: 900,

  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on) {
      addMatchImageSnapshotPlugin(on)
      on('before:browser:launch', (_browser, launchOptions) => {
        launchOptions.args.push("--window-size=1640,900")
        return launchOptions
      })
    },
  },
  env: {
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleSecret: process.env.GOOGLE_SECRET,
    googleRefreshToken: process.env.GOOGLE_REFRESH_TOKEN,
  },
})
