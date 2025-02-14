export function formatPhoneNumber(input: string) {
    // Remove all non-digit characters
    const digits = input.replace(/\D/g, '');

    // Limit input to 10 digits
    const limitedDigits = digits.slice(0, 10);

    // Format the phone number in the (XXX) XXX-XXXX style
    if (limitedDigits.length <= 3) {
        return `(${limitedDigits}`;
    } else if (limitedDigits.length <= 6) {
        return `(${limitedDigits.slice(0, 3)}) ${limitedDigits.slice(3)}`;
    } else {
        return `(${limitedDigits.slice(0, 3)}) ${limitedDigits.slice(3, 6)}-${limitedDigits.slice(6, 10)}`;
    }
}