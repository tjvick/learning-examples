import React from "react"
import { Link } from "gatsby"
import Header from "../components/header"

export default () => (
  <div style={{ margin: `3rem auto`, maxWidth: 600 }}>
    <Link to="/about/">About</Link>
    <Link to="/contact/">Contact</Link>
    <Header headerText="Richard Hamming on Luck" />
    <div>
      <p>
        From Richard Hamming’s classic and must-read talk, “
        <a href="http://www.cs.virginia.edu/~robins/YouAndYourResearch.html">
          You and Your Research
        </a>
        ”.
      </p>
      <blockquote>
        <p>
          There is indeed an element of luck, and no, there isn’t. The prepared
          mind sooner or later finds something important and does it. So yes, it
          is luck.{" "}
          <em>
            The particular thing you do is luck, but that you do something is
            not.
          </em>
        </p>
      </blockquote>
    </div>
    <p>Posted April 09, 2011</p>
  </div>
)
