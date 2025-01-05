import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import { Auth } from "aws-amplify";
import { useHistory } from "react-router-dom";
import LoaderButton from "../components/LoaderButton";
import { useAppContext } from "../libs/contextLib";
import { useFormFields } from "../libs/hooksLib";
import { onError } from "../libs/errorLib";
import "./Signup.css";
export default function Signup() {

    const [fields, handleFieldChange] = useFormFields({
        email: "",
        password: "",
        confirmPassword: "",
        confirmationCode: "",
    });

    const history = useHistory();
    const [newUser, setNewUser] = useState(null);
    const { userHasAuthenticated } = useAppContext();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
    const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State for confirmPassword

    function validateForm() {
        return (
            fields.email.length > 0 &&
            fields.password.length > 0 &&
            fields.password === fields.confirmPassword
        );
    }

    function validateConfirmationForm() {
        return fields.confirmationCode.length > 0;
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setIsLoading(true);
        try {
            const newUser = await Auth.signUp({
                username: fields.email,
                password: fields.password,
            });
            setIsLoading(false);
            setNewUser(newUser);
        } catch (e) {
            onError(e);
            setIsLoading(false);
        }
    }

    async function handleConfirmationSubmit(event) {
        event.preventDefault();
        setIsLoading(true);
        try {
            await Auth.confirmSignUp(fields.email, fields.confirmationCode);
            await Auth.signIn(fields.email, fields.password);
            userHasAuthenticated(true);
            history.push("/");
        } catch (e) {
            onError(e);
            setIsLoading(false);
        }
    }



    function renderConfirmationForm() {
        return (
            <Form onSubmit={handleConfirmationSubmit}>
                <Form.Group controlId="confirmationCode" size="lg">
                    <Form.Label>Confirmation Code</Form.Label>
                    <Form.Control
                        autoFocus
                        type="tel"
                        onChange={handleFieldChange}
                        value={fields.confirmationCode}
                    />
                    <Form.Text muted>Please check your email for the code.</Form.Text>
                </Form.Group>
                <LoaderButton
                    block
                    size="lg"
                    type="submit"
                    variant="success"
                    isLoading={isLoading}
                    disabled={!validateConfirmationForm()}
                >
                    Verify
                </LoaderButton>
            </Form>
        );
    }
    function renderForm() {
        return (
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="email" size="lg">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        autoFocus
                        type="email"
                        value={fields.email}
                        onChange={handleFieldChange}
                    />
                </Form.Group>
                <Form.Group controlId="password" size="lg">
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
                <Form.Group controlId="confirmPassword" size="lg">
                    <Form.Label>Confirm Password</Form.Label>
                    <div className="password-container">
                        <Form.Control
                            type={showConfirmPassword ? "text" : "password"}
                            value={fields.confirmPassword}
                            onChange={handleFieldChange}
                        />
                        <span
                            className="toggle-password"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            <img
                                src={showPassword ? "/images/hide-password.png" : "/images/show-password.png"}
                                alt={showPassword ? "Hide password" : "Show password"}
                                style={{ width: "20px", cursor: "pointer" }}
                            />                        </span>
                    </div>
                </Form.Group>
                <LoaderButton
                    block
                    size="lg"
                    type="submit"
                    variant="success"
                    isLoading={isLoading}
                    disabled={!validateForm()}
                >
                    Signup
                </LoaderButton>
            </Form>
        );
    }
    return (
        <div className="Signup">
            {newUser === null ? renderForm() : renderConfirmationForm()}
        </div>
    );
}
