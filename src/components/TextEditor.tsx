import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { githubLight, githubDark } from '@uiw/codemirror-theme-github';

const TextEditor = ({value, onChange, ...props}) => {
    return (
        <CodeMirror
        className='w-full h-screen border-2'
        value={value} 
        theme={githubLight} 
        extensions={[javascript()]} 
        onChange={onChange}
        {...props}
      />
    )
}

export default TextEditor;