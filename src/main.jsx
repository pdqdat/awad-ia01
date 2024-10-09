import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Game from "./Game.jsx";
import "./main.css";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <Game />
    </StrictMode>
);
