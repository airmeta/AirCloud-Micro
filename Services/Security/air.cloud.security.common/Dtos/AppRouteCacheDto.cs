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
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace air.cloud.security.common.Dtos
{
    public  class AppRouteCacheDto
    {
        /// <summary>
        /// <para>zh-cn:应用Id</para>
        /// <para>en-us:App Id</para>
        /// </summary>
        public string AppId { get; set; }

        /// <summary>
        /// <para>zh-cn:应用名称</para>
        /// <para>en-us:App Name</para>
        /// </summary>
        public string AppName { get; set; }

        /// <summary>
        /// <para>zh-cn:路由地址</para>
        /// <para>en-us:Route</para>
        /// </summary>
        public string Route { get; set; }
    }
}
