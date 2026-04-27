export interface AirTableColumn<T = any> {
  /** 列类型：'selection' | 'index' | 'expand' 或自定义字符串 */
  type?: 'selection' | 'index' | 'expand' | string;
  /** 当 type=index 时，可传入基础序号或自定义函数（返回行索引，从1开始） */
  index?: number | ((index: number) => number) | ((row: T, index: number) => number);
  /** 列标题 */
  label?: string;
  /** 列的 key（用于 filter-change 等标识） */
  columnKey?: string;
  /** 对应字段名（支持点路径如 'user.name'） */
  prop?: string;
  /** 列宽 */
  width?: string | number;
  /** 最小列宽（可参与剩余宽度分配） */
  minWidth?: string | number;
  /** 是否固定，可为 true | 'left' | 'right' */
  fixed?: boolean | 'left' | 'right';
  /** 自定义表头渲染函数 */
  renderHeader?: (h: any, scope?: { column: AirTableColumn<T> }) => any;
  /** 是否可排序，或 'custom' 表示远程排序 */
  sortable?: boolean | 'custom';
  /** 自定义排序函数（同 Array.sort 返回 number） */
  sortMethod?: (a: T, b: T) => number;
  /** 排序字段/函数 或 字段数组（用于多级排序） */
  sortBy?: string | ((row: T) => any) | Array<string | ((row: T) => any)>;
  /** 排序轮转顺序 */
  sortOrders?: Array<'ascending' | 'descending' | null>;
  /** 是否可拖拽改变宽度 */
  resizable?: boolean;
  /** 单元格格式化函数： (cellValue, row, index) => string|VNode */
  formatter?: (cellValue: any, row: T, index: number) => any;
  /** 内容过长时显示 tooltip，或传入配置对象 */
  showOverflowTooltip?: boolean | Record<string, any>;
  /** 单元格对齐：'left' | 'center' | 'right' */
  align?: 'left' | 'center' | 'right';
  /** 表头对齐（未设置则继承表格对齐） */
  headerAlign?: 'left' | 'center' | 'right';
  /** 单元格自定义类名 */
  className?: string;
  /** 表头自定义类名 */
  labelClassName?: string;
  /** selection 列用：决定某行是否可选 */
  selectable?: (row: T, index: number) => boolean;
  /** 刷新数据后是否保留选择，仅对 selection 有效（需指定 row-key） */
  reserveSelection?: boolean;
  /** 过滤项数组：{ text, value }[] */
  filters?: Array<{ text: string; value: any }>;
  /** 过滤弹出框定位 */
  filterPlacement?: string;
  /** 过滤弹出框类名（2.5.0+） */
  filterClassName?: string;
  /** 过滤是否多选（默认 true） */
  filterMultiple?: boolean;
  /** 过滤方法： (value, row, column) => boolean */
  filterMethod?: (value: any, row: T, column: AirTableColumn<T>) => boolean;
  /** 当前已选中的过滤值（用于自定义表头过滤渲染） */
  filteredValue?: any[];
  /** show-overflow-tooltip 时自定义 tooltip 内容 (row, column) => string */
  tooltipFormatter?: (row: T, column: AirTableColumn<T>) => string;

  /** 以下为扩展字段，方便组件实现自定义渲染与传参 */
  /** 指定单元格使用的具名 scoped slot 名（父组件提供同名 slot 即可） */
  slot?: string;
  /** 额外属性会被直接 v-bind 到 el-table-column 上 */
  attrs?: Record<string, any>;
  /** 备用 key 字段（可与 columnKey 二选一） */
  key?: string;
}