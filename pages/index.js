import Head from 'next/head';
import Footer from '../components/Footer';
import PostCard from '../components/PostCard';
import CategoryCard from '../components/CategoryCard';
import { client } from '../lib/apollo';
import { gql } from "@apollo/client";
import { useAppContext } from '../contexts/AppContext';
import { useEffect } from 'react';


export default function Home({ categories, posts }) {
  const { newPosts, addNewPost } = useAppContext();

  useEffect(() => {
    if (newPosts.length > 0) {
      const newPostsFromWebhook = newPosts;
      addNewPost(newPostsFromWebhook);
    }
  }, []);

  const combinedPosts = [...newPosts.length > 0 ? newPosts : [], ...posts];

  return (
    <div className="container">
      <Head>
        <title>Headless WP Next Blog</title>
        <link rel="icon" href="favicon.ico"></link>
      </Head>

      <main>
        <h1 className="title">
          Headless WP Next Blog
        </h1>
        <h2> Categories:</h2>
        <div className="grid">
          {

            categories?.map((category) => {
              return (

                <CategoryCard key={category?.id} category={category}></CategoryCard>

              )
            })
          }
        </div>


        <h2> Posts:</h2>

        <div className="grid">
          {
            combinedPosts.map((post) => {
              return (
                <PostCard key={post?.slug} post={post}></PostCard>
              )
            })
          }
        </div>
      </main>

      <Footer></Footer>
    </div>
  )
}

export async function getStaticProps() {
  // Define your GraphQL queries
  const GET_POSTS = gql`
    query AllPostsQuery {
      posts {
        nodes {
          title
          uri
          slug
          excerpt
          content
          categories {
            nodes {
              uri
              slug
              name
            }
          }
        }
      }
    }
  `;

  const GET_CATEGORIES = gql`
    query AllCategories {
      categories(first: 10000) {
        edges {
          node {
            databaseId
            description
            id
            name
            slug
          }
        }
      }
    }
  `;

  try {
    // Use Apollo Client to fetch data for posts
    const postsResponse = await client.query({ query: GET_POSTS });

    // Use Apollo Client to fetch data for categories
    const categoriesResponse = await client.query({ query: GET_CATEGORIES });

    // Extract the data from each response
    const posts = postsResponse?.data?.posts?.nodes;
    const categories = categoriesResponse?.data?.categories?.edges?.map(
      (edge) => edge?.node
    );

    return {
      props: {
        posts,
        categories,
      },
      revalidate: 10,
    };
  } catch (error) {

    console.error('Error fetching data:', error);
    throw error;
  }
}
