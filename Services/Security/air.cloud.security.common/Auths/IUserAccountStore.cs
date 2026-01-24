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
using air.cloud.security.common.Model;

namespace air.cloud.security.common.Auths
{
    public interface IUserAccountStore
    {
        /// <summary>
        /// <para>zh-cn:获取指定票据的衍生票据信息</para>
        /// <para>en-us:Get the derived ticket information of the specified ticket</para>
        /// </summary>
        /// <param name="Ticket"></param>
        /// <returns></returns>
        Task<TicketCreateResult> GetForkTicketAsync(string Ticket);
        /// <summary>
        /// <para>zh-cn:获取当前登录人的票据信息</para>
        /// <para>en-us:Get the ticket information of the currently logged-in person</para>
        /// </summary>
        /// <returns></returns>
        Task<UserAccountFactory> GetUserAccountAsync();
        /// <summary>
        /// <para>zh-cn:获取指定票据信息</para>
        /// <para>en-us:Get specified ticket information</para>
        /// </summary>
        /// <param name="Ticket"></param>
        /// <returns></returns>
        Task<UserAccountFactory> GetUserAccountAsync(string Ticket);
        /// <summary>
        /// <para>zh-cn:创建临时票据</para>
        /// <para>en-us:Create a temporary ticket</para>
        /// </summary>
        /// <returns></returns>
        Task<TicketCreateResult> GetTemporaryTicketAsync();
        /// <summary>
        /// <para>zh-cn:设置票据载荷内容</para>
        /// <para>en-us:Set ticket payload content</para>
        /// </summary>
        /// <param name="userAccountFactory"></param>
        /// <returns></returns>
        Task<TicketCreateResult> SetTicketPayLoadContentAsync(UserAccountFactory userAccountFactory);

        /// <summary>
        /// <para>zh-cn:用户登出</para>
        /// <para>en-us:User log out</para>
        /// </summary>
        /// <returns></returns>
        Task<bool> LogOutUserAccountAsync(string Ticket);

    }
}