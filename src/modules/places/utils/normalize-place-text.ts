/** 장소 문자열 정규화 유틸리티 */
export function normalizePlaceText(value: string): string {
    return value.normalize('NFKC').trim().toLowerCase().replace(/\s+/g, ' ');
}
