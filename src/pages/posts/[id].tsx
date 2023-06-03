import { NextPage } from "next";
import React, { useState } from "react";

import { useRouter } from "next/router";
import { gql, useMutation, useQuery } from "@apollo/client";
import styled from "styled-components";
import { FidgetSpinner, InfinitySpin } from "react-loader-spinner";
import { Button, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import ReplyCommentModal from "@/components/reply";

type FormValues = {
    body: string;
    userEmail: string;
}

const schema = yup.object().shape({
    body: yup.string().required("Body is required"),
    userEmail: yup.string().required("User email is required").email("User email must be a valid email"),
});

const PostDetail: NextPage = () => {
    const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
  const router = useRouter();
  const { id } = router.query;
  const { data, loading, error, fetchMore } = useQuery(query, {
    variables: {
        id,
        },
    });
    const [createComment] = useMutation(mutation);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: yupResolver(schema),
    });

    const onSubmit = (data: FormValues) => {
        toast.promise(
            createCommentHandler(data),
            {
                pending: 'Creating comment...',
                success: 'Comment created!',
                error: 'Error creating comment',
            }
        )
    };

    const createCommentHandler = async (data: FormValues) => {
        await createComment({
            variables: {
                input: {
                    postId: id,
                    body: data.body,
                    userEmail: data.userEmail,
                },
            },
        });
        fetchMore({
            variables: {
                id,
            },
        });
    }

  return (
    <div>
        {selectedId && (
            <ReplyCommentModal 
                commentId={selectedId}
                onSuccess={() => {
                    setSelectedId(undefined);
                    fetchMore({
                        variables: {
                            id,
                        },
                    });
                }}
                onCancel={() => {
                    setSelectedId(undefined);
                }}
            />
        )}
      <div
        style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100px",
            backgroundColor: "lightblue",
        }}
      >
      <h1
        style={{
            fontSize: "50px",
            margin: "0 20px",
        }}
      >Post Detail</h1>
      <Button variant="contained" onClick={() => {
            router.push('/')
        }}>Volver</Button>
      </div>

        {loading && (<InfinitySpin />)}
        {error && (<p>{error.message}</p>)}
        {data && (
            <MainContainer>
                <Title>{data.post.title}</Title>
                <Image src={data.post.imageUrl} />
                <Body
                    dangerouslySetInnerHTML={{
                        __html: data.post.body,
                    }}
                />
                <CommentsContainer>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <h2>Comments</h2>
                        <TextField {...register("body")} label="Body" error={!!errors.body} helperText={errors.body?.message} />
                        <TextField {...register("userEmail")} label="User Email" error={!!errors.userEmail} helperText={errors.userEmail?.message} />
                        <Button type="submit" variant="contained">Submit</Button>
                    </Form>
                    {data.post.comments.map((comment: any) => (
                        <CommentContainer key={comment.id}>
                            <p>{comment.user.name}</p>
                            <Comment>{comment.body}</Comment>
                            <Button onClick={() => {
                                setSelectedId(comment.id);
                            }
                            }>Reply</Button>
                            <RepliesContainer>
                                {comment.replies.map((reply: any) => (
                                    <ReplyContainer key={reply.id}>
                                        <p>{reply.user.name}</p>
                                        <Reply>{reply.body}</Reply>
                                    </ReplyContainer>
                                ))}
                            </RepliesContainer>
                        </CommentContainer>
                    ))}
                </CommentsContainer>
            </MainContainer>
        )}
    </div>
  );
};

export default PostDetail;

const query = gql`
  query Post($id: ID!) {
    post(id: $id) {
      title
      body
      imageUrl
      comments {
        id
        body

        user {
          name
        }
        replies {
          id
          body
          user {
            name
          }
        }
      }
    }
  }
`;

const mutation = gql`
    mutation CreateComment($input: CreateCommentInput!) {
        createComment(input: $input) {
            id
        }
    }  
`;


const MainContainer = styled.main`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
`;

const Title = styled.h1`
    font-size: 50px;
    `;

const Image = styled.img`
    width: 100%;
    height: 100%;
    object-fit: contain;
    `;

const Body = styled.p`
    font-size: 20px;
`;


const CommentsContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 80%;
`;

const CommentContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    width: 100%;
    margin: 5px;
`;

const Comment = styled.p`
    font-size: 20px;
`;

const RepliesContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    width: 100%;
    margin-left: 20px;
`;

const ReplyContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    width: 100%;
    border: 1px solid black;
    margin: 5px;
`;

const Reply = styled.p`
    font-size: 20px;
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 80%;
    * {
        margin: 2px;
    }
`;