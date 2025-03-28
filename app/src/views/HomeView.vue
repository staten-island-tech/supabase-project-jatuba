<template>
  <div>
    <h1>Sets and Rarities</h1>

    <ul>
      <li v-for="set in setsWithRarities" :key="set.setName">
        <strong>{{ set.setName }}</strong>
        <ul>
          <li v-for="rarity in set.rarities" :key="rarity">{{ rarity }}</li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      setsWithRarities: [], // Array to store sets and their rarities
    }
  },
  methods: {
    async fetchSetsAndRarities() {
      try {
        // Fetch all available sets from the API
        const response = await fetch('https://api.pokemontcg.io/v2/sets', {
          headers: {
            Authorization: 'Bearer f4eb1886-496f-4234-b480-cefe29296242', // Replace with your actual API key
            'Content-Type': 'application/json',
          },
        })

        const data = await response.json()
        const sets = data.data // All sets from the response

        // Iterate over each set to get its rarities
        const setsWithRarities = await Promise.all(
          sets.map(async (set) => {
            const raritiesResponse = await fetch(
              `https://api.pokemontcg.io/v2/cards?set=${set.id}`,
              {
                headers: {
                  Authorization: 'Bearer f4eb1886-496f-4234-b480-cefe29296242', // Replace with your actual API key
                  'Content-Type': 'application/json',
                },
              },
            )
            const raritiesData = await raritiesResponse.json()

            // Extract unique rarities from the fetched data
            const rarities = new Set(raritiesData.data.map((card) => card.rarity))

            // Return the set with its unique rarities
            return {
              setName: set.name,
              rarities: Array.from(rarities), // Convert the Set to an Array
            }
          }),
        )

        // Store the result in the data
        this.setsWithRarities = setsWithRarities
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    },
  },
  mounted() {
    // Fetch sets and rarities when the component is mounted
    this.fetchSetsAndRarities()
  },
}
</script>

<style scoped>
/* Simple styling */
ul {
  list-style-type: none;
}

li {
  margin: 5px 0;
}

strong {
  font-size: 1.2em;
}
</style>
