// packages/components/src/install.ts
import type { App, Component } from 'vue'

// 导入所有公共组件（可通过 vite 自动导入，或手动导入）
import AppLink from './AppLink/index.vue';
import Breadcrumb from './Breadcrumb/index.vue';
import CommonWrapper from './CommonWrapper/index.vue';
import CopyButton from './CopyButton/index.vue';
// import CURD from './CURD/index.vue';
import DarkModeSwitch from './DarkModeSwitch/index.vue';
import Dict from './Dict/index.vue';

import ECharts from './ECharts/index.vue';
import Fullscreen from './Fullscreen/index.vue';
import Hamburger from './Hamburger/index.vue';
import IconSelect from './IconSelect/index.vue';

import InputTag from './InputTag/index.vue';
import LangSelect from './LangSelect/index.vue';
import MenuSearch from './MenuSearch/index.vue';
import Notification from './Notification/index.vue'

import OperationColumn from './OperationColumn/index.vue';
import Pagination from './Pagination/index.vue';
import SizeSelect from './SizeSelect/index.vue';
import TableSelect from './TableSelect/index.vue';
import TextScroll from './TextScroll/index.vue';
import FileUpload from './Upload/FileUpload.vue';
import MultiImageUpload from './Upload/MultiImageUpload.vue';
import SingleImageUpload from './Upload/SingleImageUpload.vue';
import WangEditor from './WangEditor/index.vue';




// 定义组件列表（key 为组件名，value 为组件实例）
const components: Record<string, Component> = {
    AppLink,
    Breadcrumb,
    CommonWrapper,
    CopyButton,
    // CURD,
    DarkModeSwitch,
    Dict,
    ECharts,
    Fullscreen,
    Hamburger,
    IconSelect,
    InputTag,
    LangSelect,
    MenuSearch,
    Notification,
    OperationColumn,
    Pagination,
    SizeSelect,
    TableSelect,
    TextScroll,
    FileUpload,
    MultiImageUpload,
    SingleImageUpload,
    WangEditor
}

// 全局注册方法（核心：动态挂载所有组件）
export const install = (app: App) => {
  // 遍历组件列表，动态注册为全局组件
  Object.entries(components).forEach(([name, component]) => {
    app.component(name, component)
  })
}

// 导出单个组件，支持局部按需挂载
export {  
    AppLink,
    Breadcrumb,
    CommonWrapper,
    CopyButton,
    // CURD,
    DarkModeSwitch,
    Dict,
    ECharts,
    Fullscreen,
    Hamburger,
    IconSelect,
    InputTag,
    LangSelect,
    MenuSearch,
    Notification,
    OperationColumn,
    Pagination,
    SizeSelect,
    TableSelect,
    TextScroll,
    FileUpload,
    MultiImageUpload,
    SingleImageUpload,
    WangEditor 
}

// 导出组件库对象，方便子项目引入
export default {
  install,
  ...components
}