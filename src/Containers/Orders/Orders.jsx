import React, { useEffect } from "react";
import Order from "./../../Components/Order/Order";
import AxiosInstance from "./../../AxiosInstance/InstanceOrder";
import withErrorHandler from "../../HOC/withErrorHandler/withErrorHandler";
import * as actions from "../../Store/Actions/index";
import { connect } from "react-redux";
import Spinner from "./../../UserInterface/Spinner/Spinner";

function Orders(props) {
  const { onFetchOrders, token, userId } = props;

  useEffect(() => {
    onFetchOrders(token, userId);
  }, [onFetchOrders, token, userId]);

  let orders = <Spinner />;
  if (!props.loading) {
    orders = props.orders.map((order) => {
      return (
        <Order
          key={order.id}
          ingredients={order.ingredients}
          totalPrice={order.totalPrice}
        />
      );
    });
  }

  return <div>{orders}</div>;
}

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
    orders: state.order.orders,
    loading: state.order.loading,
    userId: state.auth.userId,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchOrders: (token, userId) =>
      dispatch(actions.fetchOrders(token, userId)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorHandler(Orders, AxiosInstance));
