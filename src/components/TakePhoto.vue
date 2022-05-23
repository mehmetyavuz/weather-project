<template>
  <div class="card" style="width: 23rem;">
    <div v-if="loading" class="fa-3x d-flex justify-content-center my-5">
      <span class="fa-solid fa-spinner fa-spin-pulse fa-spin-reverse"></span>
    </div>
    <video v-show="!this.photo.dataUrl && !loading" id="video-cam"
           class="card-img-top" autoplay></video>
    <canvas v-show="this.photo.dataUrl && !loading" ref="canvas"
            class="card-img-top"></canvas>

    <div class="card-body">
      <h5 class="card-title">Profile Photo</h5>
      <p v-if="errorMessage" class="card-text text-danger">
        {{ errorMessage }}
      </p>
      <div class="card-body">
        <button v-show="!this.photo.dataUrl && !this.loading" class="btn btn-primary" @click="takePhoto">
          <span class="fa fa-camera"></span> Take
        </button>
        <button v-show="this.photo.dataUrl" class="btn btn-primary" @click="startCamera">
          <span class="fa fa-camera"></span> Retake
        </button>
        <button v-show="this.photo.dataUrl" class="btn btn-success ms-3" @click="$router.push('weather-forecast')">
          Forecast <span class="fa fa-arrow-right"></span>
        </button>
      </div>

    </div>
  </div>
</template>

<script>
import {photo} from '@/store.js'

export default {
  data() {
    return {
      photo,
      loading: false,
      errorMessage: null
    }
  },
  methods: {
    async startCamera() {
      // before starting camera make empty dataUrl property of global photo object
      // and show spinner indicator
      this.photo.dataUrl = null
      this.loading = true

      await navigator.mediaDevices
          .getUserMedia({
            video: true,
            audio: false,
          })
          .then(function (stream) {
            let video = document.getElementById('video-cam')
            // set stream of device camera as source of video element
            video.srcObject = stream
          })
          .catch(function (err) {
            this.errorMessage = err.message
          })
          .finally(() => this.loading = false)
    },
    stopCamera() {
      let video = document.getElementById('video-cam')
      const stream = video["srcObject"]

      // stop all existing streams from video element
      if (stream) {
        const tracks = stream.getTracks()
        tracks.forEach(track => track.stop())
      }
    },
    takePhoto() {
      let canvas = this.$refs.canvas
      let video = document.getElementById('video-cam')

      canvas.height = video["offsetHeight"]
      canvas.width = video["offsetWidth"]

      // capture image from video stream into canvas element
      canvas
          .getContext("2d")
          .drawImage(video, 0, 0, canvas.width, canvas.height)

      // store data url of profile picture into dataUrl property of global photo object
      this.photo.dataUrl = canvas.toDataURL("image/jpeg")
      this.stopCamera()
    }
  },
  mounted() {
    this.startCamera()
  }
};
</script>
