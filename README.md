# VmcMenu 导航菜单插件

VmcMenu 是一款轻量级、高性能的原生 JavaScript 导航菜单插件，可实现带流畅动画效果的二级下拉菜单，适用于网站主导航。

**版本**: v2.0.0  
**作者**: 维米客网页工作室 (Vomoc Web Studio)  
**官网**: http://www.vomoc.com/vmc/menu/  
**邮箱**: vomoc@qq.com

## ✨ 特性

- 🚀 **纯原生 JavaScript** - 无依赖，不依赖 jQuery 或其他库
- 🎨 **流畅动画效果** - 支持滑动、淡入淡出等动画，使用 easeOutBack 缓动函数
- 📱 **响应式设计** - 自动适配窗口大小变化
- 🎯 **灵活配置** - 丰富的配置选项，满足不同需求
- 🔧 **易于定制** - 使用 CSS 变量，方便主题定制
- ⚡ **高性能** - 使用 requestAnimationFrame 优化动画性能
- 🎪 **当前指示条** - 可选的滑动指示条，增强用户体验
- ✅ **菜单状态管理** - 支持设置和清除当前选中的菜单项
- 📊 **数据驱动渲染** - 支持通过数据数组动态生成菜单结构
- 🖼️ **图标支持** - 支持 SVG 和图片 URL 两种图标格式

## 📦 安装

### 方式一：直接下载

下载项目文件，引入以下文件：

```html
<!-- CSS -->
<link rel="stylesheet" href="dist/css/style.css">

<!-- JavaScript -->
<script src="dist/vmc.menu.js"></script>
```

### 方式二：使用源码

```html
<!-- CSS -->
<link rel="stylesheet" href="src/style.css">

<!-- JavaScript -->
<script src="src/vmc-menu.js"></script>
```

## 🚀 快速开始

### 1. HTML 结构

```html
<div class="vui-menu">
    <ul class="vui-main">
        <li class="vui-item">
            <a href="#" class="vui-item-value" data-menu-id="home">
                <span class="vui-item-value-icon"></span>
                <span class="vui-item-value-text">首页</span>
            </a>
        </li>
        <li class="vui-item">
            <a href="#" class="vui-item-value" data-menu-id="about">
                <span class="vui-item-value-icon"></span>
                <span class="vui-item-value-text">关于我们</span>
            </a>
            <ul class="vui-children">
                <li class="vui-child-item">
                    <a href="#" class="vui-child-value" data-menu-id="company">
                        <span class="vui-child-value-icon"></span>
                        <span class="vui-child-value-text">公司简介</span>
                    </a>
                </li>
                <li class="vui-child-item">
                    <a href="#" class="vui-child-value" data-menu-id="team">
                        <span class="vui-child-value-icon"></span>
                        <span class="vui-child-value-text">团队介绍</span>
                    </a>
                </li>
            </ul>
        </li>
    </ul>
</div>
```

### 2. 初始化

```javascript
// 方式一：使用全局函数
const menu = window.VmcMenu('.vui-menu', {
    duration: 400,
    currentBar: true
});

// 方式二：使用 HTMLElement 原型方法
const menuElement = document.querySelector('.vui-menu');
const menu = menuElement.VmcMenu({
    duration: 400
});

// 方式三：直接传入 DOM 元素
const menuElement = document.querySelector('.vui-menu');
const menu = window.VmcMenu(menuElement, {
    duration: 400
});
```

### 3. 设置初始选中菜单

在菜单容器上添加 `data-active-menu-id` 属性：

```html
<div class="vui-menu" data-active-menu-id="company">
    <!-- 菜单内容 -->
</div>
```

## ⚙️ 配置选项

```javascript
const menu = window.VmcMenu('.vui-menu', {
    // 动画持续时间（毫秒）
    duration: 400,
    
    // 缓动函数类型（目前支持 'easeOutBack'）
    easing: 'easeOutBack',
    
    // 是否显示当前指示条
    currentBar: true,
    
    // 当前指示条动画持续时间（毫秒）
    currentBarDuration: 300,
    
    // easeOutBack 缓动函数的回缩幅度参数
    easeOutBackParam: 1.70158
});
```

### 配置说明

| 选项 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `duration` | Number | 400 | 菜单展开/收起动画的持续时间（毫秒） |
| `easing` | String | 'easeOutBack' | 缓动函数类型 |
| `currentBar` | Boolean | true | 是否显示滑动指示条 |
| `currentBarDuration` | Number | 300 | 指示条动画持续时间（毫秒） |
| `easeOutBackParam` | Number | 1.70158 | easeOutBack 缓动函数的回缩幅度参数 |
| `data` | Array | undefined | 菜单数据数组，用于动态生成菜单结构（详见数据驱动渲染章节） |

## 📚 API 方法

### setActiveMenu(menuId)

设置当前选中的菜单项。

```javascript
// 设置选中菜单（通过 data-menu-id 属性指定）
menu.setActiveMenu('company');
```

