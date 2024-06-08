const delay = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(() => resolve(), ms);
  });

const retryFetch = (
  url: string,
  timeout: number,
  fetchOptions: RequestInit = {},
  retries = 3,
  retryDelay = 1000,
) =>
  new Promise((resolve, reject) => {
    if (timeout) setTimeout(() => reject(new Error('error: timeout')), timeout);

    const wrapper = (n: number) => {
      let wrapperRetries = n;
      fetch(url, fetchOptions)
        .then((res) => resolve(res))
        .catch(async (err) => {
          if (retries > 0) {
            await delay(retryDelay);
            wrapper(--wrapperRetries);
          } else {
            reject(err);
          }
        });
    };

    wrapper(retries);
  });

export { delay, retryFetch };
