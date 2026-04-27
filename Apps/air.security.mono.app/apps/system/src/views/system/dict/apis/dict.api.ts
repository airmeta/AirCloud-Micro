import request from '@root/base/utils/request';
import type { QueryResult } from '@root/base/components/air/AirTable/dtos/PageQuery';
import type { DictVO, DictTreeVO } from '../dtos/dict.dto';

const BASE = '/v1/security/dict';

const DictAPI = {
  /** 创建或更新字典配置 -> 返回是否成功 */
  save(data: any) {
    return request<any, boolean>({ url: `${BASE}/save`, method: 'post', data });
  },

  /** 删除字典配置 -> 返回是否成功 */
  remove(id: string) {
    return request<any, boolean>({ url: `${BASE}/remove/${id}`, method: 'delete' });
  },

  /** 分页查询 -> 返回 QueryResult<DictVO> */
  query(params?: any) {
    return request<any, QueryResult<DictVO>>({ url: `${BASE}/query`, method: 'post', data: params });
  },

  /** 树形查询 -> 返回 DictTreeVO[] */
  queryTree(params?: any) {
    return request<any, DictTreeVO[]>({ url: `${BASE}/query-tree`, method: 'post', data: params });
  },

  /** 基础（父级为空）查询 -> 返回 DictVO[] */
  queryBase(params?: any) {
    return request<any, DictVO[]>({ url: `${BASE}/query-base`, method: 'post', data: params });
  },

  /** 获取详情 -> 返回 DictVO */
  detail(id?: string) {
    return request<any, DictVO>({ url: `${BASE}/detail/${id}`, method: 'get' });
  }
};

export default DictAPI;
