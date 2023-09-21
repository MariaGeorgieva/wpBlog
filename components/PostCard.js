import Link from "next/link"

export default function PostCard({ post }) {
    const categorySlug = post?.categories?.nodes[0]?.slug;
    
    return (
        <Link href={`/${categorySlug}/${post?.slug}`} className={"card"}>
            <a className="card">
                <h3>{post?.title} &rarr;</h3>
            </a>
        </Link>
    )
}