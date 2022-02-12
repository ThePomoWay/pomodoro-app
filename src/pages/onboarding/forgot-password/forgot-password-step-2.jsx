import styles from './forgot-password.module.scss';

import { Field, Form } from "react-final-form";
import { TextField } from 'mui-rff';
import { useCallback, useState } from 'react';
import { register, resetPassword } from '../../../common/state/slices/OnboardingSlice';
import { useDispatch } from 'react-redux';
import { useSelector } from "react-redux";
import { selectPasswordResetEmail} from '../../../common/state/selectors';

export function ForgotPasswordStep2(props) {
    let userEmail = useSelector(selectPasswordResetEmail)
   
    let [userPassword, setUserPassword] = useState("");
    let [userOTP, setUserOTP] = useState("");


    let dispatch = useDispatch();

    let onSubmit = useCallback((vals) => {
        debugger;
        vals.email = userEmail;
        dispatch(resetPassword(vals));
    })

    return (
        <div className={styles['container']}>
            
            {/* <span className={styles['welcome-subtext']}>sync your tasks, get daily statistics and more!</span> */}
            <Form
                onSubmit={onSubmit}
                initialValues={{
                    password: "",
                    otp: ""
                }}
                
                render={({ handleSubmit, form, submitting, pristine, values }) => (
                <form onSubmit={handleSubmit} className={styles['form']}>
                    <div className={styles['forma']}>
                        <Field
                            name="password"
                            type="password"
                            placeholder="Set new password">
                                {({input, meta}) => (<div>
                                    <TextField
                                        fullWidth
                                        type="password"
                                        variant="standard"
                                        label="Password"
                                        name={input.name}
                                        value={input.value}
                                        onChange={input.onChange}
                                    />
                                </div>)}
                        </Field>
                    </div>
                    <Field
                        name="otp"
                        type="number"
                        placeholder="Enter OTP">
                            {({input, meta}) => (
                            <div className={styles['email']}>
                            <TextField
                                fullWidth
                                variant="standard"  
                                label="otp"
                                value={input.value}
                                name={input.name}
                                onChange={input.onChange}
                            />
                            </div>
                            )}
                        </Field>

                {/* <div>
                    <label>Notes</label>
                    <Field name="notes" component="textarea" placeholder="Notes" />
                </div> */}
                    
                    <div className={styles["cta"]}>
                        <button className="btn btn-login" type="submit" disabled={submitting || pristine} onClick={handleSubmit}>
                            Reset Password
                        </button>
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