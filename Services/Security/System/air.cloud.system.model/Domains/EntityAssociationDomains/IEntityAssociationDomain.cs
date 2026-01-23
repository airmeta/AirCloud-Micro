using air.cloud.system.model.Entitys.Associations;
using air.cloud.security.common.Enums;

using Air.Cloud.Core.Standard.DataBase.Domains;
using Air.Cloud.Core.Standard.DynamicServer;

namespace air.cloud.system.model.Domains.EntityAssociationDomains
{
    public interface IEntityAssociationDomain: ITransient, IEntityDomain
    {

        /// <summary>
        /// 判断实体是否有某种关联存在
        /// </summary>
        /// <param name="EntityId"></param>
        /// <param name="associationType"></param>
        /// <param name="AppId"></param>
        /// <returns></returns>
        public Task<bool> ExitsEntityAssignAsync(string EntityId, string AppId, AssociationTypeEnum associationType);

        /// <summary>
        ///  增加实体关联
        /// </summary>
        /// <param name="SoureEntityId">源实体编号</param>
        /// <param name="TargetEntityId">目标实体编号</param>
        /// <param name="associationType">关联类型</param>
        /// <param name="AppId">应用ID</param>
        /// <returns></returns>
        public Task<bool> AddEntityAssignAsync(string SoureEntityId, string TargetEntityId, AssociationTypeEnum associationType,string AppId);

        /// <summary>
        /// 删除实体关联
        /// </summary>
        /// <param name="SoureEntityId">源实体编号</param>
        /// <param name="TargetEntityId">目标实体编号</param>
        /// <param name="associationType">关联类型</param>
        /// <param name="AppId">应用ID</param>
        /// <returns></returns>
        public Task<bool> RemoveEntityAssignAsync(string SoureEntityId, string TargetEntityId, AssociationTypeEnum associationType,string AppId);

        /// <summary>
        /// 查询某个实体的关联
        /// </summary>
        /// <param name="entityId">实体编号</param>
        /// <param name="appId">应用ID</param>
        /// <returns></returns>
        public Task<IList<EntityAssociation>> GetEntityAssociationsAsync(string entityId, string appId, params AssociationTypeEnum[]  associationTypeEnums);

        /// <summary>
        /// 查询多个实体的关联
        /// </summary>
        /// <param name="entityIds"></param>
        /// <param name="appId"></param>
        /// <param name="associationTypeEnums"></param>
        /// <returns></returns>
        public Task<IList<EntityAssociation>> GetEntityAssociationsAsync(IList<string> entityIds, string appId, params AssociationTypeEnum[] associationTypeEnums);

        /// <summary>
        /// 查询某实体的关联（返回查询对象）
        /// </summary>
        /// <param name="entityId"></param>
        /// <param name="appId"></param>
        /// <param name="associationTypeEnums"></param>
        /// <returns></returns>
        public Task<IQueryable<EntityAssociation>> GetEntityAssociationsQueryableAsync(string entityId, string appId, params AssociationTypeEnum[] associationTypeEnums);
        /// <summary>
        /// 查询多个实体的关联（返回查询对象）
        /// </summary>
        /// <param name="entityIds"></param>
        /// <param name="appId"></param>
        /// <param name="associationTypeEnums"></param>
        /// <returns></returns>
        public Task<IQueryable<EntityAssociation>> GetEntityAssociationsQueryableAsync(IList<string> entityIds, string appId, params AssociationTypeEnum[] associationTypeEnums);

        /// <summary>
        /// 转移实体关联
        /// </summary>
        /// <param name="oldTargetEntityId">旧的目标实体编号</param>
        /// <param name="newTargetEntityId">新的目标实体编号</param>
        /// <param name="associationType">关联类型</param>
        /// <param name="appId">应用ID</param>
        /// <returns></returns>
        public Task<bool> MergeEntityAssignsAsync(string oldTargetEntityId, string newTargetEntityId, AssociationTypeEnum associationType, string appId);

        /// <summary>
        /// 清空实体关联
        /// </summary>
        /// <param name="EntityId"></param>
        /// <param name="appId"></param>
        /// <param name="associationTypeEnums"></param>
        /// <returns></returns>
        public Task<bool> TruncateEntityAssignAsync(string EntityId,string appId,params AssociationTypeEnum[] associationTypeEnums);


        /// <summary>
        /// 复制实体关联
        /// </summary>
        /// <param name="sourceEntityId"></param>
        /// <param name="targetEntityId"></param>
        /// <param name="associationType"></param>
        /// <param name="appId"></param>
        /// <returns></returns>
        public Task<bool> CopyEntityAssignsAsync(string sourceEntityId, string targetEntityId, string appId,params AssociationTypeEnum[] associationTypeEnums);


    }
}
