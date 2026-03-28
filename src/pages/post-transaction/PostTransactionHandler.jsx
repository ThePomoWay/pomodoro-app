import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  showTransactionErrorModal,
  showTransactionSuccessModal,
} from "../../common/state/slice/GlobalSlice";

export function PostTransactionHandler(props) {
  let location = window.location.pathname;
  let navigate = useNavigate();
  let dispatch = useDispatch();

  if (location === "/success") {
    dispatch(showTransactionSuccessModal());
  } else {
    dispatch(showTransactionErrorModal());
  }

  useEffect(() => {
    setTimeout(() => {
      navigate("/");
    }, 2000);
  });

  return <></>;
}
