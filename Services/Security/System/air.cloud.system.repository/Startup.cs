using air.cloud.system.repository.DbContexts;

using Air.Cloud.Core.App;
using Air.Cloud.Core.App.Startups;
using Air.Cloud.DataBase.Extensions;
using Air.Cloud.DataBase.Extensions.DatabaseProvider;

using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

using DbContextSaveChangesInterceptor = air.cloud.system.repository.DbContexts.DbContextSaveChangesInterceptor;

namespace air.cloud.system.repository
{
    public class Startup : AppStartup
    {
        public override void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {

        }

        public override void ConfigureServices(IServiceCollection services)
        {
            services.AddDatabaseAccessor(options =>
            {
                options.AddDbPool<DefaultDbContext>(providerName: default,
                       (services, opt) =>
                       {
                           var conn = AppCore.Configuration["ConnectionStrings:SecurityConnectionString"];
                           //设置oracle使用的版本
                           opt.EnableSensitiveDataLogging().UseOracle(conn, b =>
                           {
                               b.UseOracleSQLCompatibility("11");
                           });
                           //注册Zack.EFCore.Batch包Oracle服务
                           //opt.UseBatchEF_Oracle();
                       },
                       //注册拦截器
                       interceptors: new Microsoft.EntityFrameworkCore.Diagnostics.IInterceptor[]
                       {
                        new DbContextSaveChangesInterceptor(),
                        new SqlCommandAuditInterceptor()
                       });
            }, "air.cloud.Database.Migrations");
        }
    }
}