// DOM 元素
const homePage = document.getElementById('homePage');
const recordPage = document.getElementById('recordPage');
const resultPage = document.getElementById('resultPage');
const historyPage = document.getElementById('historyPage');

const startRecordBtn = document.getElementById('startRecordBtn');
const viewHistoryBtn = document.getElementById('viewHistoryBtn');
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
const ingredientsTextarea = document.getElementById('ingredients');
const seasoningsTextarea = document.getElementById('seasonings');
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

const calendarTitle = document.getElementById('calendarTitle');
const calendarDays = document.getElementById('calendarDays');
const prevMonthBtn = document.getElementById('prevMonthBtn');
const nextMonthBtn = document.getElementById('nextMonthBtn');
const dailyTitle = document.getElementById('dailyTitle');
const recordsList = document.getElementById('recordsList');

// 当前图片数据
let currentImageData = null;

// 当前分析结果
let currentAnalysisResult = null;

// 历史记录数据
let historyRecords = JSON.parse(localStorage.getItem('nutritionRecords')) || [];

// 常用食材/调料记录
let favoriteIngredients = JSON.parse(localStorage.getItem('favoriteIngredients')) || [];
let favoriteSeasonings = JSON.parse(localStorage.getItem('favoriteSeasonings')) || [];

// 当前选中的日期
let currentDate = new Date();
let selectedDate = null;

// 初始化页面
document.addEventListener('DOMContentLoaded', () => {
    renderFavorites();
    renderCalendar(currentDate);
});

// ========================================
// 页面导航
// ========================================
startRecordBtn.addEventListener('click', () => {
    homePage.style.display = 'none';
    recordPage.style.display = 'block';
});

viewHistoryBtn.addEventListener('click', () => {
    homePage.style.display = 'none';
    historyPage.style.display = 'block';
    selectedDate = null;
    renderCalendar(currentDate);
    renderDailyRecords(null);
});

backToHomeBtn.addEventListener('click', () => {
    recordPage.style.display = 'none';
    homePage.style.display = 'block';
    resetRecordForm();
});

backToRecordBtn.addEventListener('click', () => {
    resultPage.style.display = 'none';
    recordPage.style.display = 'block';
});

backFromHistoryBtn.addEventListener('click', () => {
    historyPage.style.display = 'none';
    homePage.style.display = 'block';
});

newRecordBtn.addEventListener('click', () => {
    resultPage.style.display = 'none';
    recordPage.style.display = 'block';
    resetRecordForm();
});

// 重置表单
function resetRecordForm() {
    currentImageData = null;
    ingredientsTextarea.value = '';
    seasoningsTextarea.value = '';
    previewContainer.style.display = 'none';
    uploadArea.style.display = 'flex';
}

// ========================================
// 上传菜单
// ========================================
uploadArea.addEventListener('click', (e) => {
    e.preventDefault();
    showUploadMenu();
});

takePhotoBtn.addEventListener('click', (e) => {
    e.preventDefault();
    hideUploadMenu();
    imageInputCamera.click();
});

chooseFromGalleryBtn.addEventListener('click', (e) => {
    e.preventDefault();
    hideUploadMenu();
    imageInputGallery.click();
});

cancelUploadBtn.addEventListener('click', (e) => {
    e.preventDefault();
    hideUploadMenu();
});

uploadMenuOverlay.addEventListener('click', (e) => {
    if (e.target === uploadMenuOverlay) {
        hideUploadMenu();
    }
});

function showUploadMenu() {
    uploadMenuOverlay.style.display = 'flex';
}

function hideUploadMenu() {
    uploadMenuOverlay.style.display = 'none';
}

// ========================================
// 图片处理
// ========================================
imageInputCamera.addEventListener('change', handleImageUpload);
imageInputGallery.addEventListener('change', handleImageUpload);

function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
        if (file.size > 10 * 1024 * 1024) {
            showToast('图片大小不能超过 10MB');
            imageInputCamera.value = '';
            imageInputGallery.value = '';
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            currentImageData = e.target.result;
            previewImage.src = currentImageData;
            uploadArea.style.display = 'none';
            previewContainer.style.display = 'block';
            imageInputCamera.value = '';
            imageInputGallery.value = '';
        };
        reader.onerror = () => {
            showToast('图片读取失败，请重试');
        };
        reader.readAsDataURL(file);
    }
}

deleteImageBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    currentImageData = null;
    previewContainer.style.display = 'none';
    uploadArea.style.display = 'flex';
});

