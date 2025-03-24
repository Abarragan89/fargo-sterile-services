export function formatDate(date: Date | string): string {
    if (!date) return ''; // Return an empty string if date is undefined

    const newDate = new Date(date)
    const year = newDate.getFullYear();
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const month = monthNames[newDate.getMonth()]; // Get month name from the array
    const day = newDate.getDate();

    return `${month} ${day}, ${year}`;
}