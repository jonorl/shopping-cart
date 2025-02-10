import { useState } from 'react'

export default function CustomInput() {
    const [value, setValue] = useState("");
  
    return (
      <input
        type="text"
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
    );
  }