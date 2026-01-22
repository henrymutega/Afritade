import { useEffect } from "react"
import { useLocation } from "react-router-dom"

const ComingSoon = () => {
    const location = useLocation();

    useEffect(() => {
        console.error("Coming soon: Page under development:", location.pathname);
    }, [location.pathname]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted">
            <div className="text-center">
                <h1 className="mb-4 text font-bold">Coming Soon</h1>
                <p className="mb-4 text-xl text-muted-foreground">Ooops! We are working on this page.</p>
                <a href="/" className="text-primary underline hover:text-primary/90">
                    Back to Home
                </a>
            </div>
        </div>
    )
}

export default ComingSoon;