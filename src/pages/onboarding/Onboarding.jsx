/* eslint-disable jsx-a11y/accessible-emoji */
import { TextField } from "@material-ui/core";
import React, { useCallback } from "react";
import { Form, Field } from "react-final-form";
import GoogleLogin from "react-google-login";
import FacebookLogin from 'react-facebook-login';

import "./onboarding.scss";

const onSubmit = async (values) => {
  window.alert(JSON.stringify(values, 0, 2));
};

export default function OnBoarding(props) {
  let formData = {
    stooge: "larry",
    toppings: [],
    sauces: []
  };

  const responseGoogle = useCallback((response) => {
    console.log(response);
    debugger;
  });

  const componentClicked = useCallback(() => {
      console.log('fb btn clicked');
  });

  const responseFacebook = useCallback((response) => {
    console.log(response);
    });

  return (
    <div className="form-wrapper grid grid-center">
        <div className="form-box">
        <div>React Final Form - Simple Example</div>
        <Form
            onSubmit={onSubmit}
            initialValues={{
            ...formData,
            }}
            render={({ handleSubmit, form, submitting, pristine, values }) => (
            <form onSubmit={handleSubmit}>
                <div>
                <Field
                    name="firstName"
                    type="text"
                    placeholder="First Name">

                    {props => (
                        <div>
                        <TextField
                            name={props.input.name}
                            value={props.input.value}
                            onChange={props.input.onChange}
                            variant="outlined"
                            label="Email"
                        />
                        </div>
                    )}
                    </Field>
                </div>
                
                
            {/* <div>
                <label>Notes</label>
                <Field name="notes" component="textarea" placeholder="Notes" />
            </div> */}
                
                <div>
                <button type="submit" disabled={submitting || pristine}>
                    Submit
                </button>
                <button
                    type="button"
                    onClick={form.reset}
                    disabled={submitting || pristine}
                >
                    Reset
                </button>
                </div>
                {/* <pre>{JSON.stringify(values, 0, 2)}</pre> */}
            </form>
            )}

        />

        <GoogleLogin
            clientId="905357367821-f8j4n23ghi3bbebga32e105e375edfj2.apps.googleusercontent.com"
            buttonText="Login"
            onSuccess={responseGoogle}
            onFailure={responseGoogle}
            cookiePolicy={'single_host_origin'}
        />

        <FacebookLogin
            appId="958233501449664"
            autoLoad={true}
            fields="name,email,picture"
            onClick={componentClicked}
            callback={responseFacebook} />
      </div>
    </div>
  );
};
