import React, { useRef } from "react";
import JSONInput from "react-json-editor-ajrm/index";
import locale from 'react-json-editor-ajrm/locale/en';
interface JsonEditorProps {
  initialValue?: any;
  onChange?: any
}

export const JsonEditor: React.FC<JsonEditorProps> = (props) => {
  const ref = useRef(null)

  return (
    <JSONInput
      ref={ref}
      onBlur={props.onChange}
      id='a_unique_id'
      theme="dark_vscode_tribute"
      locale={locale}
      height='100%'
      width='500px'
      placeholder={props.initialValue || {}}
    />

  )
}