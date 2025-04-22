import { defineConfig } from 'cypress';
import codeCoverage from '@cypress/code-coverage/task';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:8080',
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    video: false,
    screenshotOnRunFailure: true,
    viewportWidth: 1280,
    viewportHeight: 720,
    setupNodeEvents(on, config) {
      codeCoverage(on, config);
      return config;
    },
    env: {
      codeCoverage: {
        url: '/coverage/cypress',
        exclude: [
          'cypress/**/*.*',
          'coverage/**/*.*'
        ]
      }
    }
  },
  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
    },
    supportFile: 'cypress/support/component.ts',
    specPattern: 'cypress/component/**/*.cy.{js,jsx,ts,tsx}',
    setupNodeEvents(on, config) {
      codeCoverage(on, config);
      return config;
    }
  },
  coverageDirectory: 'coverage/cypress',
  typescript: {
    tsconfig: 'tsconfig.cypress.json'
  }
}); 