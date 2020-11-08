import React from "react";
import Aux from "../Auxiliary/Auxiliary";
import Model from "../../UserInterface/Model/Model";
import useHttpErrorHandler from "../../Hooks/http-error-handler";

const withErrorHandler = (WrappedComponent, AxiosInstance) => {
  return function (props) {
    const [error, closeErrorHandler] = useHttpErrorHandler(AxiosInstance);

    return (
      <Aux>
        <Model show={error} closeModel={closeErrorHandler}>
          {error ? error.message : null}
        </Model>
        <WrappedComponent {...props} />
      </Aux>
    );
  };
};

export default withErrorHandler;
