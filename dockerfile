FROM        node:lts-alpine
WORKDIR     /app
EXPOSE      3000

COPY        package.json yarn.lock ./
RUN         yarn --frozen-lockfile
COPY        . .

CMD         yarn start