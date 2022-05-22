// jest.config.ts
import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  preset: "ts-jest",
  testEnvironment: "node",
  verbose: true,
  testRegex: "./spec/.*.(js|ts)$",
  rootDir: ".",
  // automock: true,
};

export default config;
