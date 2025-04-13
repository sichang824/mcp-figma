# Figma MCP 画布操作插件

这是一个 Figma 插件，允许通过 MCP (Model Context Protocol) 工具在 Figma 画布上进行操作。

## 功能

- 通过 MCP 工具创建和操作 Figma 元素：
  - 矩形
  - 圆形
  - 文本
- 自定义元素属性（位置、大小、颜色等）
- 与 MCP 服务器通信以接收命令
- 显示命令执行状态和日志

## 如何使用

### 设置和安装

1. 克隆此仓库
2. 安装依赖: `bun install`
3. 构建插件: `bun run build:plugin`
4. 在 Figma 桌面应用中，右键点击并选择"插件" > "开发" > "导入插件..."
5. 选择 `src/plugin/manifest.json` 文件
6. 现在你可以在 Figma 中运行此插件，点击"插件" > "MCP 画布操作工具"

### 开发模式（自动构建）

使用 `bun run dev:plugin` 命令可以启动监视模式，自动构建插件代码。

### 使用 MCP 工具操作 Figma 画布

1. 启动 Figma 并加载插件
2. 启动 MCP 服务器: `bun run mcp`
3. 使用以下 MCP 工具在 Figma 画布上操作元素：

#### 创建矩形

```javascript
await mcp_canvas_create_rectangle({
  x: 100,
  y: 100,
  width: 200,
  height: 150,
  color: "#FF5733",
});
```

#### 创建圆形

```javascript
await mcp_canvas_create_circle({
  x: 300,
  y: 200,
  width: 150,
  height: 150,
  color: "#3385FF",
});
```

#### 创建文本

```javascript
await mcp_canvas_create_text({
  x: 100,
  y: 300,
  text: "Hello from MCP!",
  fontSize: 24,
});
```

#### 获取当前选择的元素

```javascript
await mcp_canvas_get_selection();
```

## 工作原理

1. Figma 插件在 Figma 画布中运行
2. 插件的 UI 页面与 MCP 服务器建立连接
3. MCP 工具发送命令到插件的 UI
4. UI 将命令转发给插件的主代码
5. 插件的主代码在 Figma 画布上执行操作
6. 操作结果被返回给 MCP 服务器

## 技术说明

### 代码结构

- `code.ts` - 主插件代码，包含画布操作和 MCP 命令处理逻辑
- `ui.html` - 用户界面和 MCP 通信桥梁
- `manifest.json` - 插件配置文件

### MCP 命令格式

```javascript
{
  command: "create-rectangle", // 或 "create-circle", "create-text", "get-selection"
  params: {
    // 命令特定的参数
    x: 100,
    y: 100,
    width: 200,
    height: 150,
    color: "#FF5733"
  }
}
```

### 响应格式

```javascript
{
  type: "mcp-response",
  success: true, // 或 false
  command: "create-rectangle",
  result: {
    id: "123:456",
    type: "RECTANGLE",
    name: "Rectangle"
  }
  // 如果 success 为 false，则包含 error 字段
  // error: "错误信息"
}
```

## 扩展与自定义

要添加更多 Figma 操作：

1. 在 `code.ts` 中添加新的处理函数
2. 在 `handleMcpCommand` 函数中添加新命令的处理逻辑
3. 在 `src/tools/canvas.ts` 中添加相应的 MCP 工具
