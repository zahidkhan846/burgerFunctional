import React, { Suspense, useEffect } from "react";
import { Route, Switch, withRouter, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import BurgerBuilder from "./Containers/BurgerBuilder/BurgerBuilder";
import Layout from "./HOC/Layout/Layout";
import Logout from "./Containers/Authentication/Logout/Logout";
import * as actions from "./Store/Actions/index";
import Spinner from "./UserInterface/Spinner/Spinner";

const Checkout = React.lazy(() => {
  return import("./Containers/Checkout/Checkout");
});
const Orders = React.lazy(() => {
  return import("./Containers/Orders/Orders");
});
const Auth = React.lazy(() => {
  return import("./Containers/Authentication/SignupForm");
});

function App(props) {
  const { checkAuthStatus } = props;
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  let Routes = (
    <Switch>
      <Route path="/" exact component={BurgerBuilder} />
      <Route path="/signup" render={(props) => <Auth {...props} />} />
      <Redirect to="/" />
    </Switch>
  );

  if (props.isAuthenticated) {
    Routes = (
      <Switch>
        <Route path="/checkout" render={(props) => <Checkout {...props} />} />
        <Route path="/orders" render={(props) => <Orders {...props} />} />
        <Route path="/logout" component={Logout} />
        <Route path="/signup" render={(props) => <Auth {...props} />} />
        <Route path="/" exact component={BurgerBuilder} />
        <Redirect to="/" />
      </Switch>
    );
  }

  return (
    <div>
      <Layout>
        <Suspense fallback={<Spinner />}>{Routes}</Suspense>
      </Layout>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.token != null,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    checkAuthStatus: () => dispatch(actions.checkAuthExpState()),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
