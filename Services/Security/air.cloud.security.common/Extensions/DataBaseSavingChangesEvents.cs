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
using air.cloud.security.common.Base;
using air.cloud.security.common.Model;

using Air.Cloud.Core.App;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace air.cloud.security.common.Extensions
{
    public static class DataBaseSavingChangesEvents
    {
        public static async Task SaveChangesEvents(UserAccountFactory account, DbContextEventData eventData, InterceptionResult<int> result)
        {
            // 获取当前事件对应上下文
            var dbContext = eventData.Context;
            // 获取所有更改，删除，新增的实体，但排除审计实体（避免死循环）
            var entities = dbContext.ChangeTracker.Entries()
                .Where(u => u.State == EntityState.Modified || u.State == EntityState.Added).ToList();
            // 通过请求中获取当前操作人
            var AccountUserId = string.IsNullOrEmpty(account?.Id) ? "00000000000000000000000000000000" : account?.Id;
            var AccountUserName = string.IsNullOrEmpty(account?.UserName) ? "00000000000000000000000000000000" : account?.UserName;
            foreach (var entity in entities)
            {
                switch (entity.State)
                {
                    case EntityState.Modified:

                        if (entity.CurrentValues.Properties.Any(s =>s.Name == nameof(CreateAndUpdateEntityBase.UpdateUserId)))
                        {
                            if (entity.Property(nameof(CreateAndUpdateEntityBase.UpdateUserName)).CurrentValue == null)
                                entity.Property(nameof(CreateAndUpdateEntityBase.UpdateUserName)).CurrentValue = AccountUserName;
                            if (entity.Property(nameof(CreateAndUpdateEntityBase.UpdateUserId)).CurrentValue == null)
                                entity.Property(nameof(CreateAndUpdateEntityBase.UpdateUserId)).CurrentValue = AccountUserId;
                            entity.Property(nameof(CreateAndUpdateEntityBase.UpdateTime)).CurrentValue = DateTime.Now;
                        }
                        break;
                    case EntityState.Added:
                        if (entity.CurrentValues.Properties.Any(s =>s.Name == nameof(CreateEntityBase.CreateUserId)))
                        {
                            if (entity.Property(nameof(LocalEntityBase.Id)).CurrentValue == null)
                                entity.Property(nameof(LocalEntityBase.Id)).CurrentValue = AppCore.Guid();
                            if (entity.Property(nameof(CreateEntityBase.CreateUserName)).CurrentValue == null)
                                entity.Property(nameof(CreateEntityBase.CreateUserName)).CurrentValue = AccountUserName;
                            if (entity.Property(nameof(CreateEntityBase.CreateUserId)).CurrentValue == null)
                                entity.Property(nameof(CreateEntityBase.CreateUserId)).CurrentValue = AccountUserId;
                            entity.Property(nameof(CreateEntityBase.CreateTime)).CurrentValue = DateTime.Now;
                        }
                        break;
                }

              

            }
        }
    }
}
