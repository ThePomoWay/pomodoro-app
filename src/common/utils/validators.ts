export let validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

export let validateAPIResponse = (response, dispatch, action) => {
  if (response.status !== 200) {
    dispatch(
      action({
        msg:
          response.data.message ||
          "We're facing some issues, please try again in some time",
        open: true,
        type: "failure",
      })
    );
  } else {
    return response;
  }
};
