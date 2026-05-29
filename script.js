// DOM 元素
const imageInput = document.getElementById('imageInput');
const uploadArea = document.getElementById('uploadArea');
const previewContainer = document.getElementById('previewContainer');
const previewImage = document.getElementById('previewImage');
const deleteImageBtn = document.getElementById('deleteImageBtn');
const ingredientsTextarea = document.getElementById('ingredients');
const seasoningsTextarea = document.getElementById('seasonings');
const submitBtn = document.getElementById('submitBtn');
const loading = document.getElementById('loading');
const analysisSection = document.getElementById('analysisSection');
const macroNutrientsList = document.getElementById('macroNutrients');
const microNutrientsList = document.getElementById('microNutrients');
const nutrientGap = document.getElementById('nutrientGap');
const historyList = document.getElementById('historyList');

// 当前图片数据
let currentImageData = null;

// 历史记录数据
let historyRecords = JSON.parse(localStorage.getItem('nutritionRecords')) || [];

// 初始化页面
document.addEventListener('DOMContentLoaded', () => {
    renderHistory();
    initMobileOptimizations();
});

// 移动端优化初始化
function initMobileOptimizations() {
    // 检测是否为触摸设备
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    
    if (isTouchDevice) {
        // 触摸设备优化
        document.body.classList.add('touch-device');
        
        // 防止双击缩放
        let lastTouchEnd = 0;
        document.addEventListener('touchend', (e) => {
            const now = Date.now();
            if (now - lastTouchEnd <= 300) {
                e.preventDefault();
            }
            lastTouchEnd = now;
        }, { passive: false });
    }

    // 检测是否为iOS设备
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS) {
        document.body.classList.add('ios-device');
        
        // iOS 键盘收起后滚动回顶部
        const inputs = document.querySelectorAll('textarea, input');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                setTimeout(() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }, 100);
            });
        });
    }
}

// 图片上传处理
imageInput.addEventListener('change', handleImageUpload);

// 删除图片
deleteImageBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    currentImageData = null;
    previewContainer.style.display = 'none';
    uploadArea.parentElement.style.display = 'block';
});

// 提交分析
submitBtn.addEventListener('click', () => {
    const ingredients = ingredientsTextarea.value.trim();
    const seasonings = seasoningsTextarea.value.trim();

    if (!ingredients && !currentImageData) {
        showToast('请至少输入食材信息或上传图片');
        return;
    }

    // 显示加载状态
    loading.style.display = 'block';
    analysisSection.style.display = 'none';
    
    // 滚动到加载区域
    loading.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // 模拟分析过程（延迟1秒，移动端更快响应）
    setTimeout(() => {
        // 执行营养分析
        const result = analyzeNutrition(ingredients, seasonings);
        
        // 显示分析结果
        displayAnalysisResult(result);
        
        // 保存记录到历史
        saveRecord(ingredients, seasonings, currentImageData, result);
        
        // 隐藏加载状态，显示结果
        loading.style.display = 'none';
        analysisSection.style.display = 'block';
        
        // 滚动到结果区域
        analysisSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 1000);
});

// 处理图片上传
function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
        // 检查文件大小（限制10MB）
        if (file.size > 10 * 1024 * 1024) {
            showToast('图片大小不能超过10MB');
            imageInput.value = '';
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            currentImageData = e.target.result;
            previewImage.src = currentImageData;
            uploadArea.parentElement.style.display = 'none';
            previewContainer.style.display = 'block';
            imageInput.value = ''; // 清空文件选择，确保下次选择相同文件也能触发上传
        };
        reader.onerror = () => {
            showToast('图片读取失败，请重试');
        };
        reader.readAsDataURL(file);
    }
}

// 显示分析结果
function displayAnalysisResult(result) {
    // 清空之前的结果
    macroNutrientsList.innerHTML = '';
    microNutrientsList.innerHTML = '';
    nutrientGap.innerHTML = '';

    // 显示宏量营养素
    if (result.macroNutrients.length > 0) {
        result.macroNutrients.forEach(nutrient => {
            const li = document.createElement('li');
            li.textContent = nutrient;
            macroNutrientsList.appendChild(li);
        });
    } else {
        macroNutrientsList.innerHTML = '<li style="color: #999; background: #f0f0f0;">未检测到</li>';
    }

    // 显示微量营养素
    if (result.microNutrients.length > 0) {
        result.microNutrients.forEach(nutrient => {
            const li = document.createElement('li');
            li.textContent = nutrient;
            microNutrientsList.appendChild(li);
        });
    } else {
        microNutrientsList.innerHTML = '<li style="color: #999; background: #f0f0f0;">未检测到</li>';
    }

    // 显示营养缺口
    if (result.missingNutrients.length > 0) {
        result.missingNutrients.forEach(item => {
            const gapItem = document.createElement('div');
            gapItem.className = 'gap-item';
            gapItem.innerHTML = `
                <div class="name">${item.name}</div>
                <div class="suggestion">💡 ${item.suggestion}</div>
            `;
            nutrientGap.appendChild(gapItem);
        });
    } else {
        nutrientGap.innerHTML = '<p style="color: #4caf50; text-align: center; padding: 20px; font-weight: 600;">🎉 营养均衡，继续保持！</p>';
    }
}

