import { readFileSync } from 'node:fs';

import stylelint from 'stylelint';

const ruleName = 'football/scoped-scss';
const messages = stylelint.utils.ruleMessages(ruleName, {
  expected: 'Vue style blocks must use <style scoped lang="scss">',
});

const rule = (enabled) => (root, result) => {
  if (!enabled) {
    return;
  }

  const file = root.source?.input.file;
  if (!file?.endsWith('.vue')) {
    return;
  }

  const source = readFileSync(file, 'utf8');
  const styleTags = source.matchAll(/<style\b([^>]*)>/giu);

  for (const [, attributes] of styleTags) {
    const isScoped = /\bscoped\b/iu.test(attributes);
    const isScss = /\blang=(["'])scss\1/iu.test(attributes);

    if (!isScoped || !isScss) {
      stylelint.utils.report({
        message: messages.expected,
        node: root,
        result,
        ruleName,
      });
    }
  }
};

rule.ruleName = ruleName;
rule.messages = messages;

export default stylelint.createPlugin(ruleName, rule);
