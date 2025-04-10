<template>
    <div class="app-container">
      <div v-for="(sets, generation) in generations" :key="generation" class="generation-section">
        <h2 class="generation-title">{{ generation }}</h2>
        <div class="set-grid">
          <div v-for="set in sets" :key="set.id" class="set-card">
            <img :src="set.images.symbol" :alt="set.name" loading="lazy" />
            <p>{{ set.name }}</p>
            <button @click="openPack(set.id)">Open Pack</button>
          </div>
        </div>
      </div>
  
      <div v-if="pack.length" class="results">
        <h3>Your Pack</h3>
        <ul>
          <li v-for="card in pack" :key="card.id">
            <img :src="card.images.small" :alt="card.name" loading="lazy" />
            {{ card.name }} - <span class="rarity">{{ card.rarity }}</span>
          </li>
        </ul>
      </div>
  
      <div v-if="showModal" class="modal-overlay">
        <div class="modal-content">
          <h3>Your Pack</h3>
          <ul class="modal-results">
            <li v-for="card in pack" :key="card.id">
              <img :src="card.images.small" :alt="card.name" loading="lazy" />
              <p>{{ card.name }}</p>
              <span class="rarity">{{ card.rarity }}</span>
            </li>
          </ul>
          <button class="close-btn" @click="showModal = false">Close</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const generations = ref({});
  const pack = ref([]);
  const showModal = ref(false);
  
  async function fetchAllSets() {
    const response = await fetch('https://api.pokemontcg.io/v2/sets');
    const data = await response.json();
    const sets = data.data;
  
    const genStructure = {};
    for (const set of sets) {
      const gen = getGenerationName(set);
      if (!genStructure[gen]) genStructure[gen] = [];
      genStructure[gen].push(set);
    }
    generations.value = genStructure;
  }
  
  function getGenerationName(set) {
    const id = set.id.toLowerCase();
    if (/base|jungle|fossil|teamrocket|base2|promo/i.test(id)) return 'Base';
    if (/gym/.test(id)) return 'Gym';
    if (/southern/.test(id)) return 'Southern Islands';
    if (/neo/.test(id)) return 'Neo';
    if (/legendarycollection/.test(id)) return 'Legendary Collection';
    if (/ecard|expedition|aquapolis|skyridge/.test(id)) return 'E-Card';
    if (/ex|emerald|delta|holon|crystal|powerkeepers/.test(id)) return 'Ruby and Sapphire';
    if (/pop/.test(id)) return 'POP';
    if (/dp|platinum|rumble/.test(id)) return 'Diamond and Pearl';
    if (/hgss|calloflegends/.test(id)) return 'HeartGold & SoulSilver';
    if (/sv|151|paradox|paldea|obsidian|temporal|twilight|shrouded|stellar|surging|prismatic/.test(id)) return 'Scarlet and Violet';
    if (/swsh|vivid|evolving|fusion|celebrations|chilling|rebel|darkness|shining|battle|go|brilliant|astral|lost|silver|crown/.test(id)) return 'Sword and Shield';
    if (/sm|detective|shining|burning|guardians|unbroken|teamup|dragon|celestial|forbidden|ultra|cosmic|hidden|unified|lostthunder/.test(id)) return 'Sun and Moon';
    if (/xy|kalos|evolutions|fates|generations|break|steam|roaring|primal|phantom|furious|flashfire/.test(id)) return 'XY';
    if (/bw|noble|next|emerging|dark|plasma|boundaries|dragonvault|legendarytreasures/.test(id)) return 'Black and White';
    if (/mcdonald/.test(id)) return "McDonald's";
    return 'Others';
  }
  
  async function fetchCardsForSet(setId) {
    const response = await fetch(`https://api.pokemontcg.io/v2/cards?q=set.id:${setId}`);
    const data = await response.json();
    return data.data || [];
  }
  
  function categorizeCards(cards) {
    const categories = {
      common: [],
      uncommon: [],
      rare: [],
      rareHolo: [],
      unique: []
    };
  
    for (const card of cards) {
      const rarity = card.rarity?.toLowerCase() || '';
      if (rarity.includes('common')) categories.common.push(card);
      else if (rarity.includes('uncommon')) categories.uncommon.push(card);
      else if (rarity.includes('rare holo')) categories.rareHolo.push(card);
      else if (rarity.includes('rare')) categories.rare.push(card);
      else categories.unique.push(card);
    }
  
    return categories;
  }
  
  function getRandomCard(cards) {
    if (!cards.length) return null;
    return cards[Math.floor(Math.random() * cards.length)];
  }
  
  async function openPack(setId) {
    if (!setId) return;
  
    pack.value = [];
    showModal.value = false;
  
    const cards = await fetchCardsForSet(setId);
    if (cards.length === 0) return;
  
    const categorized = categorizeCards(cards);
  
    for (let i = 0; i < 5; i++) {
      const card = getRandomCard(categorized.common);
      if (card) pack.value.push(card);
    }
  
    for (let i = 0; i < 2; i++) {
      const card = getRandomCard(categorized.uncommon);
      if (card) pack.value.push(card);
    }
  
    const rareOrHolo = [...categorized.rare, ...categorized.rareHolo];
    const rareCard = getRandomCard(rareOrHolo);
    if (rareCard) pack.value.push(rareCard);
  
    const finalCard = categorized.unique.length
      ? getRandomCard(categorized.unique)
      : getRandomCard(rareOrHolo);
    if (finalCard) pack.value.push(finalCard);
  
    showModal.value = true;
  }
  
  fetchAllSets();
  </script>
  
  <style>
  .app-container {
    padding: 20px;
    background-color: #1a1a1a;
    color: white;
    font-family: Arial, sans-serif;
    text-align: center;
  }
  
  .generation-title {
    font-size: 24px;
    margin: 32px 0 16px;
    text-align: center;
  }
  
  .generation-section {
    margin-bottom: 40px;
  }
  
  .set-grid {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 16px;
  }
  
  .set-card {
    background: #2a2a2a;
    padding: 12px;
    border-radius: 8px;
    text-align: center;
    width: 180px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.5);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  
  .set-card img {
    width: 100%;
    height: auto;
    margin-bottom: 8px;
  }
  
  .set-card button {
    background: orange;
    border: none;
    padding: 6px 12px;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 6px;
  }
  
  .results {
    margin-top: 40px;
  }
  
  .results ul {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 12px;
    padding: 0;
    list-style: none;
  }
  
  .results li {
    background: #333;
    padding: 8px;
    border-radius: 6px;
    text-align: center;
    width: 150px;
  }
  
  .results img {
    width: 100%;
    height: auto;
    margin-bottom: 6px;
  }
  
  .rarity {
    font-style: italic;
    font-size: 0.9em;
    color: #ccc;
  }
  
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.75);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
  }
  
  .modal-content {
    background-color: #222;
    color: white;
    padding: 20px;
    border-radius: 10px;
    width: 90%;
    max-width: 800px;
    max-height: 90vh;
    overflow-y: auto;
    text-align: center;
    box-shadow: 0 4px 20px rgba(0,0,0,0.7);
  }
  
  .modal-results {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 12px;
    padding: 0;
    list-style: none;
    margin: 20px 0;
  }
  
  .modal-results li {
    background: #333;
    padding: 8px;
    border-radius: 6px;
    text-align: center;
    width: 150px;
  }
  
  .modal-results img {
    width: 100%;
    height: auto;
    margin-bottom: 6px;
  }
  
  .close-btn {
    background: orange;
    border: none;
    padding: 10px 20px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 1rem;
  }
  </style>
  