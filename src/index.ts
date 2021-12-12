import { TextTemplateOptions } from './interfaces/options';

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
    options: TextTemplateOptions = {};

    constructor(
        private text: string,
        options?: TextTemplateOptions
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
                return new Function(
                    ...keys,
                    `
                        return ${key} ?? '';
                    `)(...values);
            };

        if (options.behavior === 'slot') {
            const slotSEs = options.start && options.end
                ? [[options.start, options.end]]
                : commentSyntaxesMap[(options.language in commentSyntaxesMap) ? options.language : ''];
            for (const eachSlotSE of slotSEs) {
                const start = escapeRegex(eachSlotSE[0]),
                    end = escapeRegex(eachSlotSE[1]);
                try {
                    result = result.replace(
                        new RegExp(start + '(.*?)' + end + '(.*?)' + start + end, 'gms'),
                        (_, v1: string) => eachSlotSE[0] + v1 + eachSlotSE[1] + getValue(v1.trim()) + eachSlotSE[0] + eachSlotSE[1]);
                } catch {

                }
            }
        } else {
            const start = options.start || '{{';
            const end = options.end || '}}';
            try {
                result = this.text.replace(
                    new RegExp(escapeRegex(start) + '(.*?)' + escapeRegex(end), 'gms'),
                    (_, v1: string) => getValue(v1.trim()));
            } catch {

            }
        }

        return result;
    }
}