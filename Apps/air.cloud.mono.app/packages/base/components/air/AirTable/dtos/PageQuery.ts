// packages/base/components/air/AirTable/dtos/PageQuery.ts

export type IDictionary<T = any> = Record<string, T>;

export interface PageInfo {
  page: number;
  limit: number;
  total?: number;
  [key: string]: any;
}

export interface QueryResult<T = any> {
  list: T[];
  page: PageInfo;
}

/**
 * 通用请求函数类型。接收查询参数，返回任意 Promise，
 * query 方法会尝试从返回值中解析出 { list, total, page } 等字段。
 */
export type Requester = (params: Record<string, any>) => Promise<any>;

export class PageQuery<T = any> {
  page: number;
  limit: number;
  data: IDictionary<any>;

  constructor(page = 1, limit = 10, data: IDictionary<any> = {}) {
    this.page = page;
    this.limit = limit;
    this.data = data;
  }

  setPage(page: number) {
    this.page = page;
    return this;
  }

  setLimit(limit: number) {
    this.limit = limit;
    return this;
  }

  setData(data: IDictionary<any>) {
    this.data = data;
    return this;
  }

  toParams(): Record<string, any> {
    return {
      page: this.page,
      limit: this.limit,
      ...(this.data || {}),
    };
  }
  /**
   * 执行查询。
   * - request: 一个返回 Promise 的函数（例如 axiosInstance 或封装的 API 方法）。
   * - 返回值会被解析为 QueryResult<T>，解析规则：优先使用 resp.data，接着尝试 resp.list / resp.records / resp.items；
   *   total 会尝试从 resp.total / resp.totalCount / resp.count / resp.page.total 中读取。
   */
  async query(request: Requester): Promise<QueryResult<T>> {
    const params = this.toParams();
    const resp = await request(params);

    const payload = resp && resp.data ? resp.data : resp || {};

    const list: T[] =
      payload.list ?? payload.records ?? payload.items ?? payload.rows ?? [];

    const total =
      payload.total ??
      payload.totalCount ??
      payload.count ??
      (payload.page && payload.page.total) ??
      undefined;

    const pageFromPayload: Partial<PageInfo> = payload.page ?? {};

    const page: PageInfo = {
      page: pageFromPayload.page ?? this.page,
      limit: pageFromPayload.limit ?? this.limit,
      total: pageFromPayload.total ?? total,
      ...pageFromPayload,
    };

    return { list, page };
  }
}


export type MaybeRef<T> = T | { value?: T } | null;