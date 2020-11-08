import React, { useState, useEffect } from "react";
import Input from "./../../Form/Input/Input";
import Button from "./../../UserInterface/Button/Button";
import styles from "./signupForm.module.css";
import * as actions from "../../Store/Actions/index";
import { connect } from "react-redux";
import Spinner from "./../../UserInterface/Spinner/Spinner";
import Aux from "./../../HOC/Auxiliary/Auxiliary";
import { Redirect } from "react-router-dom";
import { updatedObject, checkValidity } from "./../../Store/Utility/utility";

function SignupForm(props) {
  const [authInput, setAuthInput] = useState({
    email: {
      elementType: "input",
      elementConfig: { type: "email", placeholder: "Your Email" },
      value: "",
      validation: {
        required: true,
        isEmail: true,
      },
      valid: false,
      touched: false,
    },
    password: {
      elementType: "input",
      elementConfig: { type: "password", placeholder: "Your Password" },
      value: "",
      validation: {
        required: true,
        minLength: 6,
      },
      valid: false,
      touched: false,
    },
  });

  const [isSignUp, setIsSignUp] = useState(true);

  const { checkAuthStatus, buildingBurger, authRedirectPath } = props;
  useEffect(() => {
    if (!buildingBurger && authRedirectPath !== "/") {
      checkAuthStatus();
    }
  }, [checkAuthStatus, buildingBurger, authRedirectPath]);

  const swithAuthenticationHandler = () => {
    setIsSignUp(!isSignUp);
  };

  const submitFormHandler = (event) => {
    event.preventDefault();
    props.onSignup(authInput.email.value, authInput.password.value, isSignUp);
  };

  const changeInputHandler = (event, inputName) => {
    const controls = updatedObject(authInput, {
      [inputName]: updatedObject(authInput[inputName], {
        value: event.target.value,
        valid: checkValidity(
          event.target.value,
          authInput[inputName].validation
        ),
        touched: true,
      }),
    });
    setAuthInput(controls);
  };

  const signUpFormArray = [];
  for (let key in authInput) {
    signUpFormArray.push({
      id: key,
      config: authInput[key],
    });
  }

  let form = signUpFormArray.map((formElement) => (
    <Input
      changeInput={(event) => changeInputHandler(event, formElement.id)}
      key={formElement.id}
      elementType={formElement.config.elementType}
      elementConfig={formElement.config.elementConfig}
      value={formElement.config.value}
      invalid={!formElement.config.valid}
      shouldValidate={formElement.config.validation}
      touched={formElement.config.touched}
    />
  ));

  if (props.loading) {
    form = <Spinner />;
  }

  let errorMsg = null;

  if (props.error) {
    errorMsg = <p>{props.error.message}</p>;
  }

  let authenticated = null;
  if (props.isAuthenticated) {
    authenticated = <Redirect to={props.authRedirectPath} />;
  }

  return (
    <Aux>
      {authenticated}
      <div className={styles.SignupForm}>
        <h4>Please! enter your information</h4>
        {errorMsg}
        <form onSubmit={submitFormHandler}>
          {form}
          <Button buttonType={"Success"}>SUBMIT</Button>
        </form>
        <Button
          onButtonClick={swithAuthenticationHandler}
          buttonType={"Danger"}
        >
          Swith to {isSignUp ? "Sign In" : "Sign Up"}
        </Button>
      </div>
    </Aux>
  );
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.token !== null,
    error: state.auth.error,
    loading: state.auth.loading,
    buildingBurger: state.burgerBuilder.building,
    authRedirectPath: state.auth.authRedirectPath,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSignup: (email, password, isSignUp) =>
      dispatch(actions.auth(email, password, isSignUp)),
    onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath("/")),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignupForm);
