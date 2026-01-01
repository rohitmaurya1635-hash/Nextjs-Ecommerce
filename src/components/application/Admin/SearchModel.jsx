'use client'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import React, { useEffect, useState } from 'react'

import Fuse from "fuse.js"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import searchData from "@/lib/search"

const fuseOptions = {
    keys: ['label', 'description', 'keywords'],
    threshold: 0.3,
}
const SearchModel = ({ open, setOpen }) => {
    const [query, setQuery] = useState("")
    const [results, setResults] = useState([])

    const fuse = new Fuse(searchData, fuseOptions)

    useEffect(() => {
        query.trim() === "" ? setResults([]) : setResults(fuse.search(query).map(({ item }) => item))
    }, [query, setQuery])
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {/* <DialogTrigger>Open</DialogTrigger> */}
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Quick Search</DialogTitle>
                    <DialogDescription>
                        Find and navigate to items quickly.
                    </DialogDescription>
                </DialogHeader>

                <Input
                    placeholder="Type to search..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    autoFocus
                />

                <ul className="mt-4 max-h-60 overflow-y-auto">
                    {results.length === 0 && query.trim() !== "" && (
                        <li className="text-center py-4 text-muted-foreground">No results found.</li>
                    )}
                    {results.map((result, index) =>
                        <li key={index}>
                            <Link href={result.url} onClick={() => { setOpen(false) }} className="block py-2 px-3 rounded hover:bg-accent hover:text-accent-foreground">
                                <h4 className="font-medium">{result.label}</h4>
                                <p className="text-sm text-muted-foreground">{result.description}</p>
                            </Link>
                        </li>
                    )}
                </ul>


            </DialogContent>
        </Dialog >
    )
}

export default SearchModel