using Air.Cloud.Core.Standard.DataBase.Locators;
using Air.Cloud.Core.Standard.DataBase.Model;

using System.ComponentModel.DataAnnotations.Schema;

namespace air.cloud.security.common.Base
{

    /// <summary>
    /// 自定义实体基类（新增+修改）
    /// </summary>
    public abstract class CreateAndUpdateEntityBase : CreateEntityBase, IEntity<MasterDbContextLocator>
    {
        /// <summary>
        /// 更新人Id
        /// </summary>

        [Column("UPDATE_USER_ID")]
        public string? UpdateUserId { get; set; }
        /// <summary>
        /// 更新人
        /// </summary>

        [Column("UPDATE_USER_NAME")]
        public string? UpdateUserName { get; set; }
        /// <summary>
        /// 更新时间
        /// </summary>
        [Column("UPDATE_TIME")]

        public DateTime? UpdateTime { get; set; }

    }
}
