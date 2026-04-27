# 2026-03-23

## 目标结果

最终目标不是简单减少重复文件，而是形成稳定的 monorepo 分层结构：

1. `packages/base` 成为唯一共享实现来源。
2. `apps/auth`、`apps/system` 仅保留：
   - 应用配置
   - 入口薄壳
   - 业务模块
3. 后续公共能力只在 `base` 中演进，不再在 app 内双份维护。

## 任务分层

### G1 共享基础域

这类内容最终应只存在于 `packages/base`。

范围包括：
- 静态资源
- 样式
- 基础插件
- 基础工具
- 基础类型
- 基础组件

当前对应内容：
- `assets/icons/*`
- `assets/images/*`
- `logo.png`
- `styles/**`
- `plugins/icons.ts`
- `plugins/vxeTable.ts`
- `utils/nprogress.ts`
- `utils/storage.ts`
- `types/router.d.ts`
- `types/shims-vue.d.ts`
- `components/OperationColumn`
- `components/Pagination`

结论：这批是最先做、最好确认、风险最低的任务。

### G2 共享抽象域

这类内容本质是共性，但不能直接删 app 文件，需要先抽象。

范围包括：
- `plugins/index.ts`
- `App.vue`
- `settings.ts`
- `lang/index.ts`
- `store/modules/app-store.ts`
- `api/system/*`
- `layouts/**`
- `components/Breadcrumb`
- `components/AppLink`
- `composables/layout/**`

结论：这批不是“删副本”，而是“抽共性 + 保差异”。

### G3 应用壳域

这类文件必须保留在 app，但应该尽量薄。

范围包括：
- `main.ts`
- `router/index.ts`
- `plugins/permission.ts`
- `permission-store` wrapper

结论：这批不能追求“消失”，只能追求“变薄”。

### G4 业务私有域

这类内容应明确保留，不以共享为目标。

#### auth 私有
- `views/login/**`
- `views/inject/**`
- `views/app-center/**`
- `api/auth-api.ts`
- `utils/auth.ts`
- `utils/request.ts`
- `store/modules/user/**`

#### system 私有
- `views/system/**`
- `views/oauth/**`
- `views/dashboard/**`

结论：这批任务不是收敛，而是边界确认。

## 优先级分级

### P0 立即收敛

特征：
- 重复度高
- 基本无业务差异
- 删除或改引用即可完成
- 收益高、风险低

建议纳入 P0：
1. 静态资源统一
   - icons
   - images
   - logo
2. 公共样式统一
   - `styles/index.scss`
   - `reset.scss`
   - `element-plus.scss`
   - `vxe-table.scss`
   - `vxe-table.css`
   - `dark/css-vars.css`
3. 基础插件统一
   - `plugins/icons.ts`
   - `plugins/vxeTable.ts`
4. 基础工具统一
   - `utils/nprogress.ts`
   - `utils/storage.ts`
5. 基础类型统一
   - `types/router.d.ts`
   - `types/shims-vue.d.ts`
6. 基础组件统一
   - `OperationColumn`
   - `Pagination`

P0 完成定义：
- app 不再保留这些重复实现
- 所有引用统一指向 `@root/base/**`
- auth/system 构建通过
- 页面无明显回归

### P1 抽象后收敛

特征：
- 职责相同
- 已经有共享趋势
- 但仍混有 app 差异
- 需要先设计抽象点

建议纳入 P1：
1. 插件总装配
   - `apps/auth/src/plugins/index.ts`
   - `apps/system/src/plugins/index.ts`
2. 根组件壳
   - `apps/auth/src/App.vue`
   - `apps/system/src/App.vue`
3. 设置模型
   - `apps/auth/src/settings.ts`
   - `apps/system/src/settings.ts`
4. 国际化 / store / system API
   - `lang/index.ts`
   - `store/modules/app-store.ts`
   - `store/modules/dict-store.ts`
   - `api/system/config-api.ts`
   - `api/system/dept-api.ts`
   - `api/system/dict-api.ts`
5. 布局与通用组件群
   - `layouts/**`
   - `composables/layout/**`
   - `Breadcrumb`
   - `AppLink`
   - 其他后台通用组件

P1 完成定义：
- 共用逻辑进 base
- app 文件缩成 wrapper / override
- 共享逻辑以后只在 base 修改
- app 仅保留差异配置

### P2 专项治理

