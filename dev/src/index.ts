import { TextTemplate } from '../../src/index';
import marked from 'marked';

import readmeText from 'raw-loader!../../readme.md';
import masterConfig from '../../master.json';
import packageConfig from '../../src/package.json';

const data = {
    ...masterConfig,
    package: packageConfig
}

console.log('data:', data);

const slotTemplate = new TextTemplate(readmeText, {
    behavior: 'slot',
    language: 'readme'
});
const template = new TextTemplate(slotTemplate.render(data));
const renderedText = template.render(data);

document.getElementById('rendered-readme')
    .innerHTML = marked.parse(renderedText);