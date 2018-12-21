import React, { Component } from 'react';

export default class Card extends Component {

  getTitle(val) {
    if (this.props.refDocMapping[val] && this.props.refDocMapping[val].ast) {
      return this.props.refDocMapping[val].ast.children[0].children[0].children[0].value;
    } 
    return 'Title not found';
  }

  cardContent() {
    console.log(88, this.props.card);
    const innerContent = (
      <section style={ {height:'100%'} }>
        <div className="guide__title"> 
          { this.props.card.name === 'card' ? this.getTitle(this.props.card.argument[0].value) : this.props.card.argument[0].value } 
        </div>
        <ul className="guide__body">
          { this.props.card.name === 'card' ? '' :
              this.props.card.children[0].children.map((listItem, index) => {
                return <li className="guide__entry" key={ index }><a href={ listItem.children[0].children[0].value }> 
                  { this.getTitle(listItem.children[0].children[0].value) } 
                </a></li>
              })
          }
        </ul>
        <ul className="guide__pills"></ul>
        <div className="guide__time"> 
          { this.props.card.name === 'card' ? '5min' : '' } 
        </div>
      </section>
    );
    if (this.props.card.name === 'multi-card') {
      return (
        <div className='guide guide--jumbo guide--expanded'>
          { innerContent }
        </div>
      );
    } else {
      return (
        <a href={ this.props.card.argument[0].value } className='guide guide--regular'>
          { innerContent }
        </a>
      );
    }
  }

  render() {
    return (
      this.cardContent()
    )
  }

}

