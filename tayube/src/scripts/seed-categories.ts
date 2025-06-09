import { db } from "@/db"
import { categories } from "@/db/schema"

const categoryNames = [
    "Music",
    "List",
    "Game",
    "Live",
    "Cattoon",
    "Nature",
    "Pets and Animals",
    "Education",
    "Sports",
    "Travel and Event",
    "People and Blog",
    "Entertaiment",
    "Comedy",
]

async function main() {
    console.log("Seeding categories...")
    const values = categoryNames.map((name) => ({
        name,
        description: `video related to ${name.toLowerCase()}`
    }))
    try {
        await db.insert(categories).values(values).onConflictDoNothing();
        console.log("Secessfuly")
    } catch(error) {
        console.error("Error sendiing categories: ", error)
        process.exit(1)
    }
}

main()