import { MenuTypeEnum } from "@root/base/enums";
import { MenuVO } from "../dtos/menu.dto";

const MENU_ACTION = {
    //构建菜单树形结构
    getMenuTree(menus: MenuVO[]) {
        const treeMenus = menus.filter(menu => menu.parentId === null || menu.parentId === "0");
        function buildTree(parentMenus: MenuVO[]) {
            parentMenus.forEach(parentMenu => {
                const children = menus.filter(menu => menu.parentId === parentMenu.id);
                if (children.length > 0) {
                    parentMenu.children = children;
                    buildTree(children);
                }
            });
        }
        buildTree(treeMenus);
        return treeMenus;
    },
    //获取菜单下拉树形结构
    getMenuSelectTree(menus: MenuVO[]) {
        menus = menus.filter(menu => menu.type == MenuTypeEnum.CATALOG || menu.type == MenuTypeEnum.MENU);// 过滤掉按钮类型

        const treeMenus = [] as OptionType[];

        const topCats = menus.filter(menu => menu.parentId === null || menu.parentId === "0");

        function buildTree(menuId: string) {
            if (!menuId) {
                return [];
            }
            const children = menus.filter(menu => menu.parentId === menuId);
            if (children.length > 0) {
                const childs = children.map(menu => ({ value: menu.id, label: menu.title, children: buildTree(menu.id??"") })) as OptionType[];
                return childs;
            }
            return [];
        }
        topCats.forEach(menu => {
            treeMenus.push({ value: menu.id, label: menu.title, children: buildTree(menu.id) } as OptionType);
        });
        return treeMenus;
    }
}

export default MENU_ACTION;