import React from "react"
import Layout from "../components/layout"
import { Auth0Provider } from "@auth0/auth0-react"

ReactDOM.render(
  <Auth0Provider
    domain="fiservseminars.us.auth0.com"
    clientId="zRyYsoSjQEFqMqyZ61qQAJX2Ep2uQdSA"
    redirectUri={window.location.origin}
    audience="https://fiservseminars.us.auth0.com/api/v2/"
    scope="read:current_user update:current_user_metadata"
  >
    <App />
  </Auth0Provider>,
  document.getElementById("root")
)

export default function Home() {
  return (
    <Layout>
      <h1>Public Notes</h1>
      <p>lk;jhlkjlkjlkjlkjlkjlkjljlkjlkjkjlhjiouoijklj</p>
    </Layout>
  )
}
