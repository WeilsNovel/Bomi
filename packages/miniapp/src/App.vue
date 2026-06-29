<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app';
import { IS_DEV } from '@/config/env';

/**
 * 应用启动。
 * TODO(Stage2): 注册 APP_EVENT.UNAUTHORIZED 全局监听，token 失效时跳登录页。
 *               当前登录页未建，监听在 Stage 2 登录模块落地后接入。
 */
onLaunch(() => {
  if (IS_DEV) {
    console.log('[bomi] App Launch');
  }
});

onShow(() => {
  if (IS_DEV) {
    console.log('[bomi] App Show');
  }
});

onHide(() => {
  if (IS_DEV) {
    console.log('[bomi] App Hide');
  }
});
</script>

<style></style>
