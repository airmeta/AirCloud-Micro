using Air.Cloud.Core.App;
using Air.Cloud.Core.Extensions;
using Air.Cloud.Core.Standard.DataBase.Locators;
using Air.Cloud.Core.Standard.DataBase.Model;

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace air.cloud.security.common.Base
{
    /// <summary>
    /// 自定义实体基类
    /// </summary>
    public abstract partial class LocalEntityBase : IEntity<MasterDbContextLocator>
    {
        public LocalEntityBase()
        {
            if (Id.IsNullOrEmpty()) Id = AppCore.Guid();
        }
        /// <summary>
        /// Id
        /// </summary>
        [Column("ID")]
        [Key]
        public string Id { get; set; }

    }
}
