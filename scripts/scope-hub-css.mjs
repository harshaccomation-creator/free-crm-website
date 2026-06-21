import fs from 'node:fs';

const scope = '.salesflow-hub-root';
const raw = fs.readFileSync('src/salesflow-hub/index.css', 'utf8');

const imports = [];
let css = raw.replace(/@import\s+url\([^)]+\)\s*;/g, (match) => {
  imports.push(match);
  return '';
});

css = css.replace(/@import\s+"tailwindcss"\s*;/g, '');
css = css.replace(/@theme\s*\{[\s\S]*?\}/g, '');

function sanitizeSelector(selector) {
  return selector
    .replace(/\.([a-zA-Z_-]+)-\[#([0-9a-fA-F]+)\]/g, '[class*="$1-[#$2]"]')
    .replace(/\.([a-zA-Z_-]+)-\\\[\\#([0-9a-fA-F]+)\\\]/g, '[class*="$1-[#$2]"]');
}

function scopeSelectors(selectors) {
  return selectors
    .split(',')
    .map((part) => {
      const trimmed = part.trim();
      if (!trimmed) return '';
      if (trimmed.startsWith('@')) return trimmed;
      if (trimmed.startsWith(scope)) return sanitizeSelector(trimmed);
      return sanitizeSelector(`${scope} ${trimmed}`);
    })
    .filter(Boolean)
    .join(', ');
}

function scopeCss(input) {
  let out = '';
  let i = 0;

  while (i < input.length) {
    const nextAt = input.indexOf('@', i);
    const nextBrace = input.indexOf('{', i);

    if (nextAt !== -1 && nextAt < nextBrace) {
      const atRuleStart = nextAt;
      let j = atRuleStart;
      while (j < input.length && input[j] !== '{' && input[j] !== ';') j += 1;

      if (input[j] === ';') {
        out += input.slice(atRuleStart, j + 1);
        i = j + 1;
        continue;
      }

      const header = input.slice(atRuleStart, j).trim();
      let depth = 0;
      let k = j;
      while (k < input.length) {
        if (input[k] === '{') depth += 1;
        if (input[k] === '}') {
          depth -= 1;
          if (depth === 0) {
            const inner = input.slice(j + 1, k);
            out += `${header} {${scopeCss(inner)}}`;
            i = k + 1;
            break;
          }
        }
        k += 1;
      }
      continue;
    }

    if (nextBrace === -1) {
      out += input.slice(i);
      break;
    }

    const selectors = input.slice(i, nextBrace).trim();
    let depth = 0;
    let k = nextBrace;
    while (k < input.length) {
      if (input[k] === '{') depth += 1;
      if (input[k] === '}') {
        depth -= 1;
        if (depth === 0) {
          const body = input.slice(nextBrace + 1, k);
          out += `${scopeSelectors(selectors)} {${body}}`;
          i = k + 1;
          break;
        }
      }
      k += 1;
    }
  }

  return out;
}

const scoped = `${imports.join('\n')}\n${scopeCss(css)}`;
fs.writeFileSync('src/salesflow-hub/hubScoped.css', scoped);
console.log('Wrote scoped CSS');
