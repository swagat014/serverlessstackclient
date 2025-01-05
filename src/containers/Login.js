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
            userHasAuthenticated(true)
            history.push("/");
        } catch (e) {
            onError(e);
            setIsLoading(false);
        }
    }
    return (
        <div className="Login">
            <h2 className="text-center">Login</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group size="lg" controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        autoFocus
                        type="email"
                        value={fields.email}
                        onChange={handleFieldChange}
                    />
                </Form.Group>
                <Form.Group size="lg" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <div className="password-container">
                        <Form.Control
                            type={showPassword ? "text" : "password"}
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
                                style={{ width: "20px", cursor: "pointer" }}
                            />                        </span>
                    </div>
                </Form.Group>
                <LinkContainer to="/forget">
                    <h6 className="forgetPassword">
                        <span>Forget Password?</span>
                    </h6>
                </LinkContainer>
                <LoaderButton
                    block
                    size="lg"
                    type="submit"
                    isLoading={isLoading}
                    disabled={!validateForm()}
                >
                    Login
                </LoaderButton>
            </Form>
        </div>
    );
}