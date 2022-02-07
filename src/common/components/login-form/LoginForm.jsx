import styles from "./LoginForm.module.scss";
import { Form, Field } from "react-final-form";
import { useCallback } from "react";
import { TextField } from "@mui/material";
import { useDispatch } from "react-redux";
import { login, initiatePasswordChange, setStep} from "../../state/slices/OnboardingSlice";

export function LoginForm(props) { 
    let formData = {
        email: '',
        password: ''
    }

    let dispatch = useDispatch();

    let onSubmit = useCallback((vals) => {
        dispatch(login(vals));
    })

    let initiatePasswordChange = useCallback(() => {
        dispatch(setStep(3))
    })

    return (
        <div className={styles['container']}>
            
            {/* <span className={styles['welcome-subtext']}>sync your tasks, get daily statistics and more!</span> */}
            <Form
                onSubmit={onSubmit}
                initialValues={{
                ...formData,
                }}
                
                render={({ handleSubmit, form, submitting, pristine, values }) => (
                <form onSubmit={handleSubmit} className={styles['form']}>
                    <div className={styles['forma']}>
                    <Field
                        name="email"
                        type="text"
                        placeholder="Enter your email">

                        {props => (
                            <div className={styles['email']}>
                            <TextField
                                fullWidth
                                name={props.input.name}
                                value={props.input.value}
                                onChange={props.input.onChange}
                                variant="standard"
                                label="Email"
                            />
                            </div>
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
                        <button className="btn btn-login" type="submit" disabled={submitting || pristine} onClick={handleSubmit}>
                            Login
                        </button>

                        <div className={styles["signup"]} onClick={(e) => initiatePasswordChange()}> forgot password?</div>
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