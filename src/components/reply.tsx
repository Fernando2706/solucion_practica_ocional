import { gql, useMutation } from "@apollo/client";
import React, {FC} from "react";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button, TextField } from "@mui/material";
import { toast } from "react-toastify";
interface Props {
    commentId: string;
    onSuccess: () => void;
    onCancel: () => void;
}

type FormValues = {
    body: string;
    userEmail: string;
}

const schema = yup.object().shape({
    body: yup.string().required("Body is required"),
    userEmail: yup.string().required("User email is required").email("User email must be a valid email"),
});

const ReplyCommentModal: FC<Props> = ({commentId, onSuccess, onCancel}) => {
    const [createReply] = useMutation(mutation);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: yupResolver(schema),
    });

    const onSubmit = (data: FormValues) => {
        toast.promise(
            createReplyHandler(data),
            {
                pending: 'Creating reply...',
                success: 'Reply created!',
                error: 'Error creating reply',
            }
        )
    }

    const createReplyHandler = async (data: FormValues) => {
        await createReply({
            variables: {
                input: {
                    commentId,
                    body: data.body,
                    userEmail: data.userEmail,
                },
            },
        });
        onSuccess();
    }


    return (
        <>
            <Backdrop 
                onClick={onCancel}
            />
            <ModalContainer>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <TextField
                        label="Body"
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        {...register("body")}
                        error={!!errors.body}
                        helperText={errors.body?.message}
                    />
                    <TextField
                        label="User Email"
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        {...register("userEmail")}
                        error={!!errors.userEmail}
                        helperText={errors.userEmail?.message}
                    />
                    <div>
                        <Button
                            variant="contained"
                            type="submit"
                        >
                            Submit
                        </Button>
                        <Button
                            variant="contained"
                            onClick={onCancel}
                            color="secondary"
                        >
                            Cancel
                        </Button>
                        
                    </div>
                </form>
            </ModalContainer>
        </>
    );
};

export default ReplyCommentModal;

const mutation = gql`
    mutation CreateReplyComment($input: CreateReplyInput!) {
        createReply(input: $input) {
            id
        }
    }
`;

const Backdrop = styled.div`
    background-color: rgba(0, 0, 0, 0.8);
    position: fixed;
    z-index: 1000;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
`;

const ModalContainer = styled.div`
    background-color: white;
    position: fixed;
    z-index: 1001;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 500px;
    height: 500px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    form {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 500px;
        height: 500px;
    }

`;