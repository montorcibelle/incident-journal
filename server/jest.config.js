export default {
  testEnvironment: "node",
  roots: ["<rootDir>/test"],
  extensionsToTreatAsEsm: [".ts"],
  transform: {
    "^.+\\.ts$": [
      "@swc/jest",
      {
        module: { type: "es6" },
        jsc: { target: "es2022", parser: { syntax: "typescript" } },
      },
    ],
  },
};
