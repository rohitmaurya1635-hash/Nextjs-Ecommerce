const { useState, useLayoutEffect } = require("react")

const useWindowSize = () => {
    const [windowSize, setWindowSize] = useState({ width: null, height: null })

    useLayoutEffect(() => {
        const handleSize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            })
        }

        handleSize()
        window.addEventListener('resize', handleSize)
        return () => window.removeEventListener('resize', handleSize)
    }, [])

    return windowSize
}

export default useWindowSize