// ========================================
// 常用食材/调料功能
// ========================================
function renderFavorites() {
    // 渲染常用食材
    if (favoriteIngredients.length > 0) {
        clearFavIngredients.style.display = 'block';
        favIngredientsTags.innerHTML = favoriteIngredients.map(item => 
            `<span class="favorite-tag" data-value="${item}">${item}</span>`
        ).join('');
    } else {
        clearFavIngredients.style.display = 'none';
        favIngredientsTags.innerHTML = '<span style="color: #999; font-size: 0.9rem;">暂无常用食材</span>';
    }

    // 渲染常用调料
    if (favoriteSeasonings.length > 0) {
        clearFavSeasonings.style.display = 'block';
        favSeasoningsTags.innerHTML = favoriteSeasonings.map(item => 
            `<span class="favorite-tag" data-value="${item}">${item}</span>`
        ).join('');
    } else {
        clearFavSeasonings.style.display = 'none';
        favSeasoningsTags.innerHTML = '<span style="color: #999; font-size: 0.9rem;">暂无常用调料</span>';
    }

    // 添加点击事件
    document.querySelectorAll('.favorites-tags .favorite-tag').forEach(tag => {
        tag.addEventListener('click', function() {
            const value = this.dataset.value;
            const parentId = this.parentElement.id;
            
            if (parentId === 'favIngredientsTags') {
                const current = ingredientsTextarea.value.trim();
                ingredientsTextarea.value = current ? `${current}、${value}` : value;
            } else {
                const current = seasoningsTextarea.value.trim();
                seasoningsTextarea.value = current ? `${current}、${value}` : value;
            }
        });
    });
}

clearFavIngredients.addEventListener('click', () => {
    favoriteIngredients = [];
    localStorage.setItem('favoriteIngredients', JSON.stringify(favoriteIngredients));
    renderFavorites();
});

clearFavSeasonings.addEventListener('click', () => {
    favoriteSeasonings = [];
    localStorage.setItem('favoriteSeasonings', JSON.stringify(favoriteSeasonings));
    renderFavorites();
});

// ========================================
// 提交分析
// ========================================
submitBtn.addEventListener('click', () => {
    const ingredients = ingredientsTextarea.value.trim();
    const seasonings = seasoningsTextarea.value.trim();

    if (!ingredients && !currentImageData) {
        showToast('请输入食材或上传图片');
        return;
    }

    // 保存到常用列表
    saveToFavorites(ingredients, 'ingredients');
    saveToFavorites(seasonings, 'seasonings');

    // 显示加载状态
    loadingText.textContent = '分析中...';
    loadingOverlay.style.display = 'flex';

    setTimeout(() => {
        const result = analyzeNutrition(ingredients, seasonings);
        currentAnalysisResult = result;
        
        // 保存记录
        saveRecord(ingredients, seasonings, currentImageData, result);
        
        // 显示结果
        displayAnalysisResult(result);
        
        // 隐藏加载
        loadingOverlay.style.display = 'none';
        
        // 切换页面
        recordPage.style.display = 'none';
        resultPage.style.display = 'block';
        
        // 滚动到顶部
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1200);
});

// 保存到常用列表
function saveToFavorites(input, type) {
    if (!input) return;
    
    const items = input.split(/[,，、\s]+/).filter(item => item.trim());
    const favorites = type === 'ingredients' ? favoriteIngredients : favoriteSeasonings;
    const storageKey = type === 'ingredients' ? 'favoriteIngredients' : 'favoriteSeasonings';
    
    items.forEach(item => {
        if (!favorites.includes(item) && favorites.length < 15) {
            favorites.push(item);
        }
    });
    
    if (type === 'ingredients') {
        favoriteIngredients = favorites;
    } else {
        favoriteSeasonings = favorites;
    }
    
    localStorage.setItem(storageKey, JSON.stringify(favorites));
    renderFavorites();
}

// ========================================
// 显示分析结果
// ========================================
function displayAnalysisResult(result) {
    // 显示图片
    if (currentImageData) {
        resultImage.src = currentImageData;
        resultImageContainer.style.display = 'block';
    } else {
        resultImageContainer.style.display = 'none';
    }

    // 显示营养充足项
    const allPositive = [...result.macroNutrients, ...result.microNutrients];
    if (allPositive.length > 0) {
        positiveNutrients.innerHTML = allPositive.map(nutrient => 
            `<span class="nutrient-tag">✅ ${nutrient}</span>`
        ).join('');
    } else {
        positiveNutrients.innerHTML = '<span style="color: #999;">未检测到营养成分</span>';
    }

    // 显示营养缺口
    if (result.missingNutrients.length > 0) {
        gapNutrients.innerHTML = result.missingNutrients.map(item => 
            `<span class="nutrient-tag gap">⚠️ ${item.name}</span>`
        ).join('');
    } else {
        gapNutrients.innerHTML = '<span style="color: #4caf50; font-weight: 600;">🎉 营养均衡</span>';
    }

    // 显示补充建议
    if (result.missingNutrients.length > 0) {
        suggestionsList.innerHTML = result.missingNutrients.map(item => 
            `<div class="suggestion-item">${item.suggestion}</div>`
        ).join('');
    } else {
        suggestionsList.innerHTML = '<div style="text-align: center; color: #4caf50; padding: 16px;">营养均衡，无需额外补充</div>';
    }
}

// ========================================
// 保存记录
// ========================================
function saveRecord(ingredients, seasonings, imageData, result) {
    const record = {
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().slice(0, 8),
        ingredients,
        seasonings,
        image: imageData,
        result: {
            macroNutrients: result.macroNutrients,
            microNutrients: result.microNutrients,
            missingNutrients: result.missingNutrients
        }
    };
    
    historyRecords.unshift(record);
    if (historyRecords.length > 100) {
        historyRecords = historyRecords.slice(0, 100);
    }
    
    localStorage.setItem('nutritionRecords', JSON.stringify(historyRecords));
}

// ========================================
// 日历视图
// ========================================
function renderCalendar(date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    calendarTitle.textContent = `${year}年${month + 1}月`;
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDay = firstDay.getDay();
    
    let html = '';
    
    // 上月空白
    for (let i = 0; i < startDay; i++) {
        html += '<span class="calendar-day other-month"></span>';
    }
    
    // 本月日期
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const hasRecord = historyRecords.some(r => r.date === dateStr);
        const isToday = dateStr === todayStr;
        const isSelected = selectedDate === dateStr;
        
        let className = 'calendar-day';
        if (isToday) className += ' today';
        if (isSelected) className += ' selected';
        if (hasRecord) className += ' has-record';
        
        html += `<span class="${className}" data-date="${dateStr}">${day}</span>`;
    }
    
    calendarDays.innerHTML = html;
    
    // 添加点击事件
    document.querySelectorAll('.calendar-day:not(.other-month)').forEach(dayEl => {
        dayEl.addEventListener('click', () => {
            selectedDate = dayEl.dataset.date;
            renderCalendar(date);
            renderDailyRecords(selectedDate);
        });
    });
}

