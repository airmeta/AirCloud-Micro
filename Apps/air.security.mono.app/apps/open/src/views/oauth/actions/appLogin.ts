import appLoginServices from "@root/base/api/modules/appLoginServices/AppLoginService";

export class appLogin{
    /**
     * zh-cn: 使用 URL 中的 key 调用自动登录接口并在成功时保存票据与应用信息，然后刷新或跳转登录页。
     * en-us: Use the key from the URL to call the auto-login API, save ticket and app info on success, then reload or redirect to login page.
     */
    autoLogin(options?: { onSuccess?: () => void; onFail?: () => void }){
        // 从当前地址中解析 key 参数（兼容 hash 路由：/#/oauth?key=xxx）
        const key = (() => {
            // 1) Vue Router hash 模式：location.hash 形如 "#/oauth?key=..."
            const hash = window.location.hash || "";
            const hashQueryIndex = hash.indexOf("?");
            if (hashQueryIndex >= 0) {
                const hashQuery = hash.slice(hashQueryIndex + 1);
                const hashParams = new URLSearchParams(hashQuery);
                const k = hashParams.get("key");
                if (k) return k;
            }
            // 2) history 模式：location.search 形如 "?key=..."
            const searchParams = new URLSearchParams(window.location.search);
            return searchParams.get("key");
        })();

        if (!key) {
            if (options?.onFail) options.onFail();
            else window.location.href = "/login";
            return;
        }
        //调用autologin接口
        appLoginServices.autoLogin(key as string, options);
    }
    rejectAuthorization(options?: { onSuccess?: () => void; onFail?: () => void }){
           // 从当前地址中解析 key 参数（兼容 hash 路由：/#/oauth?key=xxx）
        const key = (() => {
            // 1) Vue Router hash 模式：location.hash 形如 "#/oauth?key=..."
            const hash = window.location.hash || "";
            const hashQueryIndex = hash.indexOf("?");
            if (hashQueryIndex >= 0) {
                const hashQuery = hash.slice(hashQueryIndex + 1);
                const hashParams = new URLSearchParams(hashQuery);
                const k = hashParams.get("key");
                if (k) return k;
            }
            // 2) history 模式：location.search 形如 "?key=..."
            const searchParams = new URLSearchParams(window.location.search);
            return searchParams.get("key");
        })();
        if(key){
            appLoginServices.rejectAuthorization(key as string,options);
        }

    }
}