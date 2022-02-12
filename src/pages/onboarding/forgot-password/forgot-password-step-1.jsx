import styles from './forgot-password.module.scss';

import { Field, Form } from "react-final-form";
import { TextField } from 'mui-rff';
import { useCallback, useState } from 'react';
import { register, initiatePasswordChange } from '../../../common/state/slices/OnboardingSlice';
import { useDispatch } from 'react-redux';
import { validateEmail } from '../../../common/utils/validators';

export function ForgotPasswordStep1() {
    let dispatch = useDispatch();

    let formData = {
        email: ''
    }

    let [emailError, setEmailError] = useState(false);

    let onSubmit = useCallback((vals) => {
        dispatch(initiatePasswordChange(vals));
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
                        <button className="btn btn-login" type="submit" onClick={handleSubmit} disabled={submitting || pristine || emailError}>
                            Continue
                        </button>
                    </div>
                </form>
                )}></Form>
        </div>
    )
}