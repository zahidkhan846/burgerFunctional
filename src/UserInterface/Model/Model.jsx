import React from "react";
import styles from "./Modal.module.css";
import Aux from "./../../HOC/Auxiliary/Auxiliary";
import Backdrop from "./../Backdrop/Backdrop";

function Model(props) {
  return (
    <Aux>
      <Backdrop show={props.show} closeBackdrop={props.closeModel} />
      <div
        style={{
          transform: props.show ? "translateY(0)" : "translateY(-100vh)",
          opacity: props.show ? "1" : "0",
        }}
        className={styles.Modal}
      >
        {props.children}
      </div>
    </Aux>
  );
}

export default React.memo(Model, (prevProps, nextProps) => {
  return (
    nextProps.show === prevProps.show &&
    nextProps.children === prevProps.children
  );
});
