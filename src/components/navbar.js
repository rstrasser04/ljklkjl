import React from "react"
import { Link } from "gatsby"

const Navbar = () => {
  return (
    <div className="navbar-wrapper">
      <ul className="navbar">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/notes">Private Notes</Link>
        </li>
      </ul>
    </div>
  )
}

export default Navbar
