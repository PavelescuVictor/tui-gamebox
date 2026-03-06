import { createCliRenderer } from "@opentui/core";
import { createRoot } from "@opentui/react";
import App from "./library/components/App/App";

export const main = async () => {
    const renderer = await createCliRenderer();
    createRoot(renderer).render(<App />);
    renderer.start();
};
