import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "tests/e2e",
  workers: 2,
  timeout: 30000,
  use: {
    baseURL: "http://127.0.0.1:4322",
    launchOptions: {
      executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
      args: ["--no-sandbox"],
    },
    trace: "retain-on-failure",
  },
  reporter: [["list"], ["json", { outputFile: "test-results/results.json" }]],
  webServer: [
    {
      command: "python3 -m http.server 4322 --bind 127.0.0.1 --directory dist",
      url: "http://127.0.0.1:4322",
      reuseExistingServer: !process.env.CI,
    },
    {
      command:
        "python3 -m http.server 4323 --bind 127.0.0.1 --directory .test-site/dist",
      url: "http://127.0.0.1:4323",
      reuseExistingServer: !process.env.CI,
    },
  ],
});
