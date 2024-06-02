import React, { useState, useEffect } from 'react';

const ConditionalComponent = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (hasError) {
    return <p>Error fetching data</p>;
  }

  return <p>Data fetched successfully</p>;
};

export default ConditionalComponent;