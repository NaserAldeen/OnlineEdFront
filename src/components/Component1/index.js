import React, { Component } from "react";
import { connect } from "react-redux";

class index extends Component {
  render() {
    return <div>hi</div>;
  }
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dipsatch) => {
  return {
    // action: () => dispatch(action())
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(index);