特征：
- 牵涉认证、权限、动态路由、业务流程
- 看起来相似，但不能粗暴合并
- 一旦误动，容易影响登录或路由

建议纳入 P2：
1. 入口薄壳治理
   - `main.ts`
2. 路由工厂化
   - `router/index.ts`
3. 权限守卫工厂化
   - `plugins/permission.ts`
4. 权限 store 分层
   - `permission-store`
5. auth 登录/签名链路
   - `utils/request.ts`
   - `utils/auth.ts`
   - 登录初始化链路
6. system oauth / 权限模型
   - `views/oauth/**`
   - system 权限与菜单模型相关逻辑

P2 完成定义：
- 公共守卫骨架下沉
- app 只保留策略差异
- 认证/OAuth 私有逻辑不被误抽
- 路由与权限链路回归稳定

## 按任务功能拆分

### A 类：共享资源治理
- 图标统一
- 图片统一
- logo 统一
- 公共样式统一

分级：`P0`

### B 类：共享基础能力治理
- icons 插件统一
- vxeTable 插件统一
- nprogress 工具统一
- storage 工具统一
- router/shims 类型统一
- OperationColumn/Pagination 统一

分级：`P0`

### C 类：共享装配层治理
- plugins/index 装配工厂化
- App.vue 根壳统一
- settings 统一成 base 默认 + app override
- lang/store/system-api 继续下沉

分级：`P1`

### D 类：共享后台壳治理
- layouts 统一
- layout composables 统一
- 通用后台组件统一
- Breadcrumb / AppLink / CURD 等继续归并

分级：`P1`

### E 类：应用壳治理
- main.ts 薄壳化
- router/index.ts 工厂化
- permission.ts 工厂化
- permission-store wrapper 化

分级：`P2`

### F 类：业务边界治理
- auth 登录/注入/应用中心边界确认
- auth 签名请求链路边界确认
- system OAuth 边界确认
- system 管理域边界确认

分级：`P2`
说明：这类不是“共享改造”，而是“确认不共享”。

## 建议的确认方式

### 一级确认：战略边界
1. `packages/base` 是唯一共享实现来源
2. `apps/auth` / `apps/system` 只保留壳和业务
3. 业务私有域不以去重为目标

### 二级确认：模块分级
1. P0：资源 / 样式 / 基础插件 / 基础工具 / 基础类型 / 基础组件
2. P1：plugins/index / App.vue / settings / lang / store / system-api / layouts / 通用组件群
3. P2：main.ts / router / permission / permission-store / auth 登录签名链路 / system oauth

### 三级确认：实施批次
#### 批次 A
P0 全部内容

#### 批次 B
P1 的装配层和基础共享层：
- plugins/index
- App.vue
- settings
- lang/store/system-api

#### 批次 C
P1 的后台壳：
- layouts
- composables/layout
- 通用后台组件

#### 批次 D
P2 的路由权限专项：
- main.ts
- router
- permission
- permission-store

#### 批次 E
P2 的业务边界专项：
- auth 登录/签名
- system oauth/权限模型

## 当前建议结论

### 已确认 P0
- 资源
- 样式
- icons/vxeTable
- nprogress/storage
- router/shims 类型
- OperationColumn/Pagination

### 已确认 P1
- plugins/index
- App.vue
- settings.ts
- lang/store/system-api
- layouts/components/composables
- Breadcrumb/AppLink/通用组件群

### 已确认 P2
- main.ts
- router/index.ts
- permission.ts
- permission-store
- auth 登录/签名链路
- system oauth/权限模型

### 已确认永久私有
- auth：login / inject / app-center / auth-api / auth utils / request / user store
- system：system views / oauth / dashboard

## 待办 Checklist

### P0 待办
- [x] 统一 `assets/icons/*`
- [x] 统一 `assets/images/*`
- [x] 统一 `logo.png`
- [x] 统一公共样式入口与 reset / element-plus / vxe-table / dark vars
- [x] 统一 `plugins/icons.ts`
- [x] 统一 `plugins/vxeTable.ts`
- [x] 统一 `utils/nprogress.ts`
- [x] 统一 `utils/storage.ts`
- [x] 统一 `types/router.d.ts`
- [x] 统一 `types/shims-vue.d.ts`
- [x] 统一 `components/OperationColumn`
- [x] 统一 `components/Pagination`

