import React, { useState } from "react";
import { NextPage } from "next";
import { gql, useQuery } from "@apollo/client";
import styled from "styled-components";
import { Bars } from "react-loader-spinner";
import { Button, Card, CardActions, CardContent, CardHeader, CardMedia, Grid, Typography } from "@mui/material";
import router from "next/router";

const PostHome: NextPage = () => {
    const [page, setPage] = useState(0);
    const { data, loading, error } = useQuery(query, {
        variables: {
            page,
        },
    });
    return (
        <MainContainer>
            <Button
                variant="contained"
                onClick={() => {
                    router.push("/posts/create");
                }}
            >
                Añadir Post
            </Button>
            {loading && <Bars />}
            {error && <p>{error.message}</p>}
            {data && (
                <Grid container spacing={2}>
                    {data.posts.map((post: any) => (
                        <Grid item xs={12} sm={6} md={4} key={post.id}>
                            <Card
                                sx={{
                                    maxWidth: 345,
                                    margin: 2,
                                    padding: 2,
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    textAlign: "center",
                                    height: 500,
                                }}
                            >
                                <CardHeader title={post.title} />
                                <CardMedia
                                    component="img"
                                    height="194"
                                    image={post.imageUrl}
                                    alt="Paella dish"
                                />
                                <CardContent>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        {post.body}
                                    </Typography>
                                </CardContent>
                                <CardActions disableSpacing>
                                    <Button
                                        size="small"
                                        onClick={() => {
                                            router.push(`/posts/${post.id}`);
                                        }}
                                    >
                                        Ver más
                                    </Button>
                                </CardActions>
                            </Card>
                            </Grid>
                    ))}
                </Grid>
                

            )}
            {data && data.posts.length === 0 && (
                <p>No hay posts</p>
            )}
            <div>
            {page > 0 && (
                <Button
                variant="contained"
                onClick={() => {
                    setPage(page - 1);

                }
            }>Anterior</Button>
            )}
            {data && (
                <Button 
                style={{margin: "10px"}}
                variant="contained"
                onClick={() => {
                    setPage(page + 1);
                }
            }>Siguiente</Button>
            )}
            
            </div>
        </MainContainer>
    );
};

export default PostHome;

const query = gql`
    query Posts($page: Int!) {
        posts(page: $page, limit: 6) {
            id
            title
            body
            imageUrl
        }
    }
`

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;