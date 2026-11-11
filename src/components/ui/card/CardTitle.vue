<template>
  <component :is="as" :class="cn('font-semibold leading-none tracking-tight text-xl', $attrs.class)">
    <slot />
  </component>
</template>

<script setup>
import { cn } from '@/lib/utils';

defineProps({
  as: { type: String, default: 'h3' }
});
</script>
