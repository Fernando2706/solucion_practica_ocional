import { NextPage } from "next";
import React from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, TextField, TextareaAutosize } from "@mui/material";
import styled from "styled-components";
import { gql, useMutation } from "@apollo/client";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

type FormValues = {
  title: string;
  body: string;
  imageUrl: string;
};

const schema = yup.object().shape({
  title: yup.string().required("Title is required"),
  body: yup.string().required("Body is required"),
  imageUrl: yup
    .string()
    .required("Image URL is required")
    .url("Image URL must be a valid URL"),
});

const CreatePost: NextPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
  });
  const [createPost] = useMutation(mutation);
  const router = useRouter();

  const onSubmit = (data: FormValues) => {
    toast.promise(
        createPostHandler(data),
        {
            pending: 'Creating post...',
            success: 'Post created!',
            error: 'Error creating post',
        }
    )
  };

  const createPostHandler = async (data: FormValues) => {
    await createPost({
        variables: {
            input: {
                title: data.title,
                body: data.body,
                imageUrl: data.imageUrl,
            }
        }
    })
    router.push('/')
  }

  return (
    <div>
      <h1>Create Post</h1>
      <Button  
        variant="outlined"
        onClick={() => {
            router.push("/");
        }
        }
        >
            Back
        </Button>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <TextField
            id="title"
            {...register("title")}
            label="Title"
            error={!!errors.title}
            helperText={errors.title?.message}
          />
        </div>
        <div>
          <TextField 
          id="body" 
          {...register("body")} 
          label="Body" 
          multiline 
          error={!!errors.body}
          helperText={errors.body?.message}
          />
        </div>
        <div>
          <TextField
            id="imageUrl"
            {...register("imageUrl")}
            label="Image URL"
            error={!!errors.imageUrl}
            helperText={errors.imageUrl?.message}
          />
        </div>
        <Button type="submit" variant="contained">
          Create
        </Button>
      </Form>
    </div>
  );
};

export default CreatePost;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  * {
    margin: 2px;
  }
`;


const mutation = gql`
    mutation CreatePost($input: CreatePostInput!) {
        createPost(input: $input) {
            id
        }
    }

`