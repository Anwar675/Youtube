"use client"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"
import { PlaylistGenerateModal } from "../components/playlist-create-modal"
import { useState } from "react"
import { PlaylistsSection } from "./sections/playlist-section"

export const PlaylistViews = () => {
    const [createModalOpen, setCreateModalOpen] = useState(false)
    return (
        <div className="max-w-[2400px] mx-auto mb-10 px-4 pt-2.5 flex flex-col gap-y-6">
            <PlaylistGenerateModal open={createModalOpen}  onOpenChange={setCreateModalOpen} />
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Playlist</h1>
                    <p className="text-xs text-muted-foreground">
                        Collections you have created
                    </p>
                </div>
                <Button variant="outline" size="icon" className="rounded-full" onClick={() => setCreateModalOpen(true)}>
                    <PlusIcon className="text-black" />
                </Button>
            </div>
            <PlaylistsSection  /> 
        </div>
    )
} 