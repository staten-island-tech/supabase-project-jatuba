<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../supabase'

const posts = ref([])

const fetchPosts = async () => {
  const { data, error } = await supabase.from('posts').select('*')
  if (error) console.error(error)
  else posts.value = data
}

onMounted(fetchPosts)
</script>

<template>
  <div>
    <h2>Posts</h2>
    <ul>
      <li v-for="post in posts" :key="post.id">{{ post.title }}</li>
    </ul>
  </div>
</template>
