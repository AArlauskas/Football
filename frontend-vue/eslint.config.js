import eslint from '@eslint/js';
import { globalIgnores } from 'eslint/config';
import importPlugin from 'eslint-plugin-import';
import modulesNewlines from 'eslint-plugin-modules-newlines';
import playwright from 'eslint-plugin-playwright';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import unusedImports from 'eslint-plugin-unused-imports';
import eslintPluginVue from 'eslint-plugin-vue';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import parser from 'vue-eslint-parser';

const vitestGlobals = {
  vi: true,
  describe: true,
  it: true,
  test: true,
  expect: true,
  beforeEach: true,
  afterEach: true,
  beforeAll: true,
  afterAll: true,
};

const appGlobals = {
  ProcessOut: true,
  NodeJS: true,
  RequestInit: true,
  NodeListOf: true,
};

export default tseslint.config([
  globalIgnores([
    '**/node_modules',
    '**/dist',
    '**/*.d.ts',
    'public/*',
    'types/**/*',
    'autotests/**/*',
    'locales/*',
    'src/i18n/translations.json',
    '**/autotests',
    'autotests/*',
    'tools/**',
    'e2e-tests/test-reports/**',
    'e2e-tests/test-results/**',
    'e2e-tests/playwright/**',
  ]),
  eslint.configs.recommended,
  tseslint.configs.recommended,
  ...eslintPluginVue.configs['flat/recommended'],
  {
    plugins: {
      'modules-newlines': modulesNewlines,
      'unused-imports': unusedImports,
      import: importPlugin,
    },
    files: ['**/*.{mjs,js,ts,vue}', '*.{mjs,js,ts,vue}'],
    extends: [eslintPluginPrettierRecommended],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...vitestGlobals,
        ...appGlobals,
      },
      parser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        parser: tseslint.parser,
      },
    },
    settings: {
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts'],
      },
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
      },
    },
    rules: {
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          fixStyle: 'separate-type-imports',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-namespace': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          vars: 'all',
          args: 'after-used',
          caughtErrors: 'all',
          ignoreRestSiblings: true,
          varsIgnorePattern: '^_',
          argsIgnorePattern: '^_',
        },
      ],
      'dot-notation': 'error',
      eqeqeq: ['error', 'always'],
      'func-style': 'error',
      'import/extensions': [
        'error',
        'ignorePackages',
        {
          js: 'never',
          ts: 'never',
          vue: 'ignorePackages',
        },
      ],
      'import/first': 'error',
      'import/newline-after-import': [
        'error',
        {
          count: 1,
        },
      ],
      'import/no-cycle': [
        'warn',
        {
          maxDepth: Infinity,
          ignoreExternal: true,
        },
      ],
      'import/no-duplicates': 'error',
      'import/no-self-import': 'warn',
      'import/order': [
        'error',
        {
          'newlines-between': 'always',
          groups: ['builtin', 'external', 'internal', 'sibling', 'parent'],
          pathGroups: [
            {
              pattern: '@hostinger/**',
              group: 'external',
            },
            {
              pattern: '@/**',
              group: 'internal',
            },
          ],
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
          pathGroupsExcludedImportTypes: ['builtin'],
          distinctGroup: false,
        },
      ],
      'newline-before-return': ['error'],
      'no-array-constructor': 'error',
      'no-console': [
        'error',
        {
          allow: ['error', 'warn'],
        },
      ],
      'no-const-assign': 'error',
      'no-control-regex': 'off',
      'no-debugger': 'warn',
      'no-else-return': 'error',
      'no-empty': ['error', { allowEmptyCatch: true }],
      'no-loop-func': 'error',
      'no-nested-ternary': 'error',
      'no-new-func': 'error',
      'no-object-constructor': 'error',
      'no-param-reassign': [
        'error',
        {
          props: false,
        },
      ],
      'no-sparse-arrays': 'off',
      'no-unneeded-ternary': 'error',
      'no-useless-escape': 'off',
      'no-var': 'error',
      'object-shorthand': 'error',
      'prefer-const': 'error',
      'prefer-promise-reject-errors': 'error',
      'prefer-rest-params': 'error',
      'prefer-spread': 'error',
      'prefer-template': 'error',
      'prettier/prettier': [
        'error',
        {
          singleQuote: true,
          printWidth: 80,
          trailingComma: 'all',
          htmlWhitespaceSensitivity: 'ignore',
        },
      ],
      'unused-imports/no-unused-vars': [
        'error',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
      'vue/attribute-hyphenation': [
        'error',
        'always',
        {
          ignore: [
            'customError',
            'sideMenuFixed',
            'currentRoute',
            'backButton',
            'isFullHeight',
            'noPadding',
            'feedbackOpen',
            'sideMenuComponentFile',
            'feedbackDisabled',
            'closeButton',
          ],
        },
      ],
      'vue/block-order': [
        'error',
        {
          order: ['script[setup]', 'template', 'style'],
        },
      ],
      'vue/component-definition-name-casing': ['error', 'PascalCase'],
      'vue/component-name-in-template-casing': [
        'error',
        'PascalCase',
        {
          ignores: ['/^hp-/'],
          registeredComponentsOnly: true,
          globals: [
            'TransDeprecated',
            'HButtonV1',
            'HButton',
            'HPortlet',
            'StatusIcon',
            'HActionMenu',
            'HList',
            'HListItem',
            'HFormDeprecated',
            'HFormFieldDeprecated',
            'HLabel',
            'RouterView',
            'Component',
            'RouterLink',
          ],
        },
      ],
      'vue/html-self-closing': [
        'error',
        {
          html: {
            normal: 'always',
            void: 'any',
            component: 'always',
          },
        },
      ],
      'vue/match-component-file-name': [
        'error',
        {
          extensions: ['vue'],
          shouldMatchCase: false,
        },
      ],
      'vue/match-component-import-name': 'error',
      'vue/multi-word-component-names': 'off',
      'vue/no-v-html': 'off',
      'vue/order-in-components': 'off',
      'vue/require-explicit-emits': 'error',
    },
  },
  {
    name: 'e2e-tests-base',
    files: ['e2e-tests/**/*.{mjs,js,ts}'],
    extends: [eslintPluginUnicorn.configs['flat/recommended']],
    languageOptions: {
      globals: {
        ...globals.builtin,
        ...globals.nodeBuiltin,
      },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: `${import.meta.dirname}/e2e-tests`,
      },
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    settings: {
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts'],
      },
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './e2e-tests/tsconfig.json',
        },
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-imports': 'off',
      'func-style': 'off',
      'no-console': 'off',
      'unicorn/no-null': 'off',
      'unicorn/no-nested-ternary': 'off',
      'unicorn/prevent-abbreviations': [
        'error',
        {
          replacements: { env: false },
          ignore: ['i', 'j', 'k'],
        },
      ],
      'unicorn/filename-case': ['error', { case: 'kebabCase' }],
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['../*'],
              message: 'Use path alias (@/) instead of relative imports.',
            },
          ],
        },
      ],
      'vue/comment-directive': 'off',
    },
  },
  {
    name: 'e2e-tests-ts-node-scripts',
    files: ['e2e-tests/lib/**/*.ts', 'e2e-tests/scripts/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/*'],
              message:
                'Use relative imports in lib/ and scripts/ - these run via ts-node which does not support @/ aliases.',
            },
          ],
        },
      ],
    },
  },
  {
    name: 'e2e-tests-playwright',
    files: ['e2e-tests/tests/**/*.spec.ts'],
    ...playwright.configs['flat/recommended'],
    rules: {
      ...playwright.configs['flat/recommended'].rules,
      'playwright/expect-expect': 'off',
      'playwright/no-duplicate-hooks': 'error',
      'playwright/prefer-comparison-matcher': 'error',
      'playwright/prefer-equality-matcher': 'error',
      'playwright/prefer-hooks-in-order': 'warn',
      'playwright/prefer-hooks-on-top': 'warn',
      'playwright/prefer-lowercase-title': [
        'warn',
        { ignoreTopLevelDescribe: true },
      ],
      'playwright/prefer-native-locators': 'warn',
      'playwright/prefer-strict-equal': 'warn',
      'playwright/prefer-to-be': 'warn',
      'playwright/prefer-to-contain': 'warn',
      'playwright/prefer-to-have-count': 'warn',
      'playwright/prefer-to-have-length': 'warn',
      'playwright/require-hook': [
        'warn',
        {
          allowedFunctionCalls: ['setup'],
        },
      ],
      'playwright/require-top-level-describe': 'error',
      'playwright/no-skipped-test': [
        'error',
        {
          allowConditional: true,
        },
      ],
    },
  },
]);
