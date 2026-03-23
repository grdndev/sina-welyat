const firstOfMonth = () => {
    const firstOfMonth = new Date();
    firstOfMonth.setDate(1);
    firstOfMonth.setHours(0, 0, 0, 0);
    return firstOfMonth;
}

module.exports = {
    firstOfMonth,
}