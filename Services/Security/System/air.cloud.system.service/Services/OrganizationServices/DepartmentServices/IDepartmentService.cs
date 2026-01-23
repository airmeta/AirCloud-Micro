using air.cloud.security.common.Base.Dtos;
using air.cloud.system.model.Dtos.OrganizationDtos.DepartmentDtos;

using Air.Cloud.Core.Standard.DynamicServer;

namespace air.cloud.system.service.Services.OrganizationServices.DepartmentServices
{
    public interface IDepartmentService:IDynamicService,ITransient
    {
        /// <summary>
        /// 创建部门信息
        /// </summary>
        /// <returns></returns>
        public Task<bool> SaveDepartmentAsync(DepartmentSDto dto);
        /// <summary>
        /// 删除部门信息
        /// </summary>
        /// <param name="departmentId"></param>
        /// <returns></returns>
        public Task<bool> DeleteDepartmentAsync(string departmentId);

        /// <summary>
        /// 查询部门信息
        /// </summary>
        /// <param name="Info"></param>
        /// <returns></returns>
        public Task<List<DepartmentTreeDto>> QueryDepartmentsAsync(BaseQDto dto);
        /// <summary>
        /// 查询部门详情
        /// </summary>
        /// <param name="departmentId"></param>
        /// <returns></returns>
        public Task<DepartmentSDto> GetDepartmentAsync(string departmentId);

        /// <summary>
        /// 分配区域给部门
        /// </summary>
        /// <param name="departmentId"></param>
        /// <param name="regionId"></param>
        /// <returns></returns>
        public Task<bool> AssignRegionToDepartmentAsync(string departmentId, string regionId);


        /// <summary>
        /// 取消部门区域管理权限
        /// </summary>
        /// <param name="departmentId"></param>
        /// <returns></returns>
        public Task<bool> RemoveRegionFromDepartmentAsync(string departmentId, string regionId);


    }
}
