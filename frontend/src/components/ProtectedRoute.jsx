import { Navigate } from "react-router-dom"
import { jwtDecode } from "jwt-decode"
import api from "../api"
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants"
import { useState, useEffect } from "react"

function ProtectedRoute({children}) {
    // we use this as react's in-built func for editing as it comes with a re-render page function as well
    const [isAuthorized, setIsAuthorized] = useState(null)

    // react func for fetching data, runs the function on the first param and optional arr as 
    // 2nd param for when the code shld be ran 
    useEffect(() => {
        auth().catch(() => setIsAuthorized(false))
    }, [])

    const refreshToken = async () => {
        // gets the refresh token if access has expired
        const refreshToken = localStorage.getItem(REFRESH_TOKEN)
        try {
            const res = await api.post("/api/token/refresh/", {
                refresh: refreshToken 
            });

            // if the system successfully gets the refresh token
            if (res.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, res.data.access)
                // give access
                setIsAuthorized(true)
            } else {
                // deny access
                setIsAuthorized(false)
            }
        } catch (error) {
            console.log(error)
            setIsAuthorized(false)
        }
    }

    const auth = async () => {
        // To ensure that user has an access token before giving auth
        const token = localStorage.getItem(ACCESS_TOKEN)
        if (!token) {
            setIsAuthorized(false)
            return
        }
        const decoded = jwtDecode(token) // decodes the token
        const tokenExpiration = decoded.exp // gets the token's expiration time
        const now = Date.now() / 1000 // gets current time

        // if curr time greater than token expiration time 
        if (tokenExpiration < now) {
            // runs the refreshtoken
            await refreshToken();
        // if not expired yet, give authorization
        } else {
            setIsAuthorized(true)
        }
    }

    if (isAuthorized === null) {
        return <div>Loading...</div>
    }

    return isAuthorized ? children : <Navigate to="/login" />
}

export default ProtectedRoute