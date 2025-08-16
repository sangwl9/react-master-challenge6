/**
 * npx create-react-app lecture3 --template typescript
 * npm i react@18.3.1 react-dom@18.3.1
 * npm i styled-components@5.3.10 react-router-dom@5.3.4 @tanstack/react-query react-helmet @hello-pangea/dnd
 * npm i --save-dev @types/styled-components @types/react-router-dom @tanstack/react-query-devtools @types/react-helmet
 * npm i --save react-apexcharts apexcharts
 * npm i recoil
 * npm i react-hook-form
 * npm i motion
 */

import ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProvider } from "styled-components";
import { theme } from "./theme";
import { createGlobalStyle } from "styled-components";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const GlobalStyle = createGlobalStyle`
    h1, h2, h3, h4, h5, h6, p, blockquote, pre,
    a, abbr, acronym, address, big, cite, code,
    del, dfn, em, img, ins, kbd, q, s, samp,
    small, strike, strong, sub, sup, tt, var,
    b, u, i, center,
    dl, dt, dd, menu, ol, ul, li,
    fieldset, form, label, legend,
    table, caption, tbody, tfoot, thead, tr, th, td,
    article, aside, canvas, details, embed,
    figure, figcaption, footer, header, hgroup,
    main, menu, nav, output, ruby, section, summary,
    time, mark, audio, video {
        margin: 0;
        padding: 0;
        border: 0;
        font-size: 100%;
        font: inherit;
        vertical-align: baseline;
    }
    /* HTML5 display-role reset for older browsers */
    article, aside, details, figcaption, figure,
    footer, header, hgroup, main, menu, nav, section {
        display: block;
    }
    /* HTML5 hidden-attribute fix for newer browsers */
    *[hidden] {
        display: none;
    }
    body {
        line-height: 1;
    }
    menu, ol, ul {
        list-style: none;
    }
    blockquote, q {
        quotes: none;
    }
    blockquote:before, blockquote:after,
    q:before, q:after {
        content: '';
        content: none;
    }
    table {
        border-collapse: collapse;
        border-spacing: 0;
    }
    * {
        box-sizing: border-box;
    }
    body {
        font-family: "Source Sans 3", sans-serif;
        font-weight: 300;
        color: ${(props) => props.theme.white.darker};
        line-height: 1.2;
        margin: 0;
        background-color: black;
        overflow-x:hidden
    }
    a {
        text-decoration: none;
        color: inherit;
    }
`;

const client = new QueryClient();

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement,
);
root.render(
    <QueryClientProvider client={client}>
        <ThemeProvider theme={theme}>
            <GlobalStyle />
            <App />
        </ThemeProvider>
    </QueryClientProvider>,
);
