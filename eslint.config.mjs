export default [
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
    ignores: ["./src/docs"],
    languageOptions: {
      ecmaVersion: 2018,
      sourceType: "module",
      ecmaFeatures: {
        jsx: true,
      },
      globals: {
        Atomics: "readonly",
        SharedArrayBuffer: "readonly",
      },
      parser: "@typescript-eslint/parser",
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    plugins: {
      react: require("eslint-plugin-react"),
      "@typescript-eslint": require("@typescript-eslint/eslint-plugin"),
    },
    rules: {
      "@typescript-eslint/await-thenable": "error",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/member-delimiter-style": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/no-var-requires": "off",
      "@typescript-eslint/no-use-before-define": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-this-alias": "off",
      "@typescript-eslint/no-inferrable-types": "off",
      "react/no-unescaped-entities": "off",
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off",
      "linebreak-style": ["error", "windows"],
      indent: "off",
      quotes: "off",
    },
    settings: {
      react: {
        version: "16.13",
      },
    },
  },
];
