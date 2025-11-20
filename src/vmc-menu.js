/**
 * VmcMenu 导航菜单插件 v2.0.0
 * 维米客网页工作室 Vomoc Web Studio
 * http://www.vomoc.com/vmc/menu/
 * vomoc@qq.com
 * 2025/11/20
 **/

/**
 * VmcMenu 类定义
 */
class VmcMenu {
    /**
     * 构造函数
     * @param {HTMLElement} element - 菜单容器元素
     * @param {Object} settings - 配置选项
     */
    constructor(element, settings = {}) {
        // 检查元素是否存在
        if (!(element instanceof HTMLElement)) {
            throw new Error('VmcMenu: 无效的元素参数');
        }

        this.element = element;

        // 默认配置常量
        const DEFAULT_DURATION = 400;
        const DEFAULT_CURRENT_BAR_DURATION = 300;
        const DEFAULT_EASE_OUT_BACK_PARAM = 1.70158;

        this.options = {
            duration: DEFAULT_DURATION,
            easing: 'easeOutBack',
            currentBar: true,
            currentBarDuration: DEFAULT_CURRENT_BAR_DURATION,
            easeOutBackParam: DEFAULT_EASE_OUT_BACK_PARAM,
            ...settings,
        };

        // 缓存常用选择器结果
        this.selectors = {
            main: '.vui-main',
            item: '.vui-item',
            itemValue: '.vui-item-value',
            children: '.vui-children',
            childItem: '.vui-child-item',
            childValue: '.vui-child-value',
            currentBar: '.vui-current-bar',
            currentBarBox: '.vui-current-bar-box',
            currentItemHover: 'vui-item-hover',
            childHover: 'vui-child-hover',
        };

        // 缓存DOM元素
        this.cachedElements = {
            main: null,
            items: null,
            children: null,
            currentBar: null,
            currentBarBox: null,
        };

        // 动画定时器集合 - 使用元素作为key，防止同一元素的动画冲突
        this.timers = new Map();
        // 元素动画映射，用于取消同一元素的旧动画
        this.elementAnimations = new Map();

        // Resize事件防抖定时器
        this.resizeTimer = null;

        // 保存事件处理器的引用，用于后续移除
        this.eventHandlers = {
            resizeHandler: null,
            menuItemEnterHandlers: new Map(),
            menuItemLeaveHandlers: new Map(),
            childValueEnterHandlers: new Map(),
            childValueLeaveHandlers: new Map(),
            menuEnterHandler: null,
            menuLeaveHandler: null,
        };

        // 如果提供了 data，先渲染菜单结构
        if (this.options.data && Array.isArray(this.options.data)) {
            this.renderFromData(this.options.data);
        }

        this.init();
    }

    /**
     * 获取主菜单尺寸
     * @returns {Object|null} 返回 {itemHeight, mainWidth} 或 null
     */
    getMainMenuDimensions() {
        if (!this.cachedElements.main) {
            this.cachedElements.main = this.element.querySelector(this.selectors.main);
            if (!this.cachedElements.main) {
                console.warn('VmcMenu: 未找到主菜单元素 (.vui-main)');
                return null;
            }
        }
        return {
            itemHeight: this.cachedElements.main.offsetHeight,
            mainWidth: this.cachedElements.main.offsetWidth,
        };
    }

    /**
     * 处理所有菜单项的位置和尺寸
     * @param {boolean} bindEvents - 是否绑定事件监听器
     */
    processAllMenuItems(bindEvents = false) {
        const dimensions = this.getMainMenuDimensions();
        if (!dimensions) return;

        const {itemHeight, mainWidth} = dimensions;

        // 缓存菜单项（仅在初始化时）
        if (!this.cachedElements.items) {
            this.cachedElements.items = this.element.querySelectorAll(this.selectors.item);
        }

        // 处理每个菜单项
        if (this.cachedElements.items && this.cachedElements.items.length > 0) {
            this.cachedElements.items.forEach((item) => {
                this.processMenuItem(item, itemHeight, mainWidth);
                if (bindEvents) {
                    this.bindItemEvents(item);
                }
            });
        }
    }

