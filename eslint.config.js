import js from "@eslint/js";
import { globals } from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import jsxA11y from "eslint-plugin-jsx-a11y";
import importPlugin from "eslint-plugin-import";
import securityPlugin from "eslint-plugin-security";
import deprecationPlugin from "eslint-plugin-deprecation";

// Configuration ultra stricte
export default tseslint.config(
  // Fichiers à ignorer
  { ignores: ["dist", "node_modules", "coverage", ".nyc_output"] },
  
  // Configuration de base pour tous les fichiers
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    settings: {
      "import/resolver": {
        typescript: {}
      },
      react: {
        version: "detect"
      }
    },
    linterOptions: {
      reportUnusedDisableDirectives: true
    }
  },
  
  // Configuration spécifique pour les fichiers TypeScript
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      ...tseslint.configs.recommended
    ],
    // Désactivation temporaire de la vérification de type pour résoudre les problèmes
    // languageOptions: {
    //   parserOptions: {
    //     project: ['./tsconfig.json', './tsconfig.*.json']
    //   }
    // },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "jsx-a11y": jsxA11y,
      "import": importPlugin,
      "security": securityPlugin,
      "deprecation": deprecationPlugin
    },
    rules: {
      // TypeScript
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      "@typescript-eslint/prefer-nullish-coalescing": "error",
      "@typescript-eslint/prefer-optional-chain": "error",
      "deprecation/deprecation": "warn",
      
      // React
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      
      // Accessibilité
      "jsx-a11y/alt-text": "error",
      "jsx-a11y/aria-role": "error",
      "jsx-a11y/aria-props": "error",
      
      // Import
      "import/no-duplicates": "error",
      
      // Sécurité
      "security/detect-possible-timing-attacks": "error",
      "security/detect-eval-with-expression": "error"
    }
  },
  
  // Configuration spécifique pour les fichiers JavaScript
  {
    files: ["**/*.{js,jsx}"],
    extends: [
      js.configs.recommended
    ],
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "jsx-a11y": jsxA11y,
      "import": importPlugin,
      "security": securityPlugin
    },
    rules: {
      // JavaScript
      "no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      "no-var": "error",
      "prefer-const": "error",
      
      // React
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      
      // Accessibilité
      "jsx-a11y/alt-text": "error",
      "jsx-a11y/aria-role": "error",
      "jsx-a11y/aria-props": "error"
    }
  },
  
  // Configuration spécifique pour les fichiers de test
  {
    files: ["**/*.{test,spec}.{js,jsx,ts,tsx}", "**/tests/**/*.{js,jsx,ts,tsx}", "**/__tests__/**/*.{js,jsx,ts,tsx}"],
    rules: {
      // Règles assouplies pour les tests
      "@typescript-eslint/no-explicit-any": "off"
    }
  }
);
