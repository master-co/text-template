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
        slotEnd: ''
    };

    constructor(
        private sourceString: string,
        options?: TemplateOptions
    ) {
        if (options) {
            Object.assign(this.options, options);
        }
    }

    render(data: Record<string, any>) {
        if (!this.sourceString)
            return '';

        const options = this.options, // for less file size
            keys = Object.keys(data),
            values = Object.values(data),
            fn = function (key) {
                return new Function(
                    ...keys,
                    `
                    return ${key} ?? '';
                `)(...values);
            };

        let result = this.sourceString.replace(
            new RegExp(options.start + '(.*?)' + options.end, 'gm'),
            (_, v1: string) => {
                try {
                    return fn(v1.trim());
                } catch (ex) {
                    return '#error#';
                }
            });

        const slotSEs = options.slotStart && options.slotEnd
            ? [[options.slotStart, options.slotEnd]]
            : commentSyntaxesMap[(options.language in commentSyntaxesMap) ? options.language : ''];
        for (const eachSlotSE of slotSEs) {
            const slotStart = escapeRegex(eachSlotSE[0]),
                slotEnd = escapeRegex(eachSlotSE[1]);
            result = result.replace(
                new RegExp(slotStart + '(.*?)' + slotEnd + '(.*?)' + slotStart + slotEnd, 'gm'),
                (_, v1: string) => {

                    let value: string;
                    try {
                        value = fn(v1.trim());
                    } catch (ex) {
                        value = '#error#';
                    }

                    return eachSlotSE[0] + v1 + eachSlotSE[1] + value + eachSlotSE[0] + eachSlotSE[1];;
                });
        }

        return result;
    }
}