    /**
     * 根据数据数组渲染菜单结构
     * @param {Array} data - 菜单数据数组
     */
    renderFromData(data) {
        if (!Array.isArray(data) || data.length === 0) {
            return;
        }

        // 清空容器内容
        this.element.innerHTML = '';

        // 创建主菜单容器
        const mainUl = document.createElement('ul');
        mainUl.className = 'vui-main';

        // 遍历数据生成菜单项
        data.forEach((item) => {
            this.renderMenuItem(mainUl, item, false);
        });

        // 将主菜单添加到容器
        this.element.appendChild(mainUl);
    }

    /**
     * 渲染单个菜单项（一级或二级）
     * @param {HTMLElement} parent - 父容器元素
     * @param {Object} itemData - 菜单项数据
     * @param {boolean} isChild - 是否为子菜单项
     */
    renderMenuItem(parent, itemData, isChild) {
        if (!itemData || !itemData.id || !itemData.text) {
            return;
        }

        // 创建菜单项容器
        const li = document.createElement('li');
        li.className = isChild ? 'vui-child-item' : 'vui-item';

        // 创建链接元素
        const link = document.createElement('a');
        link.href = itemData.href || '#';
        link.className = isChild ? 'vui-child-value' : 'vui-item-value';
        link.setAttribute('data-menu-id', itemData.id);

        // 创建图标容器
        const iconSpan = document.createElement('span');
        iconSpan.className = isChild ? 'vui-child-value-icon' : 'vui-item-value-icon';

        // 处理图标
        if (itemData.icon) {
            const trimmedIcon = itemData.icon.trim();
            if (trimmedIcon.toLowerCase().startsWith('<svg')) {
                // SVG 字符串，使用 innerHTML 插入
                iconSpan.innerHTML = trimmedIcon;
            } else {
                // 图片 URL，创建 img 元素
                const img = document.createElement('img');
                img.src = trimmedIcon;
                iconSpan.appendChild(img);
            }
        }

        // 创建文本容器
        const textSpan = document.createElement('span');
        textSpan.className = isChild ? 'vui-child-value-text' : 'vui-item-value-text';
        textSpan.textContent = itemData.text;

        // 组装链接元素
        link.appendChild(iconSpan);
        link.appendChild(textSpan);

        // 如果有子菜单，创建子菜单容器
        if (itemData.children && Array.isArray(itemData.children) && itemData.children.length > 0) {
            const childrenUl = document.createElement('ul');
            childrenUl.className = 'vui-children';

            // 递归渲染子菜单
            itemData.children.forEach((childItem) => {
                this.renderMenuItem(childrenUl, childItem, true);
            });

            // 组装菜单项
            li.appendChild(link);
            li.appendChild(childrenUl);
        } else {
            // 没有子菜单，只添加链接
            li.appendChild(link);
        }

        // 添加到父容器
        parent.appendChild(li);
    }

    /**
     * 初始化菜单
     */
    init() {
        // 创建滑动游标
        this.createCurrentBar();

        // 处理所有菜单项并绑定事件
        this.processAllMenuItems(true);

        // 处理子菜单项
        this.processChildItems();

        // 缓存并隐藏子菜单
        this.cachedElements.children = this.element.querySelectorAll(this.selectors.children);
        if (this.cachedElements.children && this.cachedElements.children.length > 0) {
            this.cachedElements.children.forEach((child) => {
                if (child) {
                    child.style.visibility = 'visible';
                    child.style.display = 'none';
                }
            });
        }

        // 绑定窗口resize事件
        this.bindResizeEvent();

        // 检查是否有初始选中的菜单
        this.initActiveMenu();
    }

    /**
     * 绑定窗口resize事件
     */
    bindResizeEvent() {
        this.eventHandlers.resizeHandler = () => {
            // 防抖处理，避免频繁触发
            if (this.resizeTimer) {
                clearTimeout(this.resizeTimer);
            }

            this.resizeTimer = setTimeout(() => {
                this.handleResize();
            }, 100);
        };

        window.addEventListener('resize', this.eventHandlers.resizeHandler);
    }

    /**
     * 处理窗口resize事件
     */
    handleResize() {
        // 重新计算每个菜单项的位置和尺寸（不绑定事件）
        this.processAllMenuItems(false);
    }

