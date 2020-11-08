import React, { useState, useEffect, useCallback } from "react";
import Aux from "../../HOC/Auxiliary/Auxiliary";
import Burger from "./../../Components/Burger/Burger";
import BuildControls from "../../Components/Burger/BuildControls/BuildControls";
import Model from "../../UserInterface/Model/Model";
import OrderSummary from "./../../Components/Burger/OrderSummary/OrderSummary";
import AxiosInstance from "./../../AxiosInstance/InstanceOrder";
import Spinner from "./../../UserInterface/Spinner/Spinner";
import withErrorHandler from "../../HOC/withErrorHandler/withErrorHandler";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "../../Store/Actions/index";

export function BurgerBuilder(props) {
  const [purchasing, setPurchasing] = useState(false);

  const ings = useSelector((state) => state.burgerBuilder.ingredients);
  const price = useSelector((state) => state.burgerBuilder.totalPrice);
  const error = useSelector((state) => state.burgerBuilder.error);
  const isAuthenticated = useSelector((state) => state.auth.token !== null);

  const dispatch = useDispatch();
  const addIngredient = (ing) => dispatch(actions.addIngredient(ing));
  const removeIngredient = (ing) => dispatch(actions.removeIngredient(ing));
  const onInitIngredients = useCallback(
    () => dispatch(actions.initIngredients()),
    [dispatch]
  );
  const onInitPurchase = () => dispatch(actions.purchaseBurgerInit());
  const onSetRedirectPath = (path) =>
    dispatch(actions.setAuthRedirectPath(path));

  //const { onInitIngredients } = props;
  useEffect(() => {
    onInitIngredients();
  }, [onInitIngredients]);

  const purchasableHandler = (ingredients) => {
    const ingValueSum = Object.keys(ingredients)
      .map((ingKey) => {
        return ingredients[ingKey];
      })
      .reduce((ingValueSum, el) => {
        return ingValueSum + el;
      }, 0);
    return ingValueSum > 0;
  };

  const onPuchaseHandler = () => {
    if (isAuthenticated) {
      setPurchasing(true);
    } else {
      onSetRedirectPath("/checkout");
      props.history.push("/signup");
    }
  };

  const orderCloseHandler = () => {
    setPurchasing(false);
  };

  const orderContinueHandler = () => {
    onInitPurchase();
    props.history.push("/checkout");
  };

  let disableButton = { ...ings };
  for (let key in disableButton) {
    disableButton[key] = disableButton[key] <= 0;
  }
  let disableAddButton = { ...ings };
  for (let key in disableAddButton) {
    disableAddButton[key] = disableAddButton[key] >= 3;
  }
  let orderSummary = null;

  let burger = error ? (
    <div style={{ alignItems: "center", fontSize: "30px" }}>
      <p>
        Sorry! We are currently having problems in updating "Ingredients",
        Please try later!
      </p>
    </div>
  ) : (
    <Spinner />
  );
  if (ings) {
    burger = (
      <Aux>
        <Burger ingredients={ings} />
        <BuildControls
          isAuth={isAuthenticated}
          addIngredients={addIngredient}
          removeIngredients={removeIngredient}
          disableBtn={disableButton}
          disableAddBtn={disableAddButton}
          price={price}
          onPurchase={onPuchaseHandler}
          purchasable={purchasableHandler(ings)}
        />
      </Aux>
    );
    orderSummary = (
      <OrderSummary
        continueOrder={orderContinueHandler}
        cancelOrder={orderCloseHandler}
        ingredients={ings}
        price={price}
      />
    );
  }

  return (
    <Aux>
      <Model show={purchasing} closeModel={orderCloseHandler}>
        {orderSummary}
      </Model>
      {burger}
    </Aux>
  );
}
export default withErrorHandler(BurgerBuilder, AxiosInstance);
// const mapStateToProps = (state) => {
//   return {
//     ings: state.burgerBuilder.ingredients,
//     price: state.burgerBuilder.totalPrice,
//     error: state.burgerBuilder.error,
//     isAuthenticated: state.auth.token !== null,
//   };
// };

// const mapDispatchToProps = (dispatch) => {
//   return {
//     addIngredient: (ing) => dispatch(actions.addIngredient(ing)),
//     removeIngredient: (ing) => dispatch(actions.removeIngredient(ing)),
//     onInitIngredients: () => dispatch(actions.initIngredients()),
//     onInitPurchase: () => dispatch(actions.purchaseBurgerInit()),
//     onSetRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path)),
//   };
// };

// export default connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(withErrorHandler(BurgerBuilder, AxiosInstance));
