<template lang="pug">
  v-data-table(
    :headers="headers"
    :items="items"
    :options.sync="options"
    :server-items-length="total"
    :loading="loading"
    item-key="email"
    multi-sort
  ).elevation-1.mt-10
    template(#top)
      v-text-field(
        prepend-icon="mdi-magnify"
        label="Search"
        v-model="search"
      ).mx-6
    template(
      v-for="header in headers.filter(header => header.hasOwnProperty('formatter'))"
      #[`item.${header.value}`]="{ header, value }"
    ) {{ header.formatter(value)}}
</template>

<script>
export default {
  name: 'RsDataTable',

  props: {
    headers: {
      type: Array,
      required: true
    },

    items: {
      type: Array,
      required: true
    },

    total: {
      type: Number,
      default: null
    },

    initial: {
      type: Object,
      default: () => {}
    },

    loading: {
      type: Boolean,
      default: false
    }

  },

  data() {
    return {
      search: '',
      options: this.initial,
      timeout: null
    }
  },

  watch: {
    search (newVal, oldVal) {
      if (newVal !== oldVal) {
        // expect typing and debounce
        const resetPaging = () => {
          this.options = { ...this.options, page: 1 }
        }
        this.debounce(resetPaging, 750)
      }
    },

    options: {
      handler (newVal) {
        this.$emit('update', { ...newVal, search: this.search.trim().toUpperCase() })
      },
      deep: true
    }
  },

  methods: {
    debounce (callback, delay) {
      if (this.timeout) clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        clearTimeout(this.timeout)
        callback()
      }, delay)
    }


  }
}
</script>

<style lang="sass" scoped>
  .v-data-table
    max-width: 100%

  ::v-deep thead.v-data-table-header
    background-color: #fff
    tr
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.5)

  ::v-deep thead.v-data-table-header tr th
    text-transform: uppercase
    border-right: 1px solid $rs__lightgrey
    &:last-child
      border-right: none

  ::v-deep thead.v-data-table-header tr th .v-data-table-header__icon
    vertical-align: text-bottom

  ::v-deep tbody tr:hover
    background-color: $rs__indigo !important

</style>
