// 营养知识库
const nutritionDatabase = {
    // 宏量营养素 - 食材映射
    macroNutrients: {
        '蛋白质': ['鸡胸肉', '鸡腿肉', '牛肉', '猪肉', '鱼肉', '虾', '鸡蛋', '豆腐', '豆浆', '牛奶', '酸奶', '黑豆', '红豆', '鹰嘴豆'],
        '脂肪': ['橄榄油', '花生油', '黄油', '牛油果', '坚果', '肥肉', '油炸食品', '奶油', '芝士', '椰子油'],
        '碳水化合物': ['米饭', '面条', '馒头', '面包', '土豆', '红薯', '玉米', '燕麦', '糙米', '全麦面包'],
        '膳食纤维': ['西兰花', '菠菜', '芹菜', '胡萝卜', '番茄', '苹果', '香蕉', '橙子', '草莓', '蓝莓', '燕麦', '糙米']
    },
    
    // 微量营养素 - 食材映射
    microNutrients: {
        '维生素A': ['胡萝卜', '南瓜', '红薯', '菠菜', '西兰花', '鸡蛋黄', '牛奶'],
        '维生素C': ['橙子', '柠檬', '猕猴桃', '草莓', '番茄', '西兰花', '青椒', '菠菜'],
        '维生素B族': ['瘦肉', '鸡蛋', '牛奶', '全麦面包', '糙米', '燕麦', '豆类'],
        '维生素D': ['鸡蛋黄', '牛奶', '三文鱼', '蘑菇'],
        '钙': ['牛奶', '酸奶', '奶酪', '西兰花', '菠菜', '小鱼干'],
        '铁': ['瘦肉', '猪肝', '菠菜', '黑木耳', '红枣', '红豆'],
        '锌': ['瘦肉', '猪肝', '鸡蛋', '坚果', '豆类'],
        '钾': ['香蕉', '橙子', '菠菜', '土豆', '番茄', '牛油果']
    },
    
    // 常见调味品
    seasonings: ['盐', '酱油', '醋', '糖', '料酒', '蚝油', '生抽', '老抽', '花椒', '八角', '桂皮', '姜', '蒜', '葱', '辣椒', '香油', '橄榄油', '花生油'],
    
    // 非正餐食品分类
    nonMealCategories: {
        coffee: ['咖啡', '拿铁', '美式', '卡布奇诺', '摩卡', '浓缩咖啡', '黑咖啡'],
        tea: ['奶茶', '红茶', '绿茶', '花茶', '水果茶', '柠檬茶', '乌龙茶', '普洱茶'],
        dessert: ['蛋糕', '饼干', '冰淇淋', '巧克力', '糖果', '布丁', '甜甜圈', '蛋挞'],
        snack: ['薯片', '坚果', '瓜子', '花生', '饼干', '巧克力', '糖果', '辣条', '蜜饯'],
        beverage: ['可乐', '雪碧', '果汁', '汽水', '饮料', '苏打水', '气泡水']
    },
    
    // 正餐食材特征
    mealFoods: ['米饭', '面条', '馒头', '粥', '肉', '鱼', '虾', '鸡蛋', '豆腐', '蔬菜', '汤', '炒菜', '炖菜', '煮菜']
};

// 必需营养素列表（用于判断缺失）
const essentialNutrients = [
    '蛋白质', '脂肪', '碳水化合物', '膳食纤维',
    '维生素A', '维生素C', '维生素B族', '维生素D',
    '钙', '铁', '锌', '钾'
];

// 简洁营养补充建议（不超过20字/条）
const supplementSuggestions = {
    '蛋白质': '吃鸡胸肉、鸡蛋、牛奶',
    '脂肪': '吃牛油果、坚果、橄榄油',
    '碳水化合物': '吃米饭、红薯、玉米',
    '膳食纤维': '多吃蔬菜、水果',
    '维生素A': '吃胡萝卜、南瓜、菠菜',
    '维生素C': '吃橙子、猕猴桃、番茄',
    '维生素B族': '吃瘦肉、鸡蛋、糙米',
    '维生素D': '多晒太阳、喝牛奶',
    '钙': '喝牛奶、吃西兰花',
    '铁': '吃瘦肉、菠菜、红枣',
    '锌': '吃瘦肉、坚果',
    '钾': '吃香蕉、橙子、土豆'
};

// 分析食材营养成分
function analyzeNutrition(ingredients, seasonings) {
    const result = {
        macroNutrients: [],
        microNutrients: [],
        missingNutrients: []
    };

    const ingredientList = ingredients.toLowerCase().split(/[,，、\s]+/).filter(item => item.trim());
    const seasoningList = seasonings.toLowerCase().split(/[,，、\s]+/).filter(item => item.trim());
    const allItems = [...ingredientList, ...seasoningList];

    for (const [nutrient, foods] of Object.entries(nutritionDatabase.macroNutrients)) {
        for (const food of foods) {
            if (allItems.some(item => item.includes(food.toLowerCase()))) {
                if (!result.macroNutrients.includes(nutrient)) {
                    result.macroNutrients.push(nutrient);
                }
            }
        }
    }

    for (const [nutrient, foods] of Object.entries(nutritionDatabase.microNutrients)) {
        for (const food of foods) {
            if (allItems.some(item => item.includes(food.toLowerCase()))) {
                if (!result.microNutrients.includes(nutrient)) {
                    result.microNutrients.push(nutrient);
                }
            }
        }
    }

    const allDetected = [...result.macroNutrients, ...result.microNutrients];
    for (const essential of essentialNutrients) {
        if (!allDetected.includes(essential)) {
            result.missingNutrients.push({
                name: essential,
                suggestion: supplementSuggestions[essential]
            });
        }
    }

    return result;
}

// 判断是否为非正餐食品
function isNonMealFood(ingredients, seasonings) {
    const allItems = [...ingredients.toLowerCase().split(/[,，、\s]+/), ...seasonings.toLowerCase().split(/[,，、\s]+/)]
        .filter(item => item.trim());
    
    for (const [category, foods] of Object.entries(nutritionDatabase.nonMealCategories)) {
        for (const food of foods) {
            if (allItems.some(item => item.includes(food.toLowerCase()))) {
                return true;
            }
        }
    }
    return false;
}

// 判断是否为正餐食材
function isMealFood(ingredients) {
    const ingredientList = ingredients.toLowerCase().split(/[,，、\s]+/).filter(item => item.trim());
    
    for (const food of nutritionDatabase.mealFoods) {
        if (ingredientList.some(item => item.includes(food.toLowerCase()))) {
            return true;
        }
    }
    return false;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        analyzeNutrition, 
        nutritionDatabase, 
        essentialNutrients, 
        supplementSuggestions,
        isNonMealFood,
        isMealFood
    };
}