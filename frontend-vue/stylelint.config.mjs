import order from 'stylelint-order';

import scopedScss from './stylelint-rules/scoped-scss.mjs';

const bemClassPattern =
  '^[a-z][a-z0-9]*(?:-[a-z0-9]+)*(?:__[a-z0-9]+(?:-[a-z0-9]+)*)?(?:--[a-z0-9]+(?:-[a-z0-9]+)*)?$';

export default {
  extends: [
    'stylelint-config-standard-scss',
    'stylelint-config-recommended-vue/scss',
  ],
  plugins: [order, scopedScss],
  rules: {
    'declaration-block-no-redundant-longhand-properties': null,
    'football/scoped-scss': true,
    'max-nesting-depth': 3,
    'order/order': ['custom-properties', 'declarations', 'rules', 'at-rules'],
    'selector-class-pattern': [
      bemClassPattern,
      {
        message:
          'Expected class selector to follow kebab-case BEM: block__element--modifier',
        resolveNestedSelectors: true,
      },
    ],
  },
};
