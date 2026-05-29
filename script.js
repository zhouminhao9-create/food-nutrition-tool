// DOM 元素
const homePage = document.getElementById('homePage');
const recordPage = document.getElementById('recordPage');
const resultPage = document.getElementById('resultPage');
const historyPage = document.getElementById('historyPage');

const startRecordBtn = document.getElementById('startRecordBtn');
const viewHistoryBtn = document.getElementById('viewHistoryBtn');
const settingsBtn = document.getElementById('settingsBtn');
const backToHomeBtn = document.getElementById('backToHomeBtn');
const backToRecordBtn = document.getElementById('backToRecordBtn');
const backFromHistoryBtn = document.getElementById('backFromHistoryBtn');
const newRecordBtn = document.getElementById('newRecordBtn');

const imageInputCamera = document.getElementById('imageInputCamera');
const imageInputGallery = document.getElementById('imageInputGallery');
const uploadArea = document.getElementById('uploadArea');
const previewContainer = document.getElementById('previewContainer');
const previewImage = document.getElementById('previewImage');
const deleteImageBtn = document.getElementById('deleteImageBtn');

// 用餐分类元素
const mealCategoryRadios = document.querySelectorAll('input[name="mealCategory"]');
const suggestionToggle = document.getElementById('suggestionToggle');
const suggestionModeRadios = document.querySelectorAll('input[name="suggestionMode"]');

// 时间和备注
const mealTimeInput = document.getElementById('mealTime');
const mealNoteInput = document.getElementById('mealNote');

// 食材/调料输入
const ingredientsTextarea = document.getElementById('ingredients');
const seasoningsTextarea = document.getElementById('seasonings');
const ingredientsSuggestions = document.getElementById('ingredientsSuggestions');

const submitBtn = document.getElementById('submitBtn');
const loadingOverlay = document.getElementById('loadingOverlay');
const loadingText = document.getElementById('loadingText');

const uploadMenuOverlay = document.getElementById('uploadMenuOverlay');
const takePhotoBtn = document.getElementById('takePhotoBtn');
const chooseFromGalleryBtn = document.getElementById('chooseFromGalleryBtn');
const cancelUploadBtn = document.getElementById('cancelUploadBtn');

const favIngredientsTags = document.getElementById('favIngredientsTags');
const favSeasoningsTags = document.getElementById('favSeasoningsTags');
const clearFavIngredients = document.getElementById('clearFavIngredients');
const clearFavSeasonings = document.getElementById('clearFavSeasonings');

const resultImageContainer = document.getElementById('resultImageContainer');
const resultImage = document.getElementById('resultImage');
const positiveNutrients = document.getElementById('positiveNutrients');
const gapNutrients = document.getElementById('gapNutrients');
const suggestionsList = document.getElementById('suggestionsList');
const mealTypeBadge = document.getElementById('mealTypeBadge');

const resultMealCategory = document.getElementById('resultMealCategory');
const resultMealTime = document.getElementById('resultMealTime');
const resultNoteRow = document.getElementById('resultNoteRow');
const resultMealNote = document.getElementById('resultMealNote');

// 收起/展开按钮
const expandPositive = document.getElementById('expandPositive');
const expandGap = document.getElementById('expandGap');
const expandSuggestions = document.getElementById('expandSuggestions');

const gapCard = document.getElementById('gapCard');
const suggestionsCard = document.getElementById('suggestionsCard');

const calendarTitle = document.getElementById('calendarTitle');
const calendarDays = document.getElementById('calendarDays');
const prevMonthBtn = document.getElementById('prevMonthBtn');
const nextMonthBtn = document.getElementById('nextMonthBtn');
const dailyTitle = document.getElementById('dailyTitle');
const recordsList = document.getElementById('recordsList');

