<br><br>
<p align="center">
    <img src="https://raw.githubusercontent.com/master-style/package/document/images/logo-and-text.svg" alt="logo" width="142">
</p>
<p align="center">
    <b><!-- name --><!-- --></b>
</p>
<p align="center"><!-- package.description --><!-- --></p>
<p align="center">
<!-- badges.map((badge) => `<a href="${badge.href}"><img src="${badge.src}" alt="${badge.alt}"></a>`).join('&nbsp;')-->
<!-- -->
</p>

###### CONTENTS
- [Install](#install)
  - [CDN](#cdn)
- [Usage](#usage)
  - [Getting start](#getting-start)
    - [Behaviors of default options](#behaviors-of-default-options)
  - [Replace with data tokens](#replace-with-data-tokens)
  - [Insert with slot tokens](#insert-with-slot-tokens)
  - [Combo above behaviors](#combo-above-behaviors)
- [Custom `start` and `end` token](#custom-start-and-end-token)
- [Tokenize with js syntax](#tokenize-with-js-syntax)
- [Remove token when errors occur](#remove-token-when-errors-occur)
- [Custom identification delimiter](#custom-identification-delimiter)
- [Options](#options)

# Install
```sh
npm install @master/text-template
```
## CDN
<!-- cdns.map((cdn) => `\n- [${cdn.name}](${cdn.href})`).join('') -->
<!-- -->

# Usage
## Getting start
```ts
import { TextTemplate } from '@master/text-template';
```
### Behaviors of default [options](#options)
```ts
const template = new TextTemplate(text);
```
equal to
```ts
const template = new TextTemplate(text, {
    start: '{{',
    end: '}}',
    behavior: '', // replace
    language: '', // /* data */ /* */,
    removeOnError: false,
    delimiter: ' ',
});
```

## Replace with data tokens
```ts
const template = new TextTemplate('Hi {{ username }}');
const renderedText = template.render({ username: 'Aron' });
```
output `renderedText`:
```ts
Hi Aron
```

## Insert with slot tokens
```ts
const html = `
    <title>
        <!-- title --><!-- -->
    <title>
`;
const template = new TextTemplate(html, {
    behavior: 'slot',
    language: 'html'
});
const renderedHtml = template.render({ title: 'Hello World' });
```
output `renderedHtml`:
```html
<title>
    <!-- title -->Hello World<!-- -->
<title>
```
The slot token isn't removed, which means you can keep result and render multiple times.

## Combo above behaviors
```ts
const readmeText = `
    # Hi {{ username }}
    <!-- description --><!-- -->
`;

const data = {
    username: 'Aron',
    description: 'Hello World {{ username }}'
}

// 1. Insert
const slotTemplate = new TextTemplate(readmeText, {
    behavior: 'slot',
    language: 'readme'
});

// 2. Replace
const template = new TextTemplate(slotTemplate.render(data));

const renderedReadmeText = template.render(data);
```
output `renderedReadmeText`:
```md
# Hi Aron
<!-- description -->Hello World<!-- -->
```

# Custom `start` and `end` token
```ts
const template = new TextTemplate('Hi ${ username }', {
    start: '${',
    end: '}'
});
```

# Tokenize with js syntax
```ts
const data = {
    people:  ['Aron', 'Joy']
}
const text = `/* people.join(' ❤️ ') */ /* */`;
const template = new TextTemplate(text);
const renderedText = template.render(data);
```
output `renderedText`
```ts
/* people.join(' ❤️ ') */ Aron ❤️ Joy /* */
```

# Remove token when errors occur
`removeOnError: true`
```ts
const text = 'Hi {{ username }}, welcome.';
const data = {};
const t1 = new TextTemplate(text);
const t2 = new TextTemplate(text, { removeOnError: true });
const r1 = t1.render(data);
const r2 = t2.render(data);
```
output `r1`
```
Hi {{ username }}, welcome.
```
output `r2`
```
Hi , welcome.
```

# Custom identification delimiter
default
```ts
const template = new TextTemplate(html, {
    behavior: 'slot',
    language: 'html'
});
```

```html
<title><!-- name --><!-- --></title>
```

custom
```ts
const template = new TextTemplate(html, {
    behavior: 'slot',
    language: 'html',
    delimiter: ' / ' 
});
```

```html
<title><!-- name --><!-- / --></title>
```

# Options
The default values of all options are `undefined`, and each has a default behavior.
- `start` Default `{{`. Replace or slot start token
- `end` Default `}}`. Replace or slot end token
- `behavior` Default *replace*. Specify render behavior
- `language` Required `behavior: 'slot'`. Specify using comment language to set  `start` and `end` quickly.
  - `''` relative to `/* data */ /* */` as default
  - `'html'`, `readme` relative to `<!-- data --> <!-- -->`
  - `'pascal'` relative to `(* data *) (* *)` or `{ data } { }`
  - `'forth'` relative to `( data ) ()`
  - `'haskell'` relative to `{- data -} {- -}`
- `delimiter` Default ` `. Required `behavior: 'slot'`. Specify middle delimiter for identifying end
- `removeOnError` Default `false`. If `true`, the token will be removed when the data doesn't match or js syntax go wrong. 
