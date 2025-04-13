import { ModeToggle } from "./mode-toggle"

export const Header = () => {
    return (
        <div className="grid grid-cols-2 m-2">
            <h1 className='mb-2 text-2xl'>JSON Schema Discovery</h1>
            <div className="text-right"><ModeToggle /></div>
        </div>
    )
}