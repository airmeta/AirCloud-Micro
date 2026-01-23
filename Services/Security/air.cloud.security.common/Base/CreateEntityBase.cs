using Air.Cloud.Core.Standard.DataBase.Locators;
using Air.Cloud.Core.Standard.DataBase.Model;

using System.ComponentModel.DataAnnotations.Schema;

namespace air.cloud.security.common.Base
{
    /// <summary>
    /// 自定义实体基类（新增）
    /// </summary>
    public abstract class CreateEntityBase : LocalEntityBase, IEntity<MasterDbContextLocator>
    {
        /// <summary>
        /// 创建者id
        /// </summary>
        [Column("CREATE_USER_ID")]
        public string? CreateUserId { get; set; }
        /// <summary>
        /// 创建者姓名
        /// </summary>

        [Column("CREATE_USER_NAME")]
        public string? CreateUserName { get; set; }
        /// <summary>
        /// 创建时间
        /// </summary>

        [Column("CREATE_TIME")]
        public DateTime? CreateTime { get; set; }

    }
}