    /**
     * 获取元素的真实尺寸（临时显示元素以测量）
     * @param {HTMLElement} element - 目标元素
     * @param {Function} callback - 在元素临时显示时执行的回调，用于获取尺寸
     * @returns {number} 返回测量结果
     */
    getElementRealSize(element, callback) {
        if (!element || !callback) return 0;

        // 保存原始样式
        const originalStyles = {
            display: element.style.display,
            visibility: element.style.visibility,
            width: element.style.width,
            left: element.style.left,
            top: element.style.top,
        };

        // 临时设置为可见但隐藏，并移除宽度限制以获取真实宽度
        element.style.display = 'block';
        element.style.visibility = 'hidden';
        element.style.width = 'auto';
        element.style.left = '0';
        element.style.top = '0';

        // 执行回调获取尺寸
        const result = callback(element);

        // 恢复原始样式
        element.style.display = originalStyles.display;
        element.style.visibility = originalStyles.visibility;
        element.style.width = originalStyles.width;
        element.style.left = originalStyles.left;
        element.style.top = originalStyles.top;

        return result;
    }

    /**
     * 处理菜单项的尺寸和位置
     * @param {HTMLElement} item - 菜单项元素
     * @param {number} itemHeight - 菜单项高度
     * @param {number} mainWidth - 主菜单宽度（当前实际宽度）
     */
    processMenuItem(item, itemHeight, mainWidth) {
        if (!item || !itemHeight || !mainWidth) return;

        const child = item.querySelector(this.selectors.children);
        if (!child) return;

        // 获取当前位置和尺寸
        const rect = item.getBoundingClientRect();
        const parentElement = item.parentElement;
        if (!parentElement) return;

        const parentRect = parentElement.getBoundingClientRect();
        const pos = {
            left: rect.left - parentRect.left,
            top: rect.top - parentRect.top,
        };

        const itemWidth = item.offsetWidth || 0;

        // 获取下拉菜单的真实宽度
        const childWidth = this.getElementRealSize(child, (element) => {
            const width = element.offsetWidth || 0;
            // 确保子菜单宽度不小于菜单项宽度
            return Math.max(itemWidth, width);
        });

        // 计算子菜单居左位置（基于当前主菜单宽度）
        let childLeft = mainWidth - pos.left - childWidth;
        childLeft = childLeft > 0 ? 0 : childLeft;

        // 设置子菜单样式
        child.style.top = itemHeight + 'px';
        child.style.left = childLeft + 'px';
        child.style.width = childWidth + 'px';
    }

    /**
     * 执行 currentBar 动画
     * @param {HTMLElement} item - 菜单项元素
     */
    animateCurrentBar(item) {
        if (!this.options.currentBar) return;

        // 使用缓存的currentBar元素，如果不存在则查询并缓存
        if (!this.cachedElements.currentBar) {
            this.cachedElements.currentBar = this.element.querySelector(this.selectors.currentBar);
        }

        if (!this.cachedElements.currentBar) return;

        const rect = item.getBoundingClientRect();
        const parentRect = item.parentElement
            ? item.parentElement.getBoundingClientRect()
            : this.cachedElements.main.getBoundingClientRect();
        const pos = {
            left: rect.left - parentRect.left,
        };
        const width = item.offsetWidth;

        this.animate(this.cachedElements.currentBar, {
            left: pos.left,
            width: width,
        }, this.options.currentBarDuration, 'easeOutBack');
    }

    /**
     * 绑定菜单项事件
     * @param {HTMLElement} item - 菜单项元素
     */
    bindItemEvents(item) {
        const child = item.querySelector(this.selectors.children);
        const itemValue = item.querySelector(this.selectors.itemValue);

        // 鼠标进入事件
        this.eventHandlers.menuItemEnterHandlers.set(item, () => {
            if (child) {
                this.slideDown(child, this.options.duration);
            }

            if (itemValue) {
                itemValue.classList.add(this.selectors.currentItemHover);
            }

            // current bar 动画
            this.animateCurrentBar(item);
        });

        item.addEventListener('mouseenter', this.eventHandlers.menuItemEnterHandlers.get(item));

        // 鼠标离开事件
        this.eventHandlers.menuItemLeaveHandlers.set(item, () => {
            const hasChildItems = child && item.querySelectorAll(this.selectors.childItem).length > 0;

            if (hasChildItems) {
                this.slideUp(child, this.options.duration / 2, () => {
                    if (itemValue) {
                        itemValue.classList.remove(this.selectors.currentItemHover);
                    }
                });
            } else if (itemValue) {
                itemValue.classList.remove(this.selectors.currentItemHover);
            }
        });

        item.addEventListener('mouseleave', this.eventHandlers.menuItemLeaveHandlers.get(item));
    }