### P1 待办
- [x] 抽取 `plugins/index.ts` 公共装配流程
- [x] 抽取 `App.vue` 公共根壳
- [x] 统一 `settings.ts` 为 base 默认配置 + app override
- [x] 收敛 `lang/index.ts`
- [x] 收敛 `store/modules/app-store.ts`
- [x] 收敛 `store/modules/dict-store.ts`
- [x] 收敛 `api/system/config-api.ts`
- [x] 收敛 `api/system/dept-api.ts`
- [x] 收敛 `api/system/dict-api.ts`
- [x] 收敛 `layouts/**`
- [x] 收敛 `composables/layout/**`
- [x] 收敛 `Breadcrumb`
- [x] 收敛 `AppLink`
- [x] 收敛 `Dict / WangEditor / TableSelect`
- [x] 收敛 `CURD` 组件骨架与类型出口
- [x] 清理 auth 全局组件类型中的遗留本地入口
- [x] 删除 `Dict` wrapper 并改为页面直接引用 base
- [x] 删除 `WangEditor` wrapper，保留全局类型直指 base
- [x] 删除 `TableSelect` wrapper，保留全局类型直指 base
- [x] 删除未使用的 `CURD/PageSearch.vue`、`PageContent.vue`、`PageModal.vue`、`types.ts`
- [x] 复查 `CURD/usePage.ts` 是否仍需保留
- [x] 复查 `CURD/**` 是否仍需保留桥接层
- [x] 收敛 `Upload/**`
- [x] 复查 `TextScroll / IconSelect / Hamburger / ECharts / InputTag`
- [ ] 复查 `layouts/components/Menu/BasicMenu.vue` 是否保留 auth 差异实现
- [ ] 完成通用后台组件群收尾并关闭批次 C

### P2 待办
- [ ] 薄壳化 `main.ts`
- [x] 工厂化 `router/index.ts`
- [x] 工厂化 `plugins/permission.ts`
- [x] 分层 `permission-store`
- [ ] 统一 `permission-store` 新旧接口兼容（如 `isRouteGenerated` 读法）
- [ ] 复查 auth 登录/签名链路边界
- [ ] 复查 system OAuth / 权限模型边界
- [ ] 收尾 auth 非视图残留（`settings-store.ts` / `types/global.d.ts` / `AiAssistant`）

## 实施批次清单

### 批次 A：P0 纯重复收敛
- 静态资源：icons / images / logo
- 公共样式：`styles/**`
- 基础插件：`icons.ts` / `vxeTable.ts`
- 基础工具：`nprogress.ts` / `storage.ts`
- 基础类型：`router.d.ts` / `shims-vue.d.ts`
- 基础组件：`OperationColumn` / `Pagination`

**目标**：先清掉纯重复副本，快速建立“公共能力只从 base 来”的基线。

### 批次 B：P1 装配层与共享基础层收敛
- `plugins/index.ts`
- `App.vue`
- `settings.ts`
- `lang/index.ts`
- `store/modules/app-store.ts`
- `store/modules/dict-store.ts`
- `api/system/*`

**目标**：把共享接线逻辑、共享配置模型、共享基础 store/api 下沉到 base。

### 批次 C：P1 后台壳与通用组件收敛
- `layouts/**`
- `composables/layout/**`
- `Breadcrumb`
- `AppLink`
- 其他后台通用组件群

**目标**：让后台壳与通用 UI 只在 base 中演进。

### 批次 D：P2 路由权限专项
- `main.ts`
- `router/index.ts`
- `plugins/permission.ts`
- `permission-store`

**目标**：抽公共骨架，保留 app 差异策略，避免粗暴合并导致登录和动态路由回归。

**当前进度（2026-04-01）**：
- `router/index.ts` 已完成工厂化：`packages/base/router/index.ts` 已提供共享 `createAppRouter` / `setupRouter`，auth/system 两端 router 已降为静态路由配置 + base 工厂薄壳。
- `plugins/permission.ts` 已完成工厂化：`packages/base/plugins/permission.ts` 已提供 `setupPermissionGuard`，标题处理、登录态判断、动态路由注入、404 与 `NProgress` 生命周期已下沉到 base。
- `permission-store` 已完成分层：`packages/base/store/modules/permission-store.ts` 已提供 `createPermissionStore`，auth/system 仅保留菜单来源、transformRoutes、removeRoute wrapper。
- `main.ts` 薄壳化尚未完成：auth 仍本地负责 `createApp`、样式导入、插件注册、挂载；system 虽已有更多 base 初始化，但两端仍未统一成共享 bootstrap。
- 当前主要收尾点：统一 `permission-store` 新旧接口兼容（如 `isRouteGenerated` 的读法）、复查 auth/system 私有边界、完成路由权限回归验证。

