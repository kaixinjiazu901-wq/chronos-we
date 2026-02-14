# 微信小程序类目配置问题修复

## 问题描述

部署时出现错误：
```
submit audit failed, code: 85008, msg: category is invalid
```

## 错误原因

微信小程序的 `project.config.json` 中的 `category` 字段配置了无效的类目值：

```json
"category": ["工具", "生活服务"]
```

这个配置的问题：
1. **类目名称无效**：`"工具"` 和 `"生活服务"` 不是微信官方支持的类目名称
2. **格式不正确**：category 字段应该使用类目 ID，而不是类目名称
3. **作用误解**：category 字段主要用于开发调试，正式审核时需要在微信公众平台后台选择类目

## 修复方案

### 1. 代码修改

已删除 `project.config.json` 中的 `category` 字段：

```diff
{
  "miniprogramRoot": "./dist",
  "projectname": "Chronos",
  "description": "精神时区切换工具",
  "appid": "touristappid",
- "category": ["工具", "生活服务"],
  "setting": {
    ...
  }
}
```

### 2. 重新构建

```bash
pnpm build
```

构建后的 `dist/project.config.json` 已经不包含 `category` 字段。

### 3. 微信公众平台手动选择类目

在提交审核时，需要在微信公众平台上手动选择正确的类目。

#### 推荐的类目选择

对于 Chronos 精神时区切换工具，推荐以下类目：

**方案 1：工具类（推荐）**
- 一级类目：工具
- 二级类目：效率
- 三级类目：实用工具

**方案 2：生活服务类**
- 一级类目：生活服务
- 二级类目：生活助手

**方案 3：IT科技类**
- 一级类目：IT科技
- 二级类目：软件服务提供商
- 三级类目：工具类软件

#### 选择类目的步骤

1. 登录 [微信公众平台](https://mp.weixin.qq.com/)
2. 进入小程序管理后台
3. 点击左侧菜单 "设置" → "基本设置"
4. 找到 "服务类目" 部分
5. 点击 "添加" 或 "编辑"
6. 根据小程序功能选择合适的类目
7. 保存后即可提交审核

## 注意事项

1. **类目权限**：不同的小程序类型（个人/企业）有不同的类目选择范围
2. **类目限制**：个人开发者的小程序类目选择受限，部分类目仅对企业开放
3. **功能匹配**：选择的类目必须与小程序的实际功能匹配
4. **审核严格**：微信会严格审核小程序功能与类目的一致性

## 验证修复

1. 检查 `project.config.json` 不包含 `category` 字段
2. 检查 `dist/project.config.json` 不包含 `category` 字段
3. 构建成功，无错误
4. 部署到微信平台
5. 在微信公众平台手动选择正确的类目
6. 提交审核

## 相关资源

- [微信小程序类目说明](https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/app.html)
- [微信小程序服务类目规范](https://developers.weixin.qq.com/miniprogram/product/material/#服务类目)
- [project.config.json 配置说明](https://developers.weixin.qq.com/miniprogram/dev/devtools/projectconfig.html)

## 后续建议

1. 避免在 `project.config.json` 中配置 `category` 字段
2. 在微信公众平台管理后台统一管理类目配置
3. 定期查看微信官方类目规范更新
4. 确保小程序功能与所选类目匹配
