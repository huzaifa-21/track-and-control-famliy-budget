# FinFam – Family Budget Management App

## Overview

**FinFam** هو تطبيق محمول يهدف إلى مساعدة الأسر في **إدارة ميزانياتها المالية** بشكل منظم وفعّال.  
يوفر التطبيق أدوات لتسجيل الدخل والمصروفات، تحليل البيانات المالية باستخدام رسوم بيانية، وتوليد تقارير دورية تساعد في اتخاذ قرارات مالية أفضل.

---

## Features

- **Authentication** باستخدام Firebase (إنشاء حساب / تسجيل الدخول).
- **إدارة محافظ مالية متعددة** (عائلية، شخصية…).
- **تسجيل المعاملات المالية** (دخل / مصروف) مع تفاصيل (التاريخ، الفئة، الملاحظات).
- **تحليل البيانات المالية** عبر رسوم بيانية تفاعلية (أسبوعية، شهرية، سنوية).
- **نظام التنبيهات** للتذكير بالتقارير.
- **دعم لغات متعددة** (النسخة الحالية بالإنجليزية مع خطط لدعم العربية).

---

## Tech Stack

- **Frontend:** React Native + NativeWind (Tailwind CSS for RN).
- **Backend & Database:** Firebase (Authentication + Firestore).
- **Data Visualization:** react-native-segmented-control / charts.
- **Development Tools:** Expo, TypeScript, VS Code.

---

## Database Structure (Firestore)

- **Users Collection:** uid, email, name, image.
- **Wallets Collection:** id, uid, name, amount, totalIncome, totalExpenses, created, image.
- **Transactions Collection:** id, walletId, type (income/expense), amount, category, date, description, image.

Relationships:

- User → Wallets → Transactions

---

## Installation & Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/huzaifa-21/track-and-control-famliy-budget.git
   cd "track-and-control-famliy-budget"
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Add your **Firebase config** inside `.env.local`:
   ```env
   EXPO_PUBLIC_FIREBASE_API_KEY="xxxx"
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN="xxxx"
   EXPO_PUBLIC_FIREBASE_PROJECT_ID="xxxx"
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET="xxxx"
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="xxxx"
   EXPO_PUBLIC_FIREBASE_APP_ID="xxxx"
   EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID="xxxx"
   ```
4. Run the project:
   ```bash
   npx expo start
   ```

---

## Testing

- **Functional Testing:** تسجيل الدخول، إضافة محفظة، تسجيل معاملة.
- **UI Testing:** التحقق من سهولة الاستخدام عبر أجهزة مختلفة.
- **Performance Testing:** تقييم سرعة الاستجابة واستهلاك الموارد.

---

## Future Improvements

- دعم كامل للغة العربية.
- ربط التطبيق بالحسابات البنكية.
- إمكانية مشاركة المحفظة بين عدة مستخدمين.
- تنبيهات ذكية عند تجاوز الميزانية المحددة.
- تطوير لوحة تحكم على الويب لمتابعة البيانات من الكمبيوتر.

---

## Credits

- Developed by: **Huzaifa Salaheldin Abdelrahman Ali**
- Supervisor: **Dr. Hanaa Mohamed kamal**
- University of Jordanian-Sudanese for Science & Technology – Software Engineering Dept.

---

## How to install

download the application for android from [here](https://drive.google.com/file/d/1BvQi415C0w-ylhv9B6FLeACQxpPQUEGU/view?usp=drive_link)
