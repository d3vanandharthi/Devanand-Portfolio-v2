/**
 * Simple obfuscation utility to avoid storing plain text keys.
 * Note: This is NOT encryption, but obfuscation. 
 * It prevents basic scraping and human-readable exposure.
 */

const SHIFT = 3;

export const obfuscate = (str: string): string => {
    return str
        .split("")
        .map((char) => String.fromCharCode(char.charCodeAt(0) + SHIFT))
        .reverse()
        .join("");
};

export const deobfuscate = (str: string): string => {
    return str
        .split("")
        .reverse()
        .map((char) => String.fromCharCode(char.charCodeAt(0) - SHIFT))
        .join("");
};
