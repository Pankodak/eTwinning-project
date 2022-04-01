import React, { useEffect } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { useToasts } from "react-toast-notifications";

import * as actions from "../../store/actions/index";
type logout = {
  onLogout: () => void;
};
const Logout: React.FC<logout> = ({ onLogout }) => {
  const { addToast } = useToasts();
  useEffect(() => {
    addToast("Logout success", {
      appearance: "success",
      autoDismiss: true,
    });
    onLogout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <Redirect to="/" />;
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    onLogout: () => dispatch(actions.logout()),
  };
};

export default connect(null, mapDispatchToProps)(Logout);
