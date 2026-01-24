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
namespace air.cloud.system.model.Dtos.AppInfoDtos
{
    public  class AppRouteSDto
    {
        /// <summary>
        /// <para>zh-cn:编号</para>
        /// <para>en-us:Id</para>
        /// </summary>
        public string Id { get; set; }
        /// <summary>
        /// <para>zh-cn:路由地址</para>
        /// <para>en-us:Route Address</para>
        /// </summary>
        public string Route { get; set; }
        /// <summary>
        /// <para>zh-cn:应用ID</para>
        /// <para>en-us:App ID</para>
        /// </summary>
        public string AppId { get; set; }

    }
}
