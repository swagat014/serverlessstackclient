import React, { useState, useEffect } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import { useAppContext } from "../libs/contextLib";
import { onError } from "../libs/errorLib";
import { Auth } from "aws-amplify";
import { BsPencilSquare } from "react-icons/bs";
import { LinkContainer } from "react-router-bootstrap";
import { API } from "aws-amplify";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import "./Home.css";

export default function Home() {
    const [notes, setNotes] = useState([]);
    const [filteredNotes, setFilteredNotes] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [greet, setGreet] = useState();
    const { isAuthenticated } = useAppContext();
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5); // You can adjust the number of items per page


    useEffect(() => {
        async function onLoad() {
            if (!isAuthenticated) {
                return;
            }
            try {
                const notes = await loadNotes();
                const user = await Auth.currentAuthenticatedUser();
                const { attributes } = user;
                const email = attributes.email;

                // Extract the part of the email before '@gmail.com' and remove any numbers
                const name = email.split('@')[0].replace(/[0-9]/g, '');

                // Set the greeting message
                setGreet(`${name}`);
                setNotes(notes);

                setFilteredNotes(notes);
            } catch (e) {
                onError(e);
            }
            setIsLoading(false);
        }
        onLoad();
    }, [isAuthenticated]);

    async function loadNotes() {
        return await API.get("notes", "/notes");
    }

    function handleSearch(event) {
        const term = event.target.value.toLowerCase();
        setSearchTerm(term);
        setFilteredNotes(
            notes.filter((note) =>
                note.content.toLowerCase().includes(term) ||
                (note.attachment && note.attachment.toLowerCase().includes(term))
            )
        );
    }

    const BASE_URL = "https://note-api-uploads.s3.us-east-1.amazonaws.com";

    const indexOfLastNote = currentPage * itemsPerPage;
    const indexOfFirstNote = indexOfLastNote - itemsPerPage;
    const currentNotes = filteredNotes.slice(indexOfFirstNote, indexOfLastNote);

   function renderNotesList(notes) {
    return (
        <>
            <div className="notes-grid">
                <LinkContainer to="/notes/new">
                    <div className="note-card create-new-card">
                        <BsPencilSquare size={30} />
                        <h5>Create a new note</h5>
                    </div>
                </LinkContainer>
                {notes.map(({ noteId, content, createdAt, attachment, userId }) => {
                        const safeContent = typeof content === "string" ? content : "No content available";
                        const safeAttachment = typeof attachment === "string" ? attachment : null;

                        const filePath = `private/${userId}/${safeAttachment}`;
                        const encodedKey = encodeURIComponent(filePath);
                        const imageUrl = `${BASE_URL}/${encodedKey}`;
                    return (
                        <LinkContainer key={noteId} to={`/notes/${noteId}`}>
                            <div className="note-card">
                            {imageUrl && (
                                    <img
                                        src={imageUrl}
                                        alt={`Note ${safeContent.trim().split("\n")[0]}`}
                                        className="note-image"
                                        onError={(e) => (e.target.src = "/default-image.png")}
                                    />
                                )}
                                 <div className="note-content">
                                    <span className="font-weight-bold">
                                        {safeContent.trim().split("\n")[0]}
                                    </span>
                                </div>
                                <div className="note-actions">
                                    <LinkContainer to={`/notes/${noteId}`}>
                                        <Button variant="primary" size="sm" className="mr-2">
                                            Show
                                        </Button>
                                    </LinkContainer>
                                </div>
                            
                                <div className="card-body">
                                    <h5 className="card-title">
                                        {content.trim().split("\n")[0]}
                                    </h5>
                                    <p className="card-text">
                                        Created: {new Date(createdAt).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </LinkContainer>
                    );
                })}
            </div>
        </>
    );
}





    function renderPagination() {
        const totalPages = Math.ceil(filteredNotes.length / itemsPerPage);

        return (
            <div className="pagination">
                <Button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                >
                    Previous
                </Button>
                <span>{`Page ${currentPage} of ${totalPages}`}</span>
                <Button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                >
                    Next
                </Button>
            </div>
        );
    }

    function renderLander() {
        return (
            <div className="lander">
                <div className="hero">
                    <h1 className="hero-title">Scratch</h1>
                    <p className="hero-subtitle">A simple, elegant note-taking app</p>
                    <div className="hero-buttons">
                        <LinkContainer to="/signup">
                            <Button className="hero-button signup">Sign Up</Button>
                        </LinkContainer>
                        <LinkContainer to="/login">
                            <Button className="hero-button login">Login</Button>
                        </LinkContainer>
                    </div>
                </div>
            </div>
        );


    }



    function renderNotes() {
        return (
            <div className="notes">
                <h2>
                    Welcome, <span>{greet}</span>
                </h2>
                <h2 className="pb-3 mt-4 mb-3 border-bottom">Your Notes</h2>
                <Form className="mb-3">
                    <Form.Control
                        type="text"
                        placeholder="Search notes..."
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </Form>
                {!isLoading ? (
                    <>
                        <ListGroup>{renderNotesList(currentNotes)}</ListGroup>
                        {renderPagination()}
                    </>
                ) : (
                    <div className="loading-notes-container">
                        <div className="spinner">
                            <div className="dot dot1"></div>
                            <div className="dot dot2"></div>
                            <div className="dot dot3"></div>
                        </div>
                        <p className="loading-text">Loading your notes...</p>
                    </div>
                )}


            </div>
        );
    }

    return (
        <div className="Home">
            {isAuthenticated ? renderNotes() : renderLander()}
        </div>
    );
}
