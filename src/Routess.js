import React from "react";
import NotFound from "./containers/NotFound";
import { Routes, Route } from "react-router-dom";
import Home from "./containers/Home";
export default function Routess() {
    return (<>

        <Routes>
            <Route path="/" element={<Home />} />
            <Route element={<NotFound />} />
        </Routes>
    </>
    );
}
