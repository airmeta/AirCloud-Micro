/*
 * Copyright (c) 2024-2030 星曳数据
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * This file is provided under the Mozilla Public License Version 2.0,
 * and the "NO WARRANTY" clause of the MPL is hereby expressly
 * acknowledged.
 */
using air.cloud.security.common.Exceptions;
using air.cloud.security.common.Model;
using air.cloud.security.common.Model.AppClientInfos;

using Air.Cloud.Core;
using Air.Cloud.Core.App;
using Air.Cloud.Core.Extensions;
using Air.Cloud.Core.Plugins.Http.Extensions;
using Air.Cloud.Core.Plugins.Security.MD5;
using Air.Cloud.Core.Standard.Store;
using Air.Cloud.Core.Standard.Taxin.Client;
using Air.Cloud.WebApp.UnifyResult.Internal;

using Microsoft.AspNetCore.Http;

namespace air.cloud.security.common.Auths
{
    public class UserAccountStore : IUserAccountStore
    {
        /// <summary>
        /// <para>zh-cn:未登录的票据载荷标识</para>
        /// <para>en-us:Not logged in ticket payload identification</para>
        /// </summary>
        public const string NOT_LOGIN_PAYLOAD = "NOT_LOGIN";

        /// <summary>
        /// <para>zh-cn:获取未登录的临时票据的路由地址</para>
        /// <para>en-us:Get the route address of the temporary ticket for not logged in</para>
        /// </summary>
        public static string TempTicketCreateRoute => AppCore.Configuration["SkyMirrorSettings:AuthServerSettings:Actions:TempTicket"];
        /// <summary>
        /// <para>zh-cn:创建票据的路由地址</para>
        /// <para>en-us:The route address for creating tickets</para>
        /// </summary>
        public static string CreateTicketCreateRoute => AppCore.Configuration["SkyMirrorSettings:AuthServerSettings:Actions:CreateTicket"];

        /// <summary>
        /// <para>zh-cn:获取票据载荷信息的路由地址</para>
        /// <para>en-us:Get the route address of the ticket payload information</para>
        /// </summary>
        public static string GetTicketPayLoadRoute => AppCore.Configuration["SkyMirrorSettings:AuthServerSettings:Actions:TicketPayLoad"];

        /// <summary>
        /// <para>zh-cn:获取分叉票据的路由地址</para>
        /// <para>en-us:Get the route address of the forked ticket</para>
        /// </summary>
        public static string ForkTicketRoute => AppCore.Configuration["SkyMirrorSettings:AuthServerSettings:Actions:ForkTicket"];


        private readonly IHttpContextAccessor httpContextAccessor;

        private readonly IHttpClientFactory httpClientFactory;

        private readonly ITaxinClientStandard taxinClientStandard;


        private readonly ITaxinStoreStandard taxinStoreStandard;

        public UserAccountStore(IHttpContextAccessor httpContextAccessor,
            IHttpClientFactory httpClientFactory,
            ITaxinClientStandard taxinClientStandard,
            ITaxinStoreStandard taxinStoreStandard)
        {
            this.httpContextAccessor = httpContextAccessor;
            this.httpClientFactory = httpClientFactory;
            this.taxinClientStandard = taxinClientStandard;
            this.taxinStoreStandard = taxinStoreStandard;
        }

