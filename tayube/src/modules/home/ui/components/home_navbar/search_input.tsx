'use client'
import { Button } from "@/components/ui/button"
import { APP_URL } from "@/constans"
import { SearchIcon, XIcon } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"

export const SearchInput = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const query = searchParams.get("query") || ""
    const categoryId =searchParams.get("query") || ""
    const [value, setValue] = useState(query)
    

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const url = new URL("/search",APP_URL ? `https://${APP_URL}` : "http://localhost:3000")
        const newQuery = value.trim()

        if(categoryId) {
            url.searchParams.set("categoryId", categoryId)
        }
        if(newQuery === "") {
            url.searchParams.delete("query")
        }
        setValue(newQuery)
        const searchPath = `/search?query=${encodeURIComponent(newQuery)}`
        router.push(searchPath)
    }
    return (
        
       <form className="flex w-full max-w-[600px]" onSubmit={handleSearch}>
            <div className="relative w-full ">
                <input value={value} onChange={(e) => setValue(e.target.value)} type="text" placeholder="Search"  className="w-full pl-4 py-2 pr-12 rounded-l-full border  focus:outline-none focus:border-white bg-black/25"/>
                {value && (
                    <Button type="button" variant="ghost" size="icon" onClick={() => setValue("")} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full ">
                        <XIcon className="text-gray-500" />
                    </Button>
                )}
            </div>
            <button disabled={!value.trim()} type="submit" className="px-4 py-2.5 bg-[#3f3f3f] border rounded-r-full hover:bg-[#d3d3d3] disabled:opacity-50 disabled:cursor-not-allowed border-l-0">
                <SearchIcon  className="size-5"/>
            </button>
            
       </form>
    )
}