### clearActiveMenu()

清除所有菜单项的选中状态。

```javascript
menu.clearActiveMenu();
```

### destroy()

销毁菜单实例，清理所有事件监听器和动画。

```javascript
menu.destroy();
```

## 🎨 样式定制

VmcMenu 使用 CSS 变量来定义样式，您可以通过覆盖这些变量来定制菜单外观。

### 主菜单样式变量

```css
.vui-menu {
    /* 菜单尺寸 */
    --vmc-menu-width: 100%;
    --vmc-menu-height: 60px;
    --vmc-menu-z-index: 9;
    
    /* 菜单背景和文字 */
    --vmc-menu-bg: #B10000;
    --vmc-menu-text-color: #FFF;
    --vmc-menu-font-size: 16px;
    --vmc-menu-font-weight: normal;
    
    /* 悬停状态 */
    --vmc-menu-hover-bg: #C00;
    --vmc-menu-hover-text-color: #FFF000;
    
    /* 激活状态 */
    --vmc-menu-active-bg: #aaa;
    --vmc-menu-active-text-color: #000;
}
```

### 子菜单样式变量

```css
.vui-menu {
    /* 子菜单高度 */
    --vmc-menu-children-height: 45px;
    
    /* 子菜单背景和文字 */
    --vmc-menu-children-bg: #000;
    --vmc-menu-children-text-color: #FFF;
    --vmc-menu-children-font-size: 14px;
    --vmc-menu-children-font-weight: normal;
    
    /* 子菜单悬停状态 */
    --vmc-menu-children-hover-bg: #555;
    --vmc-menu-children-hover-text-color: #FFFf00;
    
    /* 子菜单激活状态 */
    --vmc-menu-children-active-bg: #ccc;
    --vmc-menu-children-active-text-color: #000;
}
```

### 指示条样式变量

```css
.vui-menu {
    --vmc-menu-current-bar-color: #000;
    --vmc-menu-current-bar-height: 3px;
}
```

### 完整示例

```css
.vui-menu {
    --vmc-menu-bg: #2c3e50;
    --vmc-menu-text-color: #ecf0f1;
    --vmc-menu-hover-bg: #34495e;
    --vmc-menu-hover-text-color: #3498db;
    --vmc-menu-active-bg: #3498db;
    --vmc-menu-active-text-color: #fff;
    
    --vmc-menu-children-bg: #34495e;
    --vmc-menu-children-text-color: #ecf0f1;
    --vmc-menu-children-hover-bg: #2c3e50;
    --vmc-menu-children-hover-text-color: #3498db;
    
    --vmc-menu-current-bar-color: #3498db;
    --vmc-menu-current-bar-height: 4px;
}
```

## 📖 使用示例

### 基础示例

```html
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="dist/css/style.css">
</head>
<body>
    <div class="vui-menu">
        <ul class="vui-main">
            <li class="vui-item">
                <a href="#" class="vui-item-value" data-menu-id="home">
                    <span class="vui-item-value-text">首页</span>
                </a>
            </li>
            <li class="vui-item">
                <a href="#" class="vui-item-value" data-menu-id="products">
                    <span class="vui-item-value-text">产品</span>
                </a>
                <ul class="vui-children">
                    <li class="vui-child-item">
                        <a href="#" class="vui-child-value" data-menu-id="product1">
                            <span class="vui-child-value-text">产品一</span>
                        </a>
                    </li>
                </ul>
            </li>
        </ul>
    </div>
    
    <script src="dist/vmc.menu.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const menu = window.VmcMenu('.vui-menu', {
                duration: 400,
                currentBar: true
            });
        });
    </script>
</body>
</html>
```

### 动态设置选中菜单

```javascript
const menu = window.VmcMenu('.vui-menu');

// 根据当前页面 URL 设置选中菜单
const currentPage = window.location.pathname;
if (currentPage.includes('company')) {
    menu.setActiveMenu('company');
} else if (currentPage.includes('team')) {
    menu.setActiveMenu('team');
}
```

### 数据驱动渲染

VmcMenu 支持通过数据数组动态生成菜单结构，这对于从 API 获取菜单数据或动态构建菜单非常有用。

#### 数据格式

```javascript
const menuData = [
    {
        id: 'home',              // 必需：菜单项唯一标识
        text: '首页',            // 必需：菜单项显示文本
        href: '#',               // 可选：链接地址，默认为 '#'
        icon: '<svg>...</svg>',  // 可选：图标（支持 SVG 字符串或图片 URL）
        children: [               // 可选：子菜单数组
            {
                id: 'company',
                text: '公司简介',
                href: '/company',
                icon: '<svg>...</svg>'
            }
        ]
    }
];
```

#### 使用示例

