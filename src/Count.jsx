import { useEffect, useState } from 'react'

export default function Component() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(count + 1);
  };

  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const key = setInterval(() => {
      setCounter(count => count + 1)
    }, 1000);

    return () => {
      clearInterval(key);
    };
  }, [])

  return (
    <>
      <p>{counter} seconds have passed.</p>
      <h1>{count}</h1>
      <button onClick={handleClick}>Increment</button>
    </>
  );
}