import React from 'react';

const MessageTimestamp = ({ timestamp }) => {
    // تبدیل timestamp به شیء Date
    const date = new Date(timestamp);

    // بررسی صحت تبدیل Date
    if (isNaN(date.getTime())) {
        return 'Invalid date'; // نمایش پیام خطا در صورت تبدیل نادرست
    }

    // ایجاد یک شیء Intl.DateTimeFormat برای فرمت کردن زمان به منطقه زمانی "Asia/Tehran"
    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Tehran',
        hour: '2-digit',
        minute: '2-digit',
    });

    // فرمت کردن زمان به صورت ساعت:دقیقه:ثانیه
    const formattedTime = formatter.format(date);

    return formattedTime
};

export default MessageTimestamp;