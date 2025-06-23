import { useState, useRef, useEffect } from "react";

export const useIntersectionObserver = (options?:IntersectionObserverInit) => {
    const [isInterecting, setIsInteresting] = useState(false)
    const targetRef = useRef<HTMLDivElement>(null) 
    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            setIsInteresting(entry.isIntersecting)
        },options)

        if(targetRef.current) {
            observer.observe(targetRef.current)
        }
        return () => observer.disconnect()
    },[options])
    return {targetRef, isInterecting}
}