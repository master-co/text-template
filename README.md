<br><br>
<p align="center">
    <img src="https://raw.githubusercontent.com/master-style/package/document/images/logo-and-text.svg" alt="logo" width="142">
</p>
<p align="center">
    <b><!-- name -->text-template<!-- --></b>
</p>
<p align="center"><!-- package.description -->Tokenize any texts and render with data<!-- --></p>
<p align="center"><!-- badges.map((badge) => `<a href="${badge.href}"><img src="${badge.src}" alt="${badge.alt}"></a>`).join('&nbsp;')--><a href="https://circleci.com/gh/master-style/workflows/text-template/tree/main"><img src="https://img.shields.io/circleci/build/github/master-style/text-template/main.svg?logo=circleci&logoColor=fff&label=CircleCI" alt="CI status"></a>&nbsp;<a href="https://www.npmjs.com/@master/text-template"><img src="https://img.shields.io/npm/v/@master/text-template.svg?logo=npm&logoColor=fff&label=NPM&color=limegreen" alt="npm"></a>&nbsp;<a href="https://github.com/master-style/text-template/blob/main/LICENSE"><img src="https://img.shields.io/github/license/master-style/text-template" alt="license"></a><!-- --></p>

###### CONTENTS
- [Install](#install)
  - [CDN](#cdn)
- [Usage](#usage)
  - [Getting start](#getting-start)
  - [Replace with data tokens](#replace-with-data-tokens)
  - [Insert with slot tokens](#insert-with-slot-tokens)
  - [Combo above behaviors](#combo-above-behaviors)
- [Custom your `start` and `end` token](#custom-your-start-and-end-token)
- [Tokenize with js syntax](#tokenize-with-js-syntax)
- [Remove token when errors occur](#remove-token-when-errors-occur)
- [Options](#options)

# Install
```sh
npm install @master/text-template
```
## CDN
<!-- cdns.map((cdn) => `\n- [${cdn.name}](${cdn.href})`).join('') -->
- [jsdelivr](https://www.jsdelivr.com/package/npm/@master/text-template)
- [unpkg](https://unpkg.com/@master/text-template)<!-- -->

# Usage
## Getting start
```ts
import { TextTemplate } from '@master/text-template';
```
default options overview
```ts
const template = new TextTemplate(text, {
    start: undefined, // '{{'
    end: undefined, // '}}'
    behavior: undefined, // replace
    language: undefined, // /* data */ /* */,
    removeOnError: undefined // false
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
    description: 'Hello World'
}

const slotTemplate = new TextTemplate(readmeText, {
    behavior: 'slot',
    language: 'readme'
});

const template = new TextTemplate(slotTemplate.render(data));
const renderedReadmeText = template.render(data);
```
output `renderedReadmeText`:
```md
# Hi Aron
<!-- description -->Hello World<!-- -->
```

# Custom your `start` and `end` token
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
const text = 'Hi {{ username }}';
const data = {};
const t1 = new TextTemplate(text);
const t2 = new TextTemplate(text, { removeOnError: true });
const t1Result = t1.render(data);
const t2Result = t2.render(data);
```
output `t1Result`
```
Hi {{ username }}
```
output `t2Result`
```
Hi 
```

# Options
- `start` replace or slot start token
- `end` replace or slot end token
- `behavior` specify render behavior
- `language` require `behavior: 'slot'`. Specify using comment language to set  `start` and `end` quickly.
  - `''` slot token `/* data */ /* */`
  - `'html'` slot token `<!-- data --> <!-- -->`
  - `'readme'` slot token `<!-- data --> <!-- -->`
  - `'pascal'` slot token `(* data *) (* *)` or `{ data } { }`
  - `'forth'` slot token `( data ) ()`
  - `'haskell'` slot token `{- data -} {- -}`
- `removeOnError` default `false`. If `true`, the token will be removed when the data doesn't match or js syntax go wrong. 
