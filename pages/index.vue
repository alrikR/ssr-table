<template lang="pug">
  v-container
    v-row
      v-col(cols)
        DataTable(
          v-show="total !== null"
          :headers="headers"
          :items="items"
          :total="total"
          :loading="loading"
          :initial="{ sortBy: ['user'], sortDesc: [false] }"
          @update="fetchData($event)"
        )
        v-progress-circular(
          v-if="loading"
          width="2"
          color="rs__primary"
          indeterminate
        ).mx-auto
</template>

<script>
import DataTable from '~/components/DataTable'
import sales from '~/api/sales'
import { flattenObj } from '~/assets/js/utility/helpers'
import { formatUser, formatNumber } from '~/assets/js/formatters'

export default {
  name: 'RsIndexPage',

  components: {
    DataTable
  },

  data () {
    return {
      total: null,
      loading: false,
      items: [],
      headers: [
        { text: 'Name', value: 'user', align: 'start', formatter: val => formatUser(val) },
        { text: 'Email', value: 'email' },
        { text: 'Gender', value: 'gender', width: '10%' },
        { text: 'Year', value: 'year', width: '10%', align: 'end' },
        { text: 'Sales', value: 'sales', align: 'end', formatter: val => formatNumber(val) },
        { text: 'Country', value: 'country' },
      ],
    }
  },


  methods: {
    async fetchData ({ page, itemsPerPage, sortBy, sortDesc, search }) {
      this.loading = true
      try {
        let data = await sales.results

        if (search) {
          data = this.searchData(data, search)
        }
        // total after search sounds more logical
        const total = data.length
        if (sortBy.length && sortDesc.length) {
          data = this.multiSort(data, sortBy, sortDesc)
        }

        data = this.paginate(data, page, itemsPerPage)

        await this.delay(1500)
        this.total = total
        this.items = data
      } catch (err) {
        console.log(err)
      } finally {
        this.loading = false
      }
    },

    searchData (data, search) {
      return data.filter(item => Object.values(flattenObj(item)).join('_').toUpperCase().includes(search))
    },

    multiSort (data, sortBy, sortDesc) {
      let sortData = [ ...data ]
      const sortByOrder = [ ...sortBy ].reverse()
      const sortDescOrder = [ ...sortDesc ].reverse()

      sortByOrder.forEach((el, idx) => {
        sortData.sort(this.compare(el, sortDescOrder[idx]))
      })
      return sortData
    },

    paginate (data, page, itemsPerPage) {
      const start = (page - 1) * itemsPerPage
      const end = page * itemsPerPage
      return data.slice(start, end)
    },

    compare (sortBy, sortDesc) {
      return (a,b) => {
        if (!a.hasOwnProperty(sortBy) || !b.hasOwnProperty(sortBy)) {
          return 0
        }

        const sortA = sortBy === 'user'
          ? a[sortBy].last_name.toUpperCase()
          : sortBy === 'sales'
            ? parseFloat(a[sortBy])
            : typeof a[sortBy] === 'string'
              ? a[sortBy].toUpperCase()
              : a[sortBy]

        const sortB = sortBy === 'user'
          ? b[sortBy].last_name.toUpperCase()
          : sortBy === 'sales'
            ? parseFloat(b[sortBy])
            : typeof a[sortBy] === 'string'
              ? b[sortBy].toUpperCase()
              : b[sortBy]

        let comparison = 0
        if (sortA > sortB) {
          comparison = 1
        } else if (sortA < sortB) {
          comparison = -1
        }

        return sortDesc ? (comparison * -1) : comparison
      }
    },

    delay (ms) {
      return new Promise(resolve => setTimeout(resolve, ms))
    },


  }
}
</script>

<style lang="sass" scoped>
.v-progress-circular
  position: absolute
  top: 50%
  left: 50%
</style>
