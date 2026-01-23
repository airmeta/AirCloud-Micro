using air.cloud.security.common.Enums;

using Air.Cloud.Core.Standard.DataBase.Locators;
using Air.Cloud.Core.Standard.DataBase.Model;

using System.ComponentModel.DataAnnotations.Schema;

namespace air.cloud.security.common.Base
{
    /// <summary>
    /// 自定义实体基类（新增+修改+删除）
    /// </summary>
    public abstract class AllEntityBase : CreateAndUpdateEntityBase, IEntity<MasterDbContextLocator>
    {
        /// <summary>
        /// 删除人Id
        /// </summary>

        [Column("DELETE_USER_ID")]
        public string? DeleteUserId { get; set; }
        /// <summary>
        ///  删除人
        /// </summary>

        [Column("DELETE_USER_NAME")]
        public string? DeleteUserName { get; set; }
        /// <summary>
        /// 是否删除
        /// </summary>

        [Column("IS_DELETE")]
        public IsOrNotEnum IsDelete { get; set; }
        /// <summary>
        /// 删除时间
        /// </summary>

        [Column("DELETE_TIME")]
        public DateTime? DeleteTime { get; set; }
    }
}
