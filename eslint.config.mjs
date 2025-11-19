import { defineConfig } from "eslint/config";
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
import perfectionist from "eslint-plugin-perfectionist";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
});

export default defineConfig([
    {
        extends: compat.extends("plugin:@typescript-eslint/recommended"),
        plugins: {
            perfectionist,
        },
        languageOptions: {
            globals: {
                ...globals.node,
            },
            ecmaVersion: "latest",
            sourceType: "module",
        },
        rules: {
            "@typescript-eslint/no-explicit-any": "off",
            "perfectionist/sort-imports": [
                "warn",
                {
                    type: "line-length",
                    order: "desc",
                },
            ],
            "perfectionist/sort-named-imports": [
                "warn",
                {
                    type: "line-length",
                    order: "desc",
                },
            ],
            "perfectionist/sort-exports": [
                "warn",
                {
                    type: "line-length",
                    order: "desc",
                },
            ],
            "perfectionist/sort-named-exports": [
                "warn",
                {
                    type: "line-length",
                    order: "desc",
                },
            ],
        },
    },
]);
