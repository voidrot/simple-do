<template>
  <div class="hero min-h-[50vh] bg-base-200">
    <div class="hero-content text-center">
      <div class="max-w-md">
        <h1 class="text-5xl font-bold">Welcome to Simple Do</h1>
        <p class="py-6">
          Your simple task management app. Create, manage, and complete your tasks with ease.
        </p>
        <div v-if="!session">
          <NuxtLink to="/auth" class="btn btn-primary">
            Get Started
          </NuxtLink>
        </div>
        <div v-else>
          <p class="text-lg">Ready to manage your tasks?</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'

const { session } = useAuth()
</script>
