// show visibility or access as a single character at the beginning of each property or method
export function convertVisibility(v) {
    switch (v) {
        case 'public':
            return '+';
        case 'private':
            return '-';
        case 'protected':
            return '#';
        case 'package':
            return '~';
        default:
            return v;
    }
}