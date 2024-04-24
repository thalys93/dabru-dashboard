import axios from 'axios'

export const apiURL_Local = axios.create({
    baseURL: `http://localhost:3000/`
})

export const AuthHeaders = (token: string) => {
    return { headers: { Authorization: `Bearer ${token}` } }
}

// export const apiURL_prod = axios.create({
//     baseURL: ``
// })