// 设置弹窗
const settingsOverlay = document.getElementById('settingsOverlay');
const closeSettingsBtn = document.getElementById('closeSettingsBtn');
const resetMemoryBtn = document.getElementById('resetMemoryBtn');
const clearCacheBtn = document.getElementById('clearCacheBtn');
const clearAllBtn = document.getElementById('clearAllBtn');

// 编辑弹窗
const editOverlay = document.getElementById('editOverlay');
const closeEditBtn = document.getElementById('closeEditBtn');
const cancelEditBtn = document.getElementById('cancelEditBtn');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
const confirmEditBtn = document.getElementById('confirmEditBtn');

const editMealCategoryRadios = document.querySelectorAll('input[name="editMealCategory"]');
const editMealTime = document.getElementById('editMealTime');
const editMealNote = document.getElementById('editMealNote');
const editIngredients = document.getElementById('editIngredients');
const editSeasonings = document.getElementById('editSeasonings');

// 当前图片数据
let currentImageData = null;

// 当前分析结果
let currentAnalysisResult = null;

// 当前编辑的记录ID
let editingRecordId = null;

// 历史记录数据
let historyRecords = JSON.parse(localStorage.getItem('nutritionRecords')) || [];

// 常用食材/调料记录
let favoriteIngredients = JSON.parse(localStorage.getItem('favoriteIngredients')) || [];
let favoriteSeasonings = JSON.parse(localStorage.getItem('favoriteSeasonings')) || [];

// 时间行为数据（行为学习）
let timeBehaviorData = JSON.parse(localStorage.getItem('timeBehaviorData')) || [];

// 当前选中的日期
let currentDate = new Date();
let selectedDate = null;

// 正餐时段定义
const mealTimeRanges = {
    breakfast: { start: 6, end: 10 },
    lunch: { start: 11, end: 14 },
    dinner: { start: 17, end: 21 }
};

// 分类名称映射
const categoryNames = {
    breakfast: '早餐',
    lunch: '午餐',
    dinner: '晚餐',
    snack: '下午茶/零食'
};

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initPage();
});

function initPage() {
    // 加载常用食材/调料
    loadFavoriteItems();
    
    // 设置默认时间
    const now = new Date();
    const timeStr = now.toTimeString().slice(0, 5);
    mealTimeInput.value = timeStr;
    
    // 根据行为学习自动选择分类
    autoSelectMealCategory();
    
    // 绑定事件
    bindEvents();
    
    // 显示首页
    showPage(homePage);
}

