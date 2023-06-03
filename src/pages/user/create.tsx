import React from "react";
import { NextPage } from "next";
import { gql, useMutation } from "@apollo/client";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import styled from "styled-components";
import { Button, StepButton, TextField } from "@mui/material";

type FormValues = {
    email: string;
    password: string;
    name: string;
}

const schema = yup.object().shape({
    email: yup.string().required("Email is required").email("Email must be a valid email"),
    password: yup.string().required("Password is required").min(8, "Password must be at least 8 characters"),
    name: yup.string().required("Name is required"),
});

const UserCreate: NextPage = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: yupResolver(schema),
    });

    const router = useRouter();
    const [createUser] = useMutation(mutation);

    const onSubmit = (data: FormValues) => {
        toast.promise(
            createUserHandler(data),
            {
                pending: 'Creating user...',
                success: 'User created!',
                error: 'Error creating user',
            }
        )
    }

    const createUserHandler = async (data: FormValues) => {
        await createUser({
            variables: {
                input: {
                    email: data.email,
                    password: data.password,
                    name: data.name,
                },
            },
        });
        router.push("/");
    }
    

    return (
        <MainContainer>
            <form onSubmit={handleSubmit(onSubmit)}>
                <h1>Create User</h1>
                <TextField
                    label="Email"
                    variant="outlined"
                    {...register("email")}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                />
                <TextField
                    label="Password"
                    variant="outlined"
                    {...register("password")}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    type="password"
                />
                <TextField
                    label="Name"
                    variant="outlined"
                    {...register("name")}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                />

                <Button type="submit">Create</Button>
            </form>
        </MainContainer>
    );
};

export default UserCreate;

const mutation = gql`
    mutation CreateUser($input: CreateUserInput!) {
        createUser(input: $input) {
            id
        }
    }
`

const MainContainer = styled.main`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 50px;
    width: auto;

    form {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 500px;
        height: 500px;
        border: 1px solid black;
        border-radius: 10px;
        * {
            margin: 2px;
        }
    }
`