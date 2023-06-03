
import { gql, useQuery } from '@apollo/client';
import styled from 'styled-components';
import { Audio } from 'react-loader-spinner'
import { Button, Card, CardActions, CardContent, CardHeader, CardMedia, IconButton, Typography } from '@mui/material';
import { FavoriteOutlined, MoreVert } from '@mui/icons-material';
import { useRouter } from 'next/router';

export default function Home() {
  const { data, loading, error } = useQuery(query);
  const router = useRouter();
  return (
    <MainContainer>
      <RowContainer>
      <Button variant="contained"

      onClick={() => {
        router.push('/posts/create')
      }}
      >Añadir Post</Button>
      <Button variant="contained"
      style={{marginLeft: 10, marginRight: 10}}
      onClick={() => {
        router.push('/user/create')
      }}
      >Añadir Usuario</Button>
      <Button variant="contained"
      onClick={() => {
        router.push('/posts/')
      }}
      >Ver todos</Button>
      </RowContainer>
      {loading && (
        <Audio />
      )}
      {error && (
        <p>{error.message}</p>
      )}
      <RowContainer>
      {data && data.posts.map((post: any) => (
        <Card key={post.id}
          sx={{
            maxWidth: 345,
            margin: 2,
            padding: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            height: 500,
          }}
        >
          <CardHeader
            title={post.title}
          />
          
          <CardMedia
            component="img"
            height="194"
            image={post.imageUrl}
            alt={post.title}
            style={
              {
                objectFit: 'contain',
              }
            }
          />
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              {post.body}
            </Typography>
          </CardContent>
        <CardActions disableSpacing>
          <Button size="small"
          onClick={() => {
            router.push(`/posts/${post.id}`)
          }}
          >Ver más</Button>
        </CardActions>
        </Card>
      ))}
      </RowContainer>
    </MainContainer>
  )
}

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

const RowContainer = styled.div`
flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const query = gql`
  query{
    posts(
      limit:3,
      page:0
    ){
      id
      title
      imageUrl
      body
      
    }
  }
`;