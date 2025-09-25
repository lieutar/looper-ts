import globals from "globals";
import pluginTs from "@typescript-eslint/eslint-plugin";
import parserTs from "@typescript-eslint/parser";
import configPrettier from "eslint-config-prettier";

export default [ {
    files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
    ignores: [
        "eslint.config.js",
        "dist/**/*",         "dist/**/.*",
        "node_modules/**/*", "node_modules/**/.*",
    ],
    languageOptions: {
        parser: parserTs,
        parserOptions: {
            project: "./tsconfig.json",
            ecmaVersion: 2022,
            sourceType: "module",
        },
        globals: {
            ...globals.node,
        },
    },
    plugins: {
        "@typescript-eslint": pluginTs,
    },
    rules: {
        '@typescript-eslint/no-unused-vars': [
            'warn', // 警告レベル
            {
                argsIgnorePattern: '^_', // アンダーバーで始まる引数を無視
                varsIgnorePattern: '^_', // アンダーバーで始まる変数を無視
            },
        ],
        "@typescript-eslint/no-floating-promises": "error",
        "@typescript-eslint/require-await": "warn",
        "semi": ["error", "always"],
    },
}, configPrettier, ];
