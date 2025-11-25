export default [
  {
    ignores: [".next/**", "out/**", "build/**", "next-env.d.ts", "node_modules/**"]
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      parser: "@typescript-eslint/parser",
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: { jsx: true }
      }
    },
    plugins: {
      "@typescript-eslint": {},
      "react": {}
    },
    rules: {
      "react/no-unescaped-entities": "error"
    }
  }
];
