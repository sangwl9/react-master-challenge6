import { useLocation } from "react-router-dom";
import {
    getSearchMovies,
    getSearchTvs,
    IGetMoviesResult,
    IGetTvResult,
} from "../api";
import styled from "styled-components";
import { motion, AnimatePresence, Variants } from "motion/react";
import { useEffect, useState } from "react";
import { makeImagePath } from "../utils";
import { useQuery } from "@tanstack/react-query";

const Wrapper = styled.div`
    background-color: black;
`;

const Loader = styled.div`
    height: 20vh;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const Slider = styled.div`
    position: relative;
    height: 300px;
    overflow: hidden;

    &:first-child {
        margin-top: 150px;
    }

    &:last-child {
        margin-bottom: 50px;
    }
`;

const RowTitle = styled.span`
    color: ${({ theme }) => theme.white.lighter};
    font-size: 32px;
    margin: 0 10px 8px;
    line-height: 48px;
`;

const RightBtn = styled.div`
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 56px;
    height: 80px;
    z-index: 2;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 28px;
    background: ${({ theme }) => theme.black.lighter};
    border: none;
    color: ${({ theme }) => theme.white.lighter};
    opacity: 0.85;
    cursor: pointer;

    &:hover {
        opacity: 1;
    }
`;

const Row = styled(motion.div)`
    display: grid;
    gap: 10px;
    grid-template-columns: repeat(6, 1fr);
    position: absolute;
    top: 48px;
    left: 0;
    right: 0;
    width: 100%;
`;

const Box = styled(motion.div)<{ $bgPhoto: string }>`
    background-color: white;
    background-image: url(${(props) => props.$bgPhoto});
    background-size: cover;
    background-position: center center;
    height: 200px;
    font-size: 66px;
    margin-bottom: 50px;
    cursor: pointer;

    &:first-child {
        transform-origin: center left;
    }
    &:last-child {
        transform-origin: center right;
    }
`;

const Info = styled(motion.div)`
    padding: 20px;
    background-color: ${(props) => props.theme.black.lighter};
    opacity: 0;
    position: absolute;
    width: 100%;
    bottom: 0;

    h4 {
        text-align: center;
        font-size: 18px;
    }
`;

const rowVariants: Variants = {
    hidden: {
        x: window.outerWidth,
    },
    visible: {
        x: 0,
    },
    exit: {
        x: -window.outerWidth,
    },
};

const boxVariants: Variants = {
    normal: {
        scale: 1,
    },
    hover: {
        scale: 1.3,
        y: -50,
        transition: {
            delay: 0.5,
            duration: 0.1,
            type: "tween",
        },
    },
};

const infoVariants: Variants = {
    hover: {
        opacity: 1,
        transition: {
            delay: 0.5,
            duration: 0.1,
            type: "tween",
        },
    },
};

const offset = 6;
type SectionId = "movies" | "tvs";
const makeRowKey = (section: SectionId, pageIndex: number) =>
    `${section}-page-${pageIndex}`;

function Search() {
    const location = useLocation();
    const keyword = new URLSearchParams(location.search).get("keyword") ?? "";
    const { isLoading: loadingMovies, data: moviesData } =
        useQuery<IGetMoviesResult>({
            queryKey: ["search", "movies", keyword],
            queryFn: () => getSearchMovies(keyword),
        });
    const { isLoading: loadingTvs, data: tvsData } = useQuery<IGetTvResult>({
        queryKey: ["search", "tvs", keyword],
        queryFn: () => getSearchTvs(keyword),
    });

    // Movies
    const [moviesDataIndex, setMoviesDataIndex] = useState(0);
    const [moviesDataLeaving, setMoviesDataLeaving] = useState(false);
    const increaseMoviesDataIndex = (data: any) => {
        if (data) {
            if (moviesDataLeaving) return;
            toggleMoviesDataLeaving();
            const totalMovies = data.results.length;
            const maxIndex = Math.floor(totalMovies / offset);
            setMoviesDataIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
        }
    };
    const toggleMoviesDataLeaving = () => setMoviesDataLeaving((prev) => !prev);

    // Tvs
    const [tvsDataIndex, setTvsDataIndex] = useState(0);
    const [tvsDataLeaving, setTvsDataLeaving] = useState(false);
    const increaseTvsDataIndex = (data: any) => {
        if (data) {
            if (tvsDataLeaving) return;
            toggleTvsDataLeaving();
            const totalMovies = data.results.length;
            const maxIndex = Math.floor(totalMovies / offset);
            setTvsDataIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
        }
    };
    const toggleTvsDataLeaving = () => setTvsDataLeaving((prev) => !prev);
    useEffect(() => {
        setMoviesDataIndex(0);
        setTvsDataIndex(0);
    }, [keyword]);
    return (
        <Wrapper>
            {loadingMovies && loadingTvs ? (
                <Loader>Loading...</Loader>
            ) : (
                <>
                    {/* Movies */}
                    <Slider>
                        <RightBtn
                            onClick={() => increaseMoviesDataIndex(moviesData)}
                        >
                            {">"}
                        </RightBtn>
                        <RowTitle>Movies</RowTitle>
                        <AnimatePresence
                            initial={false}
                            onExitComplete={toggleMoviesDataLeaving}
                        >
                            <Row
                                variants={rowVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                transition={{ type: "tween", duration: 1 }}
                                key={makeRowKey("movies", moviesDataIndex)}
                            >
                                {moviesData?.results
                                    .slice(
                                        offset * moviesDataIndex,
                                        offset * moviesDataIndex + offset,
                                    )
                                    .map((movie) => (
                                        <Box
                                            layoutId={`movies-${movie.id}`}
                                            variants={boxVariants}
                                            key={movie.id}
                                            whileHover="hover"
                                            initial="normal"
                                            transition={{ type: "tween" }}
                                            $bgPhoto={makeImagePath(
                                                movie.backdrop_path,
                                                "w500",
                                            )}
                                        >
                                            <Info variants={infoVariants}>
                                                <h4>{movie.title}</h4>
                                            </Info>
                                        </Box>
                                    ))}
                            </Row>
                        </AnimatePresence>
                    </Slider>
                    {/* Movies */}
                    <Slider>
                        <RightBtn onClick={() => increaseTvsDataIndex(tvsData)}>
                            {">"}
                        </RightBtn>
                        <RowTitle>Movies</RowTitle>
                        <AnimatePresence
                            initial={false}
                            onExitComplete={toggleTvsDataLeaving}
                        >
                            <Row
                                variants={rowVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                transition={{ type: "tween", duration: 1 }}
                                key={makeRowKey("tvs", tvsDataIndex)}
                            >
                                {tvsData?.results
                                    .slice(
                                        offset * tvsDataIndex,
                                        offset * tvsDataIndex + offset,
                                    )
                                    .map((movie) => (
                                        <Box
                                            layoutId={`tvs-${movie.id}`}
                                            variants={boxVariants}
                                            key={movie.id}
                                            whileHover="hover"
                                            initial="normal"
                                            transition={{ type: "tween" }}
                                            $bgPhoto={makeImagePath(
                                                movie.backdrop_path,
                                                "w500",
                                            )}
                                        >
                                            <Info variants={infoVariants}>
                                                <h4>{movie.name}</h4>
                                            </Info>
                                        </Box>
                                    ))}
                            </Row>
                        </AnimatePresence>
                    </Slider>
                </>
            )}
        </Wrapper>
    );
}

export default Search;
