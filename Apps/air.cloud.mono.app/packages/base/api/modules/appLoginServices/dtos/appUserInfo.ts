import { Meta } from "../../../system/menu-api";
import { Layout } from "../../../../../../apps/auth/src/router";
import { useUserStore } from "../../../../store";
import { UserInfo } from "../../../system/user-api";


export function convertAuthorityToTree(authoritys: authorityInfo[]): authorityTree[] {
    const trees = [] as authorityTree[];
    const findChildren = (menus: authorityInfo[], parentId: string): authorityTree[] => {
        const children: authorityTree[] = [];
        const filtered = menus
            .filter((authority) => authority.parentId === parentId)
            .sort((a, b) => ( (a.sortNumber ?? 0) - (b.sortNumber ?? 0) ));
        filtered.forEach((authority) => {
            const childNode: authorityTree = {
                id: authority.id,
                name: authority.title,
                component: authority.component?.replace("@room/views/","/"),
                meta:  {
                    /** 【目录】只有一个子路由是否始终显示 */
                    alwaysShow: false,
                    /** 是否隐藏(true-是 false-否) */
                    hidden: false,
                    /** ICON */
                    icon: authority.icon,
                    /** 【菜单】是否开启页面缓存 */
                    keepAlive: true,
                    /** 路由title */
                    title: authority.title
                } as Meta,
                children: findChildren(menus, authority.id),
                redirect: authority.redirect,
                path: authority.path
            };
            children.push(childNode);
        });
        return children;
    }
    // 提取权限列表
    const permissions= authoritys.filter(authority => authority.type === 2).map(authority => authority.authority);
    //提取菜单与目录
    const memus= authoritys.filter(authority => authority.type === 0 || authority.type === 1);
    const baseAuthorities: authorityInfo[] = memus
        .filter(authority => authority.parentId === "0" || authority.parentId === "" || authority.parentId === null || authority.parentId === undefined)
        .sort((a, b) => ((a.sortNumber ?? 0) - (b.sortNumber ?? 0)));
    for (const authority of baseAuthorities) {
        const treeNode: authorityTree = {
            id: authority.id,
            name: authority.title,
            component:"Layout",
            meta:  {
                /** 【目录】只有一个子路由是否始终显示 */
                alwaysShow: false,
                /** 是否隐藏(true-是 false-否) */
                hidden: false,
                /** ICON */
                icon: authority.icon,
                /** 【菜单】是否开启页面缓存 */
                keepAlive: true,
                /** 路由title */
                title: authority.title
            } as Meta,
            children: findChildren(memus, authority.id),
            path: authority.path,
            redirect: authority.redirect
        };
        // 递归查找子节点
        treeNode.children = findChildren(memus, authority.id);
        trees.push(treeNode);
    }
    useUserStore().setUserInfo({
        userId: "",
        username: "",
        nickname: "",
        avatar: "",
        roles: [],
        perms: permissions
    } as UserInfo);
    return trees;
}



export interface appUserInfo {
    account: string;
    accountCreateAppId: string;
    authoritys: authorityInfo[];
    currentAppId: string;
    currentAppName: string;
    id: string;
}
/** 菜单树信息 */
export interface authorityInfo {
    /** 菜单类型 0目录 1菜单 2权限 */
    type: number;
    /** 菜单名称 */
    title: string;
    /** 菜单组件 */
    icon: string;
    /** 路由路径 */
    path: string;
    /** 组件路径 */
    component: string;
    /** 菜单排序(数字越小排名越靠前) */
    sortNumber?: number;
    /** 菜单ID */
    id: string;
    /** 父菜单ID */
    parentId: string;
    /**权限信息 */
    authority: string;
    /** 是否隐藏 0否 1是 */
    hide: number;
    /** 菜单元数据 */
    meta: Meta;
    /** 跳转地址 */
    redirect?: string;

    /** 子路由列表 */
    children?: authorityInfo[];
}

export interface authorityTree {
    /** 子路由列表 */
    children: authorityTree[];
    /** 组件路径 */
    component?: string;
    /** 路由属性 */
    meta?: Meta;
    /** 路由名称 */
    name?: string;
    /** 路由路径 */
    path?: string;
    /** 跳转链接 */
    redirect?: string;
    /** 菜单ID */
    id: string;

}