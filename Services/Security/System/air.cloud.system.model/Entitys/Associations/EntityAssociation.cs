using air.cloud.security.common.Base;
using air.cloud.security.common.Enums;
using air.cloud.system.model.Consts;

namespace air.cloud.system.model.Entitys.Associations
{
    /// <summary>
    /// 实体映射关联表
    /// </summary>
    [Table("SYS_ENTITY_ASSOCIATION")]
    public class EntityAssociation:CreateEntityBase
    {
        /// <summary>
        /// 源实体Id
        /// </summary>
        [Column("SOURCE_ENTITY_ID")]
        public string SourceEntityId { get; set; }

        /// <summary>
        /// 目标实体Id
        /// </summary>
        [Column("TARGET_ENTITY_ID")]
        public string TargetEntityId { get; set; }

        /// <summary>
        /// 关联类型
        /// </summary>
        [Column("ASSOCIATION_TYPE")]
        public AssociationTypeEnum AssociationType { get; set; }

        /// <summary>
        /// <para>zh-cn:所属应用</para>
        /// <para>en-us:Belonging Application</para>
        /// </summary>
        [Column("APP_ID")]
        public string AppId { get; set; }



    }
}
