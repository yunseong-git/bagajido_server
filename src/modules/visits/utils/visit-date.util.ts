// visitedOn은 일반 timestamp가 아니라 @db.Date이므로 API에서도 YYYY-MM-DD를 유지해야 한다.

export function parseDateOnly(value: string): Date {
    return new Date(`${value}T00:00:00.000Z`);
}

export function formatDateOnly(value: Date): string {
    return value.toISOString().slice(0, 10);
}
