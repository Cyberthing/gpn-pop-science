import React, { Component } from 'react';
// export function computeProps(props)=>

export function addComputedProps(computedPropsFunc, options = {}) {
  return function addPropsWrapper(WrappedComponent) {
    const {
      changeExclude,
      changeInclude,
      flagRecomputed = false,
      recomputedFlagName = 'recomputedProps',
    } = options;

    // helper to compute props and optionally include the recomputedProps flag
    function computeProps(props) {
      let computedProps = computedPropsFunc(props);
      if (flagRecomputed) {
        computedProps = Object.assign({ [recomputedFlagName]: true }, computedProps);
      }

      return computedProps;
    }

    const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';

    class AddComputedProps extends Component {
      static displayName = `AddComputedProps(${displayName})`
      static WrappedComponent = WrappedComponent
      static defaultProps = WrappedComponent.defaultProps

      constructor(){
        super()

        // this.self = React.createRef()
      }

      componentWillMount() {
        this.propsToAdd = computeProps(this.props);
      }

      componentWillUpdate(nextProps) {
        // recompute props to add only when the props change
          this.propsToAdd = computeProps(nextProps);
      }

      render() {
        //console.dir(WrappedComponent)
        if(WrappedComponent.prototype && WrappedComponent.prototype.render)
          return <WrappedComponent ref={ ref => this.self = ref } {...this.props} {...(this.propsToAdd || {})} />;
        else
          return <WrappedComponent {...this.props} {...(this.propsToAdd || {})} />;
      }
    }

    return AddComputedProps;
  };
}