import React from 'react'
import { Button } from '../ui/button'
import { Loader2Icon } from 'lucide-react'
import { cn } from '@/lib/utils'

const ButtonLoading = ({ type, text, loading, className, onClick, ...props }) => {
    return (
        <Button
            type={type}
            disabled={loading}
            className={cn("", className)}
            onClick={onClick} {...props}
        >
            {loading &&
                <Loader2Icon className="animate-spin" />
            }
            {text}
        </Button>
    )
}

export default ButtonLoading