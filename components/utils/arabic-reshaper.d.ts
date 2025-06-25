declare module 'arabic-reshaper' {
    const convertArabic: {
        reshape: (text: string) => string;
    };
    export = reshaper;
}