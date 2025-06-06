import { Sidebar, SidebarContent } from "@/components/ui/sidebar"
import { MainSection } from "./main_section"
import { Separator } from "@/components/ui/separator"
import { PersonalSection } from "./persion_section"

export const HomeSidebar = () => {
    return (
        <Sidebar className="border-none pt-[4rem]" collapsible="icon">
            <SidebarContent className="bg-[#0f0f0f]" >
                <MainSection />
                <Separator />
                <PersonalSection />
            </SidebarContent>
        </Sidebar>

    )
}