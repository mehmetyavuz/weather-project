<template>
  <div class="container py-5 h-100">
    <div class="row d-flex justify-content-center align-items-center h-100">
      <div class="col-md-12 col-xl-10">

        <div class="card shadow-0 border border-dark border-1 text-dark" style="border-radius: 10px;">
          <div class="card-body p-5">
            <div v-if="this.today.length > 0" class="mb-5">
              <div class="d-flex justify-content-around mt-3">
                <p class="big">{{ this.city.name }}, {{ this.city["country"] }}</p>
                <p class="big">{{ new Date(convertDate(this.today[0]["dt_txt"])).toDateString() }}</p>
                <div class="text-center">
                  <img v-if="photo.dataUrl" :src="photo.dataUrl" :alt="userCity.username" height="70"/>
                  <p class="big">{{ userCity.username }}</p>
                </div>

              </div>
              <div class="d-flex justify-content-around align-items-center py-3 my-1">
                <p class="fw-bold mb-0" style="font-size: 7rem;">{{ parseInt(this.today[0].main["temp"]) }}°C</p>
                <div class="text-start">
                  <p class="small">{{ getHours() }}</p>
                  <p class="h3 mb-3">{{ getDay(convertDate(this.today[0]["dt_txt"]), false) }}</p>
                  <p class="small mb-0">{{ this.today[0].weather[0].description }}</p>
                </div>
              </div>
              <div class="d-flex justify-content-around align-items-center mb-3 border"
                   style="border-radius: 10px; padding: .75rem">
                <div class="flex-column">
                  <span class="fas fa-minus"></span>
                </div>
                <div class="flex-column">
                  <p class="small mb-1 fw-bold">Today</p>
                </div>
                <div v-for="hh in this.today" :key="hh.dt"
                     class="flex-column">
                  <p class="small mb-1">{{ getHours(hh["dt_txt"]) }}</p>
                  <p class="small mb-0 fw-bold">
                    {{ parseInt(hh.main["temp"]) }}°C
                  </p>
                </div>
                <div class="flex-column">
                  <span class="fas fa-minus"></span>
                </div>
              </div>
              <div class="d-flex justify-content-around align-items-center mb-3">
                <div class="flex-column">
                  <span class="fas fa-minus"></span>
                </div>
                <div class="flex-column">
                  <p class="small mb-1 fw-bold text-center">Hours</p>
                  <p class="small mb-1 text-center">0:00</p>
                  <p class="small mb-1 text-center">3:00</p>
                  <p class="small mb-1 text-center">6:00</p>
                  <p class="small mb-1 text-center">9:00</p>
                  <p class="small mb-1 text-center">12:00</p>
                  <p class="small mb-1 text-center">15:00</p>
                  <p class="small mb-1 text-center">18:00</p>
                  <p class="small mb-1 text-center">21:00</p>
                </div>
                <div v-for="day in this.nextDays" :key="day[0].dt" class="flex-column text-center">
                  <p class="small mb-1 fw-bold">{{ getDay(convertDate(day[0]["dt_txt"])) }}</p>
                  <p v-for="hh in day" :key="hh.dt" class="small mb-1">
                    {{ parseInt(hh.main["temp"]) }}°C
                  </p>
                </div>
                <div class="flex-column">
                  <span class="fas fa-minus"></span>
                </div>
              </div>
            </div>
            <div v-else-if="loading" class="d-flex justify-content-around mb-5 fa-3x">
              <span class="fa-solid fa-spinner fa-spin-pulse fa-spin-reverse"></span>
            </div>
            <div v-else>
              <div class="d-flex justify-content-around text-danger">
                <p>Could not found data !</p>
              </div>
            </div>
            <div class="d-flex justify-content-around">
              <button @click="restart" class="btn btn-danger">
                <span class="fa fa-arrow-left"></span> Restart
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import {photo, userCity} from '@/store.js'
import router from "@/router";
import axios from "axios";

export default {
  data() {
    return {
      photo,
      userCity,
      city: {},
      today: [],
      nextDays: [],
      loading: false,
      errored: false
    }
  },
  methods: {
    restart() {
      // before going to start page
      // make global properties null
      this.photo.dataUrl = null
      this.userCity.coordinates = null
      this.userCity.cityName = null
      this.userCity.username = null
      router.back()
    },
    getDay(datetime, isShort = true) {
      // getting week days as text
      let weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
      let day = new Date(datetime)
      return isShort ? weekday[day.getDay()].substring(0, 3) : weekday[day.getDay()]
    },
    getHours(datetime) {
      let hours = datetime ? new Date(datetime) : new Date()
      let minutes = `${hours.getMinutes()}`.padStart(2, "0")
      return `${hours.getHours()}:${minutes}`
    },
    convertDate(date) {
      // replace character '/' which gives 'Invalid Date' error in Safari browser
      return date.replace(/-/g, "/")
    }
  },
  async created() {
    // if coordinates provided make a request to get forecast data
    if (userCity.coordinates) {
      let lat = userCity.coordinates["lat"]
      let lon = userCity.coordinates["lon"]
      let appid = '97a8baa22be169155bc8cd770fce852c'
      let unit = 'metric'
      let path = `https://api.openweathermap.org/data/2.5/forecast?units=${unit}&lat=${lat}&lon=${lon}&appid=${appid}`

      this.loading = true
      await axios
          .get(path)
          .then(response => {
            this.city = response.data.city
            let list = response.data.list

            let first_day_txt = this.convertDate(list[0]["dt_txt"])
            let firstDay = new Date(first_day_txt).getDate()
            let prevDay = new Date(first_day_txt).getDate()
            let daily = []

            // splitting today's data and next days' forecast data
            list.forEach(item => {
              let date_txt = this.convertDate(item["dt_txt"])
              let dt = new Date(date_txt)
              let currentDay = dt.getDate()

              if (currentDay === firstDay) {
                this.today.push(item)
              } else {
                if (prevDay !== currentDay) {
                  if (daily.length > 0) {
                    this.nextDays.push(daily)
                    daily = []
                  }
                }
                daily.push(item)
              }
              prevDay = currentDay
            })
          })
          .catch(error => {
            console.log(error)
            this.errored = true
          })
          .finally(() => this.loading = false)
    }
  }
}
</script>