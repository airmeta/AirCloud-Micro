using air.cloud.security.common.Base.Dtos;
using air.cloud.security.common.Dtos;
using air.cloud.security.common.Extensions;
using air.cloud.security.common.Model;
using air.cloud.system.model.Domains.AppInfoDomains;
using air.cloud.system.model.Dtos.AppInfoDtos;
using air.cloud.system.model.Entitys.Apps;

using Air.Cloud.Core;
using Air.Cloud.Core.App;
using Air.Cloud.Core.Extensions;
using Air.Cloud.Core.Extensions.Linqs;
using Air.Cloud.DataBase.Repositories;
using Air.Cloud.WebApp.FriendlyException;

using Microsoft.EntityFrameworkCore;

namespace air.cloud.system.domain.Impls.AppInfoDomains
{
    public  class AppRouteDomain : IAppRouteDomain
    {
        private readonly IRepository<AppRoute> repository;

        private readonly IRepository<AppRouteAuth> authRepository;

        public AppRouteDomain(IRepository<AppRoute> repository, IRepository<AppRouteAuth> authRepository)
        {
            this.repository = repository;
            this.authRepository = authRepository;
        }

        public async Task<IList<AppRouteCacheDto>> QueryAllAppRouteAuthAsync(string BindAppId)
        {
            var Routes = await (from a in (authRepository.DetachedEntities.Where(a => a.AppId == BindAppId).AsQueryable())
                                join b in (repository.DetachedEntities.Where(b => b.Id == BindAppId).AsQueryable())
                                on a.RouteId equals b.Id
                                join c in (repository.Change<AppInformation>().DetachedEntities.AsQueryable())
                                on b.AppId equals c.Id
                                select new AppRouteCacheDto()
                                {
                                    //路由属于某个应用
                                    AppId = b.AppId,
                                    //获得授权的路由地址
                                    Route = b.Route,
                                    AppName = c.AppName
                                }).ToListAsync();
            await AppRealization.RedisCache.String.SetAsync($"App:RouteAuth:{BindAppId}", AppRealization.JSON.Serialize(Routes));
            return Routes;
        }
        public async Task<PageList<AppRouteCacheDto>> QueryAppRouteAuthAsync(BaseQDto dto)
        {
            if (dto.AppId.IsNullOrEmpty()) throw Oops.Oh("应用编号不能为空");

            IQueryable<AppRouteCacheDto> Routes =from a in (authRepository.DetachedEntities.Where(a => a.AppId == dto.AppId).AsQueryable())
                                join b in (repository.DetachedEntities.Where(b => b.Id == dto.AppId).AsQueryable())
                                on a.RouteId equals b.Id
                                join c in (repository.Change<AppInformation>().DetachedEntities.AsQueryable())
                                on b.AppId equals c.Id
                                select new AppRouteCacheDto()
                                {
                                    //路由属于某个应用
                                    AppId = b.AppId,
                                    //获得授权的路由地址
                                    Route = b.Route,
                                    AppName = c.AppName
                                };
            var query= await Routes.ToPageListAsync<AppRouteCacheDto>(dto.Page, dto.Limit);
            return query;
        }

        public async Task<bool> BindAppRouteAsync(string RouteId, string BindAppId)
        {
            AppRouteAuth appRouteAuth = new AppRouteAuth()
            {
                AppId = BindAppId,
                Id = AppCore.Guid(),
                RouteId = RouteId
            };
            await authRepository.InsertAsync(appRouteAuth);

            await QueryAllAppRouteAuthAsync(BindAppId);
            return true;
        }
        public async Task<bool> RemoveAppRouteAuthAsync(string RouteId, string BindAppId)
        {
            var auth = await authRepository.DetachedEntities.FirstOrDefaultAsync(a => a.AppId == BindAppId && a.RouteId == RouteId);
            if (auth != null)
            {
                await authRepository.DeleteAsync(auth);
            }
            await QueryAllAppRouteAuthAsync(BindAppId);
            return true;
        }
        public async Task<bool> CreateAppRouteAsync(AppRouteSDto dto)
        {
            AppRoute appRoute= new AppRoute()
            {
                AppId = dto.AppId,
                Id = AppCore.Guid(),
                Route = dto.Route
            };
            await repository.InsertAsync(appRoute);
            return true;
        }

        public async Task<bool> DeleteAppRouteAsync(string Id)
        {
            var route = await repository.DetachedEntities.FirstOrDefaultAsync(a => a.Id == Id);
            if (route == null) throw Oops.Oh("路由地址不存在");

            var hasRouteAuth = await authRepository.DetachedEntities.AnyAsync(s=>s.RouteId==route.Id);
            if(!hasRouteAuth) throw Oops.Oh("该路由地址已被应用");
            await repository.DeleteAsync(route);
            return true;
        }

        public async Task<AppRoute> GetAppRouteAsync(string Id)
        {
            var route = await repository.DetachedEntities.FirstOrDefaultAsync(a => a.Id == Id);
            if (route == null) throw Oops.Oh("路由地址不存在");
            return route;
        }

        public async Task<PageList<AppRoute>> QueryAppRoutesAsync(BaseQDto dto)
        {
            var linq = LinqExpressionExtensions.And<AppRoute>();
            if (!string.IsNullOrEmpty(dto.AppId))
            {
                linq = linq.And(s => s.AppId == dto.AppId);
            }
            if (!string.IsNullOrEmpty(dto.Info))
            {
                linq = linq.And(s => s.Route.Contains(dto.Info));
            }
            var query = repository.Change<AppRoute>().DetachedEntities.Where(linq);
            return await query.OrderByDescending(s => s.CreateTime).ToPageListAsync<AppRoute>(dto.Page, dto.Limit);
        }

        public async Task<bool> UpdateAppRouteAsync(AppRouteSDto dto)
        {
           var route=await repository.DetachedEntities.FirstOrDefaultAsync(a=>a.Id==dto.Id);
            if(route!=null)
            {
                route.Route = dto.Route;
                await repository.UpdateIncludeAsync(route, new string[]
                {
                    nameof(route.Route)
                });
                return true;
            }
            return true;
        }
    }
}
