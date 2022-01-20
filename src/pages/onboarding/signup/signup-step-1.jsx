import { Field, Form } from "react-final-form";
import { TextField } from 'mui-rff';
import { useDispatch } from "react-redux";
import { validateEmail } from "../../../common/utils/validators";

import styles from './signup.module.scss';
import { useCallback, useState } from "react";
import { registerCheck } from "../../../common/state/slices/OnboardingSlice";

export function SignupStep1(props) {
    let dispatch = useDispatch();

    let formData = {
        email: ''
    }

    let [emailError, setEmailError] = useState(false);

    let onSubmit = useCallback((vals) => {
        dispatch(registerCheck(vals.email));
    })

    let validate = (vals) => {
        let error = !validateEmail(vals.email);
        setEmailError(error);
        return error;
    }
    return (
        <div className={styles['container']}>
            {/* <div className={styles['title']}>Please enter the following details</div> */}
            <Form
                onSubmit={onSubmit}
                validate={validate}
                initialValues={{
                ...formData,
                }}
                
                render={({ handleSubmit, form, submitting, pristine, values }) => (
                <form onSubmit={handleSubmit} className={styles['form']}>
                    <div>
                   
                    <Field
                        name="email"
                        type="text"
                        placeholder="Enter your email">

                        {({input, meta}) => (
                            
                            <TextField
                                fullWidth
                                name={input.name}
                                value={input.value}
                                onChange={input.onChange}
                                variant="standard"
                                label="Email"
                                error={!meta.active && meta.dirty && emailError}
                                helperText={(!meta.active && meta.dirty && emailError) ? "Incorrect value for email.": ''}
                            />
                        
                        )}
                        </Field>
                    </div>
                    <div className={styles["cta"]}>
                        <button className="btn btn-login" type="submit" disabled={submitting || pristine || emailError}>
                            Signup with email
                        </button>

                        <div className={styles["login"]} onClick={(e) => props.onChange && props.onChange()}> or Login</div>
                    {/* <button
                        type="button"
                        onClick={form.reset}
                        disabled={submitting || pristine}
                    >
                        Reset
                    </button> */}
                    </div>
                </form>
                )}></Form>
        </div>
    )
}