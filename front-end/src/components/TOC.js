import React, { Component } from 'react';

export default class TOC extends Component {

  render() {
    return (
      <aside className="left-toc hide-first-toc-level">
        <div className="left-toc__title">Overview:</div>
        <ul>
          <li>
            <a className="reference internal" href="#"></a>
            <ul>
              <li><a className="reference internal" href="#prerequisites">What You’ll Need</a></li>
              <li><a className="reference internal" href="#check_your_environment">Check Your Environment</a></li>
              <li><a className="reference internal" href="#procedure">Procedure</a></li>
              <li><a className="reference internal" href="#summary">Summary</a></li>
              <li><a className="reference internal" href="#whats_next">What’s Next</a></li>
              <li><a className="reference internal" href="#see_also">See Also</a></li>
            </ul>
          </li>
        </ul>
      </aside>
    )
  }

}