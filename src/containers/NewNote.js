import React, { useRef, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useHistory } from "react-router-dom";
import { API } from "aws-amplify";
import LoaderButton from "../components/LoaderButton";
import { onError } from "../libs/errorLib";
import config from "../config";
import { s3Upload } from "../libs/awsLib";
import "./NewNote.css";

export default function NewNote() {
    const file = useRef(null);
    const history = useHistory();
    const [content, setContent] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    function validateForm() {
        return content.length > 0;
    }

    function handleFileChange(event) {
        file.current = event.target.files[0];
    }

    async function handleSubmit(event) {
        event.preventDefault();

        if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
            alert(
                `Please pick a file smaller than ${config.MAX_ATTACHMENT_SIZE / 1000000} MB.`
            );
            return;
        }

        setIsLoading(true);
        try {
            const attachment = file.current
                ? await s3Upload(file.current)
                : null;

            await createNote({ content, attachment });

            history.push("/");
        } catch (e) {
            onError(e);
            setIsLoading(false);
        }
    }

    function createNote(note) {
        return API.post("notes", "/notes", {
            body: note,
        });
    }

    return (
        <div className="new-note-container">
            <div className="new-note-header">
                <Button
                    variant="danger"
                    className="back-button"
                    onClick={() => history.goBack()}
                >
                    Back
                </Button>
                <h2>Create a New Note</h2>
            </div>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="content">
                    <Form.Control
                        as="textarea"
                        rows={5}
                        placeholder="Write your note here..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="note-textarea"
                    />
                </Form.Group>
                <Form.Group controlId="file">
                    <Form.Label className="file-label">Attachment</Form.Label>
                    <Form.Control
                        type="file"
                        onChange={handleFileChange}
                        className="file-input"
                    />
                </Form.Group>
                <LoaderButton
                    block
                    type="submit"
                    size="lg"
                    variant="success"
                    isLoading={isLoading}
                    disabled={!validateForm()}
                    className="create-button"
                >
                    Create
                </LoaderButton>
            </Form>
        </div>
    );
}
