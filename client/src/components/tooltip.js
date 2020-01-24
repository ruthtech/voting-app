import React from 'react'
import PropTypes from 'prop-types'

export default class Tooltip extends React.Component {
  
  static propTypes = {
    features: PropTypes.array.isRequired
  };

  render() {
    const { features } = this.props;

    if(features.length === 0) {
      // Nothing to render for now. This happens when the mouse is over, for example, 
      // America instead of Canada.
      return (<div></div>);
    }

    let feature = features[0]; // There is only one voting feature per district.
    return (
      <div>
        <div className="bg-white">
          <div key={feature.layer.metadata.votingDistrict}>
            <strong>{feature.layer.metadata.votingDistrict}</strong>
            <div>{feature.layer.metadata.votingSeat}</div>
          </div>
        </div>
        <span className="flex-child color-white triangle triangle--d"></span>
      </div>
    );
  }
}