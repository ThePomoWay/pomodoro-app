import { useCallback, useState } from "react";
import styles from "./signup.module.scss";
import { Field, Form } from "react-final-form";
import { validateEmail } from "../../utils/validators";
import { TextField } from 'mui-rff';
import { register } from "../../state/slices/OnboardingSlice";
import { useDispatch } from "react-redux";
export function SignupForm (props) {

    let formData = {
        email: '',
        password: '',
        name: ''
    }

    let dispatch = useDispatch();

    let [errors, setErrors] = useState({
        emailError: false,
        passwordError: false,
        confirmPasswordError: false
    })

    let onSubmit = useCallback((vals) => {
        dispatch(register(vals));
    })

    let validate = (vals) => {
        errors.emailError = !validateEmail(vals.email);
        setErrors(errors);
        return (errors.emailError || errors.passwordError || errors.confirmPasswordError);
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
                            name="name"
                            type="text"
                            placeholder="Enter your name">

                        {props => (
                            <div>
                            <TextField
                                fullWidth
                                name={props.input.name}
                                value={props.input.value}
                                type="text"
                                onChange={props.input.onChange}
                                variant="standard"
                                label="Enter your name"
                            />
                            </div>
                        )}
                        </Field>
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
                                error={!meta.active && meta.dirty && errors.emailError}
                                helperText={(!meta.active && meta.dirty && errors.emailError) ? "Incorrect value for email.": ''}
                            />
                        
                        )}
                        </Field>
                        <Field
                            name="password"
                            type="password"
                            placeholder="Enter your password">

                        {props => (
                            <div>
                            <TextField
                                fullWidth
                                name={props.input.name}
                                value={props.input.value}
                                type="password"
                                onChange={props.input.onChange}
                                variant="standard"
                                label="Password"
                            />
                            </div>
                        )}
                        </Field>
                        
                    </div>
                    
                    
                {/* <div>
                    <label>Notes</label>
                    <Field name="notes" component="textarea" placeholder="Notes" />
                </div> */}
                    
                    <div className={styles["cta"]}>
                        <button className="btn btn-login" type="submit" disabled={submitting || pristine}>
                            Signup
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
                    {/* <pre>{JSON.stringify(values, 0, 2)}</pre> */}
                </form>
                )}

            />
        </div>
    )
}