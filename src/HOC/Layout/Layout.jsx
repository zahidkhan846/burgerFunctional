import React, { useState } from "react";
import styles from "./Layout.module.css";
import Toolbar from "./../../Components/NavigationBar/Toolbar/Toolbar";
import Aux from "../Auxiliary/Auxiliary";
import SideDrawer from "../../Components/NavigationBar/SideDrawer/SideDrawer";
import { connect } from "react-redux";

function Layout(props) {
  const [showSidedrawer, setShowSidedrawer] = useState(false);

  const closeSideDrawerHandler = () => {
    setShowSidedrawer(false);
  };
  const showSidedrawerHandler = () => {
    setShowSidedrawer(!showSidedrawer);
  };

  return (
    <Aux>
      <Toolbar
        isAuth={props.isAuthenticated}
        showSide={showSidedrawerHandler}
      />
      <SideDrawer
        isAuth={props.isAuthenticated}
        showSidedrawer={showSidedrawer}
        closeSidedrawer={closeSideDrawerHandler}
      />
      <main className={styles.Content}>{props.children}</main>
    </Aux>
  );
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.token !== null,
  };
};

export default connect(mapStateToProps)(Layout);