function bindEvents() {
    // 页面导航
    startRecordBtn.addEventListener('click', () => showPage(recordPage));
    viewHistoryBtn.addEventListener('click', () => {
        showPage(historyPage);
        renderCalendar();
    });
    settingsBtn.addEventListener('click', () => settingsOverlay.style.display = 'flex');
    backToHomeBtn.addEventListener('click', () => {
        resetRecordForm();
        showPage(homePage);
    });
    backToRecordBtn.addEventListener('click', () => showPage(recordPage));
    backFromHistoryBtn.addEventListener('click', () => showPage(homePage));
    newRecordBtn.addEventListener('click', () => {
        resetRecordForm();
        showPage(recordPage);
    });

    // 图片上传
    uploadArea.addEventListener('click', () => uploadMenuOverlay.style.display = 'flex');
    takePhotoBtn.addEventListener('click', () => {
        uploadMenuOverlay.style.display = 'none';
        imageInputCamera.click();
    });
    chooseFromGalleryBtn.addEventListener('click', () => {
        uploadMenuOverlay.style.display = 'none';
        imageInputGallery.click();
    });
    cancelUploadBtn.addEventListener('click', () => uploadMenuOverlay.style.display = 'none');
    
    imageInputCamera.addEventListener('change', handleImageSelect);
    imageInputGallery.addEventListener('change', handleImageSelect);
    deleteImageBtn.addEventListener('click', deleteImage);

    // 用餐分类选择
    mealCategoryRadios.forEach(radio => {
        radio.addEventListener('change', handleMealCategoryChange);
    });

    // 营养建议开关选择
    suggestionModeRadios.forEach(radio => {
        radio.addEventListener('change', handleSuggestionModeChange);
    });

    // 食材输入联想
    ingredientsTextarea.addEventListener('input', showIngredientSuggestions);
    ingredientsTextarea.addEventListener('blur', () => {
        setTimeout(() => ingredientsSuggestions.classList.remove('show'), 200);
    });

    // 常用食材/调料勾选
    clearFavIngredients.addEventListener('click', () => {
        favoriteIngredients = [];
        saveFavorites();
        loadFavoriteItems();
    });
    clearFavSeasonings.addEventListener('click', () => {
        favoriteSeasonings = [];
        saveFavorites();
        loadFavoriteItems();
    });

    // 提交分析
    submitBtn.addEventListener('click', submitAnalysis);

    // 收起/展开功能
    expandPositive.addEventListener('click', () => toggleExpand(positiveNutrients, expandPositive));
    expandGap.addEventListener('click', () => toggleExpand(gapNutrients, expandGap));
    expandSuggestions.addEventListener('click', () => toggleExpand(suggestionsList, expandSuggestions));

    // 日历导航
    prevMonthBtn.addEventListener('click', () => {
        currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
        renderCalendar();
    });
    nextMonthBtn.addEventListener('click', () => {
        currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
        renderCalendar();
    });

    // 设置弹窗
    closeSettingsBtn.addEventListener('click', () => settingsOverlay.style.display = 'none');
    resetMemoryBtn.addEventListener('click', resetBehaviorMemory);
    clearCacheBtn.addEventListener('click', clearImageCache);
    clearAllBtn.addEventListener('click', clearAllData);

    // 编辑弹窗
    closeEditBtn.addEventListener('click', () => editOverlay.style.display = 'none');
    cancelEditBtn.addEventListener('click', () => editOverlay.style.display = 'none');
    confirmDeleteBtn.addEventListener('click', deleteCurrentRecord);
    confirmEditBtn.addEventListener('click', saveEditRecord);
}

function handleMealCategoryChange() {
    const selectedCategory = getSelectedMealCategory();
    
    if (selectedCategory === 'snack') {
        // 下午茶/零食：隐藏营养建议开关，固定仅查看成分
        suggestionToggle.style.display = 'none';
    } else {
        // 正餐：显示营养建议开关
        suggestionToggle.style.display = 'block';
        // 默认选中"需要建议"
        document.querySelector('input[name="suggestionMode"][value="suggest"]').checked = true;
    }
}

function handleSuggestionModeChange() {
    // 可以在这里添加额外的处理逻辑
}

function getSelectedMealCategory() {
    const selected = document.querySelector('input[name="mealCategory"]:checked');
    return selected ? selected.value : null;
}

function getSelectedSuggestionMode() {
    const selected = document.querySelector('input[name="suggestionMode"]:checked');
    return selected ? selected.value : 'suggest';
}

function autoSelectMealCategory() {
    const hour = new Date().getHours();
    const pattern = detectBehaviorPattern(hour);
    
    if (pattern) {
        // 使用行为学习结果
        const radio = document.querySelector(`input[name="mealCategory"][value="${pattern}"]`);
        if (radio) radio.checked = true;
    } else {
        // 根据当前时间自动选择
        let defaultCategory = 'lunch';
        if (hour >= 6 && hour < 10) {
            defaultCategory = 'breakfast';
        } else if (hour >= 11 && hour < 14) {
            defaultCategory = 'lunch';
        } else if (hour >= 17 && hour < 21) {
            defaultCategory = 'dinner';
        }
        
        const radio = document.querySelector(`input[name="mealCategory"][value="${defaultCategory}"]`);
        if (radio) radio.checked = true;
    }
    
    // 触发分类变化处理
    handleMealCategoryChange();
}

