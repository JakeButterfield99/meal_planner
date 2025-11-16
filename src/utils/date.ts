// Get the day suffix e.g. 10th, 1st etc.
export function GetDaySuffix(day: number): string {
    if (day >= 11 && day <= 13) return 'th';
    switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
    }
}

// Returns date string in format 'Monday 10 Nov'
export function GetDateText(date: Date): string {
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const day = date.getDate();
    const prefix = GetDaySuffix(day);
    return `${dayOfWeek} ${day}${prefix} ${month}`;
}

// Converts date ISO string to YYYY-MM-DD format
export function GetDateKey(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

// Converts date to short DDst/th/nd format
export function GetShortDate(date: Date): string {
    const day = date.getDate();

    return `${day}${GetDaySuffix(day)}`;
}

// Get all days of week from a given monday
export function GetWeekDates(mon: Date): Date[] {
    let dates = [mon];
    for (let idx = 1; idx < 7; idx++) {
        const new_date = new Date(mon);
        new_date.setDate(mon.getDate() + idx)
        dates.push(new_date);
    }
    return dates
}