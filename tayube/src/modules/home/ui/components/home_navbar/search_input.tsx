
import { SearchIcon } from "lucide-react"

export const SearchInput = () => {
    return (
       <form className="flex w-full max-w-[600px]">
            <div className="relative w-full ">
                <input type="text" placeholder="Search"  className="w-full pl-4 py-2 pr-12 rounded-l-full border  focus:outline-none focus:border-white bg-black/25"/>
            </div>
            <button type="submit" className="px-4 py-2.5 bg-[#3f3f3f] border rounded-r-full hover:bg-[#d3d3d3] disabled:opacity-50 disabled:cursor-not-allowed border-l-0">
                <SearchIcon  className="size-5"/>
            </button>
            
       </form>
    )
}