### 批次 E：P2 业务边界专项
- auth 登录链路
- auth 签名请求链路
- system OAuth 链路
- system 权限模型边界

**目标**：明确哪些必须私有，哪些只是当前混杂了私有逻辑的公共壳层。

## 文件级任务表

| 分级 | 任务项 | 关键文件/目录 | 目标动作 | 结果要求 |
|---|---|---|---|---|
| P0 | 静态资源统一 | `apps/auth/src/assets/**`, `apps/system/src/assets/**`, `packages/base/assets/**` | 删除 app 重复副本，统一改引用 | 资源仅保留 base 一份 |
| P0 | 公共样式统一 | `apps/*/src/styles/**`, `packages/base/styles/**` | 删除重复样式，统一引 base | 公共样式只从 base 进入 |
| P0 | 基础插件统一 | `apps/*/src/plugins/icons.ts`, `apps/*/src/plugins/vxeTable.ts`, `packages/base/plugins/*` | 清理重复插件文件 | 插件只保留 base 实现 |
| P0 | 基础工具统一 | `apps/*/src/utils/nprogress.ts`, `apps/*/src/utils/storage.ts`, `packages/base/utils/*` | 清理重复工具文件 | 工具只保留 base 实现 |
| P0 | 基础类型统一 | `apps/*/src/types/router.d.ts`, `apps/*/src/types/shims-vue.d.ts`, `packages/base/types/*` | 删除重复类型定义 | 类型统一由 base 维护 |
| P0 | 基础组件统一 | `apps/*/src/components/OperationColumn`, `apps/*/src/components/Pagination`, `packages/base/components/*` | 删除重复组件副本 | 标准组件统一由 base 提供 |
| P1 | 插件总装配收敛 | `apps/auth/src/plugins/index.ts`, `apps/system/src/plugins/index.ts` | 提炼公共装配流程 | app 只保留差异接线 |
| P1 | 根组件壳收敛 | `apps/auth/src/App.vue`, `apps/system/src/App.vue` | 提炼公共 AppShell | 根壳逻辑统一 |
| P1 | 设置模型收敛 | `apps/auth/src/settings.ts`, `apps/system/src/settings.ts`, `packages/base/base_settings.ts` | 通用项下沉，app 保留 override | settings 不再双份维护 |
| P1 | 国际化收敛 | `apps/*/src/lang/index.ts`, `packages/base/lang/index.ts` | 统一语言初始化 | i18n 初始化只维护一份 |
| P1 | store 收敛 | `apps/*/src/store/modules/app-store.ts`, `dict-store.ts`, `packages/base/store/modules/*` | 下沉共享 store | app 仅保留业务 store |
| P1 | system API 收敛 | `apps/auth/src/api/system/*`, `packages/base/api/system/*` | 统一 API 出口 | 通用 system API 只维护一份 |
| P1 | 布局壳收敛 | `apps/auth/src/layouts/**`, `packages/base/layouts/**` | 继续复用或迁移到 base | 后台壳只在 base 演进 |
| P1 | 通用组件群收敛 | `apps/auth/src/components/**`, `packages/base/components/**` | 逐批识别并迁移 | 组件保留需说明业务专属性 |
| P2 | 入口薄壳化 | `apps/auth/src/main.ts`, `apps/system/src/main.ts` | 提炼公共初始化 | main.ts 只保留 app 启动壳 |
| P2 | 路由工厂化 | `apps/auth/src/router/index.ts`, `apps/system/src/router/index.ts` | 下沉 router 创建逻辑 | app 只保留路由表 |
| P2 | 权限守卫工厂化 | `apps/auth/src/plugins/permission.ts`, `apps/system/src/plugins/permission.ts` | 提炼守卫骨架 | app 只保留策略差异 |
| P2 | 权限 store 分层 | `apps/auth/src/store/modules/permission-store.ts`, `apps/system/src/plugins/permission-store.ts` | 分离共性和特例 | 权限模型边界清晰 |
| P2 | auth 私有边界确认 | `apps/auth/src/views/login/**`, `inject/**`, `app-center/**`, `utils/auth.ts`, `utils/request.ts` | 保留私有并剥离共性 | 认证链路不误收敛 |
| P2 | system 私有边界确认 | `apps/system/src/views/oauth/**`, `views/system/**`, `views/dashboard/**` | 保留私有并剥离共性 | system 业务域不误收敛 |

