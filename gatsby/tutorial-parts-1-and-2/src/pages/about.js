import React from 'react'
import { Link } from "gatsby"
import Header from '../components/header'

export default () => (
  <div style={{ margin: `3rem auto`, maxWidth: 600 }}>
    <Link to="/">Home</Link>
    <Header headerText="About Gatsby"/>
    <Header headerText="It's pretty cool"/>
    <p>Such wow. Very React.</p>
  </div>
)