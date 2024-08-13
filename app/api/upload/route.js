import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request) {
    try {
        // تبدیل درخواست به FormData
        const formData = new FormData();
        const file = await request.formData();  // دریافت داده‌های فرم

        // اضافه کردن فایل به FormData
        formData.append('file', file.get('file')); 

        // دریافت توکن از هدر
        const token = request.headers.get('Authorization')?.split(' ')[1];
        
        if (!token) {
            return NextResponse.json({ error: 'Token is required' }, { status: 401 });
        }

        // ارسال درخواست به API دیگر
        const response = await axios({
            url: 'https://evtopback.liara.run/api/v1/chat/upload/',
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
            data: formData,
        });

        // بازگرداندن پاسخ
        return NextResponse.json(response.data);

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
