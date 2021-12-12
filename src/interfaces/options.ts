export interface TextTemplateOptions {
    start?: string;
    end?: string;
    language?: 'html' | 'readme' | 'pascal' | 'forth' | 'haskell' | '';
    behavior?: '' | 'slot';
    removeOnError?: boolean;
};