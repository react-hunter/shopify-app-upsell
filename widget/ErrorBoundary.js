
import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    if(window.TrackJS){
        windows.TrackJS.track(error);
    }
    console.log(`error logged to TrackJS: ${error}`)
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      this.props.handleError();
      return null;
    }

    return this.props.children;
  }
}
