import APP_CENTER_API from "../../app-center/script/index.api";
import { accountAppIdsRDto } from "../dto/accountAppIdsRDto";

const apps = ref<accountAppIdsRDto[]>([]);

onMounted(async () => {
  const res = await APP_CENTER_API.queryAccountApps();
  apps.value = res;
});