    /**
     * 处理子菜单项
     */
    processChildItems() {
        // 处理子菜单值元素
        const childValues = this.element.querySelectorAll(this.selectors.childValue);
        if (childValues && childValues.length > 0) {
            childValues.forEach((value) => {
                if (!value) return;

                // 绑定悬停事件
                this.eventHandlers.childValueEnterHandlers.set(value, () => {
                    if (value) {
                        value.classList.add(this.selectors.childHover);
                    }
                });

                value.addEventListener('mouseenter', this.eventHandlers.childValueEnterHandlers.get(value));

                this.eventHandlers.childValueLeaveHandlers.set(value, () => {
                    if (value) {
                        value.classList.remove(this.selectors.childHover);
                    }
                });

                value.addEventListener('mouseleave', this.eventHandlers.childValueLeaveHandlers.get(value));
            });
        }
    }

    /**
     * 创建当前条
     */
    createCurrentBar() {
        if (!this.options.currentBar) return;

        // 检查是否已存在
        this.cachedElements.currentBarBox = this.element.querySelector(this.selectors.currentBarBox);
        if (this.cachedElements.currentBarBox) return;

        const currentBarBox = document.createElement('div');
        currentBarBox.className = 'vui-current-bar-box';
        currentBarBox.style.display = 'none';
        this.element.appendChild(currentBarBox);
        this.cachedElements.currentBarBox = currentBarBox;

        const currentBar = document.createElement('div');
        currentBar.className = 'vui-current-bar';
        currentBarBox.appendChild(currentBar);
        this.cachedElements.currentBar = currentBar;

        this.eventHandlers.menuEnterHandler = () => {
            this.fadeIn(currentBarBox, this.options.duration);
        };

        this.element.addEventListener('mouseenter', this.eventHandlers.menuEnterHandler);

        this.eventHandlers.menuLeaveHandler = () => {
            this.fadeOut(currentBarBox, this.options.duration);
        };

        this.element.addEventListener('mouseleave', this.eventHandlers.menuLeaveHandler);
    }

    /**
     * 淡入淡出动画的公共逻辑
     * @param {HTMLElement} element - 目标元素
     * @param {number} duration - 动画持续时间
     * @param {boolean} isFadeIn - 是否为淡入动画
     */
    fade(element, duration = 400, isFadeIn = true) {
        if (!element) return;

        // 取消该元素之前的动画
        this.cancelElementAnimation(element);

        const startOpacity = isFadeIn ? 0 : 1;
        const endOpacity = isFadeIn ? 1 : 0;

        if (isFadeIn) {
            element.style.opacity = '0';
            element.style.display = 'block';
        } else {
            element.style.opacity = '1';
        }

        const startTime = performance.now();
        const animationId = this.generateAnimationId('fade');

        const tick = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const currentOpacity = startOpacity + (endOpacity - startOpacity) * progress;
            element.style.opacity = currentOpacity.toString();

            if (progress < 1) {
                const frameId = requestAnimationFrame(tick);
                this.timers.set(animationId, frameId);
                this.elementAnimations.set(element, animationId);
            } else {
                this.timers.delete(animationId);
                this.elementAnimations.delete(element);
                if (!isFadeIn) {
                    element.style.display = 'none';
                }
            }
        };

