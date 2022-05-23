<template>
  <div class="card" style="width: 23rem;">
    <div class="card-body">
      <h5 class="card-title mb-4">Register</h5>
      <div class="card-text mb-3">
        <input v-model="userCity.username" type="text" class="form-control" placeholder="name"/>
        <br>
        <div class="d-flex align-items-center">
          <input type="text" class="form-control" placeholder="city"
                 @keyup="getCity" v-model="userCity.cityName"/>
          <span v-show="loading" class="fa-solid fa-spinner fa-spin-pulse fa-spin-reverse ms-2"></span>
          <span v-show="errorMessage && !loading" class="fa fa-xmark text-danger ms-2"></span>
          <span v-show="found && !loading" class="fa fa-check text-success ms-2"></span>
        </div>
      </div>

      <div class="row">
        <div v-if="errorMessage" class="col">
          <div class="text-danger">
            {{errorMessage}}
          </div>
        </div>
        <div class="text-end col">
          <button :disabled="!(userCity.coordinates && userCity.username)"
                  @click="this.$emit('take-photo')"
                  class="btn btn-primary">
            Submit <span class="fa fa-arrow-right"></span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {userCity} from '@/store.js'
import axios from "axios";

export default {
  data() {
    return {
      userCity,
      loading: false,
      found: false,
      errorMessage: null,
      timeout: null
    }
  },
  methods: {
    getCity(e) {
      // for new search request
      // clear previous request in setTimeout
      clearTimeout(this.timeout)
      this.loading = false
      this.userCity.coordinates = null

      let query = e.target.value
      if (query.length > 0) {
        this.loading = true
        this.errorMessage = null

        // in order to provide smooth searching experience
        // set one-second delay after key up
        this.timeout = setTimeout(() => {
          let appid = '97a8baa22be169155bc8cd770fce852c'
          let path = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${appid}`

          axios
              .get(path)
              .then(response => {
                // assign coordinates of queried city to coordinates property of global userCity object
                this.userCity.coordinates = response.data["coord"]
                this.errorMessage = null
                this.found = true
              })
              .catch(error => {
                console.log(error)
                this.errorMessage = error.response.data.message
                this.found = false
                this.userCity.coordinates = null
              })
              .finally(() => this.loading = false)
        }, 1000)
      }
      else {
        // if the input element is empty ask for entering a city
        this.errorMessage = 'Please enter a city'
      }
    }
  }
}
</script>
