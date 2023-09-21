import Head from 'next/head';
import Footer from '../../components/Footer';
import { client } from '../../lib/apollo';
import { gql } from '@apollo/client';

export default function PostSlugPage({ post }) {

  return (
    <div>
      <Head>
        <title>WP Next Blog</title>
        <link rel="icon" href="favicon.ico" />
      </Head>

      <main>
        <div className="siteHeader">
          <h1 className="title">{post?.title}</h1>
        </div>

        <h2>
          Category: <a href={`/${post?.categories?.edges[0]?.node?.slug}`}>
            {post?.categories?.edges[0]?.node?.slug}
          </a>
        </h2>
        <article dangerouslySetInnerHTML={{ __html: post?.content }}></article>
      </main>

      <Footer />
    </div>
  );
}

export async function getStaticProps({ params }) {


  const GetPostBySlug = gql`
    query GetPostBySlug($id: ID!) {
      post(id: $id, idType: SLUG) {
        slug
        title
        excerpt
        uri
        content
        categories {
          edges {
            node {
              slug
              uri
              name
              databaseId
            }
          }
        }
      }
    }
  `;

  const response = await client.query({
    query: GetPostBySlug,
    variables: {
      id: params.postSlug,
    },
  });

  const post = response?.data?.post;

  return {
    props: {
      post,
    },
    revalidate: 10,
  };
}

export async function getStaticPaths() {
  const GET_POSTS = gql`
    query AllPosts {
      posts {
        nodes {
          categories {
            nodes {
              slug
            }
          }
          slug
        }
      }
    }
  `;

  const { data } = await client.query({
    query: GET_POSTS,
  });

  const paths = data.posts.nodes.flatMap((post) => {
    const categorySlug = post.categories.nodes[0]?.slug || 'uncategorized'; // Default category if none
    return {
      params: {
        category_slug: categorySlug,
        postSlug: post.slug,
      },
    };
  });

  return {
    paths,
    fallback: 'blocking',
  };
}