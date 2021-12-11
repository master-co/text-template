import { TemplateOptions } from './interfaces/options';

const commentSyntaxesMap = {
    pascal: [['(*', '*)'], ['{', '}']],
    forth: [['(', ')']],
    html: [['<!--', '-->']],
    readme: [['<!--', '-->']],
    haskell: [['{-', '-}']],
    '': [['/*', '*/']]
};

function escapeRegex(string) {
    return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

export class TextTemplate {
    options: TemplateOptions = {
        start: '{{',
        end: '}}',
        language: '',
        slotStart: '',
        slotEnd: '',
        behavior: ''
    };

    constructor(
        private text: string,
        options?: TemplateOptions
    ) {
        if (options) {
            Object.assign(this.options, options);
        }
    }

    render(data: Record<string, any>) {
        if (!this.text)
            return '';

        let result = this.text;

        const options = this.options, // for less file size
            keys = Object.keys(data),
            values = Object.values(data),
            getValue = (key: string) => {
                try {
                    return new Function(
                        ...keys,
                        `
                        return ${key} ?? '';
                    `)(...values);
                } catch (ex) {
                    return '#error#';
                }
            };

        if (options.behavior === 'slot') {
            const slotSEs = options.slotStart && options.slotEnd
                ? [[options.slotStart, options.slotEnd]]
                : commentSyntaxesMap[(options.language in commentSyntaxesMap) ? options.language : ''];
            for (const eachSlotSE of slotSEs) {
                const slotStart = escapeRegex(eachSlotSE[0]),
                    slotEnd = escapeRegex(eachSlotSE[1]);
                result = result.replace(
                    new RegExp(slotStart + '(.*?)' + slotEnd + '(.*?)' + slotStart + slotEnd, 'gms'),
                    (_, v1: string) => eachSlotSE[0] + v1 + eachSlotSE[1] + getValue(v1.trim()) + eachSlotSE[0] + eachSlotSE[1]);
            }
        } else {
            result = this.text.replace(
                new RegExp(escapeRegex(options.start) + '(.*?)' + escapeRegex(options.end), 'gms'),
                (_, v1: string) => getValue(v1.trim()));
        }

        return result;
    }
}