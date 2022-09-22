const useTokens = () => {
  const apiToken = () => {
    return localStorage.authState
      ? JSON.parse(localStorage.authState)["token"] || null
      : null;
  };
  const accessKey = () => {
    return localStorage.authState
      ? JSON.parse(localStorage.authState)["key"] || null
      : null;
  };
  const signature = () => {
    return localStorage.authState
      ? JSON.parse(localStorage.authState)["signature"] || null
      : null;
  };
  return { apiToken, accessKey, signature };
};

export default useTokens;
