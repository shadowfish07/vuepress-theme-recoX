/* eslint-disable no-proto */
import postMixin from "@theme/mixins/posts";
import localMixin from "@theme/mixins/locales";
import {
  interceptRouterError,
  fixRouterError404,
  visitRecord,
} from "@theme/helpers/other";
import { install } from "vue-demi";

export default ({ Vue, siteData, isServer, router }) => {
  install(Vue);
  Vue.mixin(postMixin);
  Vue.mixin(localMixin);

  interceptRouterError(router);
  fixRouterError404(router);
  visitRecord(siteData.themeConfig.vuePressAdminHost, router);
};
