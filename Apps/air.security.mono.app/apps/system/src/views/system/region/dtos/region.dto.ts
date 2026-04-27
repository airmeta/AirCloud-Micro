/**
 * 区域相关 DTOs
 */

export enum RegionTypeEnum {
  // 0: 市区
  District = 0,
  // 1: 县区
  County = 1,
  // 2: 乡镇/街道
  Town = 2,
  // 3: 村/社居委
  Village = 3,
}

/**
 * RegionForm 表单数据
 */
export interface RegionForm {
  /**
   * zh-cn: 区域编号
   * en-us: Region Id
   */
  id: string;

  /**
   * zh-cn: 区域编码
   * en-us: Region Code
   */
  code: string;

  /**
   * zh-cn: 区域名称
   * en-us: Region Name
   */
  name: string;

  /**
   * zh-cn: 区域类型
   * en-us: Region Type
   * Template: 0:市区 1:县区 2:乡镇/街道 3:村/社居委
   */
  type: RegionTypeEnum;

  /**
   * zh-cn: 实际上级区域编号
   * en-us: Parent Id
   */
  parentId?: string | null;

  /**
   * zh-cn: 名义上级区域编号(可选,在某些片区的情形下需要此字段作为归属区域判断)
   * en-us: Parent Region Id (Optional, used for certain scenarios)
   */
  parentRegionId?: string | null;

  /**
   * zh-cn: 区域描述
   * en-us: Region Description
   */
  description?: string | null;

  /**
   * zh-cn: 经纬度及卫星定位信息
   * en-us: Longitude, Latitude and Satellite Information
   */
  lngAndSat?: string | null;

  /**
   * zh-cn: 所属应用编号
   * en-us: App Id
   */
  appId: string;
}

/**
 * RegionVO（用于树形结构返回）
 */
export interface RegionVO {
  /**
   * 区域编码
   */
  id: string;

  /**
   * 区域编码
   */
  code: string;

  /**
   * 区域名称
   */
  name: string;

  /**
   * 区域类型
   */
  type: RegionTypeEnum;

  /**
   * 父级区域编码
   */
  parentId?: string | null;

  /**
   * 上级区域编码(可选)
   */
  parentRegionId?: string | null;

  /**
   * 描述
   */
  description?: string | null;

  /**
   * 中心点坐标
   */
  lngAndSat?: string | null;

  /**
   * 区域对应的应用ID
   */
  appId: string;

  /**
   * 下级区域
   */
  children?: RegionVO[];
}