## 今日归档（2026-03-24)

### 今日完成

#### 1. 收敛 `apps/auth/src/composables/layout/**`
已将 auth 侧布局 composables 改为直接转发 base 实现：
- `apps/auth/src/composables/layout/useLayout.ts`
- `apps/auth/src/composables/layout/useLayoutMenu.ts`
- `apps/auth/src/composables/layout/useDeviceDetection.ts`

结果：`composables/layout/**` 已完成收敛，后续布局逻辑统一从 `packages/base/composables/layout/**` 演进。

#### 2. 收敛 `apps/auth/src/layouts/**`
已将 auth 侧布局主壳与 mode 大批量压缩为 base wrapper：
- `apps/auth/src/layouts/index.vue`
- `apps/auth/src/layouts/modes/base/index.vue`
- `apps/auth/src/layouts/modes/left/index.vue`
- `apps/auth/src/layouts/modes/top/index.vue`
- `apps/auth/src/layouts/modes/mix/index.vue`

同时已将下列布局组件改为直接复用 base：
- `apps/auth/src/layouts/components/Settings/index.vue`
- `apps/auth/src/layouts/components/AppLogo/index.vue`
- `apps/auth/src/layouts/components/TagsView/index.vue`

补充确认：
- `apps/auth/src/layouts/components/NavBar/index.vue`
- `apps/auth/src/layouts/components/AppMain/index.vue`
- `apps/auth/src/layouts/components/Menu/MixTopMenu.vue`
- `apps/auth/src/layouts/components/Menu/components/MenuItemContent.vue`
- `apps/auth/src/layouts/components/Menu/components/MenuItem.vue`

其中多项在本次推进前就已处于 wrapper 状态。

结果：`layouts/**` 已基本完成收敛，auth 后台壳已以 `packages/base/layouts/**` 为唯一主实现来源。

#### 3. 收敛通用后台组件群的类型与引用
已先完成 `apps/auth/src/types/components.d.ts` 的一轮归并，把一批全局组件类型声明从 auth 本地 wrapper 路径切换到 `@root/base`：
- `CopyButton`
- `Dict`
- `DictLabel`
- `ECharts`
- `FileUpload`
- `Fullscreen`
- `Hamburger`
- `IconSelect`
- `LangSelect`
- `MenuSearch`
- `MultiImageUpload`
- `Notification`
- `SingleImageUpload`
- `SizeSelect`
- `WangEditor`

并继续收敛 layout 内部对 auth wrapper 的直接依赖：
- `apps/auth/src/layouts/components/NavBar/components/NavbarActions.vue`
  已改为直接引用：
  - `@root/base/components/MenuSearch/index.vue`
  - `@root/base/components/Fullscreen/index.vue`
  - `@root/base/components/SizeSelect/index.vue`
  - `@root/base/components/LangSelect/index.vue`
  - `@root/base/components/Notification/index.vue`

结果：这批通用组件在“类型声明层”和“layout 引用层”已基本脱离 auth 本地 wrapper 入口。

### 今日结论
- `composables/layout/**`：已完成
- `layouts/**`：已完成
- 通用后台组件群：已完成第一轮类型与引用收敛，但物理删除与薄壳清理尚未全部完成

### 当前遗留
以下组件/目录仍需继续判断是“可删除 wrapper”还是“需保留薄包装层”：
- `apps/auth/src/components/TableSelect/index.vue`
- `apps/auth/src/components/Upload/**`
- `apps/auth/src/components/CURD/**`
- `apps/auth/src/components/TextScroll/index.vue`
- `apps/auth/src/components/IconSelect/index.vue`
- `apps/auth/src/components/Hamburger/index.vue`
- `apps/auth/src/components/ECharts/index.vue`
- `apps/auth/src/components/InputTag/index.vue`

保留原因主要包括：
- slot 转发
- emit 转发
- `defineExpose` 桥接
- 默认 props 包装
- 类型桥接

