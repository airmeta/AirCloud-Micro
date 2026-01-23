using air.cloud.system.model.Dtos.RegionDtos;
using air.cloud.system.model.Entitys;
using air.cloud.security.common.Base.Dtos;
using air.cloud.security.common.Model;
using air.cloud.system.model.Dtos.RoleDtos;

using Air.Cloud.Core.Standard.DataBase.Domains;
using Air.Cloud.Core.Standard.DynamicServer;

namespace air.cloud.system.model.Domains.RegionDomains
{
    public interface IRegionDomain : IEntityDomain, ITransient
    {
        /// <summary>
        /// 创建区域信息
        /// </summary>
        /// <param name="dto"></param>
        /// <returns></returns>
        public Task<bool> CreateRegionAsync(RegionSDto dto);


        /// <summary>
        /// 检查区域编码是否存在
        /// </summary>
        /// <param name="Code"></param>
        /// <returns></returns>
        public Task<bool> ExitRegionAsync(string Code);

        /// <summary>
        /// 删除区域信息
        /// </summary>
        /// <param name="dto"></param>
        /// <returns></returns>
        public Task<bool> DeleteRegionAsync(string  RegionId);

        /// <summary>
        /// 更新区域信息
        /// </summary>
        /// <param name="dto"></param>
        /// <returns></returns>
        public Task<bool> UpdateRegionAsync(RegionSDto dto);

        /// <summary>
        /// 查询区域
        /// </summary>
        /// <param name="dto"></param>
        /// <returns></returns>
        public Task<IList<RegionTreeDto>> QueryRegionsTreeAsync(BaseQDto dto);

        /// <summary>
        /// 获取单个区域
        /// </summary>
        /// <returns></returns>
        public Task<Region> GetRegionAsync(string RegionId);

    }
}
