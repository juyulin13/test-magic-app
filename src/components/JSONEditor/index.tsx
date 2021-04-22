import JSONInput from "react-json-editor-ajrm/index";
import locale from 'react-json-editor-ajrm/locale/en';

export const JsonEditor = () => {
  return (
    <JSONInput
      id='a_unique_id'
      theme="dark_vscode_tribute"
      locale={locale}
      height='550px'
    />

  )
}