function detectBehaviorPattern(currentHour) {
    if (timeBehaviorData.length < 3) return null;
    
    // 按时段分组统计
    const patternCount = {};
    const timeWindow = 2; // 时间窗口为2小时
    
    timeBehaviorData.forEach(record => {
        const hour = new Date(record.timestamp).getHours();
        const category = record.category;
        
        // 只考虑计入统计的数据
        if (!record.excludeFromStats) {
            if (!patternCount[category]) {
                patternCount[category] = 0;
            }
            patternCount[category]++;
        }
    });
    
    // 找到最频繁的分类
    let maxCount = 0;
    let bestPattern = null;
    
    Object.keys(patternCount).forEach(category => {
        if (patternCount[category] >= 3 && patternCount[category] > maxCount) {
            maxCount = patternCount[category];
            bestPattern = category;
        }
    });
    
    return bestPattern;
}

function handleImageSelect(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            currentImageData = event.target.result;
            previewImage.src = currentImageData;
            previewContainer.style.display = 'block';
            uploadArea.style.display = 'none';
        };
        reader.readAsDataURL(file);
    }
}

function deleteImage() {
    currentImageData = null;
    previewContainer.style.display = 'none';
    uploadArea.style.display = 'flex';
    imageInputCamera.value = '';
    imageInputGallery.value = '';
}

function showIngredientSuggestions() {
    const input = ingredientsTextarea.value.trim();
    if (!input) {
        ingredientsSuggestions.classList.remove('show');
        return;
    }
    
    const filtered = favoriteIngredients.filter(item => 
        item.toLowerCase().includes(input.toLowerCase())
    ).slice(0, 5);
    
    if (filtered.length > 0) {
        ingredientsSuggestions.innerHTML = filtered.map(item => 
            `<div class="suggestion-item" onclick="insertIngredient('${item}')">${item}</div>`
        ).join('');
        ingredientsSuggestions.classList.add('show');
    } else {
        ingredientsSuggestions.classList.remove('show');
    }
}

function insertIngredient(item) {
    const currentValue = ingredientsTextarea.value.trim();
    ingredientsTextarea.value = currentValue ? `${currentValue}、${item}` : item;
    ingredientsSuggestions.classList.remove('show');
}

function loadFavoriteItems() {
    // 加载常用食材
    if (favoriteIngredients.length > 0) {
        favIngredientsTags.innerHTML = favoriteIngredients.map(item => 
            `<span class="favorite-tag" onclick="addIngredient('${item}', 'ingredients')">${item}</span>`
        ).join('');
        clearFavIngredients.style.display = 'block';
    } else {
        favIngredientsTags.innerHTML = '<span class="no-favorites">暂无常用食材</span>';
        clearFavIngredients.style.display = 'none';
    }
    
    // 加载常用调料
    if (favoriteSeasonings.length > 0) {
        favSeasoningsTags.innerHTML = favoriteSeasonings.map(item => 
            `<span class="favorite-tag" onclick="addIngredient('${item}', 'seasonings')">${item}</span>`
        ).join('');
        clearFavSeasonings.style.display = 'block';
    } else {
        favSeasoningsTags.innerHTML = '<span class="no-favorites">暂无常用调料</span>';
        clearFavSeasonings.style.display = 'none';
    }
}

function addIngredient(item, type) {
    const textarea = type === 'ingredients' ? ingredientsTextarea : seasoningsTextarea;
    const currentValue = textarea.value.trim();
    textarea.value = currentValue ? `${currentValue}、${item}` : item;
    textarea.focus();
}

function saveFavorites() {
    localStorage.setItem('favoriteIngredients', JSON.stringify(favoriteIngredients));
    localStorage.setItem('favoriteSeasonings', JSON.stringify(favoriteSeasonings));
}

