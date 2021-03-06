import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import { IDateProvider } from "../IDateProvider";

dayjs.extend(utc);

class DayJsDateProvider implements IDateProvider {
    compareInHours(startDate: Date, endDate: Date): number {
        const endDateUTC = this.convertToUTC(endDate);
        const startDateUTC = this.convertToUTC(startDate);

        return dayjs(endDateUTC).diff(startDateUTC, "hours");
    }

    compareInDays(startDate: Date, endDate: Date): number {
        const endDateUTC = this.convertToUTC(endDate);
        const startDateUTC = this.convertToUTC(startDate);

        return dayjs(endDateUTC).diff(startDateUTC, "days");
    }

    compareIfBefore(startDate: Date, endDate: Date): boolean {
        return dayjs(startDate).isBefore(endDate);
    }

    convertToUTC(date: Date): string {
        return dayjs(date).utc().local().format();
    }

    dateNow(): Date {
        return dayjs().toDate();
    }

    addDays(days: number): Date {
        return dayjs().add(days, "days").toDate();
    }

    addHours(hours: number): Date {
        return dayjs().add(hours, "hour").toDate();
    }
}

export { DayJsDateProvider };
