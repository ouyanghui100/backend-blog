# 🚀 React-Nest 博客后端系统

一个基于 **NestJS + TypeScript + MySQL** 构建的现代化博客后端系统，提供完整的 RESTful API 接口。

![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-blue?logo=typescript)
![NestJS](https://img.shields.io/badge/NestJS-11.0.1-red?logo=nestjs)
![MySQL](https://img.shields.io/badge/MySQL-8.0+-orange?logo=mysql)
![JWT](https://img.shields.io/badge/JWT-Auth-green?logo=jsonwebtokens)
![Swagger](https://img.shields.io/badge/Swagger-API_Docs-brightgreen?logo=swagger)

## 📋 目录

- [项目简介](#项目简介)
- [主要功能](#主要功能)
- [技术栈](#技术栈)
- [快速开始](#快速开始)
- [环境配置](#环境配置)
- [API 文档](#api-文档)
- [项目结构](#项目结构)
- [开发规范](#开发规范)
- [部署说明](#部署说明)
- [许可证](#许可证)

## 📖 项目简介

这是一个功能完整的博客后端系统，采用模块化设计，支持多种用户角色，提供丰富的内容管理功能。系统使用 **NestJS** 框架开发，遵循企业级开发标准，具有良好的可扩展性和维护性。

### ✨ 主要特色

- 🏗️ **模块化架构** - 清晰的模块划分，易于维护和扩展
- 🔐 **JWT 认证** - 安全的用户认证和授权机制
- 📝 **Swagger 文档** - 自动生成的 API 接口文档
- 🛡️ **类型安全** - 全面的 TypeScript 类型定义
- 📊 **数据验证** - 严格的请求数据验证
- 🏷️ **标准化** - 统一的响应格式和错误处理
- 🧪 **测试完备** - 单元测试和端到端测试

## 🚀 主要功能

### 👥 用户管理

- **管理员系统** - 完整的后台管理功能
- **游客访问** - 支持游客只读访问
- **JWT 认证** - 安全的身份验证机制
- **权限控制** - 基于角色的访问控制

### 📝 内容管理

- **文章管理** - 文章的增删改查、发布管理
- **标签系统** - 灵活的标签分类管理
- **分类管理** - 层级化的分类体系
- **评论系统** - 支持评论审核和回复

### 🔧 系统功能

- **前台接口** - 公开的前端展示接口
- **后台管理** - 完整的内容管理接口
- **数据统计** - 文章、标签等统计信息
- **批量操作** - 支持批量数据处理

## 🛠️ 技术栈

### 核心框架

- **[NestJS](https://nestjs.com/)** `^11.0.1` - 企业级 Node.js 框架
- **[TypeScript](https://www.typescriptlang.org/)** `^5.7.3` - 类型安全的 JavaScript 超集
- **[Express](https://expressjs.com/)** - 快速、极简的 Web 框架

### 数据库与 ORM

- **[MySQL](https://www.mysql.com/)** `^3.14.1` - 稳定可靠的关系型数据库
- **[TypeORM](https://typeorm.io/)** `^0.3.25` - 功能丰富的 TypeScript ORM

### 认证与安全

- **[Passport](https://www.passportjs.org/)** `^0.7.0` - 身份验证中间件
- **[JWT](https://jwt.io/)** `^11.0.0` - JSON Web Token 认证
- **[bcryptjs](https://github.com/dcodeIO/bcrypt.js)** `^3.0.2` - 密码加密库

### 数据验证与转换

- **[class-validator](https://github.com/typestack/class-validator)** `^0.14.2` - 装饰器数据验证
- **[class-transformer](https://github.com/typestack/class-transformer)** `^0.5.1` - 对象转换库

### 文档与开发工具

- **[Swagger](https://swagger.io/)** `^11.2.0` - API 文档自动生成
- **[ESLint](https://eslint.org/)** `^9.18.0` - 代码质量检查
- **[Prettier](https://prettier.io/)** `^3.4.2` - 代码格式化工具
- **[Jest](https://jestjs.io/)** `^29.7.0` - 测试框架

## 🚀 快速开始

### 环境要求

确保你的开发环境满足以下要求：

- **Node.js** >= 18.0.0
- **npm** >= 8.0.0 或 **pnpm** >= 7.0.0
- **MySQL** >= 8.0
- **Git**

### 安装步骤

1. **克隆项目**

   ```bash
   git clone [your-repository-url]
   cd backend-blog
   ```

2. **安装依赖**

   ```bash
   # 使用 npm
   npm install

   # 或使用 pnpm (推荐)
   pnpm install
   ```

3. **环境配置**

   ```bash
   # 复制环境变量模板
   cp .env.example .env

   # 编辑环境变量
   nano .env
   ```

4. **数据库准备**

   ```bash
   # 创建数据库
   mysql -u root -p
   CREATE DATABASE blog_mysql CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

5. **启动项目**

   ```bash
   # 开发模式
   npm run start:dev

   # 生产模式
   npm run build
   npm run start:prod
   ```

6. **访问应用**
   - 🌐 **API 基础地址**: http://localhost:3000/api
   - 📚 **Swagger 文档**: http://localhost:3000/api/docs
   - 📋 **OpenAPI JSON**: http://localhost:3000/api/docs-json

## ⚙️ 环境配置

### 环境变量说明

创建 `.env` 文件并配置以下变量：

```env
# 服务器配置
PORT=3000
NODE_ENV=development

# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_DATABASE=blog_mysql

# JWT 配置
JWT_SECRET=your-super-secret-jwt-key-change-it-in-production
JWT_EXPIRES_IN=168h

# 其他配置
API_PREFIX=api
```

### 数据库配置说明

| 变量名        | 说明           | 默认值       | 示例              |
| ------------- | -------------- | ------------ | ----------------- |
| `DB_HOST`     | 数据库主机地址 | `localhost`  | `127.0.0.1`       |
| `DB_PORT`     | 数据库端口     | `3306`       | `3306`            |
| `DB_USERNAME` | 数据库用户名   | `root`       | `blog_user`       |
| `DB_PASSWORD` | 数据库密码     | (空)         | `your_password`   |
| `DB_DATABASE` | 数据库名称     | `blog_mysql` | `blog_production` |

## 📚 API 文档

### Swagger 在线文档

启动项目后，访问 [http://localhost:3000/api/docs](http://localhost:3000/api/docs) 查看完整的 API 文档。

### 响应格式

所有 API 响应都遵循统一格式：

```json
{
  "success": true,
  "message": "操作成功",
  "data": {},
  "timestamp": "2024-01-15 18:30:45"
}
```

## 🧑‍💻 开发规范

### 代码规范

项目严格遵循以下开发规范：

- **TypeScript 优先** - 禁止使用 JavaScript，确保类型安全
- **函数式编程** - 优先使用 async/await，避免回调地狱
- **模块化设计** - 清晰的模块划分，单一职责原则
- **错误处理** - 完善的异常处理机制

### 命名规范

| 类型   | 规范               | 示例                 |
| ------ | ------------------ | -------------------- |
| 文件名 | kebab-case         | `user.controller.ts` |
| 类名   | PascalCase         | `UserService`        |
| 方法名 | camelCase          | `getUserById()`      |
| 常量   | UPPER_SNAKE_CASE   | `API_VERSION`        |
| 接口   | PascalCase + I前缀 | `IUserRepository`    |

### Git 提交规范

```
<类型>(<范围>): <主题>

<正文>

<脚注>
```

**类型说明：**

- `feat`: 新功能
- `fix`: 修复问题
- `docs`: 文档更新
- `style`: 代码格式化
- `refactor`: 重构代码
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动

**示例：**

```
feat(用户模块): 添加用户注册功能

- 实现用户注册接口
- 添加邮箱验证功能
- 完善错误处理机制

Closes #123
```

## 🔧 开发命令

### 常用命令

```bash
# 开发相关
npm run start          # 启动应用
npm run start:dev      # 开发模式（热重载）
npm run start:debug    # 调试模式
npm run start:prod     # 生产模式

# 构建相关
npm run build          # 构建项目

# 代码质量
npm run lint           # 代码检查
npm run lint:fix       # 修复代码问题
npm run format         # 格式化代码
npm run format:check   # 检查代码格式
npm run code:check     # 检查代码质量和格式
npm run code:fix       # 修复代码质量和格式问题

# 测试相关
npm run test           # 运行单元测试
npm run test:watch     # 监视模式运行测试
npm run test:cov       # 生成测试覆盖率报告
npm run test:debug     # 调试模式运行测试
npm run test:e2e       # 运行端到端测试

# 预提交检查
npm run pre-commit     # 提交前代码检查
```

### 开发流程

1. **创建功能分支**

   ```bash
   git checkout -b feat/new-feature
   ```

2. **开发功能**

   ```bash
   npm run start:dev    # 启动开发服务器
   ```

3. **代码检查**

   ```bash
   npm run code:check   # 检查代码质量
   npm run test         # 运行测试
   ```

4. **提交代码**

   ```bash
   npm run pre-commit   # 预提交检查
   git add .
   git commit -m "feat: 添加新功能"
   ```

5. **推送分支**
   ```bash
   git push origin feat/new-feature
   ```

## 🚀 部署说明

### 环境准备

1. **服务器要求**

   - Node.js >= 18.0.0
   - MySQL >= 8.0
   - PM2 (推荐)

2. **环境变量**
   ```bash
   # 生产环境配置
   NODE_ENV=production
   PORT=3000
   DB_HOST=your_db_host
   DB_USERNAME=your_db_user
   DB_PASSWORD=your_db_password
   JWT_SECRET=your_production_secret
   ```

## 📄 许可证

本项目采用 [MIT](LICENSE) 许可证。
