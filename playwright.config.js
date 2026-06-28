
import { defineConfig, devices } from '@playwright/test';


;
export default defineConfig(
  {
  testDir: './tests',
   reporter:'html',
   timeout: 40*1000,
   retries: 1,
   ignoreHTTPSErrors: true,
 expect:{
  timeout: 20*1000
 },
 
   
 use:{
  screenshot:'only-on-failure',
  video: 'retain-on-failure',
  trace:'on-first-retry',
  headless:false
},

  projects: [
    {
      name: 'e2e',
      testDir: './tests/e2e',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'integration',
      testDir: './tests/integration',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'security',
      testDir: './tests/security',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'load',
      testDir: './tests/load',
      workers: 1,
      fullyParallel: false,
      retries: 0,
      use: { ...devices['Desktop Chrome'] }
    }
  ],

  
});

