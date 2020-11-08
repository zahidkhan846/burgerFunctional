import React from "react";
import CheckoutSummery from "./../../Components/Order/CheckoutSummery/CheckoutSummery";
import { Route, Redirect } from "react-router-dom";
import ContactInfo from "../Forms/ContactInfo/ContactInfo";
import { connect } from "react-redux";

const Checkout = (props) => {
  const cancelOrderHandler = () => {
    props.history.goBack("/");
  };

  const buyOrderHandler = () => {
    props.history.replace("/checkout/contact-info");
  };

  let checkoutSummery = <Redirect to="/" />;

  if (props.ings) {
    const purchased = props.purchased ? <Redirect to="/" /> : null;
    checkoutSummery = (
      <div>
        {purchased}
        <CheckoutSummery
          onCancel={cancelOrderHandler}
          onBuy={buyOrderHandler}
          ingredients={props.ings}
        />
        <Route
          path={props.match.path + "/contact-info"}
          component={ContactInfo}
        />
      </div>
    );
  }

  return checkoutSummery;
};

const mapStateToProps = (state) => {
  return {
    ings: state.burgerBuilder.ingredients,
    purchased: state.order.purchased,
  };
};

export default connect(mapStateToProps)(Checkout);