prevMonthBtn.addEventListener('click', () => {
    currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    renderCalendar(currentDate);
});

nextMonthBtn.addEventListener('click', () => {
    currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    renderCalendar(currentDate);
});

function renderDailyRecords(dateStr) {
    if (!dateStr) {
        dailyTitle.textContent = '选择日期查看记录';
        recordsList.innerHTML = '<div class="empty-state"><div class="empty-icon">📝</div><p>暂无记录</p></div>';
        return;
    }
    
    const date = new Date(dateStr);
    const formattedDate = `${date.getMonth() + 1}月${date.getDate()}日`;
    dailyTitle.textContent = formattedDate;
    
    const dayRecords = historyRecords.filter(r => r.date === dateStr);
    
    if (dayRecords.length > 0) {
        recordsList.innerHTML = dayRecords.map(record => `
            <div class="history-item" data-id="${record.id}">
                ${record.image ? `<img src="${record.image}" alt="餐食照片">` : '<div class="no-image">📷</div>'}
                <div class="history-info">
                    <h4>${record.ingredients || '无食材记录'}</h4>
                    <div class="history-time">${record.time}</div>
                </div>
                <button class="history-delete" data-id="${record.id}" aria-label="删除记录">×</button>
            </div>
        `).join('');
        
        // 添加点击和删除事件
        document.querySelectorAll('.history-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (e.target.classList.contains('history-delete')) return;
                const id = parseInt(item.dataset.id);
                const record = historyRecords.find(r => r.id === id);
                if (record) {
                    viewRecordDetail(record);
                }
            });
        });
        
        document.querySelectorAll('.history-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = parseInt(btn.dataset.id);
                deleteRecord(id);
            });
        });
    } else {
        recordsList.innerHTML = '<div class="empty-state"><div class="empty-icon">📝</div><p>当日暂无记录</p></div>';
    }
}

function viewRecordDetail(record) {
    currentImageData = record.image;
    currentAnalysisResult = record.result;
    
    displayAnalysisResult(record.result);
    
    historyPage.style.display = 'none';
    resultPage.style.display = 'block';
}

function deleteRecord(id) {
    historyRecords = historyRecords.filter(r => r.id !== id);
    localStorage.setItem('nutritionRecords', JSON.stringify(historyRecords));
    renderDailyRecords(selectedDate);
    renderCalendar(currentDate);
    showToast('已删除');
}

// ========================================
// Toast提示
// ========================================
function showToast(message) {
    const existingToast = document.querySelector('.toast-message');
    if (existingToast) {
        existingToast.remove();
    }
    
    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s';
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}