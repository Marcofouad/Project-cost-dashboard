/**
 * تقوم بحساب الفرق بين التكلفة المخططة والفعلية 
 * وتحديث لوحة التحكم بالنتيجة والحالة.
 */
function calculateCost() {
    // 1. جلب القيم من حقول الإدخال
    const plannedCostInput = document.getElementById('planned-cost').value;
    const actualCostInput = document.getElementById('actual-cost').value;

    // تحويل القيم إلى أرقام
    const plannedCost = parseFloat(plannedCostInput);
    const actualCost = parseFloat(actualCostCostInput);

    // التحقق من صحة الإدخالات
    if (isNaN(plannedCost) || isNaN(actualCost)) {
        alert("الرجاء إدخال قيم رقمية صالحة لكلا التكلفتين.");
        return;
    }

    // 2. الحساب: الفرق = المخططة - الفعلية
    // (النتيجة الموجبة تعني توفير/تحت الميزانية، والنتيجة السالبة تعني تجاوز/فوق الميزانية)
    const difference = plannedCost - actualCost;

    // 3. تحديث واجهة المستخدم بالنتيجة
    const differenceOutput = document.getElementById('difference-output');
    const statusOutput = document.getElementById('status-output');

    // عرض الفرق
    differenceOutput.textContent = difference.toLocaleString('ar-EG', { style: 'currency', currency: 'EGP', maximumFractionDigits: 2 });
    
    // إزالة فئات الحالة القديمة
    statusOutput.classList.remove('status-good', 'status-bad', 'status-neutral');

    // تحديد الحالة بناءً على الفرق وتطبيق التنسيق المناسب
    let statusText = '';

    if (difference > 0) {
        statusText = 'توفير (تحت الميزانية)';
        statusOutput.classList.add('status-good');
    } else if (difference < 0) {
        statusText = 'تجاوز (فوق الميزانية)';
        statusOutput.classList.add('status-bad');
    } else {
        statusText = 'متساوي (على الميزانية)';
        statusOutput.classList.add('status-neutral');
    }

    statusOutput.textContent = statusText;
}

// تشغيل الدالة تلقائيًا عند تحميل الصفحة لملء النتائج الافتراضية
document.addEventListener('DOMContentLoaded', calculateCost);