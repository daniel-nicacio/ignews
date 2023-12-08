import { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { RichText } from "prismic-dom";

import { client } from "../../services/prismic";

import styles from "./styles.module.scss";

type Content = {
  type: string;
};

type Post = {
  slug: string;
  title: string;
  excerpt: string;
  updatedAt: string;
};

interface PostsProps {
  posts: Post[];
}

export default function Posts({ posts }: PostsProps) {
  return (
    <>
      <Head>
        <title>Posts | Ignews</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          {posts.map((post) => (
            <Link key={post.slug} href={`/posts/${post.slug}`}>
              <a>
                <time>{post.updatedAt}</time>
                <strong>{post.title}</strong>
                <p>{post.excerpt}</p>
              </a>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const posts = await client.getAllByType("post", {
    pageSize: 100,
  });

  const formattedPosts = posts.map((post) => {
    const excerpt: any = post.data.content.find(
      (content: Content) => content.type === "paragraph"
    );

    return {
      slug: post.uid,
      title: RichText.asText(post.data.title),
      excerpt: excerpt?.text || "",
      updatedAt: new Date(post.last_publication_date).toLocaleDateString(
        "pt-BR",
        {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }
      ),
    };
  });

  console.log(JSON.stringify(posts, null, 2));

  return {
    props: { posts: formattedPosts },
  };
};
