export interface TemplateOptions {
    start?: string;
    end?: string;
    language?: 'html' | 'readme' | 'pascal' | 'forth' | 'haskell' | '';
    slotStart?: string;
    slotEnd?: string;
    behavior?: '' |'slot'
};