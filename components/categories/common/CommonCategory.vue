<template>
  <div class="d-flex flex-column align-center justify-center my-6 common-category-item" @click="$emit('click')">
    <v-avatar
      :size="avatarSize"
    >
      <v-img :src="src" />
    </v-avatar>

    <div
      class="mt-3"
      :class="{
        'font-weight-bold': active,
        'orange--text': active,
        'text--darken-2': active,
      }"
    >
      {{ label }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'CommonCategory',
  props: {
    src: {
      required: true,
      type: [String, Object]
    },
    label: {
      required: true,
      type: String
    },
    active: {
      required: false,
      type: Boolean,
      default: false
    }
  },
  computed: {
    avatarSize () {
      if (this.$vuetify.breakpoint.xsOnly) {
        return 64
      }
      return 96
    }
  }
}
</script>

<style scoped lang="scss">
.common-category-item {
  cursor: pointer;
  &:not(:first-child) {
    margin-left: 16px;
  }
}
</style>
