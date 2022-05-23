import {reactive} from 'vue'

// global variables

export const userCity = reactive({
    username: null,
    cityName: null,
    coordinates: null
})

export const photo = reactive({
    dataUrl: null
})