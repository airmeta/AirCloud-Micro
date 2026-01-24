import { useRoute, useRouter } from "vue-router";
import { appLogin } from "../actions/appLogin";
import { getClientAppConfig } from "@root/base/store/modules/client/client";

export function useOauthActions() {
	const route = useRoute();
	const router = useRouter();
	function approveAuthorization() {
		const pathParam = route.params?.path as string | undefined;
		const targetPath = pathParam ? "/" + pathParam : "/";

		// 将 key 留在 oauth 页面用于 autoLogin；跳转目标页时移除 key，避免重复自动登录
		const targetQuery = { ...route.query } as Record<string, any>;
		const key = targetQuery.key;
		delete targetQuery.key;

		if (key) {
			const login = new appLogin();
			login.autoLogin({
				onSuccess: () => {
					const resolved = router.resolve({ path: targetPath, query: targetQuery });
					console.log("Redirecting to:", resolved.href);
					window.location.href = resolved.href;
				},
				onFail: () => {
					window.location.href = "/login";
				},
			});
			return;
		}
		router.replace({ path: targetPath, query: targetQuery });
	}

	function denyAuthorization() {
		const login = new appLogin();
		const clientConfig = getClientAppConfig();
		const backUrl = clientConfig?.loginPath;
		if (!backUrl) return;
		login.rejectAuthorization({
			onSuccess: () => {
				window.location.href = backUrl;
			},
			onFail: () => {
				window.location.href = backUrl;
			},
		});
	}

	return { approveAuthorization, denyAuthorization };
}