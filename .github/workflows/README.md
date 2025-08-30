# GitHub Actions 工作流说明

本项目包含三个 GitHub Actions 工作流文件，用于不同的构建和发布场景：

## 1. build.yml - 完整多平台构建

**触发条件：**
- 推送到 main/master 分支
- 创建标签（v* 格式）
- Pull Request 到 main/master 分支
- 手动触发

**构建平台：**
- Windows x64/ARM64
- macOS Intel/Apple Silicon
- Linux x64/ARM64

**功能：**
- 自动构建所有平台版本
- 上传构建产物为 artifacts

## 2. release.yml - 发布构建

**触发条件：**
- GitHub Release 发布时
- 手动触发（需要指定版本号）

**功能：**
- 分别在对应平台构建各架构版本
- 上传构建产物为 artifacts，可手动下载

## 3. test.yml - 测试构建

**触发条件：**
- 推送到 main/master/develop 分支
- Pull Request 到 main/master 分支

**功能：**
- 快速测试各平台的构建兼容性
- 不生成完整的发布包，主要用于验证代码变更

## 使用说明

### 开发阶段
推送代码到 develop 或 main 分支时，会自动触发 `test.yml` 进行快速构建测试。

### 发布新版本
1. 创建并推送标签：
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```
   这会触发完整的多平台构建，构建产物会作为 artifacts 上传。

2. 或者在 GitHub 上手动创建 Release，然后触发 release.yml 工作流，构建产物同样会作为 artifacts 上传。

3. 需要发布时，可以从 Actions 页面下载对应的 artifacts，然后手动上传到 GitHub Release。

### 手动构建
在 GitHub 仓库的 Actions 页面，可以手动触发任何工作流。

## 注意事项

1. **Windows MSI 构建**：需要 WiX Toolset，工作流会自动安装
2. **macOS 签名**：由于没有付费开发者证书，构建的 macOS 应用需要用户手动处理安全警告
3. **构建时间**：完整的多平台构建可能需要 20-30 分钟
4. **存储空间**：构建产物会占用 GitHub Actions 的存储配额

## 自定义配置

如果需要修改构建配置，主要文件：
- `forge.config.js` - Electron Forge 配置
- `package.json` - 项目依赖和脚本
- `.github/workflows/*.yml` - GitHub Actions 配置