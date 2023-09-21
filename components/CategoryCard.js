import Link from "next/link"

export default function CategoryCard({ category }) {
    return (
        <>
            <div>{category?.posts}</div>
            <Link href="/[categorySlug]" as={`/${category?.slug}`} className={"card"}>

                <a className="card">
                    <h3>{category?.name} &rarr;</h3>
                </a>
            </Link>
        </>
    )
}