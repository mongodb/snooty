import React, { Component} from 'react';

export default class URIForm extends Component {

  render() {
    return (
      <form className="uriwriter__form" id="uriwriter" autoComplete="off">
        <div id="deployment_type" className="mongodb-form__prompt" style={ {display: 'block'} }>
          <div className="mongodb-form__label">Server deployment type</div>
          <ul className="guide__pills">
            <li className="uriwriter__toggle guide__pill guide__pill--active">local MongoDB</li>
            <li className="uriwriter__toggle guide__pill">local MongoDB with replica set</li>
          </ul>
        </div>
        <label className="mongodb-form__prompt uriwriter__atlascontrols" style={ {display: 'none'} }>
          <div className="mongodb-form__label">Atlas connection string</div>
          <div>
            <textarea className="mongodb-form__input" id="uriwriter_atlaspaste" spellCheck="false" rows="3" cols="50" placeholder="mongo &quot;mongodb+srv://clustername.mongodb.net/test&quot; --username user"></textarea>
            <div className="atlascontrols__status mongodb-form__status"></div>
          </div>
        </label>
        <div id="userinfo_form">
          <label className="mongodb-form__prompt">
              <div className="mongodb-form__label">Username</div>
              <input className="mongodb-form__input" id="uriwriter_username" required="" />
          </label>
          <label className="mongodb-form__prompt">
              <div className="mongodb-form__label">Database name</div>
              <input className="mongodb-form__input" id="uriwriter_db" required="" />
          </label>
          <label className="mongodb-form__prompt uriwriter__option-prompt">
            <div className="mongodb-form__label">replicaSet</div>
            <input id="replicaSet" className="mongodb-form__input" />
          </label>
          <label className="mongodb-form__prompt uriwriter__option-prompt">
            <div className="mongodb-form__label">authSource</div>
            <input id="authSource" className="mongodb-form__input" />
          </label>
          <div className="mongodb-form__prompt" data-server-configuration="">
            <div className="mongodb-form__label">Servers</div>
            <div id="hostlist">
              <input className="mongodb-form__input" placeholder="localhost:27017" />
              <div className="mongodb-form__status"></div>
            </div>
          </div>
        </div>
      </form>
    )
  }

}