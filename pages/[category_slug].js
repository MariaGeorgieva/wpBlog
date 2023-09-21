import Head from 'next/head';
import Footer from '../components/Footer'
import { client } from '../lib/apollo';
import { gql } from '@apollo/client';
import PostCard from '../components/PostCard';

export default function CategoryPage({ category, posts }) {

  return (
    <div>
      <Head>
        <title>CategoryPage</title>
        <link rel="icon" href="favicon.ico" />
      </Head>

      <main>
        <div className="siteHeader">
          <h1 className="title">{category?.name}</h1>
        </div>
        <ul>

          <h2> Posts:</h2>
          <div className="grid">
            {
              posts.map((post) => {
                return (
                  <PostCard key={post?.slug} post={post}></PostCard>
                )
              })
            }
          </div>
        </ul>
      </main>

      <Footer />
    </div>
  );
}

export async function getStaticProps({ params }) {

  const GetCategoryBySlug = gql`
    query CategoryBySlug($slug: ID!) {
      category(id: $slug, idType: SLUG) {
        name
        slug
        categoryId
      }
    }
  `;

  const GetPostsByCategory = gql`
  query GetPostsByCategory($categoryName: String!) {
    posts(where: {categoryName: $categoryName}) {
      nodes {
        slug
        title
        content
        categories {
          nodes {
            slug
          }
        }
      }
    }
  }
  `

  const [categoryResponse, postsResponse] = await Promise.all([
    client.query({
      query: GetCategoryBySlug,
      variables: {
        slug: params.category_slug,
      },
    }),
    client.query({
      query: GetPostsByCategory,
      variables: {
        categoryName: params.category_slug,
      },
    }),
  ]);

  try {
    const category = categoryResponse?.data?.category;
    const posts = postsResponse?.data?.posts?.nodes || [];

    return {
      props: {
        category,
        posts,
      },
    };
  } catch (error) {
    console.error("Promise rejection:", error);
    return {
      props: {
        category: null, 
        posts: [],    
      },
    };
  }
}

export async function getStaticPaths() {
  const GET_CATEGORY_SLUGS = gql`
    query CategorySlugs {
      categories(first: 10000) {
        edges {
          node {
            slug
          }
        }
      }
    }
  `;

  const { data } = await client.query({
    query: GET_CATEGORY_SLUGS,
  });

  const paths = data.categories.edges.map((edge) => ({
    params: { category_slug: edge.node.slug },
  }));

  return {
    paths,
    fallback: 'blocking', 
  };
}