// 保存记录到历史
function saveRecord(ingredients, seasonings, imageData, result) {
    const record = {
        id: Date.now().toString(),
        ingredients: ingredients,
        seasonings: seasonings,
        imageData: imageData,
        result: result,
        date: new Date().toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        })
    };

    historyRecords.unshift(record);
    
    // 最多保存50条记录
    if (historyRecords.length > 50) {
        historyRecords = historyRecords.slice(0, 50);
    }

    localStorage.setItem('nutritionRecords', JSON.stringify(historyRecords));
    renderHistory();
}

// 渲染历史记录
function renderHistory() {
    if (historyRecords.length === 0) {
        historyList.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📝</div>
                <p>暂无历史记录</p>
                <p class="hint">记录您的第一餐开始吧！</p>
            </div>
        `;
        return;
    }

    historyList.innerHTML = '<div class="history-list">' + historyRecords.map(record => `
        <div class="history-item" data-id="${record.id}">
            ${record.imageData ? `<img src="${record.imageData}" alt="菜品图片" loading="lazy">` : '<div style="width:80px;height:80px;background:#e0e0e0;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:32px;">🍽️</div>'}
            <div class="content">
                <div class="ingredients">${record.ingredients || '未填写食材'}</div>
                <div class="date">📅 ${record.date}</div>
                <div class="nutrients">
                    ${record.result.macroNutrients.slice(0, 3).map(n => `<span class="nutrient-tag">${n}</span>`).join('')}
                    ${record.result.microNutrients.slice(0, 2).map(n => `<span class="nutrient-tag">${n}</span>`).join('')}
                </div>
            </div>
            <div class="actions">
                <button class="view-btn" onclick="viewRecord('${record.id}')">查看</button>
                <button class="delete-history-btn" onclick="deleteRecord('${record.id}')">删除</button>
            </div>
        </div>
    `).join('') + '</div>';
}

// 查看记录详情
function viewRecord(id) {
    const record = historyRecords.find(r => r.id === id);
    if (!record) return;

    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>餐食详情</h3>
                <button class="modal-close" onclick="closeModal()">×</button>
            </div>
            <div class="modal-body">
                ${record.imageData ? `<img class="modal-image" src="${record.imageData}" alt="菜品图片">` : ''}
                <div class="modal-ingredients"><strong>🥬 食材：</strong>${record.ingredients || '未填写'}</div>
                <div class="modal-seasonings"><strong>🧂 调味品：</strong>${record.seasonings || '未填写'}</div>
                <div class="modal-nutrients">
                    <h4>✅ 含有的营养物质</h4>
                    <ul>
                        ${[...record.result.macroNutrients, ...record.result.microNutrients].map(n => `<li>${n}</li>`).join('')}
                    </ul>
                </div>
                ${record.result.missingNutrients.length > 0 ? `
                    <div class="modal-nutrients">
                        <h4>⚠️ 缺少的营养物质</h4>
                        ${record.result.missingNutrients.map(m => `
                            <p style="margin-bottom: 8px;"><strong>${m.name}：</strong>${m.suggestion.replace('💡 ', '')}</p>
                        `).join('')}
                    </div>
                ` : '<p style="color: #4caf50; margin-top: 16px; font-weight: 600;">🎉 营养均衡！</p>'}
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    // 禁止背景滚动
    document.body.style.overflow = 'hidden';
    
    // 点击遮罩关闭
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    
    // 滑动关闭（移动端手势）
    let startY = 0;
    modal.addEventListener('touchstart', (e) => {
        startY = e.touches[0].clientY;
    });
    modal.addEventListener('touchend', (e) => {
        const endY = e.changedTouches[0].clientY;
        if (endY - startY > 100) {
            closeModal();
        }
    });
}

// 关闭弹窗
function closeModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        document.body.removeChild(modal);
        document.body.style.overflow = '';
    }
}

// 删除记录
function deleteRecord(id) {
    if (!confirm('确定要删除这条记录吗？')) return;
    
    historyRecords = historyRecords.filter(r => r.id !== id);
    localStorage.setItem('nutritionRecords', JSON.stringify(historyRecords));
    renderHistory();
}

// Toast提示（移动端友好）
function showToast(message) {
    // 移除已有的toast
    const existingToast = document.querySelector('.toast-message');
    if (existingToast) {
        existingToast.remove();
    }
    
    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        font-size: 16px;
        z-index: 9999;
        text-align: center;
        max-width: 80%;
        word-wrap: break-word;
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s';
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

// 导出函数供外部使用
window.viewRecord = viewRecord;
window.deleteRecord = deleteRecord;
window.closeModal = closeModal;
