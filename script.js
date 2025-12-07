/**
 * إضافة صف جديد إلى جدول التكاليف لإدخال بند جديد.
 */
function addRow() {
    const tableBody = document.querySelector('#cost-table tbody');
    const newRow = document.createElement('tr');
    newRow.classList.add('cost-row');
    
    // نموذج لصف جديد
    newRow.innerHTML = `
        <td><input type="text" placeholder="اسم البند الجديد"></td>
        <td><input type="number" class="planned-cost" value="0"></td>
        <td><input type="number" class="actual-cost" value="0"></td>
        <td><button onclick="removeRow(this)" class="remove-button">-</button></td>
    `;
    
    tableBody.appendChild(newRow);
}

/**
 * حذف صف من جدول التكاليف.
 * @param {HTMLElement} button - زر الحذف الذي تم النقر عليه.
 */
function removeRow(button) {
    const row = button.closest('.cost-row');
    if (row) {
        row.remove();
        // إعادة الحساب مباشرة بعد الحذف
        calculateCost(); 
    }
}

/**
 * حساب إجمالي التكاليف ومؤشرات الأداء والتوقعات.
 */
function calculateCost() {
    // 1. جلب بيانات الصفوف وإجراء الحسابات الأولية
    const rows = document.querySelectorAll('.cost-row');
    let totalPlannedCost = 0; // إجمالي التكلفة المخططة (Budget At Completion - BAC)
    let totalActualCost = 0;  // إجمالي التكلفة الفعلية (Actual Cost - AC)
    
    rows.forEach(row => {
        const plannedInput = row.querySelector('.planned-cost');
        const actualInput = row.querySelector('.actual-cost');
        
        // التحقق من صلاحية القيم قبل إضافتها
        const planned = parseFloat(plannedInput.value) || 0;
        const actual = parseFloat(actualInput.value) || 0;
        
        totalPlannedCost += planned; 
        totalActualCost += actual;
    });

    // جلب تقدير التكلفة المتبقية (Estimate To Complete - ETC/EOT)
    const remainingEstimateInput = document.getElementById('remaining-estimate').value;
    const remainingEstimate = parseFloat(remainingEstimateInput) || 0;


    // 2. الحسابات الرئيسية للمؤشرات (EVM Formulas)
    
    // انحراف التكلفة (Cost Variance - CV)
    // في هذا المثال نستخدم BAC - AC كبديل مبسط لـ EV - AC.
    // (افتراض أن العمل المنجز يساوي المخطط)
    const costVariance = totalPlannedCost - totalActualCost; 
    
    // الميزانية المتبقية لإكمال العمل (Budget Remaining - BVAC)
    const budgetRemaining = totalPlannedCost - totalActualCost; 

    // تقدير التكلفة عند الانتهاء (Estimate At Completion - EAC/FAC)
    // الصيغة المبسطة: EAC = AC + ETC
    const estimateAtCompletion = totalActualCost + remainingEstimate;

    // تقدير الوقت عند الانتهاء (Estimate To Complete - ETC/EOT)
    // نستخدم قيمة المدخل المباشر كتقدير
    const estimateToComplete = remainingEstimate; 


    // 3. تحديث واجهة المستخدم بالنتائج

    // دالة مساعدة لتنسيق العملة
    const formatCurrency = (amount) => {
        // إذا كان الرقم سالبًا، نعرضه بين قوسين بالنمط المحاسبي
        const sign = amount < 0 ? '-' : '';
        const absoluteAmount = Math.abs(amount);
        return sign + absoluteAmount.toLocaleString('ar-EG', { 
            style: 'currency', 
            currency: 'EGP', 
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
    };

    // تحديث مؤشرات الأداء الأساسية
    document.getElementById('bac-output').textContent = formatCurrency(totalPlannedCost);
    document.getElementById('ac-output').textContent = formatCurrency(totalActualCost);
    document.getElementById('cv-output').textContent = formatCurrency(costVariance);
    document.getElementById('bvac-output').textContent = formatCurrency(budgetRemaining);
    
    // تحديث مؤشرات التوقع (EAC/FAC و ETC/EOT)
    document.getElementById('eac-output').textContent = formatCurrency(estimateAtCompletion);
    document.getElementById('etc-output').textContent = formatCurrency(estimateToComplete);
    
    // تحديد الحالة العامة
    const statusOutput = document.getElementById('status-output');
    statusOutput.classList.remove('status-good', 'status-bad', 'status-neutral');

    let statusText = '';
    if (costVariance > 0) {
        statusText = 'أداء جيد (تحت الميزانية)';
        statusOutput.classList.add('status-good');
    } else if (costVariance < 0) {
        statusText = 'تجاوز الميزانية (يجب المراجعة)';
        statusOutput.classList.add('status-bad');
    } else {
        statusText = 'متساوي مع الميزانية';
        statusOutput.classList.add('status-neutral');
    }

    statusOutput.textContent = statusText;
}

// تشغيل الدالة تلقائيًا عند تحميل الصفحة 
document.addEventListener('DOMContentLoaded', calculateCost);