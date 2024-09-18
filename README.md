Production ready checklist:
API Documentation - Let's write a Swagger doc to document our endpoints.
Environment - We need files to load in secrets and env vars to each respective environment (local, dev, prod)
CI/CD - Consider using GitHub Actions for this
Metrics, Monitoring, Alerting - Can implement via DataDog or similar. Track metrics like CPU and Memory usage, cache size, errors and rates
Log aggregation - can also be Datadog
Containerization vs. Serverless - Let's think about where the app will live. Caching strategies will be different based on how the app is hosted and where we want to store cache data.
Test suite - Nice to have E2E test suite, integration tests at a minimum to pass deployment

We need to define the data models in data.d.ts so we can take advantage of TypeScript's type checking.

window.d.ts needed type definition exported. Maybe we can delete the redudant code. I commented it out as per acceptance criteria only accepts code changes within the cachingFetch.ts file.

Added jest and some tests that cover various error cases for the validator.
Consider erroring out for empty array. What are our API guidelines?

Known Issues:
Maybe there's a way to cut down on the amount of rerendering that React does when loading from the cache to improve performance. Right now, it's not an issue, but it could be for larger data sets, or images/video.

Next Steps:
Metrics and monitoring around cache hits and cache requests would be useful.
Using this information, we can determine whether we need to extend the cache time.

Discussion:
Any considerations we need to take with upstream/downstream communications? Any teams relying on our data or are we self-contained?

Why are Name and Person separate entities? They are called from the same URL.

First thought for cache impl was SWR. However, for server side rendering, it is not possible to use unless we extend the application to use Next.js, so a pivot was made into using node-fetch and node-fetch-cache. However, there is no way to clear the entire cache, so I ultimately created my own simple cache...

There are some discussions to have for client vs server side rendering here, mostly involving cost and compute. For some applications, I may suggest using SWR and not worrying about server side rendering. node-fetch-cache is flexible enough to easily implement Redis or a disk memory store, which is an interesting consideration. With the disk memory store, there is technically a way to clear the entire cache, but you are relying on disk speeds versus volitile memory speeds.
