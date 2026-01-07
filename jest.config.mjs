// @ts-check
import { createDefaultPreset } from 'ts-jest';

const presetConfig = createDefaultPreset({
  tsconfig: 'tsconfig.test.json',
});

/** @type {import("jest").Config} **/
export default {
  testEnvironment: 'node',
  ...presetConfig,
};
