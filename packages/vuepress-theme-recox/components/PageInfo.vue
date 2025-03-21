<template>
  <div>
    <reco-icon
      v-if="pageInfo.frontmatter.author || $themeConfig.author"
      icon="reco-account"
    >
      <span>{{ pageInfo.frontmatter.author || $themeConfig.author }}</span>
    </reco-icon>
    <reco-icon v-if="pageInfo.frontmatter.date" icon="reco-date">
      <span>{{ formatDateValue(pageInfo.frontmatter.date) }}</span>
    </reco-icon>
    <reco-icon v-if="showAccessNumber === true" icon="reco-eye">
      <span>{{ readCount }}</span>
    </reco-icon>
    <reco-icon v-if="pageInfo.frontmatter.tags" icon="reco-tag" class="tags">
      <span
        v-for="(subItem, subIndex) in pageInfo.frontmatter.tags"
        :key="subIndex"
        class="tag-item"
        :class="{ active: currentTag == subItem }"
        @click.stop="goTags(subItem)"
        >{{ subItem }}</span
      >
    </reco-icon>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue-demi";
import { RecoIcon } from "@vuepress-reco/core/lib/components";
import { useInstance } from "@theme/helpers/composable";
import axios from "axios";

export default defineComponent({
  components: { RecoIcon },
  props: {
    pageInfo: {
      type: Object,
      default() {
        return {};
      },
    },
    currentTag: {
      type: String,
      default: "",
    },
    showAccessNumber: {
      type: Boolean,
      default: false,
    },
    VPAHost: {
      type: String,
      default: false,
    },
  },

  setup(props, ctx) {
    const instance = useInstance();

    const numStyle = {
      fontSize: ".9rem",
      fontWeight: "normal",
      color: "#999",
    };

    const goTags = (tag) => {
      if (instance.$route.path !== `/tag/${tag}/`) {
        instance.$router.push({ path: `/tag/${tag}/` });
      }
    };

    const formatDateValue = (value) => {
      return new Intl.DateTimeFormat(instance.$lang).format(new Date(value));
    };

    const readCount = ref("loading");

    if (
      props.VPAHost &&
      props.pageInfo.frontmatter.meta &&
      props.pageInfo.frontmatter.meta[0].id
    ) {
      axios
        .get(
          `${props.VPAHost}/api/article/${props.pageInfo.frontmatter.meta[0].id}/read_count`
        )
        .then((res) => {
          if (res.data.success) {
            readCount.value = res.data.data;
          } else {
            readCount.value = "获取阅读量失败";
          }
        })
        .catch(() => {
          readCount.value = "获取阅读量失败";
        });
    }

    return { numStyle, goTags, formatDateValue, readCount };
  },
});
</script>

<style lang="stylus" scoped>
.iconfont
  display inline-block
  line-height 1.5rem
  &:not(:last-child)
    margin-right 1rem
  span
    margin-left 0.5rem
.tags
  .tag-item
    font-family Ubuntu, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif
    cursor pointer
    &.active
      color $accentColor
    &:hover
      color $accentColor
@media (max-width: $MQMobile)
  .tags
    display block
    margin-left 0 !important
</style>
