# تقرير تسليم Production — أبا غالية وآمنه

**تاريخ التحقق:** 15 أغسطس 2026

## النتيجة

أصبحت نسخة الـ Web مستقلة عن Manus وقابلة للتشغيل محليًا أو عبر أي استضافة Static SPA تدعم إعادة كتابة المسارات إلى `index.html`. لا تعتمد النسخة الحالية على قاعدة بيانات أو API خارجي؛ تحفظ بيانات المهام والمواعيد والحركات المالية والمظهر محليًا في متصفح المستخدم عبر `localStorage`.

## الروابط

| العنصر | الرابط أو القيمة |
| --- | --- |
| GitHub Repository | [github.com/herrelemy/personal-operating-system](https://github.com/herrelemy/personal-operating-system) |
| رابط Vercel العام المتاح | [personal-operating-system-ioqb.vercel.app](https://personal-operating-system-ioqb.vercel.app/) |
| فرع GitHub | `main` |
| مشروع Vercel المرتبط | `aba-ghalia-amina-web-live` |

الرابط العام الظاهر داخل About في مستودع GitHub يعمل ويعرض التطبيق دون تسجيل دخول. توجد أيضًا Deployment URL أحدث أنشأها Vercel، لكنها كانت محمية بتحويل إلى تسجيل الدخول في Vercel ولم تعتمد كالرابط العام النهائي للمستخدم.

## التقنية وإعدادات البناء

| الإعداد | القيمة |
| --- | --- |
| Framework | React 19 + TypeScript + Vite |
| Package manager | pnpm |
| Install Command | `pnpm install --frozen-lockfile` |
| Build Command | `pnpm build` |
| Output Directory | `dist` |
| SPA Rewrite | كل المسارات إلى `/index.html` عبر `vercel.json` |
| Node.js | إصدار حديث يدعم Vite 7، ويفضل Node 20 أو أحدث |

## متغيرات البيئة

الإصدار الحالي لا يحتاج إلى أسرار أو مفاتيح API كي يعمل. ملف `.env.example` موجود للتوثيق فقط، ويحتوي على `VITE_APP_NAME` وقيم اختيارية معلقة لـ `VITE_API_BASE_URL` و`VITE_SENTRY_DSN` و`VITE_ANALYTICS_ENDPOINT` و`VITE_ANALYTICS_WEBSITE_ID`. يجب عدم وضع أسرار حقيقية في متغيرات تبدأ بـ `VITE_` لأنها تصل إلى المتصفح أثناء البناء.

## الاختبارات المنفذة

نجح اختبار Vitest الذي يغطي القراءة والكتابة في `localStorage` والقيم الافتراضية وتوليد المعرّفات. كما نجح فحص TypeScript عبر `pnpm check` وبناء الإنتاج عبر `pnpm build`، وخرج مجلد `dist` دون أخطاء.

تم اختبار رابط الإنتاج العام بتحميل الصفحة الرئيسية ومسارات `/tasks` و`/finance` و`/calendar` و`/habits` مباشرة. كما تم فتح نموذج المصروف وتعبئته وحفظ حركة اختبارية، وظهر إشعار النجاح وتحدّث الرصيد وقائمة الحركات. لم تظهر صفحة 404 أثناء هذه الاختبارات، كما اجتاز التطبيق اختبار Console المحلي دون أخطاء Runtime.

## التشغيل على جهاز آخر

```bash
git clone https://github.com/herrelemy/personal-operating-system.git
cd personal-operating-system
cp .env.example .env.local
pnpm install --frozen-lockfile
pnpm check
pnpm test
pnpm build
pnpm dev
```

للتشغيل الإنتاجي محليًا بعد البناء:

```bash
pnpm preview
```

## النقل خارج Manus

يتضمن المستودع المصدر الكامل والمكوّنات والصفحات والأصول والخطوط المحلية وملفات إعداد Vite وVercel و`package.json` و`pnpm-lock.yaml` و`.env.example` وREADME واختبار التخزين. تم استبعاد `node_modules` و`dist` و`.git` والملفات المؤقتة وملفات الأسرار من حزمة ZIP، ويمكن إعادة إنشائها بالأوامر السابقة.

## ملاحظات تشغيلية

لا تتضمن هذه النسخة تسجيل دخول أو مزامنة بين الأجهزة؛ هذه نتيجة مقصودة لاستقلالية النسخة الحالية عن Manus. إذا أضيفت المزامنة مستقبلًا، فيجب إنشاء Backend آمن مستقل وتخزين مفاتيحه في Environment Variables على Vercel دون رفعها إلى GitHub.

## المراجع

[1]: https://github.com/herrelemy/personal-operating-system "GitHub repository"
[2]: https://personal-operating-system-ioqb.vercel.app/ "Public Vercel deployment"