### 下一步建议
继续完成 P1 的“通用后台组件群”收尾，优先顺序：
1. 识别并删除真正已经无人依赖的 auth wrapper 文件
2. 对 `CURD / Upload / TableSelect` 这类仍承担桥接职责的文件，决定保留薄壳还是继续下沉抽象
3. 完成后再统一回看 P1 Checklist，仅在 P1 全部结束后进入 P2

## 今日归档（2026-03-25）

### 今日完成

#### 1. 收敛 auth 通用组件 wrapper
已将下列 auth 侧通用组件压缩为直接转发 base 实现：
- `apps/auth/src/components/Dict/index.vue`
- `apps/auth/src/components/WangEditor/index.vue`
- `apps/auth/src/components/TableSelect/index.vue`

当前结果：
- `Dict` 已直接复用 `@root/base/components/Dict/index.vue`，并在本轮继续下沉为页面直接引用 base；`apps/auth/src/components/Dict/index.vue` 已删除。
- `WangEditor` 原本仅保留高度默认值与 `v-model` 薄包装；由于 base 组件自身已内置相同的 `height = "500px"` 默认值，因此 `apps/auth/src/components/WangEditor/index.vue` 已删除。
- `TableSelect` 原本主要承担 slot 转发与 `confirmClick` 事件桥接；本轮复查发现 auth 侧已无实际调用方依赖该本地 wrapper，因此 `apps/auth/src/components/TableSelect/index.vue` 已删除，保留全局类型直指 `@root/base/components/TableSelect/index.vue`。

结论：`Dict`、`WangEditor`、`TableSelect` 已全部完成从 auth wrapper 到直接 base 引用/注册的收尾。

#### 2. 收敛 auth 的 `CURD/**`
已将下列 CURD 组件切换为 base 主实现来源：
- `apps/auth/src/components/CURD/PageSearch.vue`
- `apps/auth/src/components/CURD/PageContent.vue`
- `apps/auth/src/components/CURD/PageModal.vue`
- `apps/auth/src/components/CURD/types.ts`

同时确认：
- `PageSearch.vue`、`PageContent.vue`、`PageModal.vue` 在上一阶段已改为直接复用 `@root/base/components/CURD/**`。
- `types.ts` 已改为直接转发 `@root/base/components/CURD/types`。
- 本轮继续沿调用链复查，未检出 auth 页面或其他模块对上述四个文件的实际外部引用，因此已删除这些遗留 wrapper / type forwarding 文件。
- `usePage.ts` 虽仍保留在 auth 侧，但它承载的是页面联动与弹窗控制等组合逻辑，不属于简单 wrapper；当前也尚未检出外部使用，需在后续单独复查其保留必要性。

结论：`CURD/**` 已完成大部分物理清理，auth 侧仅剩 `usePage.ts` 待最终确认。

### 今日结论
- 通用后台组件群已不再只是“类型与引用收敛”，而是进入了“wrapper 薄壳化收尾”阶段。
- `Dict`、`WangEditor`、`TableSelect` 已全部完成从 auth wrapper 到直接 base 引用/注册的收尾。
- `CURD/PageSearch.vue`、`PageContent.vue`、`PageModal.vue`、`types.ts` 在确认无实际外部调用后已删除，`apps/auth/src/types/components.d.ts` 中对应全局组件类型继续直接指向 `@root/base`。
- 后续重点已缩小为：继续确认 `CURD/usePage.ts` 是否仍需保留，以及检查其他历史组件入口是否还存在残余清理点。

### 当前遗留
以下内容仍建议继续复查：
- `apps/auth/src/layouts/components/Menu/BasicMenu.vue`

当前结论：
- `apps/auth/src/components/CURD/usePage.ts` 已确认无外部调用并已删除。
- `Upload / TextScroll / IconSelect / Hamburger / ECharts / InputTag` 当前已不再体现为 auth 本地实现文件，类型入口也已切到 `@root/base` 或 Element Plus，未检出 auth 本地残余引用。
- 批次 C 当前主要阻塞项已收敛到 `BasicMenu.vue`：它仍是 auth 本地实现，且直接依赖 auth 本地 `store` 与 `utils`，需要进一步判断是保留为 auth 差异实现，还是继续下沉到 base。

