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
      fetch(url, fetchOptions)
        .then((res) => resolve(res))
        .catch(async (err) => {
          if (n > 0) {
            await delay(retryDelay);
            // eslint-disable-next-line no-param-reassign
            wrapper(--n);
          } else {
            reject(err);
          }
        });
    };

    wrapper(retries);
  });

export { delay, retryFetch };