function updateFavorites() {
    const ingredients = ingredientsTextarea.value.trim();
    const seasonings = seasoningsTextarea.value.trim();
    
    if (ingredients) {
        ingredients.split(/[,，、\n]/).forEach(item => {
            const trimmed = item.trim();
            if (trimmed && !favoriteIngredients.includes(trimmed)) {
                favoriteIngredients.push(trimmed);
            }
        });
        // 限制数量
        favoriteIngredients = [...new Set(favoriteIngredients)].slice(0, 20);
    }
    
    if (seasonings) {
        seasonings.split(/[,，、\n]/).forEach(item => {
            const trimmed = item.trim();
            if (trimmed && !favoriteSeasonings.includes(trimmed)) {
                favoriteSeasonings.push(trimmed);
            }
        });
        favoriteSeasonings = [...new Set(favoriteSeasonings)].slice(0, 20);
    }
    
    saveFavorites();
    loadFavoriteItems();
}

function submitAnalysis() {
    const category = getSelectedMealCategory();
    const suggestionMode = getSelectedSuggestionMode();
    
    if (!category) {
        showToast('请选择用餐分类');
        return;
    }
    
    const ingredients = ingredientsTextarea.value.trim();
    if (!ingredients && !currentImageData) {
        showToast('请上传图片或输入食材');
        return;
    }
    
    // 显示加载
    loadingText.textContent = '分析中...';
    loadingOverlay.style.display = 'flex';
    
    // 模拟分析延迟
    setTimeout(() => {
        const result = analyzeNutrition(ingredients, seasoningsTextarea.value.trim());
        
        // 记录行为学习数据（仅当需要建议时）
        const excludeFromStats = (category === 'snack') || (suggestionMode === 'viewOnly');
        if (!excludeFromStats) {
            recordBehavior(category);
        }
        
        // 更新常用食材
        updateFavorites();
        
        // 保存记录
        const record = {
            id: Date.now(),
            timestamp: Date.now(),
            category: category,
            mealTime: mealTimeInput.value,
            note: mealNoteInput.value.trim(),
            ingredients: ingredients,
            seasonings: seasoningsTextarea.value.trim(),
            image: currentImageData,
            analysis: result,
            excludeFromStats: excludeFromStats,
            suggestionMode: suggestionMode
        };
        
        historyRecords.unshift(record);
        localStorage.setItem('nutritionRecords', JSON.stringify(historyRecords));
        
        // 显示结果
        showResult(result, record);
        loadingOverlay.style.display = 'none';
        showPage(resultPage);
    }, 1500);
}

function recordBehavior(category) {
    const behaviorRecord = {
        timestamp: Date.now(),
        category: category,
        excludeFromStats: false
    };
    
    timeBehaviorData.push(behaviorRecord);
    
    // 只保留最近30天的数据
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    timeBehaviorData = timeBehaviorData.filter(r => r.timestamp > thirtyDaysAgo);
    
    localStorage.setItem('timeBehaviorData', JSON.stringify(timeBehaviorData));
}

function analyzeNutrition(ingredients, seasonings) {
    const allItems = ingredients + '、' + seasonings;
    return nutritionAnalyzer.analyze(allItems);
}

