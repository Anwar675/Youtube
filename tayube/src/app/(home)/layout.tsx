import { HomeLayout } from "@/modules/home/ui/layouts/home_layout";

interface LayoutProps {
    children: React.ReactNode;
}


const Layout = ({children}: LayoutProps) => {
    return (
        <HomeLayout>
            {children}
        </HomeLayout>
    )
}

export default Layout