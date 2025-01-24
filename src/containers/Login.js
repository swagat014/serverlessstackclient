import React, { useState } from "react";
import { Auth } from "aws-amplify";
import Form from "react-bootstrap/Form";
import { useHistory } from "react-router-dom";
import LoaderButton from "../components/LoaderButton";
import { useAppContext } from "../libs/contextLib";
import { useFormFields } from "../libs/hooksLib";
import { onError } from "../libs/errorLib";
import { LinkContainer } from "react-router-bootstrap";
import "./Login.css";

export default function Login() {
    const history = useHistory();
    const { userHasAuthenticated } = useAppContext();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
    const [fields, handleFieldChange] = useFormFields({
        email: "",
        password: ""
    });

    function validateForm() {
        return fields.email.length > 0 && fields.password.length > 0;
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setIsLoading(true);
        try {
            await Auth.signIn(fields.email, fields.password);
            userHasAuthenticated(true);
            history.push("/");
        } catch (e) {
            onError(e);
            setIsLoading(false);
        }
    }

    return (
        <div className="login-container">
            <div className="login-card">
                <h2 className="text-center">Welcome Back!</h2>
                {/* <p className="text-center">Login to continue to your dashboard</p> */}

                <Form onSubmit={handleSubmit}>
                    <Form.Group size="lg" controlId="email">
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control
                            autoFocus
                            type="email"
                            placeholder="Enter your email"
                            value={fields.email}
                            onChange={handleFieldChange}
                        />
                    </Form.Group>

                    <Form.Group size="lg" controlId="password">
                        <Form.Label>Password</Form.Label>
                        <div className="password-container">
                            <Form.Control
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                value={fields.password}
                                onChange={handleFieldChange}
                            />
                            <span
                                className="toggle-password"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                <img
                                    src={showPassword ? "/images/hide-password.png" : "/images/show-password.png"}
                                    alt={showPassword ? "Hide password" : "Show password"}
                                    style={{ width: "24px", cursor: "pointer" }}
                                />
                            </span>
                        </div>
                    </Form.Group>

                    <LinkContainer to="/forget">
                        <p className="forget-password text-right">Forgot your password?</p>
                    </LinkContainer>

                    <LoaderButton
                        block
                        size="lg"
                        type="submit"
                        isLoading={isLoading}
                        disabled={!validateForm()}
                        className="login-button"
                    >
                        Login
                    </LoaderButton>
                </Form>
            </div>
        </div>
    );
}
