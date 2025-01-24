import React, { useRef, useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { API, Storage } from "aws-amplify";
import { onError } from "../libs/errorLib";
import Form from "react-bootstrap/Form";
import LoaderButton from "../components/LoaderButton";
import config from "../config";
import { s3Upload } from "../libs/awsLib";
import "./Notes.css";

export default function Notes() {
    const file = useRef(null);
    const { id } = useParams();
    const history = useHistory();
    const [note, setNote] = useState(null);
    const [content, setContent] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        async function onLoad() {
            try {
                const note = await API.get("notes", `/notes/${id}`);
                const { content, attachment } = note;

                note.attachment = attachment || "";
                if (attachment) {
                    note.attachmentURL = await Storage.vault.get(attachment);
                }
                setContent(content);
                setNote(note);
            } catch (e) {
                onError(e);
            }
        }
        onLoad();
    }, [id]);

    function validateForm() {
        return content.length > 0;
    }

    function formatFilename(str) {
        return str.replace(/^\w+-/, "");
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
                : note.attachment;

            await API.put("notes", `/notes/${id}`, {
                body: { content, attachment },
            });

            history.push("/");
        } catch (e) {
            onError(e);
            setIsLoading(false);
        }
    }

    async function handleDelete(event) {
        event.preventDefault();

        const confirmed = window.confirm("Are you sure you want to delete this note?");
        if (!confirmed) {
            return;
        }

        setIsDeleting(true);
        try {
            await API.del("notes", `/notes/${id}`);
            history.push("/");
        } catch (e) {
            onError(e);
            setIsDeleting(false);
        }
    }

    return (
        <div className="notes-container">
            <div className="notes-header">
                <Button
                    variant="secondary"
                    className="back-button"
                    onClick={() => history.goBack()}
                >
                    Back
                </Button>
                <h2>Edit Note</h2>
            </div>

            {note && (
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="content">
                        <Form.Control
                            as="textarea"
                            rows={5}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="note-textarea"
                        />
                    </Form.Group>

                    <Form.Group controlId="file">
                        <Form.Label className="file-label">Attachment</Form.Label>
                        {note.attachment && (
                            <p>
                                <a
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    href={note.attachmentURL}
                                >
                                    {formatFilename(note.attachment)}
                                </a>
                            </p>
                        )}
                        <Form.Control
                            type="file"
                            onChange={handleFileChange}
                            className="file-input"
                        />
                    </Form.Group>

                    <div className="action-buttons">
                        <LoaderButton
                            block
                            size="lg"
                            type="submit"
                            isLoading={isLoading}
                            disabled={!validateForm()}
                            className="save-button"
                        >
                            Save
                        </LoaderButton>

                        <LoaderButton
                            block
                            size="lg"
                            variant="danger"
                            onClick={handleDelete}
                            isLoading={isDeleting}
                            className="delete-button"
                        >
                            Delete
                        </LoaderButton>
                    </div>
                </Form>
            )}
        </div>
    );
}
