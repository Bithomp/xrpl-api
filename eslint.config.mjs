import typescriptEslint from "@typescript-eslint/eslint-plugin";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  ...compat.extends("prettier"),
  {
    files: ["src/**/*.ts", "test/**/*.ts"],

    plugins: {
      "@typescript-eslint": typescriptEslint,
    },

    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.mocha,
      },

      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",
    },

    rules: {
      eqeqeq: "warn",
      "no-invalid-this": "error",
      "no-return-assign": "error",

      "no-unused-expressions": [
        "error",
        {
          allowTernary: true,
        },
      ],

      "no-useless-concat": "error",
      "no-useless-return": "error",

      "no-constant-condition": [
        "warn",
        {
          checkLoops: false,
        },
      ],

      "no-unused-vars": "off",

      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "req|res|next|__|^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],

      "no-undef": "error",
      "@typescript-eslint/consistent-type-assertions": "error",
      "@typescript-eslint/array-type": "error",
      "@typescript-eslint/no-empty-interface": "error",

      "no-bitwise": [
        "warn",
        {
          int32Hint: true,
        },
      ],

      indent: [
        "error",
        2,
        {
          SwitchCase: 1,
        },
      ],

      "no-mixed-spaces-and-tabs": "warn",
      "space-before-blocks": "error",
      "space-in-parens": "error",
      "space-infix-ops": "error",
      "space-unary-ops": "error",
      "keyword-spacing": "error",
      "multiline-ternary": ["error", "never"],
      "no-mixed-operators": "warn",
      "no-param-reassign": "warn",
      "no-redeclare": "warn",
      "no-shadow": "off",
      "@typescript-eslint/no-shadow": "warn",

      "no-multiple-empty-lines": [
        "error",
        {
          max: 2,
          maxEOF: 1,
        },
      ],

      "no-whitespace-before-property": "error",
      "nonblock-statement-body-position": "error",

      "object-property-newline": [
        "error",
        {
          allowAllPropertiesOnSameLine: true,
        },
      ],

      "arrow-spacing": "error",
      "no-confusing-arrow": "error",
      "no-duplicate-imports": "error",
      "no-var": "error",
      "object-shorthand": "off",
      "prefer-const": "error",
      "prefer-template": "warn",
    },
  },
  {
    files: ["**/*.test.ts"],

    rules: {
      "no-invalid-this": "off",
      "no-unused-expressions": "off",
    },
  },
];
