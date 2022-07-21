interface IDateProvider {
    compareInHours(startDate: Date, endDate: Date): number;
    compareInDays(startDate: Date, endDate: Date): number;
    convertToUTC(date: Date): string;
    dateNow(): Date;
    addDays(days: number): Date;
}

export { IDateProvider };
