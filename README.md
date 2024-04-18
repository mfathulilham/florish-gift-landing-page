# Start or Build
  - For **Node v17** and above please ensure that you **add** the `--openssl-legacy-provider` command whenever you start/build React.
  - If you are using **Node v16** or lower, simply **remove** the `--openssl-legacy-provider` when starting/building React.
  > Click [here](https://github.com/webpack/webpack/issues/14532#issuecomment-947807590) to know **why**?
# Create Docker Image
  - `docker build . -f <DOCKER_FILE_NAME> -t <DOCKER_IMAGE_NAME>`
  - e.g: `docker build . -f Dockerfile.dev -t reactstarter-image`