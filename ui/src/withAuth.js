import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

export default function withAuth(ComponentToProtect) {
  return class extends Component {
    constructor() {
      super();
      this.state = {
        loading: true,
        redirect: false,
      };
    }

    componentDidMount() {
      fetch('/checkToken')
        .then(res => {
          if (res.status === 200) {
            this.setState({ loading: false });
          } else {
            const error = new Error(res.error);
            throw error;
          }
        })
        .catch(err => {
          console.error(err);
          this.setState({ loading: false, redirect: true });
        });
    }


    render() {
      const { loading, redirect } = this.state;
      console.log('loading')

      if (loading) {
      console.log('loading','null')
          
        return <h3>LOADING</h3>;
      }
      if (redirect) {
        return <Redirect to="/login" />;
      }
      console.log('loading', 'accepted')

      return <ComponentToProtect {...this.props} />;
    }
  }
}