function showResult(result, record) {
    currentAnalysisResult = result;
    
    // 设置餐食信息
    resultMealCategory.textContent = categoryNames[record.category];
    resultMealTime.textContent = record.mealTime;
    
    if (record.note) {
        resultMealNote.textContent = record.note;
        resultNoteRow.style.display = 'flex';
    } else {
        resultNoteRow.style.display = 'none';
    }
    
    // 显示图片
    if (record.image) {
        resultImage.src = record.image;
        resultImageContainer.style.display = 'block';
    } else {
        resultImageContainer.style.display = 'none';
    }
    
    // 根据分类和模式决定显示内容
    const category = record.category;
    const suggestionMode = record.suggestionMode;
    const showSuggestions = (category !== 'snack') && (suggestionMode === 'suggest');
    
    // 显示营养成分
    positiveNutrients.innerHTML = result.positive.map(nutrient => 
        `<div class="nutrient-tag">${nutrient.name}</div>`
    ).join('');
    
    if (result.gap.length > 0) {
        gapNutrients.innerHTML = result.gap.map(nutrient => 
            `<div class="nutrient-tag gap">${nutrient.name}</div>`
        ).join('');
        gapCard.style.display = 'block';
    } else {
        gapCard.style.display = 'none';
    }
    
    // 显示补充建议（仅正餐+需要建议模式）
    if (showSuggestions && result.suggestions.length > 0) {
        suggestionsList.innerHTML = result.suggestions.map(suggestion => 
            `<div class="suggestion-item">${suggestion}</div>`
        ).join('');
        suggestionsCard.style.display = 'block';
    } else {
        suggestionsCard.style.display = 'none';
    }
    
    // 更新标签
    mealTypeBadge.textContent = categoryNames[category];
    mealTypeBadge.className = `meal-type-badge ${category === 'snack' ? 'non-meal' : 'meal'}`;
    mealTypeBadge.style.display = 'block';
}

function toggleExpand(element, button) {
    element.classList.toggle('expanded');
    element.classList.toggle('collapsed');
    button.classList.toggle('collapsed');
}

function resetRecordForm() {
    // 重置图片
    deleteImage();
    
    // 重置分类选择
    autoSelectMealCategory();
    
    // 重置输入
    ingredientsTextarea.value = '';
    seasoningsTextarea.value = '';
    mealNoteInput.value = '';
    
    // 重置时间为当前时间
    const now = new Date();
    mealTimeInput.value = now.toTimeString().slice(0, 5);
}

function showPage(page) {
    [homePage, recordPage, resultPage, historyPage].forEach(p => p.style.display = 'none');
    page.style.display = 'block';
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 2000);
}

function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    calendarTitle.textContent = `${year}年${month + 1}月`;
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    
    let html = '';
    
    // 空白日期
    for (let i = 0; i < startDay; i++) {
        html += '<div class="calendar-day empty"></div>';
    }
    
    // 日期格子
    for (let i = 1; i <= daysInMonth; i++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        const hasRecords = historyRecords.some(r => {
            const rDate = new Date(r.timestamp);
            return rDate.toISOString().split('T')[0] === dateStr;
        });
        
        const isToday = isSameDate(new Date(), new Date(year, month, i));
        const isSelected = selectedDate && isSameDate(selectedDate, new Date(year, month, i));
        
        html += `
            <div class="calendar-day ${hasRecords ? 'has-records' : ''} ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}" 
                 onclick="selectDate('${dateStr}')">${i}</div>
        `;
    }
    
    calendarDays.innerHTML = html;
}

function isSameDate(date1, date2) {
    return date1.toDateString() === date2.toDateString();
}

function selectDate(dateStr) {
    selectedDate = new Date(dateStr);
    renderCalendar();
    showDailyRecords(dateStr);
}

