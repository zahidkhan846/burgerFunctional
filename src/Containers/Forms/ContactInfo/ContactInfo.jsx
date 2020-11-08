import React, { useState } from "react";
import styles from "../ContactInfo/ContactInfo.module.css";
import Button from "../../../UserInterface/Button/Button";
import Spinner from "../../../UserInterface/Spinner/Spinner";
import Input from "../../../Form/Input/Input";
import { connect } from "react-redux";
import * as orderAction from "../../../Store/Actions/index";
import withErrorHandler from "./../../../HOC/withErrorHandler/withErrorHandler";
import AxiosInstance from "./../../../AxiosInstance/InstanceOrder";
import { updatedObject, checkValidity } from "./../../../Store/Utility/utility";

function ContactInfo(props) {
  const [contactForm, setContactForm] = useState({
    name: {
      elementType: "input",
      elementConfig: {
        type: "text",
        placeholder: "Your Name",
      },
      value: "",
      validation: {
        required: true,
      },
      valid: false,
      touched: false,
    },
    street: {
      elementType: "input",
      elementConfig: {
        type: "text",
        placeholder: "Street",
      },
      value: "",
      validation: {
        required: true,
      },
      valid: false,
      touched: false,
    },
    zipCode: {
      elementType: "input",
      elementConfig: {
        type: "text",
        placeholder: "ZIP Code",
      },
      value: "",
      validation: {
        required: true,
        minLength: 5,
        maxLength: 5,
        isNumeric: true,
      },
      valid: false,
      touched: false,
    },
    country: {
      elementType: "input",
      elementConfig: {
        type: "text",
        placeholder: "Country",
      },
      value: "",
      validation: {
        required: true,
      },
      valid: false,
      touched: false,
    },
    email: {
      elementType: "input",
      elementConfig: {
        type: "email",
        placeholder: "Your E-Mail",
      },
      value: "",
      validation: {
        required: true,
        isEmail: true,
      },
      valid: false,
      touched: false,
    },
    deliveryMethod: {
      elementType: "select",
      elementConfig: {
        options: [
          { value: "fastest", displayValue: "Fastest" },
          { value: "cheapest", displayValue: "Cheapest" },
        ],
      },
      value: "fastest",
      validation: {},
      valid: true,
    },
  });

  const [formIsValid, setFormIsValid] = useState(false);

  const changeInputHandler = (event, selectedId) => {
    const selectedElContactForm = updatedObject(contactForm[selectedId], {
      value: event.target.value,
      valid: checkValidity(
        event.target.value,
        contactForm[selectedId].validation
      ),
      touched: true,
    });

    const updatedContactForm = updatedObject(contactForm, {
      [selectedId]: selectedElContactForm,
    });

    let formIsValid = true;
    for (let selectedId in contactForm) {
      formIsValid = contactForm[selectedId].valid && formIsValid;
    }
    setContactForm(updatedContactForm);
    setFormIsValid(formIsValid);
  };

  const orderNowHandler = (event) => {
    event.preventDefault();
    const contactForm = {};
    for (let eachElement in contactForm) {
      contactForm[eachElement] = contactForm[eachElement].value;
    }
    const order = {
      ingredients: props.ings,
      totalPrice: props.price,
      orderData: contactForm,
      userId: props.userId,
    };
    props.onSubmitOrder(order, props.token);
  };

  const contactFormArray = [];
  for (let key in contactForm) {
    contactFormArray.push({
      id: key,
      config: contactForm[key],
    });
  }

  let form = (
    <form onSubmit={orderNowHandler}>
      {contactFormArray.map((formElement) => {
        return (
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
        );
      })}
      <Button disabled={!formIsValid} buttonType={"Success"}>
        Order Now
      </Button>
    </form>
  );
  if (props.loading) {
    return <Spinner />;
  }

  return (
    <div className={styles.ContactInfo}>
      <h4>Please! enter your information</h4>
      {form}
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
    ings: state.burgerBuilder.ingredients,
    price: state.burgerBuilder.totalPrice,
    loading: state.order.loading,
    userId: state.auth.userId,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSubmitOrder: (orderData, token) =>
      dispatch(orderAction.purchaseBurger(orderData, token)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorHandler(ContactInfo, AxiosInstance));
