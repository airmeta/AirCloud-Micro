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
using air.cloud.system.model.Dtos.AccountDtos;

using Air.Cloud.Core.Standard.DynamicServer;

namespace air.cloud.account.service.Services.AccountServices.AppLoginServices
{
    /// <summary>
    /// <para>zh-cn:应用登录服务</para>
    /// <para>en-us:App Login Service</para>
    /// </summary>
    public interface IAppLoginService: IDynamicService
    {
        /// <summary>
        /// <para>zh-cn:登录完成,获取账户信息</para>
        /// <para>en-us:After login, get account information</para>
        /// </summary>
        /// <returns></returns>
        Task<UserAccountInfo> GetAuthority(string RandomKey);

        /// <summary>
        /// <para>zh-cn:获取重定向地址</para>
        /// <para>en-us:Get redirect URL</para>
        /// </summary>
        /// <returns>
        /// 
        /// </returns>
        Task<string> GetRedirectUrl(string AppId);

    }
}
