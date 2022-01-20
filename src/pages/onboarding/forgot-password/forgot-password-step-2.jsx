import styles from './forgot-password.module.scss';

import { Field, Form } from "react-final-form";
import { TextField } from 'mui-rff';
import { useCallback, useState } from 'react';
import { register } from '../../../common/state/slices/OnboardingSlice';
import { useDispatch } from 'react-redux';

export function ForgotPasswordStep2(props) {

    let [nameError, setNameError] = useState(false);
    let [passwordError, setPasswordError] = useState(false);

    let dispatch = useDispatch();

    let validate = useCallback((vals) => {
        setNameError(vals.name && vals.name.length === 0);
        setPasswordError(vals.password && vals.password.length < 4);
    })
    let onSubmit = useCallback((vals) => {
        if(vals.name.length && vals.password.length >= 4) {
            dispatch(register(vals));
        }
    })

    return (<div className={styles['container']}>
        <span className={styles["title"]}>PomöPanda</span>
        <span className={styles['welcome-text']}>Almost there!</span>
        <Form
                onSubmit={onSubmit}
                validate={validate}
                initialValues={{
                name: '',
                password: ''
                }}
                
                render={({ handleSubmit, form, submitting, pristine, values }) => (
                <form onSubmit={handleSubmit} className={styles['form']}>
                    <div>
                   
                    <Field
                        name="name"
                        type="text"
                        placeholder="Enter your Name">

                        {({input, meta}) => (
                            
                            <TextField
                                fullWidth
                                name={input.name}
                                value={input.value}
                                onChange={input.onChange}
                                variant="standard"
                                label="Name"
                                error={!meta.active && meta.dirty && nameError}
                                helperText={(!meta.active && meta.dirty && nameError) ? "Name cannot be empty.": ''}
                            />
                        
                        )}
                        </Field>
                        <Field
                        name="password"
                        type="password"
                        placeholder="Enter your Password">

                        {({input, meta}) => (
                            
                            <TextField
                                fullWidth
                                name={input.name}
                                value={input.value}
                                onChange={input.onChange}
                                variant="standard"
                                label="Password"
                                type="password"
                                error={!meta.active && meta.dirty && passwordError}
                                helperText={(!meta.active && meta.dirty && passwordError) ? "Password should be at least 4 characters long.": ''}
                            />
                        
                        )}
                        </Field>
                    </div>
                    <div className={styles["cta"]}>
                        <button className="btn btn-login" type="submit" disabled={submitting || pristine || nameError || passwordError} onClick={handleSubmit}>
                            Register
                        </button>

                    </div>
                </form>
                )}></Form>
    </div>)
}