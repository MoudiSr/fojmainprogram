import ArabicReshaper from 'arabic-reshaper';

export interface ArabicTextProps {
    text: string;
}

export function ArabicTextDisplay({ text }: ArabicTextProps) {
    const reshapedText = ArabicReshaper.convertArabic(text);
    return reshapedText
}