function showDailyRecords(dateStr) {
    const dayRecords = historyRecords.filter(r => {
        const rDate = new Date(r.timestamp);
        return rDate.toISOString().split('T')[0] === dateStr;
    });
    
    dailyTitle.textContent = `${dateStr} 的记录`;
    
    if (dayRecords.length > 0) {
        recordsList.innerHTML = dayRecords.map(record => `
            <div class="history-item" onclick="showRecordDetail(${record.id})">
                ${record.image ? `<img src="${record.image}" alt="餐食">` : '<div class="no-image-icon">🍽️</div>'}
                <div class="history-info">
                    <span class="meal-type-tag meal-type-${record.category === 'snack' ? 'non-meal' : 'meal'}">${categoryNames[record.category]}</span>
                    <h4>${record.ingredients || '未记录食材'}</h4>
                    <p>${record.mealTime}</p>
                </div>
                <div class="history-actions">
                    <button class="action-btn edit" onclick="event.stopPropagation(); editRecord(${record.id})">✏️</button>
                </div>
            </div>
        `).join('');
    } else {
        recordsList.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📝</div>
                <p>当日暂无记录</p>
            </div>
        `;
    }
}

function showRecordDetail(recordId) {
    const record = historyRecords.find(r => r.id === recordId);
    if (record) {
        showResult(record.analysis, record);
        showPage(resultPage);
    }
}

function editRecord(recordId) {
    editingRecordId = recordId;
    const record = historyRecords.find(r => r.id === recordId);
    
    if (record) {
        // 设置表单值
        const radio = document.querySelector(`input[name="editMealCategory"][value="${record.category}"]`);
        if (radio) radio.checked = true;
        
        editMealTime.value = record.mealTime || '12:00';
        editMealNote.value = record.note || '';
        editIngredients.value = record.ingredients || '';
        editSeasonings.value = record.seasonings || '';
        
        editOverlay.style.display = 'flex';
    }
}

function deleteCurrentRecord() {
    if (editingRecordId !== null) {
        historyRecords = historyRecords.filter(r => r.id !== editingRecordId);
        localStorage.setItem('nutritionRecords', JSON.stringify(historyRecords));
        editOverlay.style.display = 'none';
        showToast('记录已删除');
        
        // 刷新日历和记录列表
        if (selectedDate) {
            const dateStr = selectedDate.toISOString().split('T')[0];
            showDailyRecords(dateStr);
            renderCalendar();
        }
    }
}

function saveEditRecord() {
    if (editingRecordId !== null) {
        const recordIndex = historyRecords.findIndex(r => r.id === editingRecordId);
        if (recordIndex !== -1) {
            const category = document.querySelector('input[name="editMealCategory"]:checked').value;
            const oldRecord = historyRecords[recordIndex];
            
            // 更新记录
            historyRecords[recordIndex] = {
                ...oldRecord,
                category: category,
                mealTime: editMealTime.value,
                note: editMealNote.value,
                ingredients: editIngredients.value,
                seasonings: editSeasonings.value,
                excludeFromStats: category === 'snack'
            };
            
            localStorage.setItem('nutritionRecords', JSON.stringify(historyRecords));
            editOverlay.style.display = 'none';
            showToast('记录已更新');
            
            // 刷新日历和记录列表
            if (selectedDate) {
                const dateStr = selectedDate.toISOString().split('T')[0];
                showDailyRecords(dateStr);
                renderCalendar();
            }
        }
    }
}

// 设置功能
function resetBehaviorMemory() {
    timeBehaviorData = [];
    localStorage.setItem('timeBehaviorData', JSON.stringify(timeBehaviorData));
    settingsOverlay.style.display = 'none';
    showToast('行为学习记忆已重置');
}

function clearImageCache() {
    // 清除所有图片数据
    historyRecords = historyRecords.map(record => ({
        ...record,
        image: null
    }));
    localStorage.setItem('nutritionRecords', JSON.stringify(historyRecords));
    settingsOverlay.style.display = 'none';
    showToast('图片缓存已清空');
}

function clearAllData() {
    if (confirm('确定要清空所有数据吗？此操作不可恢复。')) {
        historyRecords = [];
        favoriteIngredients = [];
        favoriteSeasonings = [];
        timeBehaviorData = [];
        
        localStorage.setItem('nutritionRecords', JSON.stringify(historyRecords));
        localStorage.setItem('favoriteIngredients', JSON.stringify(favoriteIngredients));
        localStorage.setItem('favoriteSeasonings', JSON.stringify(favoriteSeasonings));
        localStorage.setItem('timeBehaviorData', JSON.stringify(timeBehaviorData));
        
        settingsOverlay.style.display = 'none';
        showToast('所有数据已清空');
    }
}