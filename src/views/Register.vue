<template>
  <div v-if="!isTakingPhoto">
    <UserCity @take-photo="isTakingPhoto = !isTakingPhoto"></UserCity>
  </div>
  <div v-else>
    <TakePhoto></TakePhoto>
  </div>
</template>

<script>
import TakePhoto from '@/components/TakePhoto.vue'
import UserCity from '@/components/UserCity.vue'

export default {
  components: {TakePhoto, UserCity},
  data() {
    return {
      isTakingPhoto: false,
    }
  }
}
</script>