        /// <summary>
        /// <para>zh-cn:获取未登录的临时票据</para>
        /// <para>en-us:Get a temporary ticket for not logged in</para>
        /// </summary>
        /// <param name="ExpiredSeconds"></param>
        /// <returns></returns>
        public async Task<TicketCreateResult> GetTemporaryTicketAsync()
        {
            //var d = await this.taxinStoreStandard.GetPersistenceAsync();
            //var Routes = ITaxinStoreStandard.Routes["skymirrorshield_create_temp_Ticket"];
            //var result = await taxinClientStandard.SendAsync<TicketCreateResult>("skymirrorshield_create_temp_Ticket");
            //if (result == null)
            //{
            //    throw new AuthException("Temp_Ticket_Create_Faild", "身份验证失败,暂时无法登录系统");
            //}
            //return result;


            using (var client = httpClientFactory.CreateClient())
            {
                var response = await client.GetAsync(TempTicketCreateRoute);
                response.EnsureSuccessStatusCode();
                var content = await response.Content.ReadAsStringAsync();
                RESTfulResult<TicketCreateResult> TicketCreateResult = AppRealization.JSON.Deserialize<RESTfulResult<TicketCreateResult>>(content);
                if (TicketCreateResult != null)
                {
                    if (TicketCreateResult.Succeeded)
                    {
                        if (TicketCreateResult.Data.Code == 200)
                        {
                            return TicketCreateResult.Data;
                        }
                    }
                }
                throw new AuthException("Temp_Ticket_Create_Faild", "身份验证失败,暂时无法登录系统");
            }
        }
        public async Task<UserAccountFactory> GetUserAccountAsync()
        {
            string Ticket = httpContextAccessor.HttpContext.Request.Headers[IAppClientInfo.CLIENT_Ticket_HEADER];
            if (Ticket == null) throw new AuthException("Ticket_Payload_Faild", "Ticket负载验证不合法");
            return await GetUserAccountAsync(Ticket);
        }
        public async Task<UserAccountFactory> GetUserAccountAsync(string Ticket)
        {
            var userAccountFactory = AppRealization.RedisCache.String.Get<UserAccountFactory>($"Cache:Account:{MD5Encryption.GetMd5By32(Ticket)}");
            if (userAccountFactory != null) return userAccountFactory;

            //var accountInfo = await taxinClientStandard.SendAsync<UserAccountFactory>("skymirrorshield_get_account_payload", new
            //{
            //    Ticket = Ticket,
            //});
            //if (accountInfo == null)
            //{
            //    throw new AuthException("Ticket_Payload_Faild", "票据负载读取失败");
            //}
            //TimeSpan span = accountInfo.ExpiredAt - DateTime.Now;
            //int CacheSeconds = (int)span.TotalSeconds - 60;
            //if (CacheSeconds > 10)
            //{
            //    await AppRealization.RedisCache.String.SetAsync($"Cache:Account:{MD5Encryption.GetMd5By32(Ticket)}", accountInfo, new TimeSpan(0, 0, CacheSeconds - 5));
            //}
            //return accountInfo;
            using (var client = httpClientFactory.CreateClient())
            {
                var response = await client.GetAsync(string.Format(GetTicketPayLoadRoute, Ticket));
                response.EnsureSuccessStatusCode();
                var content = await response.Content.ReadAsStringAsync();

                RESTfulResult<UserAccountFactory> accountInfo = AppRealization.JSON.Deserialize<RESTfulResult<UserAccountFactory>>(content);
                if (accountInfo != null)
                {
                    if (accountInfo.Succeeded)
                    {
                        if (accountInfo.Data == null)
                        {
                            return null;
                        }
                        TimeSpan span = accountInfo.Data.ExpiredAt - DateTime.Now;
                        int CacheSeconds = (int)span.TotalSeconds - 60;
                        if (CacheSeconds > 10)
                        {
                            await AppRealization.RedisCache.String.SetAsync($"Cache:Account:{MD5Encryption.GetMd5By32(Ticket)}", accountInfo.Data, new TimeSpan(0, 0, CacheSeconds - 5));
                        }
                        return accountInfo.Data;
                    }
                }
                throw new AuthException("Ticket_Payload_Faild", "票据负载读取失败");
            }
        }
        public async Task<TicketCreateResult> SetTicketPayLoadContentAsync(UserAccountFactory userAccountFactory)
        {
            //try
            //{

            //    var result = await taxinClientStandard.SendAsync<TicketCreateResult>("skymirrorshield_create_Ticket", userAccountFactory);
            //    if (result == null)
            //    {
            //        throw new AuthException("Temp_Ticket_Create_Faild", "票据存储失败,暂时无法登录系统");
            //    }
            //    return result;
            //}
            //catch (Exception ex)
            //{

            //    throw new AuthException("Temp_Ticket_Create_Faild", "票据存储失败,暂时无法登录系统");
            //}
            using (var client = httpClientFactory.CreateClient())
            {
                var response = await client.PostAsync(CreateTicketCreateRoute, client.SetBody(userAccountFactory));
                response.EnsureSuccessStatusCode();
                var content = await response.Content.ReadAsStringAsync();

                RESTfulResult<TicketCreateResult> TicketCreateResult = AppRealization.JSON.Deserialize<RESTfulResult<TicketCreateResult>>(content);

                if (TicketCreateResult != null)
                {
                    if (TicketCreateResult.Succeeded)
                    {
                        if (TicketCreateResult.Data.Code == 200)
                        {
                            return TicketCreateResult.Data;
                        }
                    }
                }
                throw new AuthException("Temp_Ticket_Create_Faild", "票据存储失败,暂时无法登录系统");
            }
        }

        public async Task<TicketCreateResult> GetForkTicketAsync(string Ticket)
        {
            //var result = await taxinClientStandard.SendAsync<TicketCreateResult>("skymirrorshield_fork_Ticket",new
            //{
            //    Ticket = Ticket
            //});
            //if (result == null)
            //{
            //    throw new AuthException("Temp_Ticket_Create_Faild", "票据存储失败,暂时无法登录系统");
            //}
            //return result;

            using (var client = httpClientFactory.CreateClient())
            {
                var response = await client.GetAsync(string.Format(ForkTicketRoute, Ticket));
                response.EnsureSuccessStatusCode();
                var content = await response.Content.ReadAsStringAsync();

                RESTfulResult<TicketCreateResult> TicketCreateResult = AppRealization.JSON.Deserialize<RESTfulResult<TicketCreateResult>>(content);
                if (TicketCreateResult != null)
                {
                    if (TicketCreateResult.Succeeded)
                    {
                        if (TicketCreateResult.Data.Code == 200)
                        {
                            return TicketCreateResult.Data;
                        }
                    }
                }
                throw new AuthException("Temp_Ticket_Create_Faild", "票据存储失败,暂时无法登录系统");
            }
        }

        public async Task<bool> LogOutUserAccountAsync(string Ticket)
        {
            var result = await taxinClientStandard.SendAsync<TicketCreateResult>("skymirrorshield_clear_Ticket", new
            {
                Ticket = Ticket
            });
            if (result == null)
            {
                throw new AuthException("Temp_Ticket_Clear_Faild", "身份认证失败,请稍后重试");
            }
            return result.Code==200;
        }
    }
}