        const frameId = requestAnimationFrame(tick);
        this.timers.set(animationId, frameId);
        this.elementAnimations.set(element, animationId);
    }

    /**
     * 淡入动画效果
     * @param {HTMLElement} element - 目标元素
     * @param {number} duration - 动画持续时间
     */
    fadeIn(element, duration = 400) {
        this.fade(element, duration, true);
    }

    /**
     * 淡出动画效果
     * @param {HTMLElement} element - 目标元素
     * @param {number} duration - 动画持续时间
     */
    fadeOut(element, duration = 400) {
        this.fade(element, duration, false);
    }

    /**
     * 取消指定元素的动画
     * @param {HTMLElement} element - 目标元素
     */
    cancelElementAnimation(element) {
        if (!element) return;

        const animationId = this.elementAnimations.get(element);
        if (animationId) {
            const frameId = this.timers.get(animationId);
            if (frameId) {
                cancelAnimationFrame(frameId);
            }
            this.timers.delete(animationId);
            this.elementAnimations.delete(element);
        }
    }

    /**
     * 自定义缓动函数（easeOutBack）
     * @param {number} t - 当前时间
     * @param {number} b - 初始值
     * @param {number} c - 变化量
     * @param {number} d - 持续时间
     * @param {number} s - 回缩幅度
     * @returns {number} 缓动后的值
     */
    easeOutBack(t, b, c, d, s) {
        if (s === undefined) {
            s = this.options.easeOutBackParam;
        }
        const normalizedT = t / d - 1;
        return c * (normalizedT * normalizedT * ((s + 1) * normalizedT + s) + 1) + b;
    }

    /**
     * 动画函数
     * @param {HTMLElement} element - 目标元素
     * @param {Object} properties - 要改变的属性
     * @param {number} duration - 动画持续时间
     * @param {string} easing - 缓动函数类型
     * @param {Function} callback - 动画完成回调函数
     */
    animate(element, properties, duration, easing, callback) {
        if (!element) return;

        // 取消该元素之前的动画
        this.cancelElementAnimation(element);

        const startTime = performance.now();
        const startValues = {};
        const changes = {};

        // 获取初始值和变化量
        const computedStyle = getComputedStyle(element);
        for (const property in properties) {
            if (properties.hasOwnProperty(property)) {
                startValues[property] = parseFloat(computedStyle[property]) || 0;
                changes[property] = properties[property] - startValues[property];
            }
        }

        // 生成唯一的动画ID
        const animationId = this.generateAnimationId('animation');

        const animationLoop = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // 应用缓动函数
            let easedProgress;
            if (easing === 'easeOutBack') {
                easedProgress = this.easeOutBack(progress, 0, 1, 1);
            } else {
                easedProgress = progress; // 默认线性
            }

            // 更新属性值
            for (const property in properties) {
                if (properties.hasOwnProperty(property)) {
                    const currentValue = startValues[property] + changes[property] * easedProgress;
                    element.style[property] = currentValue + 'px';
                }
            }

            if (progress < 1) {
                // 保存动画帧ID以便可能取消
                const frameId = requestAnimationFrame(animationLoop);
                this.timers.set(animationId, frameId);
                this.elementAnimations.set(element, animationId);
            } else {
                this.timers.delete(animationId);
                this.elementAnimations.delete(element);
                if (callback) callback();
            }
        };

        const frameId = requestAnimationFrame(animationLoop);
        this.timers.set(animationId, frameId);
        this.elementAnimations.set(element, animationId);
    }

    /**
     * 生成动画ID
     * @param {string} type - 动画类型
     * @returns {Symbol} 动画ID
     */
    generateAnimationId(type) {
        return Symbol(type);
    }

    /**
     * 滑动动画的公共逻辑
     * @param {HTMLElement} element - 目标元素
     * @param {number} duration - 动画持续时间
     * @param {boolean} isSlideDown - 是否为滑下动画
     * @param {Function} callback - 动画完成回调函数
     */
    slide(element, duration = 400, isSlideDown = true, callback) {
        if (!element) {
            if (callback) callback();
            return;
        }

        // 取消该元素之前的动画
        this.cancelElementAnimation(element);

        let targetHeight;
        if (isSlideDown) {
            element.style.height = '0px';
            element.style.display = 'block';
            targetHeight = element.scrollHeight;
        } else {
            targetHeight = element.offsetHeight;
            if (targetHeight === 0) {
                element.style.display = 'none';
                element.style.height = '';
                if (callback) callback();
                return;
            }
        }

        const startTime = performance.now();
        const animationId = this.generateAnimationId('slide');

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            let currentHeight;
            if (isSlideDown) {
                // 使用easeOutBack缓动实现弹性效果
                const easedProgress = this.easeOutBack(progress, 0, 1, 1);
                currentHeight = targetHeight * easedProgress;
            } else {
                // 使用线性效果，不应用缓动函数
                currentHeight = targetHeight * (1 - progress);
            }
            element.style.height = currentHeight + 'px';

            if (progress < 1) {
                const frameId = requestAnimationFrame(animate);
                this.timers.set(animationId, frameId);
                this.elementAnimations.set(element, animationId);
            } else {
                this.timers.delete(animationId);
                this.elementAnimations.delete(element);
                if (isSlideDown) {
                    element.style.height = ''; // 重置为auto以适应内容
                } else {
                    element.style.display = 'none';
                    element.style.height = '';
                }
                if (callback) callback();
            }
        };

        const frameId = requestAnimationFrame(animate);
        this.timers.set(animationId, frameId);
        this.elementAnimations.set(element, animationId);
    }

    /**
     * 滑下动画效果（带弹性缓动）
     * @param {HTMLElement} element - 目标元素
     * @param {number} duration - 动画持续时间
     */
    slideDown(element, duration = 400) {
        this.slide(element, duration, true);
    }

    /**
     * 滑上动画效果（无线性缓动）
     * @param {HTMLElement} element - 目标元素
     * @param {number} duration - 动画持续时间
     * @param {Function} callback - 动画完成回调函数
     */
    slideUp(element, duration = 400, callback) {
        this.slide(element, duration, false, callback);
    }

    /**
     * 初始化选中的菜单（从 data-active-menu-id 属性读取）
     */
    initActiveMenu() {
        const activeMenuId = this.element.getAttribute('data-active-menu-id');
        if (activeMenuId) {
            this.setActiveMenu(activeMenuId);
        }
    }

    /**
     * 查找具有指定 menu-id 的菜单元素
     * @param {HTMLElement} container - 容器元素
     * @param {string} selector - 菜单值选择器
     * @param {string} menuId - 菜单ID
     * @returns {HTMLElement|null} 返回找到的菜单值元素或 null
     */
    findMenuValueBySelector(container, selector, menuId) {
        const elements = container.querySelectorAll(selector);
        for (let i = 0; i < elements.length; i++) {
            if (elements[i].getAttribute('data-menu-id') === menuId) {
                return elements[i];
            }
        }
        return null;
    }

    /**
     * 根据 menu-id 查找菜单元素
     * @param {string} menuId - 菜单ID
     * @returns {Object|null} 返回 {item: 一级菜单项, childItem: 二级菜单项} 或 null
     */
    findMenuById(menuId) {
        if (!menuId) return null;

        // 先查找二级菜单
        const childValue = this.findMenuValueBySelector(this.element, this.selectors.childValue, menuId);
        if (childValue) {
            const childItem = childValue.closest(this.selectors.childItem);
            const parentItem = childItem ? childItem.closest(this.selectors.item) : null;
            return {
                item: parentItem,
                childItem: childItem,
            };
        }

        // 如果没找到二级菜单，查找一级菜单
        const itemValue = this.findMenuValueBySelector(this.element, this.selectors.itemValue, menuId);
        if (itemValue) {
            const item = itemValue.closest(this.selectors.item);
            return {
                item: item,
                childItem: null,
            };
        }

        return null;
    }

    /**
     * 清除所有菜单的选中状态
     */
    clearActiveMenu() {
        // 一次性查询所有激活的菜单项并清除
        const activeItems = this.element.querySelectorAll(
            '.vui-item-value.vui-item-active, .vui-child-value.vui-child-active',
        );
        activeItems.forEach(item => {
            item.classList.remove('vui-item-active', 'vui-child-active');
        });
    }

    /**
     * 设置当前选中的菜单
     * @param {string} menuId - 菜单ID（通过 data-menu-id 属性指定）
     */
    setActiveMenu(menuId) {
        if (!menuId) {
            this.clearActiveMenu();
            return;
        }

        // 先清除所有选中状态
        this.clearActiveMenu();

        // 查找对应的菜单
        const menu = this.findMenuById(menuId);
        if (!menu) {
            console.warn('VmcMenu: 未找到 menu-id 为 "' + menuId + '" 的菜单项');
            return;
        }

        // 设置一级菜单为选中状态
        if (menu.item) {
            const itemValue = menu.item.querySelector(this.selectors.itemValue);
            if (itemValue) {
                itemValue.classList.add('vui-item-active');
            }
        }

        // 如果是二级菜单，也设置二级菜单为选中状态
        if (menu.childItem) {
            const childValue = menu.childItem.querySelector(this.selectors.childValue);
            if (childValue) {
                childValue.classList.add('vui-child-active');
            }
        }
    }

    /**
     * 销毁实例
     */
    destroy() {
        // 取消所有正在进行的动画
        for (const [, frameId] of this.timers) {
            cancelAnimationFrame(frameId);
        }
        this.timers.clear();
        this.elementAnimations.clear();

        // 清空缓存
        this.cachedElements = {
            main: null,
            items: null,
            children: null,
            currentBar: null,
            currentBarBox: null,
        };

        // 清除resize事件定时器
        if (this.resizeTimer) {
            clearTimeout(this.resizeTimer);
            this.resizeTimer = null;
        }

        // 移除所有事件监听器
        if (this.eventHandlers.resizeHandler) {
            window.removeEventListener('resize', this.eventHandlers.resizeHandler);
        }

        if (this.eventHandlers.menuEnterHandler) {
            this.element.removeEventListener('mouseenter', this.eventHandlers.menuEnterHandler);
        }

        if (this.eventHandlers.menuLeaveHandler) {
            this.element.removeEventListener('mouseleave', this.eventHandlers.menuLeaveHandler);
        }

        // 移除菜单项事件监听器
        if (this.cachedElements.items) {
            this.cachedElements.items.forEach(item => {
                if (this.eventHandlers.menuItemEnterHandlers.has(item)) {
                    item.removeEventListener('mouseenter', this.eventHandlers.menuItemEnterHandlers.get(item));
                    this.eventHandlers.menuItemEnterHandlers.delete(item);
                }

                if (this.eventHandlers.menuItemLeaveHandlers.has(item)) {
                    item.removeEventListener('mouseleave', this.eventHandlers.menuItemLeaveHandlers.get(item));
                    this.eventHandlers.menuItemLeaveHandlers.delete(item);
                }
            });
        }

        // 移除子菜单项事件监听器
        const childValues = this.element.querySelectorAll(this.selectors.childValue);
        if (childValues && childValues.length > 0) {
            childValues.forEach(value => {
                if (this.eventHandlers.childValueEnterHandlers.has(value)) {
                    value.removeEventListener('mouseenter', this.eventHandlers.childValueEnterHandlers.get(value));
                    this.eventHandlers.childValueEnterHandlers.delete(value);
                }

                if (this.eventHandlers.childValueLeaveHandlers.has(value)) {
                    value.removeEventListener('mouseleave', this.eventHandlers.childValueLeaveHandlers.get(value));
                    this.eventHandlers.childValueLeaveHandlers.delete(value);
                }
            });
        }

        // 移除事件监听器等清理工作可以在这里添加
    }
}

// 为 HTMLElement 添加便捷方法
HTMLElement.prototype.VmcMenu = function (settings) {
    // 检查是否已经初始化过
    if (!this.vmcMenuInstance) {
        this.vmcMenuInstance = new VmcMenu(this, settings);
    }
    return this.vmcMenuInstance;
};

// 全局函数调用方式：vmcMenu('#menu', {})
window.VmcMenu = function (selector, settings) {
    let element;

    // 如果第一个参数是字符串，使用 querySelector 查找元素
    if (typeof selector === 'string') {
        element = document.querySelector(selector);
        if (!element) {
            throw new Error('VmcMenu: 未找到选择器对应的元素: ' + selector);
        }
    }
    // 如果第一个参数是 HTMLElement，直接使用
    else if (selector instanceof HTMLElement) {
        element = selector;
    }
    // 其他情况抛出错误
    else {
        throw new Error('VmcMenu: 第一个参数必须是选择器字符串或 DOM 元素');
    }

    // 创建并返回 VmcMenu 实例
    return new VmcMenu(element, settings || {});
};