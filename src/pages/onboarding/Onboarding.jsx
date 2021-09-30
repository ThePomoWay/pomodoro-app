/* eslint-disable jsx-a11y/accessible-emoji */
import { TextField } from "@material-ui/core";
import React from "react";
import { Form, Field } from "react-final-form";

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
                
                
            <div>
                <label>Notes</label>
                <Field name="notes" component="textarea" placeholder="Notes" />
            </div>
                
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
                <pre>{JSON.stringify(values, 0, 2)}</pre>
            </form>
            )}
        />
      </div>
    </div>
  );
};