```javascript
const menuData = [
    {
        id: 'home',
        text: '首页',
        href: '/',
        icon: '<svg viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>'
    },
    {
        id: 'about',
        text: '关于我们',
        href: '#',
        icon: '<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>',
        children: [
            {
                id: 'company',
                text: '公司简介',
                href: '/about/company',
                icon: '<svg>...</svg>'
            },
            {
                id: 'team',
                text: '团队介绍',
                href: '/about/team'
            }
        ]
    },
    {
        id: 'products',
        text: '产品',
        href: '#',
        icon: 'https://example.com/icon.png', // 使用图片 URL
        children: [
            {
                id: 'product1',
                text: '产品一',
                href: '/products/1'
            },
            {
                id: 'product2',
                text: '产品二',
                href: '/products/2'
            }
        ]
    }
];

// 使用 data 选项创建菜单
const menu = window.VmcMenu('.vui-menu', {
    data: menuData,
    duration: 400,
    currentBar: true
});
```

#### 注意事项

- 使用 `data` 选项时，会清空菜单容器的原有内容并重新生成
- 每个菜单项必须包含 `id` 和 `text` 属性
- 图标支持两种格式：
  - SVG 字符串：以 `<svg` 开头的字符串，会直接插入到 DOM 中
  - 图片 URL：其他格式会被识别为图片 URL，创建 `<img>` 元素
- 子菜单可以嵌套任意层级（目前插件支持二级菜单，但数据结构可以支持更多层级）

### 响应式处理

插件会自动处理窗口大小变化，重新计算菜单位置。无需额外配置。

### 图标使用

VmcMenu 支持两种图标格式：

1. **SVG 字符串**：直接使用 SVG 代码
```html
<span class="vui-item-value-icon">
    <svg viewBox="0 0 24 24">
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
    </svg>
</span>
```

2. **图片 URL**：使用图片链接
```html
<span class="vui-item-value-icon">
    <img src="https://example.com/icon.png" alt="图标">
</span>
```

在数据驱动渲染中，插件会自动识别图标格式并正确渲染。

## 🌐 浏览器支持

- Chrome (最新版本)
- Firefox (最新版本)
- Safari (最新版本)
- Edge (最新版本)
- IE 11+ (需要 polyfill)

## 📁 项目结构

```
vmc-menu/
├── dist/                 # 编译后的文件（如需要）
├── src/                  # 源代码
│   ├── style.scss       # SCSS 源文件
│   ├── style.css        # 编译后的 CSS
│   └── vmc-menu.js      # ES6 源代码
├── test/                 # 测试文件
│   ├── demo.html        # 演示页面
│   └── test.html        # 详细测试用例
└── README.md            # 说明文档
```

## 🔧 开发

### 编译 SCSS

如果需要修改样式，请编辑 `src/style.scss`，然后编译为 CSS：

```bash
sass src/style.scss src/style.css
```

### 运行测试

打开 `test/test.html` 查看详细的测试用例，或打开 `test/demo.html` 查看演示页面。

## ❓ 常见问题

### Q: 如何禁用当前指示条？

A: 在初始化时设置 `currentBar: false`：

```javascript
const menu = window.VmcMenu('.vui-menu', {
    currentBar: false
});
```

### Q: 如何自定义动画速度？

A: 通过 `duration` 选项调整动画持续时间：

```javascript
const menu = window.VmcMenu('.vui-menu', {
    duration: 600  // 600 毫秒，动画更慢
});
```

### Q: 菜单项没有显示激活状态？

A: 确保菜单项的 `data-menu-id` 属性值与 `setActiveMenu()` 方法传入的参数一致。

### Q: 子菜单位置不正确？

A: 插件会自动计算子菜单位置。如果遇到问题，检查：
- 菜单容器的 CSS 定位是否正确
- 是否有其他 CSS 样式影响菜单位置
- 窗口大小变化后，插件会自动重新计算位置

### Q: 如何销毁菜单实例？

A: 调用 `destroy()` 方法：

```javascript
menu.destroy();
```

这会清理所有事件监听器和动画，释放内存。

### Q: 支持三级或更多级菜单吗？

A: 当前版本支持二级菜单。如需更多层级，可以修改代码扩展功能。

### Q: 图标不显示怎么办？

A: 检查以下几点：
- SVG 代码格式是否正确
- 图片 URL 是否可访问
- 图标容器的 CSS 样式是否正确

## 📝 更新日志

### v2.0.0
- 重写为原生 JavaScript (ES6)，移除 jQuery 依赖
- 优化动画性能，使用 requestAnimationFrame
- 添加响应式支持，自动处理窗口大小变化
- 改进事件处理机制，支持完整的事件清理
- 添加菜单状态管理 API
- 优化代码结构，提升可维护性

### v1.1.0
- 初始版本（jQuery 版本）

## 📄 许可证

Copyright © 维米客网页工作室 (Vomoc Web Studio)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📧 联系方式

- 官网: http://www.vomoc.com/vmc/menu/
- 邮箱: vomoc@qq.com

---

**维米客网页工作室** - 专业的网页开发解决方案