### 下一步建议
继续完成 P1 的“通用后台组件群”收尾，优先顺序：
1. 先处理 `apps/auth/src/layouts/components/Menu/BasicMenu.vue`，判断它应保留为 auth 差异实现，还是继续收敛到 `packages/base`。
2. 基于 `BasicMenu.vue` 的归类结果，更新 P1 Checklist 与批次 C 结论。
3. 仅在批次 C 的阻塞项明确关闭后，再进入 P2。

## 今日归档（2026-04-01）

### 今日完成

#### 1. 完成 P2 的 router 工厂化
已将 router 创建逻辑收敛到 `packages/base/router/index.ts`：
- 新增共享 `createAppRouter` / `setupRouter`
- `apps/auth/src/router/index.ts`
- `apps/system/src/router/index.ts`

当前结果：
- app 侧不再各自直接维护 `createRouter/createWebHashHistory`
- auth/system router 文件已降级为“静态路由配置 + 调用 base router 工厂”的薄壳

#### 2. 完成 P2 的权限守卫工厂化
已将公共守卫骨架收敛到 `packages/base/plugins/permission.ts`：
- 新增共享 `setupPermissionGuard`
- `apps/auth/src/plugins/permission.ts`
- `apps/system/src/plugins/permission.ts`

当前结果：
- 标题设置、登录态判断主流程、动态路由注入、404 兜底、`NProgress` 生命周期已下沉到 base
- auth/system 侧只保留白名单、未登录跳转、已登录后策略、异常回跳等策略差异

#### 3. 完成 P2 的 permission-store 分层骨架
已将动态路由状态骨架收敛到 `packages/base/store/modules/permission-store.ts`：
- 新增共享 `createPermissionStore`
- `apps/auth/src/store/modules/permission-store.ts`
- `apps/system/src/plugins/permission-store.ts`

当前结果：
- 路由状态、混合布局菜单状态、生成/重置逻辑已统一沉到 base
- auth/system 仅保留菜单来源、`transformRoutes`、`removeRoute` wrapper

### 今日结论
- P2 的核心骨架抽取已实质完成：`router/index.ts`、`plugins/permission.ts`、`permission-store` 已完成收敛。
- 当前 P2 已从“未开始”进入“核心完成、等待收尾”的阶段。

### 当前遗留
- `apps/auth/src/main.ts` 仍未完成薄壳化，`apps/system/src/main.ts` 也尚未统一成共享 bootstrap。
- `permission-store` 新旧接口兼容仍未完全收口：当前 base store 暴露 `isRouteGenerated` 为状态值，auth 按属性读取，system 仍按函数调用，需要下一轮统一。
- auth 非视图残留仍待定性：
  - `apps/auth/src/store/modules/settings-store.ts`
  - `apps/auth/src/types/global.d.ts`
  - `apps/auth/src/components/AiAssistant/index.vue`
- P2 业务边界专项仍未完成：
  - auth 登录/签名链路边界
  - system OAuth / 权限模型边界

### 下一步建议
1. 统一 `permission-store` 对外接口形态，优先收口 `isRouteGenerated` 的新旧读法。
2. 提炼共享 bootstrap，完成 auth/system `main.ts` 薄壳化。
3. 收尾 auth 非视图残留，并继续复查 P2 私有边界。
4. 完成 auth/system 路由与权限链路回归验证。

## 状态栏

| 类别 | 状态 | 说明 |
|---|---|---|
| 战略边界 | 已确认 | `packages/base` 作为唯一共享实现来源 |
| P0 范围 | 已完成 | 资源、样式、基础插件、基础工具、基础类型、基础组件已完成收敛；构建验证仍受本地依赖缺失阻塞 |
| P1 范围 | 进行中 | 批次 B 已完成；批次 C 中 `composables/layout/**` 与 `layouts/**` 已完成，通用组件群仍在继续清理 |
| P2 范围 | 进行中 | `router/index.ts`、`plugins/permission.ts`、`permission-store` 已完成收敛；`main.ts` 薄壳化、接口兼容收尾与边界复查待完成 |
| auth 私有边界 | 已确认 | login / inject / app-center / auth-api / auth utils / request / user store |
| system 私有边界 | 已确认 | system views / oauth / dashboard |
| 实施落地 | 进行中 | 批次 A、B 已完成；批次 C 基本收尾；已进入批次 D，且 router / permission / permission-store 已完成核心骨架抽取，但 `main.ts`、兼容性与边界专项仍未收尾 |
