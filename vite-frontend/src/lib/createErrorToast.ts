import { toast } from "../components/ui/use-toast"

export const createErrorToast = (error: unknown) => {
    if (error && typeof error === "object") {
        const { message } = error as { message: string }
        if (message) {
            toast({
                title: 'Error',
                description: message,
                variant: 'destructive'
            })
            return
        }
    }
    toast({
        title: 'Error',
        description: 'Unknown',
        variant: 'destructive'
    })
}
