import { useMultipleMovieQuery } from "../api";
import styled from "styled-components";
import { makeImagePath } from "../utils";
import { motion, AnimatePresence, Variants, useScroll } from "motion/react";
import { useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";

const Wrapper = styled.div`
    background-color: black;
`;

const Loader = styled.div`
    height: 20vh;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const Banner = styled.div<{ bgPhoto: string }>`
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 60px;
    background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
        url(${(props) => props.bgPhoto});
    background-size: cover;
    margin-bottom: 40px;
`;

const Title = styled.h2`
    font-size: 68px;
    margin-bottom: 20px;
`;

const Overview = styled.p`
    font-size: 30px;
    width: 50%;
`;

const Slider = styled.div`
    position: relative;
    height: 300px;
    margin-top: -150px;
    margin-bottom: 120px;
    overflow: hidden;

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

const Overlay = styled(motion.div)`
    position: fixed;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    opacity: 0;
`;

const BigMovie = styled(motion.div)`
    position: absolute;
    width: 40vw;
    height: 80vh;
    left: 0;
    right: 0;
    margin: 0 auto;
    border-radius: 15px;
    overflow: hidden;
    background-color: ${(props) => props.theme.black.lighter};
`;

const BigCover = styled.div`
    width: 100%;
    background-size: cover;
    background-position: center center;
    height: 400px;
`;

const BigTitle = styled.h3`
    color: ${(props) => props.theme.white.lighter};
    padding: 20px;
    font-size: 46px;
    position: relative;
    top: -80px;
`;

const BigOverview = styled.p`
    padding: 20px;
    position: relative;
    top: -80px;
    color: ${(props) => props.theme.white.lighter};
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
type SectionId = "latest" | "topRated" | "upcoming";
const makeRowKey = (section: SectionId, pageIndex: number) =>
    `${section}-page-${pageIndex}`;

function Home() {
    const history = useHistory();
    const bigMovieMatch = useRouteMatch<{ movieId: string }>(
        "/movies/:movieId",
    );
    const { scrollY } = useScroll();
    const [
        { isLoading: loadingLatest, data: latestData },
        { isLoading: loadingTopRated, data: topRatedData },
        { isLoading: loadingUpComming, data: upCommingData },
    ] = useMultipleMovieQuery();

    // Latest Data
    const [latestDataIndex, setLatestDataIndex] = useState(0);
    const [latestDataLeaving, setLatestDataLeaving] = useState(false);
    const increaseLatestDataIndex = (data: any) => {
        if (data) {
            if (latestDataLeaving) return;
            toggleLatestDataLeaving();
            const totalMovies = data.results.length - 1;
            const maxIndex = Math.floor(totalMovies / offset) - 1;
            setLatestDataIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
        }
    };
    const toggleLatestDataLeaving = () => setLatestDataLeaving((prev) => !prev);
    // Top Rated Data
    const [topRatedDataIndex, setTopRatedDataIndex] = useState(0);
    const [topRatedDataLeaving, setTopRatedDataLeaving] = useState(false);
    const increaseTopRatedData = (data: any) => {
        if (data) {
            if (topRatedDataLeaving) return;
            toggleTopRatedDataLeaving();
            const totalMovies = data.results.length;
            const maxIndex = Math.floor(totalMovies / offset);
            setTopRatedDataIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
        }
    };
    const toggleTopRatedDataLeaving = () =>
        setTopRatedDataLeaving((prev) => !prev);

    // Top Rated Data
    const [upComingDataIndex, setUpComingDataIndex] = useState(0);
    const [upComingDataLeaving, setUpComingDataLeaving] = useState(false);
    const increaseUpComingData = (data: any) => {
        if (data) {
            if (upComingDataLeaving) return;
            toggleUpComingDataLeaving();
            const totalMovies = data.results.length;
            const maxIndex = Math.floor(totalMovies / offset);
            setUpComingDataIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
        }
    };
    const toggleUpComingDataLeaving = () =>
        setUpComingDataLeaving((prev) => !prev);

    const allDataResult = [
        ...(latestData?.results ?? []),
        ...(topRatedData?.results ?? []),
        ...(upCommingData?.results ?? []),
    ];
    const clickedMovie =
        bigMovieMatch?.params.movieId &&
        allDataResult.find(
            (movie) => movie.id === +bigMovieMatch.params.movieId,
        );

    const onBoxClicked = (movieId: number) => {
        history.push(`/movies/${movieId}`);
    };
    const onOverlayClick = () => history.push("/");
    return (
        <Wrapper>
            {loadingLatest && loadingTopRated && loadingUpComming ? (
                <Loader>Loading...</Loader>
            ) : (
                <>
                    <Banner
                        bgPhoto={makeImagePath(
                            latestData?.results[0].backdrop_path || "",
                        )}
                    >
                        <Title>{latestData?.results[0].title}</Title>
                        <Overview>{latestData?.results[0].overview}</Overview>
                    </Banner>
                    <Slider>
                        <RightBtn
                            onClick={() => increaseLatestDataIndex(latestData)}
                        >
                            {">"}
                        </RightBtn>
                        <RowTitle>Latest Movies</RowTitle>
                        <AnimatePresence
                            initial={false}
                            onExitComplete={toggleLatestDataLeaving}
                        >
                            <Row
                                variants={rowVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                transition={{ type: "tween", duration: 1 }}
                                key={makeRowKey("latest", latestDataIndex)}
                            >
                                {latestData?.results
                                    .slice(1)
                                    .slice(
                                        offset * latestDataIndex,
                                        offset * latestDataIndex + offset,
                                    )
                                    .map((movie) => (
                                        <Box
                                            layoutId={`latest-${movie.id}`}
                                            variants={boxVariants}
                                            key={movie.id}
                                            whileHover="hover"
                                            initial="normal"
                                            transition={{ type: "tween" }}
                                            onClick={() =>
                                                onBoxClicked(movie.id)
                                            }
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
                    <Slider>
                        <RightBtn
                            onClick={() => increaseTopRatedData(topRatedData)}
                        >
                            {">"}
                        </RightBtn>
                        <RowTitle>Top Rated Movies</RowTitle>
                        <AnimatePresence
                            initial={false}
                            onExitComplete={toggleTopRatedDataLeaving}
                        >
                            <Row
                                variants={rowVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                transition={{ type: "tween", duration: 1 }}
                                key={makeRowKey("topRated", topRatedDataIndex)}
                            >
                                {topRatedData?.results
                                    .slice(
                                        offset * topRatedDataIndex,
                                        offset * topRatedDataIndex + offset,
                                    )
                                    .map((movie) => (
                                        <Box
                                            layoutId={`top-${movie.id}`}
                                            variants={boxVariants}
                                            key={movie.id}
                                            whileHover="hover"
                                            initial="normal"
                                            transition={{ type: "tween" }}
                                            onClick={() =>
                                                onBoxClicked(movie.id)
                                            }
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
                    <Slider>
                        <RightBtn
                            onClick={() => increaseUpComingData(upCommingData)}
                        >
                            {">"}
                        </RightBtn>
                        <RowTitle>Upcoming Movies</RowTitle>
                        <AnimatePresence
                            initial={false}
                            onExitComplete={toggleUpComingDataLeaving}
                        >
                            <Row
                                variants={rowVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                transition={{ type: "tween", duration: 1 }}
                                key={makeRowKey("upcoming", upComingDataIndex)}
                            >
                                {upCommingData?.results
                                    .slice(
                                        offset * upComingDataIndex,
                                        offset * upComingDataIndex + offset,
                                    )
                                    .map((movie) => (
                                        <Box
                                            layoutId={`upcoming-${movie.id}`}
                                            variants={boxVariants}
                                            key={movie.id}
                                            whileHover="hover"
                                            initial="normal"
                                            transition={{ type: "tween" }}
                                            onClick={() =>
                                                onBoxClicked(movie.id)
                                            }
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
                    <AnimatePresence>
                        {bigMovieMatch ? (
                            <>
                                <Overlay
                                    onClick={onOverlayClick}
                                    exit={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                />
                                <BigMovie
                                    style={{ top: scrollY.get() + 100 }}
                                    layoutId={bigMovieMatch.params.movieId}
                                >
                                    {clickedMovie && (
                                        <>
                                            <BigCover
                                                style={{
                                                    backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                                                        clickedMovie.backdrop_path,
                                                        "w500",
                                                    )})`,
                                                }}
                                            />
                                            <BigTitle>
                                                {clickedMovie.title}
                                            </BigTitle>
                                            <BigOverview>
                                                {clickedMovie.overview}
                                            </BigOverview>
                                        </>
                                    )}
                                </BigMovie>
                            </>
                        ) : null}
                    </AnimatePresence>
                </>
            )}
        </Wrapper>
    );
}

export default Home;
