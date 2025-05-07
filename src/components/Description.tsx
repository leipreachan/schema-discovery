import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm';

export const Description = (props: {description: string, className?: undefined | string}) => {
    const {description, className} = {...props};
    return (
        <article className={cn("prose dark:prose-invert field-description font-normal text-sm",
         "bg-sidebar-accent p-2 col-span-2 rounded-sm max-w-full m-2",
         className)}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{description}</ReactMarkdown>
        </article>
    )
}